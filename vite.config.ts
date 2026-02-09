import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  preview: {
    port: 3000,
  },
  plugins: [
    tailwindcss(),
    preact({
      prerender: {
        enabled: true,
        renderTarget: "#app",
        additionalPrerenderRoutes: [
          "/404",
          "/sign-in",
          "/sign-up",
          "/forgot-password",
          "/resend-confirmation",
          "/confirm-email",
          "/reset-password",
          "/accept-invite",
          "/download-agent",
          "/history",
          "/client",
          "/api",
          "/mocks",
          "/invites",
          "/settings",
          "/cookie-policy",
          "/terms-of-service",
          "/privacy-policy",
        ],
        previewMiddlewareEnabled: true,
        previewMiddlewareFallback: "/404",
      },
    }),
  ],
  server: {
    allowedHosts: ["apispider.com", "www.apispider.com"],
  },
});
