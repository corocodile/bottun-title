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
} from "@amplitude/analytics-browser";
import { v4 as uuidv4 } from "uuid";

// 🔁 Generate or reuse a user ID
const getUserId = () => {
  let uid = localStorage.getItem("user_id");
  if (!uid) {
    uid = uuidv4();
    localStorage.setItem("user_id", uid);
  }
  return uid;
};

const userId = getUserId();

// 🔹 Step 1: Initialize Amplitude
init("4a71948dd893820193950f208b58ab8d"); // Replace with your actual API key
setUserId(userId); // Optional: use the same user ID you're testing in GrowthBook
const identity = new Identify();
identity.set("variation", "send"); // or whatever value from GrowthBook
identify(identity);

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
});
