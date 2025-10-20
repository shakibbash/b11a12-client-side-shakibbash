import { Globe, Mail, Phone, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';


export default function CTA1() {
  return (
    <div className="w-full">
      <section className="mx-10 max-w-8xl px-2 py-12 lg:px-8">
        <div className="bg-indigo-600 rounded-2xl overflow-hidden shadow-xl">
          <div className="relative px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
            {/* Header */}
            <div className="text-center lg:text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <MessageCircle className="h-5 w-5 text-white" />
                <span className="text-white text-sm font-semibold uppercase tracking-wide">
                  Get In Touch
                </span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                How Can You <span className="text-indigo-200">Reach Us</span>?
              </h2>
               <div
            className="w-24 h-1 bg-white mx-auto mb-6"
            data-aos="fade-up"
            data-aos-delay="100"
          ></div>
              <p className="text-lg text-indigo-100 text-center mb-8 leading-relaxed">
                Have questions or need support? We're here to help you get the most out of your ForumX experience.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <a
                href="mailto:subha9.5roy350@gmail.com"
                className="group bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-red-500/20 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold">Email Us</p>
                    <p className="text-indigo-100 text-sm mt-1">shakibhossain2273@gmail.com</p>
                  </div>
                </div>
              </a>

              <a
                href="tel:+918637373116"
                className="group bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-green-500/20 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold">Call Us</p>
                    <p className="text-indigo-100 text-sm mt-1">01868623523</p>
                  </div>
                </div>
              </a>

              <Link
                href="/"
                className="group bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500/20 p-3 rounded-lg">
                    <Globe className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold">Visit Website</p>
                    <p className="text-indigo-100 text-sm mt-1">Forum-X</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Process Steps */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-semibold text-lg mb-4">How It Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                    1
                  </div>
                  <p className="text-indigo-100 text-sm">Submit your query and state your requirements</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                    2
                  </div>
                  <p className="text-indigo-100 text-sm">Receive a callback from our experts to help with your needs</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center mt-8">
              <a
                href="mailto:subha9.5roy350@gmail.com"
                className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Contact Us Now
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}