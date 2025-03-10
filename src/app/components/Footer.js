import { FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className= "border-t border-grey text-grey py-10 px-6 md:px-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Logo */}
        <div className="mb-6 md:mb-0">
          <h2 className="text-2xl font-bold text-amber-400">Clio</h2>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-wrap gap-6 text-grey text-sm">
          <a href="#" className="hover:text-orange">Features</a>
          <a href="#" className="hover:text-orange">Pricing</a>
          <a href="#" className="hover:text-orange">About</a>
          <a href="#" className="hover:text-orange">Contact</a>
        </nav>

        {/* Social Media Icons */}
        <div className="flex gap-5 mt-6 md:mt-0">
          <a href="#" className="hover:text-amber-400"><FaTwitter className="w-5 h-5" /></a>
          <a href="#" className="hover:text-amber-400"><FaInstagram className="w-5 h-5" /></a>
          <a href="#" className="hover:text-amber-400"><FaLinkedin className="w-5 h-5" /></a>
          <a href="#" className="hover:text-amber-400"><FaYoutube className="w-5 h-5" /></a>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-400 text-xs mt-8">
        © {new Date().getFullYear()} Clio. All rights reserved.
      </div>
    </footer>
  );
}
