import React from "react";
import { Card } from "../shared/Card";
import { Button } from "../shared/Button";

// type for business
interface Business {
  id: string;
  name: string;
  description: string;
  businessId: string;
  category?: string;
  location?: string;
  [key: string]: any;
}

interface BusinessCardProps {
  business: Business;
  onClick: (business: Business) => void;
}

//Type safety

const BusinessCard: React.FC<BusinessCardProps> = ({ business, onClick }) => {
  return (
    <Card
      title={business.name || "Unnamed Business"}
      description={
        business.description ||
        "Locally sourced organic produce delivered fresh to your door. Supporting sustainable farming."
      }
      variant="default"
      className="cursor-pointer"
    >
      {/* button pointing to single detail business */}
      <Button
        variant="info"
        className="w-full"
        onClick={() => onClick(business)}
      >
        View Details
      </Button>
    </Card>
  );
};

export default BusinessCard;