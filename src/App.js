import "./App.css";
import AppRouter from "./AppRouter";

import Header from "./components/Header";
import MainContent from "./components/MainContent";
import SideBar from "./components/Sidebar";
import Login from "./pages/Login";

function App() {
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;
