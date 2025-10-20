import React from 'react';
import {
  FaFacebook,
  FaInstagram,
  FaGithub,
  FaLinkedin,

  FaCode,
} from 'react-icons/fa';

import Logo from './Logo';
import { useTheme } from '../Hooks/useTheme';


const Footer = () => {
  const { isDarkMode } = useTheme();

  // Theme-based classes
  const bgFooter = isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-900 text-gray-400';
  const borderColor = isDarkMode ? 'border-gray-700/50' : 'border-gray-700/50';
  const hoverLink = isDarkMode ? 'hover:text-indigo-400' : 'hover:text-indigo-400';

  return (
    <div>
   

      <footer className={`${bgFooter}  transition-colors duration-300 relative`}>
         {/* Top wave shape */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-0 transform">
        <svg className="relative block w-full h-12 text-gray-900" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className={`${isDarkMode ? 'fill-gray-900' : 'fill-gray-50'}`}></path>
        </svg>
      </div>
        <div className="max-w-8xl mx-10 px-4 sm:px-6 lg:px-8 py-20">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {/* Logo and Description */}
            <div className="space-y-4">
              <Logo />
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-400'} text-sm leading-relaxed`}>
                Your comprehensive platform for exploring posts, sharing your thoughts & discovering trending topics!
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className={`${isDarkMode ? 'text-white' : 'text-white'} font-semibold text-lg`}>Quick Links</h3>
              <div className="space-y-2">
                {['Home', 'Dashboard', 'About', 'Contact'].map((link) => (
                  <a
                    key={link}
                    href={`/${link.toLowerCase()}`}
                    className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} ${hoverLink} transition-colors duration-200 text-sm`}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className={`${isDarkMode ? 'text-white' : 'text-white'} font-semibold text-lg`}>Get in Touch</h3>
              <div className="space-y-2 text-sm">
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                  <span className="text-indigo-400">Email:</span> shaking235@gmail.com
                </p>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                  <span className="text-indigo-400">Phone:</span> +8801868623523
                </p>

                {/* Social Media Icons */}
                <div className="flex space-x-4 mt-4">
                  <a
                    href=""
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 hover:text-indigo-500 transition-transform duration-300 hover:scale-110`}
                  >
                    <FaFacebook className="w-5 h-5" />
                  </a>
            
                  <a
                    href=""
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 hover:text-indigo-400 transition-transform duration-300 hover:scale-110`}
                  >
                    <FaGithub className="w-5 h-5" />
                  </a>
                  <a
                    href=""
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 hover:text-indigo-400 transition-transform duration-300 hover:scale-110`}
                  >
                    <FaLinkedin className="w-5 h-5" />
                  </a>
                  <a
                    href=""
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 hover:text-indigo-500 transition-transform duration-300 hover:scale-110`}
                  >
                    <FaCode className="w-5 h-5" />
                  </a>
                 
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Border */}
          <div className={`border-t ${borderColor} mt-8 pt-6`}>
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-400'} text-sm`}>
                © 2025 Forum-X. All rights reserved.
              </p>
              <div className="text-sm">
                <span className="text-gray-400">Developed by </span>
                <a
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 font-medium"
                >
                  Shakib Hossain
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
