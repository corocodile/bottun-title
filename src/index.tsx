import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GrowthBook, GrowthBookProvider } from "@growthbook/growthbook-react";
//import * as amplitude from "@amplitude/analytics-browser";
import {
  init,
  identify,
  setUserId,
  Identify,
  track,
} from "@amplitude/analytics-browser";
import { v4 as uuidv4 } from "uuid";

// 🔁 Generate or reuse a user ID
const getUserId = () => {
  const newId = uuidv4();
  localStorage.setItem("user_id", newId); // optional: for visibility/debugging
  return newId;
};

const userId = getUserId();

// 🔹 Step 1: Initialize Amplitude
init("4a71948dd893820193950f208b58ab8d");
setUserId(userId);

//const identity = new Identify();
//identity.set("variation", "send");
//identify(identity);

// 🔁 Push an event to flush the user property to Amplitude
//track("variation_set", { variation: "send" });

// 🔹 Step 2: Set up GrowthBook
const gb = new GrowthBook({
  apiHost: "https://cdn.growthbook.io",
  clientKey: "sdk-UDnDy1ItoOS60e", // replace with actual client key
  enableDevMode: true,
  attributes: {
    id: userId, // test with other IDs if needed
  },
});

// Load features from GrowthBook first
gb.loadFeatures().then(() => {
  const root = ReactDOM.createRoot(document.getElementById("root")!);
  root.render(
    <React.StrictMode>
      <GrowthBookProvider growthbook={gb}>
        <App />
      </GrowthBookProvider>
    </React.StrictMode>
  );

  // ✅ Track variation after GrowthBook has fully evaluated it
  const variation = gb.getFeatureValue("button-text", "submit");
  const identity = new Identify();
  identity.set("variation", variation);
  identify(identity);
  track("variation_set", { variation });
});


