import { Link } from "react-router-dom";
import { Mail, Globe } from "lucide-react";
import logo from "../../assets/logo/quivora-logo.png";

const Footer = () => {
  return (
    <footer className="bg-[#023222] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">

          {/* Brand */}
          <div>
            <a href="#home" className="flex items-center gap-3">
              <img
                src={logo}
                alt="Quivora"
                className="h-16"
              />

              <div>
                <h2 className="text-3xl font-bold">
                  QUIVORA
                </h2>

                <p className="text-sm tracking-[3px] text-gray-300">
                  Learn. Assess. Achieve.
                </p>
              </div>
            </a>

            <p className="mt-6 text-gray-300 leading-8">
              Empowering learners through meaningful assessments,
              continuous improvement, and lifelong learning.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3 text-gray-300">

              <li>
                <a
                  href="#home"
                  className="hover:text-[#D4A017] transition"
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="#about"
                  className="hover:text-[#D4A017] transition"
                >
                  About
                </a>
              </li>

              <li>
                <a
                  href="#features"
                  className="hover:text-[#D4A017] transition"
                >
                  Features
                </a>
              </li>

              <li>
                <a
                  href="#contact"
                  className="hover:text-[#D4A017] transition"
                >
                  Contact
                </a>
              </li>

            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-xl font-bold mb-5">
              Platform
            </h3>

            <ul className="space-y-3 text-gray-300">

              <li>
                <Link to="/login">
                    Student Login
                </Link>
              </li>

              <li>
               <Link to="/register">
                    Register
                </Link>
              </li>

              <li>
                <Link to="/login">
                    Admin Login
                </Link>
              </li>

              <li>
                <a
                  href="#privacy"
                  className="hover:text-[#D4A017] transition"
                >
                  Privacy Policy
                </a>
              </li>

            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-xl font-bold mb-5">
              Connect
            </h3>

            <div className="space-y-4">

              <div className="flex items-center gap-3">
                <Mail size={18} />
                <span>support@quivora.com</span>
              </div>

              <div className="flex items-center gap-3">
                <Globe size={18} />
                <span>www.quivora.com</span>
              </div>

            </div>
          </div>

        </div>

        <hr className="my-5 border-gray-700" />

        <p className="text-center text-gray-400 h-1">
          © 2026 Quivora. All Rights Reserved.
        </p>

      </div>
    </footer>
  );
};

export default Footer;