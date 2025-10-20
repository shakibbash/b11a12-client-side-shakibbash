import React from "react";
import Lottie from "lottie-react";

import goldBadge from "../../Public/assets/gold medal.json";
import bronzeBadge from "../../Public/assets/New Medal.json";
import silverBadge from "../../Public/assets/Glassmorphic Medal Lottie Animation.json";
import { useTheme } from "../Hooks/useTheme";

const badges = [
  {
    title: "Bronze Badge",
    desc: "Free badge during registration. 5 posts maximum.Free trial for experiencing our service",
    animation: bronzeBadge,
    requirement: "Complete registration"
  },
  {
    title: "Gold Badge",
    desc: "Become a top contributor and unlock unlimited posts with images",
    animation: goldBadge,
    requirement: "50+ quality posts"
  },
  {
    title: "Silver Badge",
    desc: "Upgrade to unlock advanced features and increased post limits",
    animation: silverBadge,
    requirement: "20+ active posts"
  },
];

const EarnBadges = () => {
  const { isDarkMode } = useTheme();

  const containerBg = isDarkMode ? "bg-gray-900" : "bg-white";
  const cardBg = isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100";
  const textPrimary = isDarkMode ? "text-white" : "text-gray-900";
  const textSecondary = isDarkMode ? "text-gray-400" : "text-gray-600";
  const accentBg = isDarkMode ? "bg-indigo-900/30" : "bg-indigo-50";
  const accentText = isDarkMode ? "text-indigo-300" : "text-indigo-600";

  return (
    <section className={`py-12 transition-colors duration-300 ${containerBg}`}>
      <div className="max-w-8xl mx-10 px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold mb-4 flex justify-center items-center gap-3 ${textPrimary}`}>
            Earn Recognition Badges
          </h2>
          <div className="w-20 h-1 bg-indigo-600 mx-auto mb-4"></div>
          <p className={`max-w-2xl mx-auto text-lg ${textSecondary}`}>
            Level up your forum experience by earning badges through active participation and valuable contributions.
          </p>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className={`rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center border ${cardBg} group`}
              data-aos="fade-up"
              data-aos-delay={idx * 150}
            >
              {/* Lottie Animation */}
              <div className="w-40 h-40 mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
                <Lottie
                  animationData={badge.animation}
                  loop
                  autoplay
                  style={{ width: "100%", height: "100%" }}
                />
              </div>

              {/* Badge Info */}
              <h3 className={`text-xl font-bold mb-3 ${textPrimary}`}>{badge.title}</h3>
              <p className={`mb-4 leading-relaxed ${textSecondary}`}>{badge.desc}</p>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${accentBg} ${accentText}`}>
                Requirement: {badge.requirement}
              </div>
            </div>
          ))}
        </div>

        {/* Achievement Progress Section */}
        <div className={`rounded-2xl shadow-lg p-8 border ${cardBg}`}>
          <div className="text-center mb-8">
            <h3 className={`text-2xl font-bold mb-3 ${textPrimary}`}>Start Your Badge Journey</h3>
            <p className={`max-w-xl mx-auto text-lg ${textSecondary}`}>
              Every great contributor starts with a single post. Begin your journey today and watch your badge collection grow!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {["Create Account", "Engage Actively", "Earn Recognition"].map((title, idx) => (
              <div key={idx} className={`${accentBg} rounded-xl p-6`}>
                <div className={`flex items-center justify-center w-10 h-10 mx-auto rounded-full text-2xl font-bold mb-2 ${accentText} bg-white`}>
                  {idx + 1}
                </div>
                <h4 className={`font-semibold mb-2 ${textPrimary}`}>{title}</h4>
                <p className={`text-sm ${textSecondary}`}>
                  {idx === 0
                    ? "Sign up and get your Bronze badge instantly"
                    : idx === 1
                    ? "Post, comment, and interact with the community"
                    : "Unlock Silver and Gold badges through contributions"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EarnBadges;
