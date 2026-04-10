import React from "react";

const ComponentOne = () => {
  return (
    <div>
      <h1>Welcome to My Website</h1>
      <h2>Introduction Section</h2>

      <p>
        This is the first paragraph of component one. It introduces the content
        and gives a brief overview.
      </p>

      <p>
        This is the second paragraph providing more details about the topic and
        explaining its importance.
      </p>

      <img
        src="test.png"
        className="image-animate"
        alt="Sample"
        style={{ width: "400px", marginTop: "10px" }}
      />
    </div>
  );
};

export default ComponentOne;