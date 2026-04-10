import React, { useState, useEffect } from "react";
import "./App.css";

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // cleanup
  }, []);
  return (
    <div className="container">
      <h1>React Clock</h1>
      <div className="clock">
        {time.toLocaleTimeString()}
      </div>
    </div>
  );
}
export default Clock;