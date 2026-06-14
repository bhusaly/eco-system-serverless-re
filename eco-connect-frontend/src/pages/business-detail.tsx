import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Review } from "../components/business-detail/review-list";
import BusinessHeader from "../components/business-detail/business-detail";
import ReviewList from "../components/business-detail/review-list";
import AddReview from "../components/business-detail/add-review";
// import axios from "axios";


// const API_URL = "https://85z743ntte.execute-api.us-east-1.amazonaws.com/business";
// const REVIEW_URL = "https://85z743ntte.execute-api.us-east-1.amazonaws.com/review";

interface Business {
  businessId: string;
  name: string;
  description: string;
  category?: string;
  location?: string;
}

const DUMMY_BUSINESS: Business = {
  businessId: "biz-001",
  name: "Green Grocer Co.",
  description:
    "Green Grocer Co. is a leading provider of locally sourced organic produce, committed to sustainable farming practices since 2015. Our mission is to make healthy, eco-friendly food accessible to everyone while maintaining the highest standards of quality and sustainability.",
  category: "Food & Grocery",
  location: "Melbourne, VIC",
};

const DUMMY_REVIEWS: Review[] = [
  {
    id: "r1",
    email: "example@gmail.com",
    comment:
      "Absolutely love this place! The produce is always fresh and the staff is incredibly knowledgeable about sustainable farming. Highly recommend!",
  },
  {
    id: "r2",
    email: "example@gmail.com",
    comment:
      "Absolutely love this place! The produce is always fresh and the staff is incredibly knowledgeable about sustainable farming. Highly recommend!",
  },
  {
    id: "r3",
    email: "example@gmail.com",
    comment:
      "Absolutely love this place! The produce is always fresh and the staff is incredibly knowledgeable about sustainable farming. Highly recommend!",
  },
];

const BusinessDetail = () => {
  const { id } = useParams<{ id: string }>();

  const [business, setBusiness] = useState<Business | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);

        // const [bizRes, reviewRes] = await Promise.all([
        //   axios.get(`${API_URL}/${businessId}`),
        //   axios.get(`${REVIEW_URL}/${businessId}`),
        // ]);
        // setBusiness(bizRes.data);
        // setReviews(reviewRes.data || []);

        setBusiness(DUMMY_BUSINESS);
        setReviews(DUMMY_REVIEWS);
      } catch (err: any) {
        setError(err.message || "Failed to load business");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBusiness();
  }, [id]);

  const handleAddReview = async (comment: string) => {
    try {
      // const session = await fetchAuthSession();
      // const token = session.tokens?.idToken?.toString();
      // await axios.post(REVIEW_URL, {
      //   businessId,
      //   comment,
      // }, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // const reviewRes = await axios.get(`${REVIEW_URL}/${businessId}`);
      // setReviews(reviewRes.data || []);

      const newReview: Review = {
        id: `r-${Date.now()}`,
        email: "you@example.com",
        comment,
      };
      setReviews((prev) => [newReview, ...prev]);
    } catch (err: any) {
      alert(err.message || "Failed to submit review");
    }
  };
// state handaling
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 text-gray-400">
        <div className="w-9 h-9 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin" />
        <p className="text-sm">Loading...</p>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-400 text-sm">
        {error || "Business not found."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/*  using componented  */}
      <BusinessHeader name={business.name} description={business.description} />
      <hr className="border-gray-100 max-w-2xl mx-auto mb-8" />
      <ReviewList reviews={reviews} />
      <AddReview onSubmit={handleAddReview} />
    </div>
  );
};

export default BusinessDetail;