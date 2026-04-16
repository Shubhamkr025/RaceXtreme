import React from "react";

const ComponentTwo = () => {
  return (
    <div>
      <h1>About Us</h1>
      <h2>Our Mission</h2>

      <p>
        We aim to provide high-quality services and ensure customer satisfaction
        through innovation and dedication.
      </p>

      <p>
        Our team works continuously to improve and deliver the best experience
        to users worldwide.
      </p>

      <img
        src="test.png"
        className="image-animate"
        alt="About"
        style={{ width: "400px", marginTop: "10px" }}
      />
    </div>
  );
};

export default ComponentTwo;