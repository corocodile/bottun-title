import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GrowthBook, GrowthBookProvider } from "@growthbook/growthbook-react";
import {
  init,
  identify,
  setUserId,
  Identify,
} from "@amplitude/analytics-browser";
import { v4 as uuidv4 } from "uuid";

// 🔁 Generate a new user ID each time (for testing distribution)
const userId = uuidv4();

// 🟦 Detect user OS and browser (optional but helpful)
const getUserContext = () => {
  const userAgent = navigator.userAgent;
  let os = "Unknown";
  let browser = "Unknown";

  if (userAgent.includes("Win")) os = "Windows";
  else if (userAgent.includes("Mac")) os = "MacOS";
  else if (userAgent.includes("Linux")) os = "Linux";
  else if (/Android/.test(userAgent)) os = "Android";
  else if (/iPhone|iPad|iPod/.test(userAgent)) os = "iOS";

  if (/Chrome/.test(userAgent)) browser = "Chrome";
  else if (/Firefox/.test(userAgent)) browser = "Firefox";
  else if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent))
    browser = "Safari";
  else if (/Edg/.test(userAgent)) browser = "Edge";

  return { os, browser };
};

const { os, browser } = getUserContext();

// 🟦 Initialize Amplitude
init("4a71948dd893820193950f208b58ab8d"); // Replace with real key
setUserId(userId);

// ⬇️ Set user properties in Amplitude
const identity = new Identify();
identity.set("os", os);
identity.set("browser", browser);
identify(identity);

// 🟩 Set up GrowthBook
const gb = new GrowthBook({
  apiHost: "https://cdn.growthbook.io",
  clientKey: "sdk-UDnDy1ItoOS60e", // Replace with real key
  enableDevMode: true,
  attributes: {
    id: userId,
    os,
    browser,
  },
});

// ⬇️ Load feature flags before rendering
gb.loadFeatures().then(() => {
  // Track assigned variation as user property in Amplitude (optional)
  const variation = gb.getFeatureValue("cta-text", "submit");
  const identityWithVariation = new Identify();
  identityWithVariation.set("variation", variation);
  identify(identityWithVariation);

  // Render the app
  const root = ReactDOM.createRoot(document.getElementById("root")!);
  root.render(
    <React.StrictMode>
      <GrowthBookProvider growthbook={gb}>
        <App userId={userId} variation={variation} />
      </GrowthBookProvider>
    </React.StrictMode>
  );
});
