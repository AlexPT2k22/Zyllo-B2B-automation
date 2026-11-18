import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext";

// Shared by the browser entry (main.jsx) and the prerender entry
// (entry-server.jsx) so server HTML and client hydration render the same tree.
export default function Root() {
  return (
    <>
      <AuthProvider>
        <App />
      </AuthProvider>
      <Analytics />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "rgba(10, 10, 15, 0.95)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "#fff",
          },
        }}
        theme="dark"
      />
    </>
  );
}
