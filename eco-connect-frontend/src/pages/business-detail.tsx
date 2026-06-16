import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";
import type { Review } from "../components/business-detail/review-list";
import BusinessHeader from "../components/business-detail/business-detail";
import ReviewList from "../components/business-detail/review-list";
import AddReview from "../components/business-detail/add-review";
import { BASE_URL } from "../aws-config";

interface Business {
  businessId: string;
  name: string;
  description: string;
  category?: string;
  location?: string;
}

const BusinessDetail = () => {
  const { id } = useParams<{ id: string }>();

  const [business, setBusiness] = useState<Business | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetches the business and its reviews together when the page loads
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/business/${id}`);
        setBusiness(res.data.business);
        setReviews(res.data.reviews || []);
      } catch (err: any) {
        setError(err.message || "Failed to load business");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBusiness();
  }, [id]);

  // submits a new review for this business using the logged in user's token
  const handleAddReview = async (comment: string) => {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      const res = await axios.post(`${BASE_URL}/reviews/${id}`, { comment }, {
        headers: { Authorization: token },
      });
      // add the new review to the top of the list
      setReviews((prev) => [res.data, ...prev]);
    } catch (err: any) {
      alert(err.message || "Failed to submit review");
    }
  };

  // loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 text-gray-400">
        <div className="w-9 h-9 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-sm">Loading...</p>
      </div>
    );
  }

  // error state
  if (error || !business) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-400 text-sm">
        {error || "Business not found."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* using components */}
      <BusinessHeader name={business.name} description={business.description} />
      <hr className="border-gray-100 max-w-2xl mx-auto mb-8" />
      <ReviewList reviews={reviews} />
      <AddReview onSubmit={handleAddReview} />
    </div>
  );
};

export default BusinessDetail;