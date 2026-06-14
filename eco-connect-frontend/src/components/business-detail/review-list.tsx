import React from "react";

export interface Review {
  id: string;
  email: string;
  comment: string;
}

interface ReviewListProps {
  reviews: Review[];
}

// reviews list
const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  return (
    <div className="max-w-2xl mx-auto px-6 mb-10">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h2>

      {reviews.length === 0 && (
        <p className="text-sm text-gray-400">No reviews yet. Be the first!</p>
      )}

      <div className="flex flex-col gap-3">
        {/* individual review card */}
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border border-gray-200 rounded-xl px-5 py-4"
          >
            <p className="text-sm font-semibold text-gray-800 mb-1">{review.email}</p>
            <p className="text-xs text-gray-500 leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;