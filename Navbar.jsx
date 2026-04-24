import { Moon, Sun, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {

  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState("features");

  // Apply dark mode to entire app
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Detect active section while scrolling
  useEffect(() => {

    const sections = ["features", "tips", "about"];

    const handleScroll = () => {
      const scrollY = window.scrollY;

      sections.forEach((section) => {
        const element = document.getElementById(section);

        if (element) {
          const offsetTop = element.offsetTop - 120;
          const height = element.offsetHeight;

          if (scrollY >= offsetTop && scrollY < offsetTop + height) {
            setActiveSection(section);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);

  }, []);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-emerald-950/70 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center px-10 py-4">

      {/* Logo */}
      <h1 className="text-2xl font-bold text-emerald-600 tracking-tight cursor-pointer">
        InterviewAI
      </h1>

      {/* Navigation Links */}
      <div className="flex gap-8 text-gray-700 dark:text-gray-300 font-medium">

        <a
          href="#features"
          className={`transition ${
            activeSection === "features"
              ? "text-emerald-600 font-semibold"
              : "hover:text-emerald-600"
          }`}
        >
          Interview Prep
        </a>

        <a
          href="#tips"
          className={`transition ${
            activeSection === "tips"
              ? "text-emerald-600 font-semibold"
              : "hover:text-emerald-600"
          }`}
        >
          Interview Tips
        </a>

        <a
          href="#about"
          className={`transition ${
            activeSection === "about"
              ? "text-emerald-600 font-semibold"
              : "hover:text-emerald-600"
          }`}
        >
          About
        </a>

      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">

        {/* Sign In */}
        <Link
          to="/login"
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white transition"
        >
          <span>Sign In</span>
          <LogIn size={18} />
        </Link>

        {/* Get Started Button */}
        <Link
          to="/login"
          className="px-5 py-2 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition shadow-md"
        >
          Get Started
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="hover:text-emerald-600 transition"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

      </div>

    </nav>
  );
};

export default Navbar;