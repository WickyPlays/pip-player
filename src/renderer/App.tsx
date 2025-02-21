import { useState, useEffect } from "react";
import "./App.scss"
import Screen from "./components/screen/Screen";
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

function AppWindow(): JSX.Element {

  useEffect(() => {
    console.log("App loaded")

    return () => {
      console.log("App unloaded")
    }
  }, [])

  return (
    <div className="app">
      <Screen />
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppWindow />} />
      </Routes>
    </Router>
  );
}
