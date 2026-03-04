import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Register Service Worker for PWA / offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // updateViaCache: 'none' → browser always fetches sw.js fresh, ignoring HTTP cache
    navigator.serviceWorker
      .register('/sw.js', { updateViaCache: 'none' })
      .then((registration) => {
        // Check for a new SW version every time the app loads
        registration.update();
      })
      .catch(() => {});

    // When the SW sends SW_UPDATED, a new version just took control → reload to get fresh assets
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.type === 'SW_UPDATED') {
        window.location.reload();
      }
    });
  });
}
