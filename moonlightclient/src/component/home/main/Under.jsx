import React from "react";
import { Wrench, Clock, ArrowLeft } from "lucide-react";

const UnderConstruction = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        {/* Icon */}
        <div className="mx-auto w-24 h-24 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mb-8">
          <Wrench className="w-12 h-12 text-yellow-400" />
        </div>

        {/* Badge */}
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-sm font-medium">
          <Clock size={16} />
          Website Under Construction
        </span>

        {/* Heading */}
        <h1 className="mt-8 text-5xl md:text-6xl font-bold text-white">
          We're Building
          <span className="block text-yellow-400">Something Amazing</span>
        </h1>

        {/* Description */}
        <p className="mt-6 text-gray-400 text-lg leading-relaxed">
          Our team is working hard to bring you a better experience.
          Please check back soon. We appreciate your patience and support.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
       

       
        </div>

        {/* Footer */}
        <p className="mt-12 text-sm text-gray-500">
          © {new Date().getFullYear()} All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default UnderConstruction;