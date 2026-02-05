interface LinksProps {
    linkToSkip?: string;
}

export default function Links({ linkToSkip }: LinksProps) {
    let urlParams: URLSearchParams | undefined;

    if (typeof window !== "undefined") {
        urlParams = new URLSearchParams(window.location.search);
    }

    const nextParam = urlParams?.get("next");
    const emailParam = urlParams?.get("email");
    const emailLockedParam = urlParams?.get("emailLocked");

    const withNext = (path: string) => {
        const params = new URLSearchParams();
        if (nextParam) params.set("next", nextParam);
        if (emailParam) params.set("email", emailParam);
        if (emailLockedParam) params.set("emailLocked", emailLockedParam);

        const query = params.toString();
        if (!query) return path;
        const hasQuery = path.includes("?");
        return `${path}${hasQuery ? "&" : "?"}${query}`;
    };

    const SignIn = () => (
        <p className="text-center text-sm opacity-70 mt-2">
            Already have an account?{" "}
            <a href={withNext("/sign-in")} className="link link-primary">
                Log in
            </a>
        </p>
    );

    const SignUp = () => (
        <p className="text-center text-sm opacity-70 mt-2">
            Don't have an account{" "}
            <a href={withNext("/sign-up")} className="link link-primary">
                Sign up
            </a>
        </p>
    );

    const ForgotPasswordLink = () => (
        <p className="text-center text-sm opacity-70 mt-2">
            Forgot a password?{" "}
            <a href={withNext("/forgot-password")} className="link link-primary">
                Reset
            </a>
        </p>
    );

    const ResendConfirmationLink = () => (
        <p className="text-center text-sm opacity-70 mt-2">
            Need a confirmation?{" "}
            <a
                href={withNext("/resend-confirmation")}
                className="link link-primary"
            >
                Get a link
            </a>
        </p>
    );

    const links: Record<string, () => any> = {
        "sign-in": SignIn,
        "sign-up": SignUp,
        "forgot-password": ForgotPasswordLink,
        "resend-confirmation": ResendConfirmationLink,
    };

    return (
        <div className="mt-6">
            {Object.entries(links)
                .filter(([key]) => key !== linkToSkip)
                .map(([key, Component]) => (
                    <Component key={key} />
                ))}
        </div>
    );
}
