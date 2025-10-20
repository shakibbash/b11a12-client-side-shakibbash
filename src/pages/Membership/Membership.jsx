import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaCrown, FaMedal, FaStar, FaArrowRight, FaInfoCircle, FaCreditCard } from "react-icons/fa";
import Lottie from "lottie-react";
import goldBadge from "../../../Public/assets/gold medal.json";
import bronzeBadge from "../../../Public/assets/New Medal.json";
import silverBadge from "../../../Public/assets/Glassmorphic Medal Lottie Animation.json";
import Marquee from "react-fast-marquee";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import Loader from "../../Components/Loader";

const plans = [
  {
    name: "Bronze",
    price: "$0/mo",
    badge: bronzeBadge,
    popular: false,
    color: "amber",
    icon: <FaMedal className="w-4 h-4" />,
    features: ["5 posts per day", "Basic community access", "Profile customization", "Access to free categories"],
    cta: "Start Basic",
  },
 
  {
    name: "Gold",
    price: "$30/mo",
    badge: goldBadge,
    popular: true,
    color: "yellow",
    icon: <FaCrown className="w-4 h-4" />,
    features: ["Everything in Silver", "Gold VIP badge", "Early access to new features", "Priority support", "Exclusive events & webinars", "Host polls & Q&As", "Leaderboard spotlight"],
    cta: "Upgrade to Gold",
  },
   {
    name: "Silver",
    price: "$15/mo",
    badge: silverBadge,
    popular: false,
    color: "gray",
    icon: <FaStar className="w-4 h-4" />,
    features: ["Unlimited posts & comments", "Ad-free browsing", "Silver badge next to username", "Upload larger files/images"],
    cta: "Go Silver",
  },
];

const Membership = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [userData, setUserData] = useState(null);  
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

  if (loading || !userData) return <Loader />;

  const handleProceedToPayment = () => {
    if (!selected) return;
    navigate("/payments", { state: { plan: selected } });
  };

  const isCurrentPlan = (planName) => userData.membership === planName;

  return (
    <div className="min-h-screen bg-white mt-10">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="w-32 h-32 mx-auto mb-6">
              <Lottie animationData={goldBadge} loop autoplay />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Upgrade Your <span className="text-yellow-300">ForumX</span> Experience
            </h1>
            <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
              Unlock premium features, earn exclusive badges, and enjoy unlimited access to our thriving community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
         
               <a href="#plan" className=" bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"> View Plans</a>
       
              
   
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="plan" className="py-16 bg-gray-50">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Select the perfect plan to unlock premium features and enhance your community experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const currentPlan = isCurrentPlan(plan.name);
              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-8 border-2 ${
                    selected === plan.name 
                      ? `border-${plan.color}-500 ring-2 ring-${plan.color}-200` 
                      : 'border-gray-200'
                  } ${plan.popular ? 'relative ring-2 ring-yellow-200' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Badge Animation */}
                  <div className="w-40 h-40 mx-auto mb-6">
                    <Lottie animationData={plan.badge} loop autoplay />
                  </div>

                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-3xl font-bold text-indigo-600">{plan.price}</p>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <FaCheckCircle className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Action Button */}
                  <button
                    onClick={() => !currentPlan && setSelected(plan.name)}
                    disabled={currentPlan}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                      currentPlan
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : selected === plan.name
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {plan.icon}
                    {currentPlan ? 'Current Plan' : plan.cta}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Selected Plan CTA */}
      {selected && !isCurrentPlan(selected) && (
        <section className="py-12 bg-white border-t border-gray-200">
          <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
              <FaCreditCard className="text-indigo-600" />
              Selected: {selected} Plan
            </h3>
            <button
              onClick={handleProceedToPayment}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto"
            >
              Proceed to Payment
              <FaArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* Comparison Table */}
      <section className="py-16 bg-white">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Plan Comparison</h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto mb-4"></div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Features</th>
                  {plans.map((plan) => (
                    <th key={plan.name} className="px-6 py-4 text-center font-semibold text-gray-900">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  ["Unlimited posts & comments", false, true, true],
                  ["Ad-free browsing", false, true, true],
                  ["VIP badge display", false, true, true],
                  ["Priority support", false,  true,false],
                  ["Exclusive events", false,  true,false],
                  ["File uploads", "Basic","Unlimited", "Enhanced", ],
                ].map(([feature, ...values], index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{feature}</td>
                    {values.map((value, idx) => (
                      <td key={idx} className="px-6 py-4 text-center">
                        {typeof value === 'boolean' ? (
                          value ? (
                            <FaCheckCircle className="w-5 h-5 text-indigo-500 mx-auto" />
                          ) : (
                            <FaInfoCircle className="w-4 h-4 text-gray-400 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-600 font-medium">{value}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Features Highlight */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Premium Benefits</h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto mb-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <FaCrown className="w-8 h-8" />, title: "Exclusive Badges", desc: "Stand out with premium badges that showcase your membership level" },
              { icon: <FaStar className="w-8 h-8" />, title: "Ad-Free Experience", desc: "Enjoy seamless browsing without any interruptions" },
              { icon: <FaMedal className="w-8 h-8" />, title: "VIP Events", desc: "Access exclusive webinars, polls, and community events" },
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <div className="text-indigo-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 bg-white">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Secure Payment Methods</h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto mb-4"></div>
          </div>

          <Marquee gradient={false} speed={40} pauseOnHover={true}>
            {[
              "https://i.ibb.co.com/YFhtM4cX/images-3.png",
              "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png",
              "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
              "https://i.ibb.co.com/yBcLLGsh/images-4.png",
            ].map((logo, index) => (
              <img
                key={index}
                src={logo}
                alt="Payment method"
                className="h-12 mx-8 opacity-70 hover:opacity-100 transition-opacity"
              />
            ))}
          </Marquee>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-8xl mx-10 px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto mb-4"></div>
          </div>

          <div className="space-y-4">
            {[
              { q: "Can I upgrade or downgrade my plan anytime?", a: "Yes, you can change your plan at any time. Changes take effect immediately." },
              { q: "Do you offer refunds?", a: "We offer a 7-day money-back guarantee for all paid plans. No questions asked." },
              { q: "Is my payment information secure?", a: "Yes, all payments are processed through secure, encrypted payment gateways." },
              { q: "Can I cancel my subscription?", a: "Yes, you can cancel anytime from your account settings. No cancellation fees." },
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-3">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Membership;