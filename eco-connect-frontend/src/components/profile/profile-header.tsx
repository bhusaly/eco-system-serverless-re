import React from "react";
import { Button } from "../shared/Button";

interface ProfileHeaderProps {
  email: string;
  businessCount: number;
  reviewCount: number;
  onAddBusiness: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  email,
  businessCount,
  reviewCount,
  onAddBusiness,
}) => {
  return (
    <div className="px-8 pt-10 pb-6">
      {/* Top row */}
      <div className="flex items-start justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{email}</h1>
        <Button variant="info" onClick={onAddBusiness}>
          Add Business
        </Button>
      </div>

      {/* Stat cards */}
      <div className="flex gap-4">
        <div className="border border-gray-200 rounded-xl px-6 py-5 w-52">
          <p className="text-lg font-bold text-gray-900 mb-1">{businessCount} Business</p>
          <p className="text-xs text-gray-400">You have added {businessCount} business yet.</p>
        </div>
        <div className="border border-gray-200 rounded-xl px-6 py-5 w-52">
          <p className="text-lg font-bold text-gray-900 mb-1">{reviewCount} Reviews</p>
          <p className="text-xs text-gray-400">You have made {reviewCount} reviews yet</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;