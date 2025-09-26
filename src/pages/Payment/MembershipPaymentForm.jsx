import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import Lottie from "lottie-react";
import goldBadge from "../../../Public/assets/gold medal.json";
import { FaLock, FaCheckCircle } from "react-icons/fa";
import { SiReact, SiStripe } from "react-icons/si";
import { AiFillCreditCard } from "react-icons/ai";
import Loader from "../../Components/Loader";
import confetti from "canvas-confetti";

const MembershipPaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const membershipAmount = 30;
  const amountInCents = membershipAmount * 100;

  if (loading) {
    return <Loader />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (pmError) {
      setError(pmError.message);
      return;
    }
    setError("");

    const res = await axiosSecure.post("/create-membership-intent", {
      amountInCents,
      membershipType: "gold",
      userId: user.uid,
    });

    const clientSecret = res.data.clientSecret;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          name: user.displayName,
          email: user.email,
        },
      },
    });

    if (result.error) {
      setError(result.error.message);
    } else {
      setError("");
      if (result.paymentIntent.status === "succeeded") {
        const transactionId = result.paymentIntent.id;

        const paymentData = {
          userId: user.uid,
          email: user.email,
          amount: membershipAmount,
          transactionId,
          paymentMethod: result.paymentIntent.payment_method_types,
          membershipType: "gold",
        };

        const paymentRes = await axiosSecure.post("/membership-payments", paymentData);

        if (paymentRes.data.success) {
       

          // 🎉 Confetti effect
          confetti({
            particleCount: 200,
            spread: 70,
            origin: { y: 0.6 },
          });

          // 🎉 SweetAlert confirmation
          await Swal.fire({
            icon: "success",
            title: "Membership Activated!",
            html: `<strong>Gold Badge Granted 🎖️</strong><br/><br/>Transaction ID: <code>${transactionId}</code>`,
            confirmButtonText: "Go to Dashboard",
            backdrop: `
                rgba(255, 215, 0, 0.4)
           
            
            `,
          });

          navigate("/dashboard/profile");
        }
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full p-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-200"
      >
        {/* Left Section: Membership Info & Badge */}
        <div className="bg-yellow-50 md:w-1/3 p-6 flex flex-col items-center justify-center space-y-4">
          <Lottie animationData={goldBadge} loop={true} className="w-36 h-36" />
          <h2 className="font-bold text-2xl text-yellow-800 flex items-center gap-2">
            Gold Membership 
          </h2>
          <p className="text-gray-700 text-center">
            Unlock premium features, exclusive deals, and priority support with Gold Membership.
          </p>
          <div className="bg-white p-3 rounded-lg shadow-inner w-full text-left space-y-2">
            <h3 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
              Membership Details
            </h3>
            <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
              <li>Price: <strong>$30</strong></li>
              <li>Duration: <strong>1 Year</strong></li>
              <li>Exclusive Badge: <strong>Gold 🎖️</strong></li>
              <li>Priority Support Access</li>
              <li>Access to Premium Features</li>
            </ul>
          </div>
        </div>

        {/* Right Section: Payment Form */}
        <div className="md:w-2/3 p-6 flex flex-col justify-center gap-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            Complete Your Payment <AiFillCreditCard className="text-gray-600" />
          </h3>
          <p className="text-gray-600 mb-4">
            Enter your card details below to activate your Gold Membership.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-4 flex flex-col gap-2">
            <p><strong>Name:</strong> {user?.displayName || "Loading..."}</p> 
            <p><strong>Email:</strong> {user?.email || "Loading..."}</p>      
          </div>

          <div className="p-4 border rounded-lg bg-gray-50 shadow-inner mb-2">
            <CardElement options={{
              style: {
                base: { fontSize: "16px", color: "#000", "::placeholder": { color: "#999" } },
                invalid: { color: "#e53e3e" }
              }
            }} />
            <div className="flex gap-2 mt-2">
              <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="w-10 h-6"/>
              <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="MasterCard" className="w-10 h-6"/>
              <img src="https://img.icons8.com/color/48/000000/amex.png" alt="Amex" className="w-10 h-6"/>
            </div>
          </div>

          <div className="flex items-center bg-blue-50 border border-blue-200 p-3 rounded-lg text-blue-800 text-base gap-2 mt-2 mb-4">
            <FaLock className="text-gray-400" />
            <span>Your payment is secured by Stripe's industry-leading encryption</span>
          </div>

          <button
            className="mt-2 bg-indigo-600 hover:bg-indigo-500 transition-colors w-full py-3 rounded text-white font-semibold text-lg flex items-center justify-center gap-2"
            type="submit"
            disabled={!stripe}
          >
            <SiStripe className="text-white" size={20} />  Pay $30
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default MembershipPaymentForm;
