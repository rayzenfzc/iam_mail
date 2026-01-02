import { createRoot } from "react-dom/client";
import App from "./App";
import AppNewDesign from "./AppNewDesign";
import PlatinumOS from "./PlatinumOS";
import "./index.css";

// Toggle between designs:
// 'app' - Original deployed design
// 'new' - AppNewDesign (light edition)
// 'platinum' - i-AM Platinum OS (MOBILE-FIRST)
const USE_DESIGN = 'platinum';

// Service worker disabled for development
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
*/

createRoot(document.getElementById("root")!).render(
    USE_DESIGN === 'platinum' ? <PlatinumOS /> :
        USE_DESIGN === 'new' ? <AppNewDesign /> :
            <App />
);
