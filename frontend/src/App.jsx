import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./pages/Header.jsx";
import Footer from "./pages/Footer.jsx";
import AutoLogoutProvider from "./components/AutoLogoutProvider.jsx";

function App() {
  return (
    <AutoLogoutProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 bg-gradient-to-br from-blue-100/60 via-slate-50 to-white bg-fixed dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 dark:bg-none">
        <Toaster position="top-center" />
        {/* Navbar */}
        <Navbar />

        {/* Dynamic Content */}
        <main className="flex-1">
        <Outlet />
      </main>

     {/* Footer */}
         <Footer />
      </div>
    </AutoLogoutProvider>
  );
}

export default App;