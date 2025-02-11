import React from "react";

const Hero = () => {
  return (
    <section className="bg-gray-100 py-20 h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">Welcome to SecurityApp</h2>
        <p className="text-lg text-gray-600 mb-6">Secure your application with role-based authentication.</p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
          Get Started
        </button>
      </div>
    </section>
  );
};

export default Hero;
