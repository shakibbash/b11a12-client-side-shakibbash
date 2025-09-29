import React from "react";
import Lottie from "lottie-react";
import { FaStar, FaAward } from "react-icons/fa";
import goldBadge from "../../Public/assets/gold medal.json";
import bronzeBadge from "../../Public/assets/New Medal.json";
import silverBadge from "../../Public/assets/Glassmorphic Medal Lottie Animation.json";

const badges = [
  {
    title: "Bronze Badge",
    desc: "Free badge  during registration  Bronze Badge. 5 posts maximum",
    animation: bronzeBadge,
    color: "from-yellow-400 to-orange-400",
    icon: <FaAward className="text-white text-2xl" />,
  },
  {
    title: "Gold Badge",
    desc: "Become a top contributor and unlock the Gold Badge ! Unlimited posts with images",
    animation: goldBadge,
    color: "from-yellow-500 to-yellow-400",
    icon: <FaAward className="text-white text-2xl" />,
  },
  {
    title: "Silver Badge",
    desc: "Membership to upgrade a level up  to claim the Silver Badge.",
    animation: silverBadge,
    color: "from-gray-400 to-gray-600",
    icon: <FaStar className="text-white text-2xl" />,
  },
  
];

const EarnBadges = () => (
  <section className="py-16 bg-gray-50" data-aos="fade-up" data-aos-duration="1000">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      {/* Heading */}
      <h2 className="text-3xl font-bold mb-4 text-gray-800 flex justify-center items-center gap-2">
        <FaAward className="text-indigo-600" /> Earn Badges
      </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-indigo-400 mx-auto mb-4"></div>
      <p className="text-gray-600 mb-10">
        Unlock achievements by participating and contributing actively in the ForumX community.
      </p>

      {/* Single row badges */}
      <div className="flex flex-wrap justify-center gap-8">
        {badges.map((badge, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-2xl shadow-lg w-60 p-4 flex flex-col items-center transition transform hover:-translate-y-1 hover:shadow-xl`}
            data-aos="fade-up"
            data-aos-delay={idx * 150}
            data-aos-duration="800"
          >
            {/* Lottie Animation */}
            <div className="w-24 h-24 mb-3">
              <Lottie
                animationData={badge.animation}
                loop
                autoplay
                style={{ width: "100%", height: "100%" }}
              />
            </div>

            {/* Icon */}
            <div className={`mb-2 p-2 rounded-full bg-gradient-to-r ${badge.color} shadow-md`}>
              {badge.icon}
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-800 mb-1 text-center">{badge.title}</h3>

            {/* Short Description */}
            <p className="text-gray-600 text-sm text-center">{badge.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default EarnBadges;
