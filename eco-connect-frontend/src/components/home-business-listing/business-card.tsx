import React from "react";
import { Card } from "../shared/Card";
import { Button } from "../shared/Button";
import type { Business } from "./business-listing";

// type define
interface BusinessCardProps {
  business: Business;
  onClick: (business: Business) => void;
}


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