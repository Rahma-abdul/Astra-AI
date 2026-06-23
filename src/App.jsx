import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateWS from "./pages/CreateWS";
function App() {
  return (
    <BrowserRouter>    
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/dashboard/:name" element ={<Dashboard/>}/>
        <Route path="/createWS" element={<CreateWS/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;