import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaQuestionCircle } from "react-icons/fa";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I create an account on ForumX?",
      answer: "Creating an account is simple! Click the 'Sign Up' button in the top navigation, enter your email address, choose a username and password, and verify your email. You'll receive a Bronze badge immediately upon registration."
    },
    {
      question: "What are the different badge levels and how do I earn them?",
      answer: "We have three badge levels: Bronze (free upon registration, 5 posts limit), Silver (earned after 20+ quality posts with increased limits), and Gold (awarded for 50+ valuable contributions with unlimited posts and image uploads)."
    },
    {
      question: "How can I search for specific topics or posts?",
      answer: "Use the search bar in our hero section or navigation. You can search by keywords, tags, or post titles. You can also filter by tags to find discussions on specific subjects you're interested in."
    },
    {
      question: "Are there any posting guidelines I should follow?",
      answer: "Yes, we encourage respectful, constructive discussions. Avoid spam, offensive language, and personal attacks. Posts should be relevant to the community and add value to conversations. Our moderation team reviews all content."
    },
    {
      question: "How does the moderation system work?",
      answer: "ForumX uses both AI-powered and human moderation. Our team works 24/7 to ensure a safe environment. Users can also report inappropriate content, which our moderators review promptly."
    },
    {
      question: "Can I upload images to my posts?",
      answer: "Yes! Bronze members can upload limited images, while Silver and Gold members enjoy increased and unlimited image upload capabilities respectively. All images are moderated for appropriateness."
    },
    {
      question: "How do I earn recognition in the community?",
      answer: "Active participation, quality posts, helpful responses, and consistent engagement earn you upvotes and reputation. Top contributors receive special badges and may be featured in our community highlights."
    },
    {
      question: "Is my personal information secure?",
      answer: "Absolutely. We use bank-level encryption and never share your personal data with third parties. Your email and personal details are protected according to our strict privacy policy."
    },
    {
      question: "What happens if I forget my password?",
      answer: "Click 'Forgot Password' on the login page. We'll send a secure reset link to your registered email address. The link expires after 24 hours for security purposes."
    },
    {
      question: "Can I delete my account if I no longer want to use ForumX?",
      answer: "Yes, you can delete your account from the settings page. Please note that this action is permanent and will remove all your posts and data from our platform."
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaQuestionCircle className="text-3xl text-indigo-600" />
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="w-20 h-1 bg-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Find quick answers to common questions about using ForumX and making the most of our community platform.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 bg-white"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-indigo-100 rounded-lg"
              >
                <span className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <FaChevronUp className="w-5 h-5 text-indigo-600" />
                  ) : (
                    <FaChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </button>
              
              <div
                className={`px-6 pb-4 transition-all duration-300 ease-in-out ${
                  openIndex === index ? "block" : "hidden"
                }`}
              >
                <p className="text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Help CTA */}
        <div className="text-center mt-12">
          <div className="bg-indigo-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h3>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Our support team is here to help you get the most out of your ForumX experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                Contact Support
              </button>
              <button className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
                Visit Help Center
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;