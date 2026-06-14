import React from "react";

interface BusinessHeaderProps {
  name: string;
  description: string;
}
// business header card 
const BusinessHeader: React.FC<BusinessHeaderProps> = ({ name, description }) => {
  return (
    <div className="text-center py-10 px-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{name}</h1>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default BusinessHeader;