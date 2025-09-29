import React, { useEffect } from "react";
import { FaUsers, FaBolt, FaLock, FaComments } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const features = [
  {
    icon: <FaUsers className="text-3xl text-white" />,
    bg: "bg-primary",
    title: "Strong Community",
    desc: "Engage with members from all around the world and grow together.",
  },
  {
    icon: <FaComments className="text-3xl text-white" />,
    bg: "bg-secondary",
    title: "Active Discussions",
    desc: "Stay updated with trending topics and contribute to meaningful posts.",
  },
  {
    icon: <FaBolt className="text-3xl text-white" />,
    bg: "bg-accent",
    title: "Fast & Easy",
    desc: "Quick navigation, instant responses, and a smooth user experience.",
  },
  {
    icon: <FaLock className="text-3xl text-white" />,
    bg: "bg-success",
    title: "Secure Platform",
    desc: "Your data and interactions are safe with our reliable security system.",
  },
];

const WhyChooseUs = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: false }); 
  }, []);

  return (
    <div className="bg-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-black mb-4">
            Why Choose <span className="text-indigo-500">ForumX</span>?
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-indigo-400 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">
            Here’s why our members love being part of ForumX
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="card bg-base-100 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-2 animate-slide-in-left duration-300 p-6 text-center rounded-xl"
              data-aos="fade-up"
              data-aos-delay={i * 150}
              data-aos-once="false"
            >
              {/* Icon with square background */}
              <div
                className={`flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-lg ${f.bg} shadow-md`}
              >
                {f.icon}
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                {f.title}
              </h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
