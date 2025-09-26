// Payment.jsx
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import MembershipPaymentForm from "./MembershipPaymentForm";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Bar */}
      <div className="bg-red-50 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate("/membership")}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors font-medium"
          >
            <FaArrowLeft className="mr-2" />
            Back to Membership
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Elements stripe={stripePromise}>
          <MembershipPaymentForm />
        </Elements>
      </div>
    </div>
  );
};

export default Payment;
