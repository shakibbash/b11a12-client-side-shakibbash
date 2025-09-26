import React, { useEffect, useState } from "react";
import { FiAward, FiLock } from "react-icons/fi";
import { Player } from "@lottiefiles/react-lottie-player";
import goldBadge from "../../../Public/assets/gold medal.json"; 
import { FaCheckCircle, FaCrown, FaMedal, FaStar, FaArrowRight, FaInfoCircle, FaCreditCard } from "react-icons/fa";
import Lottie from "lottie-react";
import bronzeBadge from "../../../Public/assets/New Medal.json";
import silverBadge from "../../../Public/assets/Glassmorphic Medal Lottie Animation";
import Marquee from "react-fast-marquee";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
// Plans
const plans = [
  {
    name: "Bronze",
    price: "$0/mo",
    badge: bronzeBadge,
    popular: false,
    color: "amber-600",
    icon: <FaMedal />,
    features: ["5 posts per day", "Basic community access", "Profile customization", "Access to free categories"],
    cta: "Start Basic",
  },
  {
    name: "Gold",
    price: "$30/mo",
    badge: goldBadge,
    popular: true,
    color: "yellow-400",
    icon: <FaCrown />,
    features: ["Everything in Silver", "Gold VIP badge", "Early access to new features", "Priority support", "Exclusive events & webinars", "Host polls & Q&As", "Leaderboard spotlight"],
    cta: "Upgrade to Gold",
  },
  {
    name: "Silver",
    price: "$15/mo",
    badge: silverBadge,
    popular: false,
    color: "gray-400",
    icon: <FaStar />,
    features: ["Unlimited posts & comments", "Ad-free browsing", "Silver badge next to username", "Upload larger files/images"],
    cta: "Go Silver",
  },
];

const borderClasses = {
  Gold: "border-yellow-400 ring-yellow-300/60",
  Silver: "border-gray-400 ring-gray-300/60",
  Bronze: "border-amber-600 ring-amber-500/60",
};

const Membership = () => {
   const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [userData, setUserData] = useState(null);  // Fetch user data

  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
    useEffect(() => {
    if (!user?.email) return;
    const fetchUser = async () => {
      try {
        const res = await axiosSecure.get(`/users/${user.email}`);
        setUserData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [user?.email, axiosSecure]);

  if (loading) return <div className="text-center mt-20">Loading user...</div>;
  if (!userData) return <div className="text-center mt-20">User not found</div>;  

  const handleProceedToPayment = () => {
    if (!selected) return alert("Please select a plan first.");
    // Replace with your Stripe payment route
   
  // pass selected plan to payments route
  navigate("/payments");
  };
  return (
    <div className="mt-5">
      {/* Hero Banner */}
      <div className="relative w-full h-[500px] rounded-xl shadow-2xl overflow-hidden p-90">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 z-0"></div>
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="absolute text-white opacity-20 animate-pulse"
            style={{ fontSize: `${Math.random() * 20 + 10}px`, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDuration: `${Math.random() * 5 + 3}s` }}>
            {["⭐", "✨", "🌟"][Math.floor(Math.random() * 5)]}
          </div>
        ))}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
          <Player autoplay loop src={goldBadge} style={{ height: "220px", width: "220px" }} />
          <span className="mt-2 text-yellow-300 text-3xl font-bold animate-bounce">Unlock Your Gold Badge!</span>
          <div className="flex gap-6 mb-4 text-white text-2xl mt-4">
                       <FaCreditCard />
            <FiAward title="Unlimited Posts" />
            <FiLock title="Exclusive Content" />
         
          </div>
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">
            Become a <span className="text-yellow-300">Forum</span> Member
          </h1>
          <h3 className="text-white text-lg md:text-2xl mb-6 max-w-xl">
            Enjoy exclusive features, unlimited posts, community perks, and stand out with your gold badge.
          </h3>
          <div className="flex gap-4">
            <button className="btn btn-warning btn-lg">Join Now</button>
            <button className="btn btn-outline btn-white btn-lg">Learn More</button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
     {/* Pricing Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 text-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
        <FaCreditCard /> Choose Your Plan
      </h1>
      <p className="text-gray-600">
        Unlock premium features and get recognized with exclusive badges 🚀
      </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
             {plans.map((plan, idx) => {
              const isCurrentPlan = userData.membership && plan.name === "Gold"; 
              return (
                <div
                  key={idx}
                  onClick={() => !isCurrentPlan && setSelected(plan.name)}
                  className={`relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border-3 cursor-pointer transform transition hover:scale-105
                    ${selected === plan.name ? borderClasses[plan.name] : "border-transparent"}
                    ${plan.popular ? "scale-105 shadow-2xl" : ""}
                    ${isCurrentPlan ? " cursor-not-allowed" : ""}
                  `}
                >
                  {/* Badge */}
                  <div className="mb-4 flex justify-center">
                    <Lottie animationData={plan.badge} loop autoplay style={{ width: 300, height: 200 }} />
                  </div>

                  {/* Title & Price */}
                  <h2 className="text-2xl font-bold text-center">{plan.name}</h2>
                  <p className="text-indigo-600 text-3xl font-bold mt-2 text-center">{plan.price}</p>

                  {/* Features */}
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <FaCheckCircle className="text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Buttons */}
                  <div className="mt-8 flex flex-col gap-3">
                    <button
                      disabled={isCurrentPlan}
                      className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold transition shadow-md ${
                        isCurrentPlan
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : plan.name === "Gold"
                          ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                          : plan.name === "Silver"
                          ? "bg-gray-400 hover:bg-gray-500 text-white"
                          : "bg-amber-600 hover:bg-amber-700 text-white"
                      }`}
                    >
                      {plan.icon} {isCurrentPlan ? "Already a Member" : plan.cta} <FaArrowRight />
                    </button>
                  </div>

                  {/* Popular Tag */}
                  {plan.popular && (
                    <span className="absolute top-4 left-4 text-xs bg-indigo-600 text-white px-2 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
        {/* Selected Plan */}
      {selected && !userData.membership && (
        <section className="py-12 bg-white/90 text-gray-900 text-center">
          <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
            <FaCreditCard /> You Selected: {selected}
          </h2>
          <button
            onClick={handleProceedToPayment}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold transition shadow-lg flex items-center justify-center gap-2 mx-auto"
          >
            Proceed to Payment <FaArrowRight />
          </button>
        </section>
      )}

      {/* Animated Comparison Table */}
      <section className="px-6 max-w-6xl mx-auto my-15">
        <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-2">
    <FaStar /> Compare Plans
  </h2>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-center rounded-2xl">
            <thead>
              <tr>
                <th>Feature</th>
                {plans.map((plan) => <th key={plan.name}>{plan.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                ["Unlimited posts & comments", false, true, true],
                ["Ad-free browsing", false, true, true],
                ["VIP badge", false, false, true],
                ["Access to exclusive events", false, false, true],
              ].map((row, idx) => (
                <tr key={idx}>
                  <td>{row[0]}</td>
                  {row.slice(1).map((val, i) => (
                    <td key={i} className="text-center">
                      {val ? <FaCheckCircle className="text-green-500 mx-auto" /> : <FaInfoCircle className="text-red-500 mx-auto" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 bg-blue-50">
         <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-2">
    <FaCrown /> Premium Features
  </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6">
          {[
            { icon: <FaCrown />, title: "VIP Badge", desc: "Stand out with a premium badge" },
            { icon: <FaStar />, title: "Ad-Free", desc: "Enjoy a smooth browsing experience" },
            { icon: <FaMedal />, title: "Exclusive Events", desc: "Access webinars & polls" },
          ].map((f, i) => (
            <div key={i} className="card bg-white shadow-lg p-6 text-center hover:scale-105 transition">
              <div className="text-4xl mb-4 text-yellow-400 mx-auto bg-blue-50 rounded-full p-2">{f.icon}</div>
              <h3 className="font-bold text-xl mb-2">{f.title}</h3>
              <p className="text-gray-700">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

    <section className="py-16 bg-white">
      <h2 className="text-3xl font-bold text-center mb-18">
        Supported Payment Methods
      </h2>

      <Marquee gradient={false} speed={50} pauseOnHover={true}>
        {/* Stripe */}
        <img
          src="https://i.ibb.co.com/YFhtM4cX/images-3.png"
          alt="Stripe"
          className="h-16 mx-6"
        />
        {/* Visa */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
          alt="Visa"
          className="h-10 mx-6"
        />
        {/* Mastercard */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
          alt="Mastercard"
          className="h-16 mx-6"
        />
        {/* American Express */}
        <img
          src="https://i.ibb.co.com/yBcLLGsh/images-4.png"
          alt="Amex"
          className="h-16 mx-6"
        />
      
      </Marquee>
    </section>

      {/* FAQ Accordion */}
      <section className="py-16 bg-gray-100">
         <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-2">
    <FaInfoCircle /> Frequently Asked Questions
  </h2>
        <div className="max-w-3xl mx-auto  px-6">
          {[
            { q: "Can I upgrade or downgrade anytime?", a: "Yes, you can change your plan anytime with no hassle." },
            { q: "Do you offer refunds?", a: "Refunds are available within the first 7 days of subscription." },
            { q: "Is payment secure?", a: "All payments are encrypted and secured through Stripe/PayPal." },
          ].map((f, i) => (
            <div key={i} tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-white rounded-box">
              <div className="collapse-title text-lg font-medium">{f.q}</div>
              <div className="collapse-content"><p>{f.a}</p></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Membership;




