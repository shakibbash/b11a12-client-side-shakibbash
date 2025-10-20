import React from "react";
import Lottie from "lottie-react";
import { FaTrophy, FaUsers, FaChartLine, FaAward, FaMedal, FaStar } from "react-icons/fa";
import goldBadge from "../../Public/assets/gold medal.json";
import bronzeBadge from "../../Public/assets/New Medal.json";
import silverBadge from "../../Public/assets/Glassmorphic Medal Lottie Animation.json";

const badges = [
  {
    title: "Bronze Badge",
    desc: "Free badge during registration. 5 posts maximum.Free trial for experiencing our service",
    animation: bronzeBadge,
    color: "from-yellow-400 to-orange-400",
    requirement: "Complete registration"
  },
  {
    title: "Gold Badge",
    desc: "Become a top contributor and unlock unlimited posts with images",
    animation: goldBadge,
    color: "from-yellow-500 to-yellow-400",
    requirement: "50+ quality posts"
  },
  {
    title: "Silver Badge",
    desc: "Upgrade to unlock advanced features and increased post limits",
    animation: silverBadge,
    color: "from-gray-400 to-gray-600",
    requirement: "20+ active posts"
  },
];



const EarnBadges = () => (
  <section className="py-12 bg-white">
    <div className="max-w-8xl mx-10 px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 flex justify-center items-center gap-3">

          Earn Recognition Badges
        </h2>
        <div className="w-20 h-1 bg-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Level up your forum experience by earning badges through active participation and valuable contributions.
        </p>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {badges.map((badge, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center border border-gray-100 group hover:border-indigo-100"
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
            {/* <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${badge.color} text-white text-sm font-semibold mb-4`}>
              <FaStar className="w-4 h-4" />
              {badge.title}
            </div> */}

            <h3 className="text-xl font-bold text-gray-900 mb-3">{badge.title}</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">{badge.desc}</p>
            <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium">
              Requirement: {badge.requirement}
            </div>
          </div>
        ))}
      </div>

    

      {/* Achievement Progress Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Start Your Badge Journey</h3>
          <p className="text-gray-600 max-w-xl mx-auto text-lg">
            Every great contributor starts with a single post. Begin your journey today and watch your badge collection grow!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-indigo-50 rounded-xl p-6">
            <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full text-2xl font-bold text-indigo-600 mb-2 bg-white ">1</div>
            <h4 className="font-semibold text-gray-900 mb-2">Create Account</h4>
            <p className="text-gray-600 text-sm">Sign up and get your Bronze badge instantly</p>
          </div>
          <div className="bg-indigo-50 rounded-xl p-6">
 <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full text-2xl font-bold text-indigo-600 mb-2 bg-white ">2</div>
            <h4 className="font-semibold text-gray-900 mb-2">Engage Actively</h4>
            <p className="text-gray-600 text-sm">Post, comment, and interact with the community</p>
          </div>
          <div className="bg-indigo-50 rounded-xl p-6">
 <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full text-2xl font-bold text-indigo-600 mb-2 bg-white ">3</div>
            <h4 className="font-semibold text-gray-900 mb-2">Earn Recognition</h4>
            <p className="text-gray-600 text-sm">Unlock Silver and Gold badges through contributions</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default EarnBadges;