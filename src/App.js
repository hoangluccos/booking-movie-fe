import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginForm from "./pages/LoginForm";
import RegisterForm from "./pages/RegisterForm";
import Header from "./components/Header";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginForm />}></Route>
        <Route path="/register" element={<RegisterForm />}></Route>
      </Routes>
      <Header />
    </div>
  );
}

export default App;
