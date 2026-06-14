import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../shared/Button";

// type defining 

export interface ProfileBusiness {
  businessId: string;
  name: string;
  description: string;
  category?: string;
}

interface BusinessListingProps {
  businesses: ProfileBusiness[];
  onEdit: (business: ProfileBusiness) => void;
  onDelete: (businessId: string) => void;
}

const BusinessListing: React.FC<BusinessListingProps> = ({
  businesses,
  onEdit,
  onDelete,
}) => {
  const nav = useNavigate();
// state handling 
  if (businesses.length === 0) {
    return (
      <p className="text-sm text-gray-400 px-8">
        You haven't added any businesses yet.
      </p>
    );
  }
// business listing
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 px-8">
      {businesses.map((biz) => (
        // single business card
        <div
          key={biz.businessId}
          className="border border-gray-200 rounded-2xl p-5 bg-white hover:shadow-md transition-shadow duration-150"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-bold text-gray-900">{biz.name}</h3>
            <div className="flex gap-2 ml-2 shrink-0">
              <button
                onClick={() => onEdit(biz)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => onDelete(biz.businessId)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-3">
            {biz.description}
          </p>

          <Button
            variant="info"
            className="w-full"
            onClick={() => nav(`/business/${biz.businessId}`)}
          >
            View Details
          </Button>
        </div>
      ))}
    </div>
  );
};

export default BusinessListing;