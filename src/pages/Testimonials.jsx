import React, { useEffect } from "react";
import { FaQuoteLeft, FaStar, FaUserCircle } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const testimonials = [
  {
    name: "Shakib Hossain",
    role: "Active Member",
    text: "This forum has been amazing for learning and connecting. The supportive community makes a big difference!",
    rating: 5,
    img:"https://i.postimg.cc/3NJ6Ww2g/Gemini-Generated-Image-k1nhcek1nhcek1nh-min-min-min.png"
  },
  {
    name: "James Lee",
    role: "Moderator",
    text: "I love how organized everything is. Posts, tags, and discussions are easy to follow. Great job to the devs!",
    rating: 4,
    img:"https://i.postimg.cc/c1nnnRBH/116be8bc85ac6d04c7c7354482f2a065.jpg"
  },
  {
    name: "James Patel",
    role: "Premium Member",
    text: "The premium features are worth it — priority responses and access to exclusive discussions.",
    rating: 5,
    img:"https://i.postimg.cc/3wqkyNy1/8fqzw8yxpkp11.jpg"
  },
];

const Testimonials = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-8xl mx-10 px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4" data-aos="fade-up">
            What Our Members Say
          </h2>
          <div className="w-20 h-1 bg-indigo-600 mx-auto mb-4" data-aos="fade-up" data-aos-delay="100"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
            Real feedback from our forum users and contributors
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100"
              data-aos="fade-up"
              data-aos-delay={idx * 150}
            >
              {/* Quote Icon */}
              <div className="flex justify-center mb-4">
                <FaQuoteLeft className="text-3xl text-indigo-600 opacity-20" />
              </div>

          {/* User Avatar */}
<div className="flex justify-center mb-4">
  <img
    src={testimonial.img}
    alt={testimonial.name}
    className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 shadow-sm"
  />
</div>


              {/* Testimonial Text */}
              <p className="text-gray-600 text-center mb-6 leading-relaxed italic">
                "{testimonial.text}"
              </p>

              {/* Rating Stars */}
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, starIdx) => (
                  <FaStar
                    key={starIdx}
                    className={`w-4 h-4 ${
                      starIdx < testimonial.rating ? "text-indigo-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* User Info */}
              <div className="text-center">
                <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;