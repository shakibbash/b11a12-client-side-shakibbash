import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { FaUsers, FaMedal, FaCrown, FaPenFancy } from "react-icons/fa";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles

const CountUpStats = () => {
  const [stats, setStats] = useState(null);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axiosSecure.get("/stats/counts").then((res) => setStats(res.data));
  }, [axiosSecure]);

  // Initialize AOS
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  if (!stats) {
    return <p className="text-center text-gray-700">Loading stats...</p>;
  }

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <FaUsers className="text-4xl text-blue-600" />,
      bgColor: "bg-blue-100",
    },
    {
      title: "Bronze Members",
      value: stats.bronzeUsers,
      icon: <FaMedal className="text-4xl text-orange-600" />,
      bgColor: "bg-orange-100",
    },
    {
      title: "Golden Members",
      value: stats.goldenUsers,
      icon: <FaCrown className="text-4xl text-yellow-600" />,
      bgColor: "bg-yellow-100",
    },
    {
      title: "Total Posts",
      value: stats.totalPosts,
      icon: <FaPenFancy className="text-4xl text-pink-600" />,
      bgColor: "bg-pink-100",
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-5"   data-aos="fade-up">
        Our Community in Numbers
      </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-indigo-400 mx-auto mb-14 " ></div>
      <div className="grid md:grid-cols-4 gap-6 px-4 max-w-6xl mx-auto">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`shadow-md text-center p-6 rounded-xl bg-white transform hover:-translate-y-2 animate-slide-in-left`}
            data-aos="fade-up"
                  data-aos-once="false"
            data-aos-delay={idx * 150} 
          >
            <div
              className={`w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4 ${card.bgColor}`}
            >
              {card.icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              <CountUp end={card.value} duration={2.5} separator="," />
            </h3>
            <p className="text-gray-600 mt-2">{card.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CountUpStats;
