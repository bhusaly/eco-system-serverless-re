import React from "react";

// hero section for the home page

const HeroSection: React.FC = () => {
  
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-10 pt-14 pb-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
        Discover
        <br />
        Eco-Friendly
        <br />
        Businesses
      </h1>
      <p className="text-gray-400 text-lg mt-4 md:mt-0 md:max-w-xs leading-relaxed">
        Connect with sustainable companies that care about our planet
      </p>
    </div>
  );
};

export default HeroSection;