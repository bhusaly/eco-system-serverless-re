import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../shared/Button";
import type { ProfileReview } from "./reviews-listing";

// type defining
interface EditReviewModalProps {
  review: ProfileReview;
  onClose: () => void;
  onSubmit: (reviewId: string, comment: string) => Promise<void>;
}

// edit review modal 
const EditReviewModal: React.FC<EditReviewModalProps> = ({
  review,
  onClose,
  onSubmit,
}) => {
  const [comment, setComment] = useState(review.comment);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    try {
      setLoading(true);
      await onSubmit(review.reviewId, comment);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm relative">
{/* form  */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Edit Review</h2>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={5}
          className="w-full mb-6 px-4 py-3 border border-gray-200 rounded-xl text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 resize-none"
        />

        <Button variant="info" className="w-full py-3 text-base" onClick={handleSubmit}>
          {loading ? "Please wait..." : "Enter"}
        </Button>
      </div>
    </div>
  );
};

export default EditReviewModal;