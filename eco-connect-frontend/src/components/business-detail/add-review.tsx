import React, { useState } from "react";
import { Button } from "../shared/Button";

interface AddReviewProps {
  onSubmit: (comment: string) => Promise<void>;
}

const AddReview: React.FC<AddReviewProps> = ({ onSubmit }) => {

  // States for the comment of review and loading for api handling
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    try {
      setLoading(true);
      await onSubmit(comment);
      setComment("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 pb-16">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Add Your Review</h2>

      <div className="flex gap-3 items-center">
        <input
          type="text"
          placeholder="Enter Your Reviews...."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        />
        <Button variant="info" className="px-6 py-3" onClick={handleSubmit}>
          {loading ? "..." : "Enter"}
        </Button>
      </div>
    </div>
  );
};

export default AddReview;