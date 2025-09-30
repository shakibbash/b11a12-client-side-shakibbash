import React, { useEffect } from 'react';
import { 
  HiUsers, 
  HiLightBulb, 
  HiHeart, 
  HiGlobe, 
  HiArrowSmRight,
  HiStar,
  HiShieldCheck,
  HiTrendingUp
} from 'react-icons/hi';
import { 
  FaRocket, 
  FaHandshake, 
  FaLaptopCode, 
  FaComments,
  FaAward,
  FaUserFriends,
  FaBalanceScale
} from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AboutMe = () => {

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: "Shakib Hossain",
      role: "Web Developer",
      image: "https://i.ibb.co/0jr2n7bQ/Whats-App-Image-2024-03-19-at-11-32-51-PM.jpg",
      bio: "Passionate about building communities that empower voices."
    }
  ];

  // Values data
  const values = [
    {
      icon: <HiHeart className="w-8 h-8" />,
      title: "Community First",
      description: "We prioritize our community's needs and foster meaningful connections."
    },
    {
      icon: <HiShieldCheck className="w-8 h-8" />,
      title: "Trust & Safety",
      description: "Creating a safe space for open and respectful conversations."
    },
    {
      icon: <HiLightBulb className="w-8 h-8" />,
      title: "Innovation",
      description: "Continuously evolving to provide the best user experience."
    },
    {
      icon: <FaBalanceScale className="w-8 h-8" />,
      title: "Inclusivity",
      description: "Welcoming diverse perspectives from around the world."
    }
  ];

  // Stats data
  const stats = [
    { number: "50K+", label: "Active Users", icon: <HiUsers /> },
    { number: "100K+", label: "Discussions", icon: <FaComments /> },
    { number: "500+", label: "Communities", icon: <HiGlobe /> },
    { number: "95%", label: "Satisfaction", icon: <HiStar /> }
  ];

  return (
    <div className="min-h-screen mt-10 bg-gradient-to-br from-gray-50 to-indigo-50">

      {/* Hero Section */}
      <section 
        className="relative py-20 bg-gradient-to-r from-indigo-600 to-purple-700 text-white"
        data-aos="fade-up"
      >
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            About Forum<span className="text-yellow-300">X</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-indigo-100 max-w-3xl mx-auto">
            Where curious minds connect, share knowledge, and build communities that matter.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Join Our Community
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white" data-aos="fade-right">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At ForumX, we believe in the power of conversation to spark innovation, 
                foster understanding, and create lasting connections. Our platform is 
                designed to bring people together around shared interests and meaningful topics.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                We're committed to building a space where every voice can be heard, 
                where knowledge is shared freely, and where communities thrive through 
                genuine engagement.
              </p>
              <div className="flex items-center gap-4 text-indigo-600 font-semibold">
                <span>Learn more about our journey</span>
                <HiArrowSmRight className="w-5 h-5 animate-pulse" />
              </div>
            </div>
            <div className="relative" data-aos="fade-left">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <FaRocket className="w-16 h-16 mb-4 text-yellow-300" />
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-indigo-100">
                  To create the world's most engaging and inclusive platform for 
                  knowledge sharing and community building, where everyone feels 
                  empowered to contribute and grow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at ForumX
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                data-aos="zoom-in"
                data-aos-delay={index * 100}
                className="text-center p-8 bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="text-indigo-600 mb-4 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet The Developer of this Platform</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind ForumX who work tirelessly to 
              make our community amazing
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={member.id}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 w-80"
              >
                <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full border-4 border-white absolute -bottom-16 left-1/2 transform -translate-x-1/2 object-cover"
                  />
                </div>
                <div className="pt-20 pb-6 px-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-indigo-600 font-semibold mb-4">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                  <div className="flex justify-center gap-4 mt-6">
                    <button className="text-indigo-600 hover:text-indigo-800 transition-colors">
                      <HiArrowSmRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutMe;
