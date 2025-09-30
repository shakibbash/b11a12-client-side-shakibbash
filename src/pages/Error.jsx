import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import Lottie from 'lottie-react';
import forum404 from '../../Public/assets/404 Animation.json'; 

const Error = () => {
  const { type } = useParams();     
  const location = useLocation();     

  // Decide message based on type param
  let heading = "ForumX Page Not Found";
  let message = "Sorry, the page you're looking for doesn't exist.";

   if (type === "forum") {
    heading = "Forum Thread Missing";
    message = "Sorry, this forum thread no longer exists.";
  }

  return (
    <div className="min-h-screen my-6 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center">

        {/* Lottie Animation */}
        <div className="mb-8">
          <Lottie 
            animationData={forum404} 
            loop={true} 
            className="w-64 h-64 mx-auto"
          />
        </div>

        {/* Dynamic Heading & Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {heading}
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            {message}
          </p>
          <p className="text-sm text-gray-500">
            The URL you tried: <span className="font-mono text-blue-600">{location.pathname}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Back to Home
          </Link>
        </div>

        {/* Fun Message */}
        <div className="mt-8 p-4 bg-blue-100 rounded-lg">
          <p className="text-sm text-blue-800">
            🗞️ Breaking News: This ForumX page has gone missing! Our moderators are investigating...
          </p>
        </div>
      </div>
    </div>
  )
}

export default Error;
