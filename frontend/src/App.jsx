import { Outlet } from "react-router-dom";
// import Navbar from "./components/common/Navbar";
// import Footer from "./components/common/Footer";
import Navbar from "./pages/Header.jsx";
import Footer from "./pages/Footer.jsx";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar */}
      <Navbar />

      {/* Dynamic Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;