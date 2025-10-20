import React, { useEffect } from "react";
import {
  FaUsers,
  FaBolt,
  FaLock,
  FaComments,
  FaHeart,
  FaRocket,
  FaShieldAlt,
  FaChartLine
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const features = [
  {
    icon: <FaUsers className="text-2xl text-white" />,
    title: "Vibrant Community",
    desc: "Join 10,000+ active members sharing knowledge and building connections daily.",
    stat: "10K+ Members",
    color: "bg-indigo-500"
  },
  {
    icon: <FaComments className="text-2xl text-white" />,
    title: "Active Discussions",
    desc: "500+ new posts daily across diverse topics from tech to lifestyle.",
    stat: "500+ Posts/Day",
    color: "bg-indigo-500"
  },
  {
    icon: <FaBolt className="text-2xl text-white" />,
    title: "Lightning Fast",
    desc: "Instant notifications, real-time updates, and seamless navigation experience.",
    stat: "<1s Response",
    color: "bg-indigo-500"
  },
  {
    icon: <FaLock className="text-2xl text-white" />,
    title: "Bank-Level Security",
    desc: "End-to-end encryption and 24/7 moderation ensure your safety.",
    stat: "100% Secure",
    color: "bg-indigo-500"
  },
  {
    icon: <FaHeart className="text-2xl text-white" />,
    title: "User-Friendly",
    desc: "Intuitive interface designed for both beginners and power users.",
    stat: "99% Satisfaction",
    color: "bg-indigo-500"
  },
  {
    icon: <FaRocket className="text-2xl text-white" />,
    title: "Rapid Growth",
    desc: "Our community grows by 100+ new members every single day.",
    stat: "100+/Day Growth",
    color: "bg-indigo-500"
  },
  {
    icon: <FaShieldAlt className="text-2xl text-white" />,
    title: "Content Moderation",
    desc: "AI-powered and human moderation for quality discussions.",
    stat: "24/7 Moderation",
    color: "bg-indigo-500"
  },
  {
    icon: <FaChartLine className="text-2xl text-white" />,
    title: "Performance Metrics",
    desc: "Track your engagement and growth with detailed analytics.",
    stat: "Real-time Stats",
    color: "bg-indigo-500"
  }
];

const WhyChooseUs = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="relative py-16 bg-white overflow-hidden">
      {/* === Grid Background Pattern === */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* === Main Content === */}
      <div className="relative z-10 max-w-8xl mx-10 px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl font-bold text-gray-900 mb-6"
            data-aos="fade-up"
          >
            Why Thousands Choose <span className="text-indigo-600">ForumX</span>
          </h2>
          <div
            className="w-24 h-1 bg-indigo-600 mx-auto mb-6"
            data-aos="fade-up"
            data-aos-delay="100"
          ></div>
          <p
            className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Discover the features that make ForumX the most engaging and trusted
            community platform for meaningful discussions and connections.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 text-center border border-gray-100 hover:border-indigo-100"
              data-aos="fade-up"
              data-aos-delay={idx * 100}
            >
              <div
                className={`w-16 h-16 flex items-center justify-center ${feature.color} rounded-2xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                {feature.desc}
              </p>
              <div className="inline-block bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-sm font-semibold">
                {feature.stat}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-3xl p-12 text-center text-white">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-4" data-aos="fade-up">
              Ready to Experience ForumX?
            </h3>
            <p
              className="text-indigo-100 text-lg mb-8 leading-relaxed"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Join our thriving community today and start engaging in meaningful
              conversations with like-minded people.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <button className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl">
                Get Started Free
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-indigo-600 transition-colors">
                Take a Tour
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
