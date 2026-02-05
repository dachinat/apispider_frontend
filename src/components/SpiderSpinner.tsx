interface SpiderSpinnerProps {
    className?: string;
}

export default function SpiderSpinner({ className = "w-6 h-6" }: SpiderSpinnerProps) {
    return (
        <div className={`relative ${className}`}>
            <svg viewBox="0 0 100 100" className="w-full h-full text-primary" xmlns="http://www.w3.org/2000/svg">
                <style>{`
          @keyframes pulseLeg {
            0%, 100% { stroke-dashoffset: 30; opacity: 0.2; }
            50% { stroke-dashoffset: 0; opacity: 1; }
          }
          .spider-leg {
            stroke-dasharray: 30;
            animation: pulseLeg 1.2s ease-in-out infinite;
          }
        `}</style>
                <circle cx="50" cy="50" r="5" fill="currentColor" className="opacity-80" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <g key={angle} style={{ transform: `rotate(${angle}deg)`, transformOrigin: "50px 50px" }}>
                        <path
                            d="M50 50 L50 35 L44 28"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                            className="spider-leg"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        />
                    </g>
                ))}
            </svg>
        </div>
    );
}
