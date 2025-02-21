import { useState, useEffect } from "react";
import "./App.scss"
import TitleBar from "./components/titlebar/TitleBar";
import Content from "./components/loader/content/Content";
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
      <TitleBar />
      <Content />
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
