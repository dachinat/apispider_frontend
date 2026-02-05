import { LocationProvider, Router, Route, hydrate, prerender as ssr } from 'preact-iso';

import Client from './pages/Client';
import History from './pages/History';
import Settings from './pages/Settings';
import Invites from './pages/Invites';
import Mocks from './pages/Mocks';
import ApiDocs from './pages/ApiDocs';
import AcceptInvite from './pages/AcceptInvite';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import CookiePolicy from './pages/legal/CookiePolicy';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResendConfirmation from './pages/Auth/ResendConfirmation';
import ConfirmEmail from './pages/Auth/ConfirmEmail';
import ResetPassword from './pages/Auth/ResetPassword';
import { NotFound } from './pages/_404';
import ProtectedRoute from './components/ProtectedRoute';
import './style.css';
import { AuthProvider } from './context/AuthContext.js';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext.js';
import { EnvironmentProvider } from './context/EnvironmentContext.js';

function AppProviders({ children }: { children: any }) {
	const { activeWorkspaceId } = useWorkspace();
	return (
		<EnvironmentProvider activeWorkspaceId={activeWorkspaceId as string}>
			{children}
		</EnvironmentProvider>
	);
}

export function App() {
	return (
		<AuthProvider>
			<WorkspaceProvider>
				<AppProviders>
					<LocationProvider>
						<main>
							<Router>
								<Route path="/" component={() => <ProtectedRoute component={Client} />} />
								<Route path="/requests/:id" component={({ id }: { id: string }) => <ProtectedRoute component={Client} id={id} type="request" />} />
								<Route path="/history/:id" component={({ id }: { id: string }) => <ProtectedRoute component={Client} id={id} type="history" />} />
								<Route path="/history" component={() => <ProtectedRoute component={History} />} />
								<Route path="/settings" component={() => <ProtectedRoute component={Settings} />} />
								<Route path="/invites" component={() => <ProtectedRoute component={Invites} />} />
								<Route path="/mocks" component={() => <ProtectedRoute component={Mocks} />} />
								<Route path="/api" component={() => <ProtectedRoute component={ApiDocs} />} />
								<Route path="/accept-invite" component={AcceptInvite} />
								<Route path="/privacy-policy" component={PrivacyPolicy} />
								<Route path="/terms-of-service" component={TermsOfService} />
								<Route path="/cookie-policy" component={CookiePolicy} />
								<Route path="/sign-in" component={SignIn} />
								<Route path="/sign-up" component={SignUp} />
								<Route path="/forgot-password" component={ForgotPassword} />
								<Route path="/resend-confirmation" component={ResendConfirmation} />
								<Route path="/confirm-email" component={ConfirmEmail} />
								<Route path="/reset-password" component={ResetPassword} />
								<Route default component={NotFound} />
							</Router>
						</main>
					</LocationProvider >
				</AppProviders>
			</WorkspaceProvider>
		</AuthProvider >
	);
}

if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
	return await ssr(<App {...data} />);
}
