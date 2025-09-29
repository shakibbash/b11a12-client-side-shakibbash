import React, { useEffect } from "react";
import { FaQuoteLeft, FaStar, FaUserCircle } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const testimonials = [
  {
    name: "Sarah Williams",
    role: "Active Member",
    text: "This forum has been amazing for learning and connecting. The supportive community makes a big difference!",
    rating: 5,
  },
  {
    name: "James Lee",
    role: "Moderator",
    text: "I love how organized everything is. Posts, tags, and discussions are easy to follow. Great job to the devs!",
    rating: 4,
  },
  {
    name: "Ava Patel",
    role: "Premium Member",
    text: "The premium features are worth it — priority responses and access to exclusive discussions.",
    rating: 5,
  },
];

const Testimonials = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: false }); // animations repeat on scroll
  }, []);

  return (
    <div className="relative bg-base-200 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4 flex items-center justify-center gap-2">
            What Our Members Say
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-indigo-400 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">
            Real feedback from our forum users and contributors
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl p-6 relative"
              data-aos="fade-up"
              data-aos-delay={i * 150}
              data-aos-once="false"
            >
              <FaQuoteLeft className="absolute top-4 left-4 text-3xl text-secondary opacity-40 animate-bounce" />
              <FaUserCircle className="text-5xl text-primary mx-auto mb-3 mt-6" />
              <p className="text-gray-700 text-lg mb-4 italic mt-4">“{t.text}”</p>

              {/* Stars */}
              <div className="flex items-center justify-center mb-2">
                {[...Array(t.rating)].map((_, idx) => (
                  <FaStar key={idx} className="text-yellow-400 animate-pulse" />
                ))}
              </div>

              <div className="font-bold text-primary text-center">{t.name}</div>
              <div className="text-sm text-gray-500 text-center">{t.role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
