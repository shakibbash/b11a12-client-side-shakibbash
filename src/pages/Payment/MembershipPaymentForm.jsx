import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import Lottie from "lottie-react";
import goldBadge from "../../../Public/assets/gold medal.json";
import { FaLock, FaCheckCircle, FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import { SiStripe } from "react-icons/si";
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
  const [isProcessing, setIsProcessing] = useState(false);
  const membershipAmount = 30;
  const amountInCents = membershipAmount * 100;

  if (loading) {
    return <Loader />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error: pmError } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (pmError) {
      setError(pmError.message);
      setIsProcessing(false);
      return;
    }
    setError("");

    try {
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
            confetti({
              particleCount: 200,
              spread: 70,
              origin: { y: 0.6 },
            });

            await Swal.fire({
              icon: "success",
              title: "Welcome to Gold Membership!",
              html: `<strong>Your Gold Badge has been activated! 🎖️</strong><br/><br/>
                     <div class="text-sm text-gray-600">
                       Transaction ID: <code class="bg-gray-100 px-2 py-1 rounded">${transactionId}</code>
                     </div>`,
              confirmButtonText: "Go to Dashboard",
              confirmButtonColor: "#4f46e5",
              backdrop: "rgba(255, 215, 0, 0.2)",
            });

            navigate("/dashboard/profile");
          }
        }
      }
    } catch {
      // Error intentionally not inspected here; generic message shown to the user
      setError("Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReturn = () => {
    navigate("/membership");
  };

  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-8xl mx-10   ">
        {/* Header with Return Button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleReturn}
            className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Plans
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Complete Payment</h1>
              <div
            className="w-24 h-1 bg-indigo-600 mx-auto mb-2 mt-3"
         
          ></div>
            <p className="text-gray-600">Secure checkout for Gold Membership</p>
          </div>
          <div className="w-20"></div> {/* Spacer for balance */}
        </div>

        <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Section: Membership Info */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 md:w-2/5 p-8 border-r border-gray-200">
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto mb-4">
                  <Lottie animationData={goldBadge} loop={true} />
                </div>
                <h2 className="text-2xl font-bold text-amber-800 mb-2">Gold Membership</h2>
                <div className="text-3xl font-bold text-amber-600">${membershipAmount}</div>
                <p className="text-amber-700 text-sm mt-1">per year</p>
              </div>

              <div className="bg-white/80 rounded-lg p-4 border border-amber-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  Membership Benefits
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    Exclusive Gold Badge
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    Unlimited posts & comments
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    Ad-free browsing experience
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    Priority customer support
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    Access to exclusive events
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Section: Payment Form */}
            <div className="md:w-3/5 p-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <AiFillCreditCard className="text-indigo-600" />
                  Payment Information
                </h3>
                <p className="text-gray-600 text-sm">
                  Enter your card details to complete the purchase
                </p>
              </div>

              {/* User Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 font-medium">Name</p>
                    <p className="text-gray-900">{user?.displayName || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Email</p>
                    <p className="text-gray-900">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Card Element */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Details
                </label>
                <div className="border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#374151",
                          "::placeholder": {
                            color: "#9CA3AF",
                          },
                        },
                      },
                    }}
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  {["visa", "mastercard", "amex"].map((type) => (
                    <div key={type} className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                      <img
                        src={`https://img.icons8.com/color/48/000000/${type}.png`}
                        alt={type}
                        className="w-6 h-4 object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                <div className="flex items-start gap-3">
                  <FaShieldAlt className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-blue-800 text-sm font-medium">Secure Payment</p>
                    <p className="text-blue-700 text-xs">
                      Your payment information is encrypted and processed securely by Stripe
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                type="submit"
                disabled={!stripe || isProcessing}
                onClick={handleSubmit}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <SiStripe className="w-5 h-5" />
                    Pay ${membershipAmount}
                  </>
                )}
              </button>

              {/* Return Button for Mobile */}
              <button
                onClick={handleReturn}
                className="w-full mt-3 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors md:hidden"
              >
                Choose Different Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipPaymentForm;