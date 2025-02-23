import { useState, useEffect } from "react";
import "./App.scss"
import Screen from "./components/screen/Screen";
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import ButtonSet from "./components/ButtonSet/ButtonSet";

function AppWindow(): JSX.Element {

  const [windowPositionStyle, setWindowPositionStyle] = useState<string>('row');

  window.electron.ipcRenderer.on('window-position', (pos: any) => {
    if (pos == 'left') {
      setWindowPositionStyle('row-reverse');
    } else if (pos == 'right') {
      setWindowPositionStyle('row');
    }
  });

  useEffect(() => {
    console.log("App loaded")

    return () => {
      console.log("App unloaded")
    }
  }, [])

  return (
    <div className="app" style={{flexDirection: windowPositionStyle as any}}>
      <ButtonSet />
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
