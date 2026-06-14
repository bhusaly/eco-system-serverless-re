import React from "react";
import { Pencil, Trash2 } from "lucide-react";

// type defiing
export interface ProfileReview {
  reviewId: string;
  businessName: string;
  comment: string;
}

interface ReviewListingProps {
  reviews: ProfileReview[];
  onEdit: (review: ProfileReview) => void;
  onDelete: (reviewId: string) => void;
}

const ReviewListing: React.FC<ReviewListingProps> = ({
  reviews,
  onEdit,
  onDelete,
}) => {
  // state handaling 
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-gray-400 px-8">
        You haven't made any reviews yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-8">
      {reviews.map((review) => (
        <div
          key={review.reviewId}
          className="border border-gray-200 rounded-2xl px-6 py-5 bg-white hover:shadow-md transition-shadow duration-150"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-bold text-gray-900">{review.businessName}</h3>
            <div className="flex gap-2 ml-2 shrink-0">
              <button
                onClick={() => onEdit(review)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => onDelete(review.reviewId)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewListing;