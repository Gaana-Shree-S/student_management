import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import LandingPage from "./LandingPage";
import "./index.css";

const Root = () => {
  const [started, setStarted] = useState(false);

  return started ? <App /> : <LandingPage onGetStarted={() => setStarted(true)} />;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
