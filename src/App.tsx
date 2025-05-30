import { useFeatureValue } from "@growthbook/growthbook-react";
import { track } from "@amplitude/analytics-browser";

function App() {
  // ✅ Get the variation from GrowthBook
  const buttonText = useFeatureValue("cta-text", "Submit");

  // ✅ Track click event in Amplitude with variation
  const handleClick = () => {
    track("task button clicked", {
      variation: buttonText,
    });
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Task Manager</h1>
      <input type="text" placeholder="Enter a task" />
      <button onClick={handleClick}>{buttonText}</button>
    </div>
  );
}

export default App;
