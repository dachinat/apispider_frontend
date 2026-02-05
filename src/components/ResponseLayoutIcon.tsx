import { JSX } from "preact";

interface ResponseLayoutIconProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  responsePosition: "bottom" | "right";
}

export default function ResponseLayoutIcon({
  responsePosition,
  ...props
}: ResponseLayoutIconProps) {
  return (
    <button
      className="btn btn-sm btn-ghost"
      title="Toggle Response Panel Position"
      {...props}
    >
      {responsePosition === "bottom" ? (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="4"
            y="4"
            width="16"
            height="16"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="4"
            y1="15"
            x2="20"
            y2="15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="4"
            y="4"
            width="16"
            height="16"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="15"
            y1="4"
            x2="15"
            y2="20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
