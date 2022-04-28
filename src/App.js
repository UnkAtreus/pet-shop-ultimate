import { useState } from "react";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Context } from "./utilities/context";

function App() {
  const [context, setcCntext] = useState({
    account: null,
    web3: null,
    contract: null,
  });
  return (
    <Context.Provider value={[context, setcCntext]}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </Context.Provider>
  );
}

export default App;
