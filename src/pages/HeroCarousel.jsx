import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaPlay, FaPause } from "react-icons/fa";

import { Link } from "react-router";
import { useTheme } from "../Hooks/useTheme";

const HeroCarousel = () => {
  const { isDarkMode } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const slides = [
    {
      id: 1,
      image: "https://i.postimg.cc/0yR13gzC/group-therapy-illustration-74855-5516.avif",
      title: "Join Our Growing Community",
      description: "Connect with thousands of passionate members sharing knowledge and building meaningful discussions every day.",
      cta: "Join Now",
    },
    {
      id: 2,
      image: "https://i.postimg.cc/7Z8rcv59/outlined-icon-of-group-of-people-doing-discussion-suitable-for-design-element-of-teamwork-discussion.jpg",
      title: "Engage in Meaningful Discussions",
      description: "Discover trending topics, share your expertise, and learn from industry professionals in our active forums.",
      cta: "Explore Posts",
    },
    {
      id: 3,
      image: "https://i.postimg.cc/52dWGcXQ/award-ribbon-badge-star-excellence-vector-design-generative-ai-vibrant-illustration-horizontal-featu.webp",
      title: "Earn Recognition & Badges",
      description: "Level up your forum experience by earning badges and recognition for your valuable contributions.",
      cta: "Learn More",
    },
    {
      id: 4,
      image: "https://i.postimg.cc/GmFtgxmH/man-holding-security-shield-developer-using-laptop-data-applications-protection-network-information.avif",
      title: "Safe & Secure Environment",
      description: "Enjoy a fully moderated platform with bank-level security and 24/7 content moderation.",
      cta: "Get Started",
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index) => setCurrentSlide(index);

  // Theme-based classes
  const containerBg = isDarkMode ? "bg-gray-900" : "bg-white";
  const textPrimary = isDarkMode ? "text-white" : "text-gray-900";
  const textSecondary = isDarkMode ? "text-gray-400" : "text-gray-600";
  const buttonBg = isDarkMode ? "bg-gray-100" : "bg-white";
  const buttonText = isDarkMode ? "text-gray-800" : "text-gray-900";
  const navBg = isDarkMode ? "bg-gray-800/90" : "bg-white/90";
  const navText = isDarkMode ? "text-white" : "text-gray-900";
  const indicatorActive = isDarkMode ? "bg-gray-300" : "bg-white";
  const indicatorInactive = isDarkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-white/50 hover:bg-white/70";
  const gradientOverlay = isDarkMode ? "from-black/20" : "from-black/10";

  return (
    <section className={`${containerBg} py-8 transition-colors duration-300`}>
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className={`text-4xl font-bold mb-6 ${textPrimary}`}>
          ForumX: Where Conversations Thrive 
        </h2>
        <div className={`w-24 h-1 mx-auto mb-6 ${isDarkMode ? "bg-indigo-500" : "bg-indigo-600"}`}></div>
        <p className={`text-lg max-w-3xl mx-auto leading-relaxed ${textSecondary}`}>
          Join our moderated community for quality discussions, expert insights, and genuine connections
        </p>
      </div>

      {/* Carousel */}
      <div className="max-w-8xl mx-10 px-4 md:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden shadow-sm border" style={{ borderColor: isDarkMode ? "#374151" : "#f3f4f6" }}>
          <div className="relative h-auto min-h-[500px]">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentSlide ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"}`}
              >
                <div className="flex flex-col lg:flex-row h-full">
                  {/* Content */}
                  <div className={`flex-1 flex items-center justify-center lg:justify-start p-8 md:p-12 lg:p-16 bg-indigo-500 ${isDarkMode ? "bg-indigo-600" : ""}`}>
                    <div className="max-w-lg text-white text-center lg:text-left">
                      <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                        {slide.title}
                      </h2>
                      <p className="text-base md:text-lg lg:text-xl mb-8 text-white/90 leading-relaxed">
                        {slide.description}
                      </p>
                      <button className={`${buttonBg} ${buttonText} px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-white transition-colors shadow-sm`}>
                        {slide.cta}
                      </button>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="flex-1 relative">
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-contain" />
                    <div className={`absolute inset-0 bg-gradient-to-l ${gradientOverlay} to-transparent`}></div>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Buttons */}
            <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-3">
              <button onClick={prevSlide} className={`${navBg} ${navText} p-3 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md border border-white/20 dark:border-gray-600/20`}>
                <FaArrowLeft className="w-4 h-4" />
              </button>
              <button onClick={nextSlide} className={`${navBg} ${navText} p-3 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md border border-white/20 dark:border-gray-600/20`}>
                <FaArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`${navBg} ${navText} absolute right-6 top-6 p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-all shadow-sm border border-white/20 dark:border-gray-600/20 text-sm font-medium flex items-center gap-2 px-3`}
            >
              {isPlaying ? <FaPause className="w-3 h-3" /> : <FaPlay className="w-3 h-3" />}
              {isPlaying ? "Pause" : "Play"}
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-8 h-1 rounded-full transition-all ${index === currentSlide ? indicatorActive : indicatorInactive}`}
                />
              ))}
            </div>

            {/* Progress Bar */}
            {isPlaying && (
              <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-white/20 dark:bg-gray-600/20`}>
                <div 
                  className="h-full bg-white/80 dark:bg-gray-300/80 transition-all duration-5000 ease-linear"
                  style={{ animation: 'progress 5s linear' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
};

export default HeroCarousel;
