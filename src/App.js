import "./App.css";

import Header from "./components/Header";
import MainContent from "./components/MainContent";
import SideBar from "./components/Sidebar";

function App() {
  return (
    <div className="App">
      <Header />
      <SideBar />
      <MainContent />
    </div>
  );
}

export default App;
