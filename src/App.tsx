import { useFeatureValue } from "@growthbook/growthbook-react";
import { track } from "@amplitude/analytics-browser";

function App({ userId, variation }: { userId: string; variation: string }) {
  const buttonText = useFeatureValue("cta-text", "submit");

  const handleClick = () => {
    track("Task Button Clicked", {
      user_id: userId,
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
