import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GrowthBook, GrowthBookProvider } from "@growthbook/growthbook-react";
import {
  init,
  identify,
  setUserId,
  Identify,
  track,
} from "@amplitude/analytics-browser";
import { v4 as uuidv4 } from "uuid";

// ✅ Generate a fresh user ID every time (for testing)
const userId = uuidv4();

// ✅ Optional: store it for debugging in localStorage (not reused)
localStorage.setItem("user_id", userId);

// ✅ Init Amplitude
init("4a71948dd893820193950f208b58ab8d");
setUserId(userId);

// ✅ Create GrowthBook instance
const gb = new GrowthBook({
  apiHost: "https://cdn.growthbook.io",
  clientKey: "sdk-UDnDy1ItoOS60e",
  enableDevMode: true,
  attributes: {
    id: userId, // this should match the "id" targeting rule in GrowthBook
  },
});

// ✅ Load GrowthBook features first
gb.loadFeatures().then(() => {
  // ✅ Mount the React app
  const root = ReactDOM.createRoot(document.getElementById("root")!);
  root.render(
    <React.StrictMode>
      <GrowthBookProvider growthbook={gb}>
        <App />
      </GrowthBookProvider>
    </React.StrictMode>
  );

  // ✅ Wait a short moment to ensure GrowthBook has evaluated everything
  setTimeout(() => {
    const variation = gb.getFeatureValue("button-text", "submit");

    // ✅ DEBUG: Show variation in browser tab title
    document.title = `Variation: ${variation}`;

    // ✅ Send user properties to Amplitude
    const identity = new Identify();
    identity.set("variation", variation);
    identify(identity);

    // ✅ Track the variation assignment in Amplitude
    track("variation_set", { variation });
  }, 100); // You can increase to 200ms if needed
});
