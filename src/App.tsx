import React from "react";
import VerificationForm from "./containers/VerificationForm/VerificationForm";

import "./App.scss";

export default function App() {
  return (
    <div className="App" data-testid="main-container">
      <VerificationForm />
    </div>
  );
}
