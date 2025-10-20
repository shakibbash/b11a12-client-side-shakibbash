import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { FaUsers, FaMedal, FaCrown, FaPenFancy } from "react-icons/fa";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import AOS from "aos";
import "aos/dist/aos.css";

const CountUpStats = () => {
  const [stats, setStats] = useState(null);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axiosSecure.get("/stats/counts").then((res) => setStats(res.data));
  }, [axiosSecure]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  if (!stats) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="text-gray-600 ml-3">Loading stats...</p>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <FaUsers className="text-3xl text-indigo-600" />,
      bgColor: "bg-indigo-50",
    },
    {
      title: "Bronze Members",
      value: stats.bronzeUsers,
      icon: <FaMedal className="text-3xl text-indigo-600" />,
      bgColor: "bg-indigo-50",
    },
    {
      title: "Golden Members",
      value: stats.goldenUsers,
      icon: <FaCrown className="text-3xl text-indigo-600" />,
      bgColor: "bg-indigo-50",
    },
    {
      title: "Total Posts",
      value: stats.totalPosts,
      icon: <FaPenFancy className="text-3xl text-indigo-600" />,
      bgColor: "bg-indigo-50",
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-8xl mx-10  md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4" data-aos="fade-up">
            Community Statistics
          </h2>
           <div className="w-20 h-1 bg-indigo-600 mx-auto mb-2" data-aos="fade-up" data-aos-delay="100"></div>
          <p   className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="200">Our community in numbers — growing stronger every day.</p>
         
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 text-center border border-gray-100"
              data-aos="fade-up"
              data-aos-delay={idx * 150}
            >
              <div className={`w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4 ${card.bgColor}`}>
                {card.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                <CountUp end={card.value} duration={2.5} separator="," />
              </h3>
              <p className="text-gray-600 text-sm font-medium">{card.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CountUpStats;