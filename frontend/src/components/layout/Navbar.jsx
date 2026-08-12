import Button from "../ui/Button";
import logo from "../../assets/logo/quivora-logo.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="h-20 bg-[#023222] shadow-lg sticky top-0 z-50">
  <nav className="max-w-7xl mx-auto h-full flex items-center justify-between px-8">

        {/* Logo */}
        <a
          href="#home"
          className="flex items-center gap-4"
        >
          <div className="relative flex items-center justify-center">
            <img
              src={logo}
              alt="Quivora Logo"
              className="w-20 h-20 object-contain scale-125"
            />
          </div>

          <div className="leading-none">
            <h1 className="text-3xl font-bold tracking-wide text-white">
              QUIVORA
            </h1>

            <p className="mt-2 text-[9px] tracking-[7px] text-[#D4A017] uppercase">
              Learn. Assess. Achieve.
            </p>
          </div>
        </a>

        {/* Navigation */}

        <ul className="hidden lg:flex items-center gap-10 font-medium text-white">

          <li>
            <a
              href="#home"
              className="hover:text-[#D4A017] transition duration-300"
            >
              Home
            </a>
          </li>

          <li>
            <a
              href="#about"
              className="hover:text-[#D4A017] transition duration-300"
            >
              About
            </a>
          </li>

          <li>
            <a
              href="#features"
              className="hover:text-[#D4A017] transition duration-300"
            >
              Features
            </a>
          </li>

          <li>
            <a
              href="#contact"
              className="hover:text-[#D4A017] transition duration-300"
            >
              Contact
            </a>
          </li>

        </ul>

        {/* Buttons */}

        <div className="hidden lg:flex gap-4">

          <Link to="/login">
            <Button variant="secondary">
                Login
            </Button>
          </Link>

          <Link to="/register">
                <Button variant="secondary">
                    Register
                </Button>
          </Link>

        </div>

      </nav>
    </header>
  );
};

export default Navbar;