import React from "react";
import "./styles.css";

function updateCount(count) {
  const otherRoot = document.getElementById("otherRoot");
  otherRoot.innerHTML = `Count from React: ${count}`;
}

function Capture({ value, onChange }) {
  function handleClick() {
    onChange(value);
  }

  return <div onClick={handleClick}>{value}</div>;
}

const MemoizedCapture = React.memo(
  Capture,
  (prevProps, nextProps) =>
    prevProps.value !== nextProps.value ||
    prevProps.onChange !== nextProps.onChange
);

// Think of function creation as snapshot...
// And function call as looking as that snapshot
// with all the parameters during the **creation** of that snapshot

export default function App() {
  const [count, setCount] = React.useState(0);

  // if we wrap logCount inside a useCallback without declaring count as dependencies
  // log will have a stale reference to "count"
  // because useCallback will take a "snapshot" of "count" and give it to log
  // when App re-renders because of state change, logCount will not have the latest count value
  const memoizedLogCount = React.useCallback(() => {
    updateCount(count);
  }, []);

  // updateCount function "closes over" count
  // why does updateCount has the "latest" value of count ?
  // because when setCount is called, App re-renders, updateCount is created again
  // and it can captures the latest value of count
  const logCount = () => {
    updateCount(count);
  };

  const trollUpdate = () => {
    // this **queries** a state update
    setCount((prevCount) => ++prevCount);
    // this references to a stale reference to count value, before the state update occurs
    // and re-render the component
    updateCount(count);

    // setCount -> query-update [App is not re-rendered]
    // updateCount -> fetch current value of count, which is not the latest
    // latest here means when App is re-rendered and count is updated via state update
  };

  return (
    <div className="App">
      <div style={{ display: "inline-block", marginRight: "5px" }}>
        Count is: {count}
      </div>
      <button
        style={{ marginRight: "5px" }}
        onClick={() => setCount((prevCount) => ++prevCount)}
      >
        Increment
      </button>
      <button onClick={memoizedLogCount}>Log</button>
    </div>
  );
}
