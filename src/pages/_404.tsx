import { useState } from "preact/hooks";

export function NotFound() {
	const [spiderScared, setSpiderScared] = useState(false);
	const [showMessage, setShowMessage] = useState(false);

	const scareSpider = () => {
		setSpiderScared(true);
		setTimeout(() => {
			setShowMessage(true);
		}, 800);
	};

	return (
		<div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-4 overflow-hidden relative">
			{/* Hanging Spider Easter Egg */}
			<div
				className={`absolute top-0 right-10 sm:right-20 md:right-32 pointer-events-auto z-20 cursor-pointer transition-all duration-700 ${spiderScared ? "translate-y-[-200px] opacity-0" : "animate-drop"
					}`}
				onClick={scareSpider}
				title="Click me!"
			>
				<div className="flex flex-col items-center animate-sway">
					<div className="w-[2px] h-32 bg-primary/30"></div>
					<svg
						width="40"
						height="40"
						viewBox="0 0 24 24"
						className="text-primary fill-current hover:scale-110 transition-transform"
					>
						<circle cx="12" cy="12" r="6" />
						<path
							d="M12 6 L12 2 M12 18 L12 22 M6 12 L2 12 M18 12 L22 12"
							stroke="currentColor"
							strokeWidth="2"
						/>
						<path
							d="M8 8 L4 4 M16 8 L20 4 M8 16 L4 20 M16 16 L20 20"
							stroke="currentColor"
							strokeWidth="2"
						/>
						<circle cx="10" cy="11" r="1.5" fill="white" />
						<circle cx="14" cy="11" r="1.5" fill="white" />
					</svg>
				</div>
			</div>

			{/* Second spider on the left */}
			<div
				className={`absolute top-0 left-10 sm:left-20 pointer-events-none z-20 transition-all duration-500 delay-300 ${spiderScared ? "translate-y-[-150px] opacity-0" : "animate-drop"
					}`}
				style={{ animationDelay: "0.5s" }}
			>
				<div
					className="flex flex-col items-center animate-sway"
					style={{ animationDelay: "0.3s" }}
				>
					<div className="w-[1px] h-20 bg-primary/20"></div>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						className="text-primary/60 fill-current"
					>
						<circle cx="12" cy="12" r="6" />
						<path
							d="M12 6 L12 2 M12 18 L12 22 M6 12 L2 12 M18 12 L22 12"
							stroke="currentColor"
							strokeWidth="2"
						/>
						<path
							d="M8 8 L4 4 M16 8 L20 4 M8 16 L4 20 M16 16 L20 20"
							stroke="currentColor"
							strokeWidth="2"
						/>
						<circle cx="10" cy="11" r="1.5" fill="white" />
						<circle cx="14" cy="11" r="1.5" fill="white" />
					</svg>
				</div>
			</div>

			<div className="text-center max-w-md relative z-10">
				{/* 404 Text */}
				<h1 className="text-9xl font-black text-primary mb-4">404</h1>

				{/* Message */}
				<h2 className="text-xl font-bold text-base-content mb-2">
					Oops! Page Not Found
				</h2>
				<p className="text-base-content/50 text-sm mb-6">
					The page you're looking for seems to have crawled away...
				</p>

				{/* Easter egg message */}
				{showMessage && (
					<div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm">
							<span>You scared the spider away!</span>
						</div>
					</div>
				)}

				{/* Actions */}
				<div className="flex flex-col sm:flex-row gap-3 justify-center">
					<a href="/" className="btn btn-primary gap-2">
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
							/>
						</svg>
						Back to Home
					</a>
					<button
						onClick={() => window.history.back()}
						className="btn btn-ghost btn-outline gap-2"
					>
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							/>
						</svg>
						Go Back
					</button>
				</div>
			</div>

			{/* Background decorations */}
			<div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
			<div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-secondary/5 rounded-full blur-3xl -z-10"></div>
		</div>
	);
}
