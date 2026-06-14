import { useEffect, useState } from "react";
// import axios from "axios";
// import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import type { ProfileBusiness } from "../components/profile/business-listing";
import type { ProfileReview } from "../components/profile/reviews-listing";
import ProfileHeader from "../components/profile/profile-header";
import BusinessListing from "../components/profile/business-listing";
import ReviewListing from "../components/profile/reviews-listing";
import BusinessModal from "../components/profile/business-form-modal";
import EditReviewModal from "../components/profile/edit-review-modal";


// const BIZ_API   = "https://85z743ntte.execute-api.us-east-1.amazonaws.com/business";
// const REV_API   = "https://85z743ntte.execute-api.us-east-1.amazonaws.com/review";

const DUMMY_EMAIL = "example@gmail.com";

const DUMMY_BUSINESSES: ProfileBusiness[] = [
  { businessId: "biz-001", name: "Green Grocer Co.", description: "Locally sourced organic produce delivered fresh to your door. Supporting sustainable farming.", category: "Food" },
  { businessId: "biz-002", name: "SolarNest",        description: "Locally sourced organic produce delivered fresh to your door. Supporting sustainable farming.", category: "Energy" },
  { businessId: "biz-003", name: "EcoThreads",       description: "Locally sourced organic produce delivered fresh to your door. Supporting sustainable farming.", category: "Fashion" },
  { businessId: "biz-004", name: "ReRoot Nursery",   description: "Locally sourced organic produce delivered fresh to your door. Supporting sustainable farming.", category: "Garden" },
  { businessId: "biz-005", name: "CleanRide EV",     description: "Locally sourced organic produce delivered fresh to your door. Supporting sustainable farming.", category: "Transport" },
  { businessId: "biz-006", name: "Wholesome Bulk",   description: "Locally sourced organic produce delivered fresh to your door. Supporting sustainable farming.", category: "Food" },
];

const DUMMY_REVIEWS: ProfileReview[] = [
  { reviewId: "rev-001", businessName: "Sarah Johnson", comment: "Absolutely love this place! The produce is always fresh and the staff is incredibly knowledgeable about sustainable farming. Highly recommend!" },
  { reviewId: "rev-002", businessName: "Green Grocer Co.", comment: "Great service and amazing organic produce. Will definitely come back!" },
];

type Tab = "business" | "reviews";

const Profile = () => {
  const [email, setEmail]             = useState("");
  const [businesses, setBusinesses]   = useState<ProfileBusiness[]>([]);
  const [reviews, setReviews]         = useState<ProfileReview[]>([]);
  const [tab, setTab]                 = useState<Tab>("business");
  const [loading, setLoading]         = useState(true);

  // Modal state
  const [showAddBiz, setShowAddBiz]           = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<ProfileBusiness | null>(null);
  const [editingReview, setEditingReview]     = useState<ProfileReview | null>(null);

  const nav = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        // const user = await getCurrentUser();
        // const session = await fetchAuthSession();
        // const token = session.tokens?.idToken?.toString();
        // const headers = { Authorization: `Bearer ${token}` };
        // const [bizRes, revRes] = await Promise.all([
        //   axios.get(`${BIZ_API}/user/${user.userId}`, { headers }),
        //   axios.get(`${REV_API}/user/${user.userId}`, { headers }),
        // ]);
        // setEmail(user.signInDetails?.loginId || "");
        // setBusinesses(bizRes.data || []);
        // setReviews(revRes.data || []);

        setEmail(DUMMY_EMAIL);
        setBusinesses(DUMMY_BUSINESSES);
        setReviews(DUMMY_REVIEWS);
      } catch {
        nav("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleAddBusiness = async (data: { name: string; category: string; description: string }) => {
    // const session = await fetchAuthSession();
    // const token = session.tokens?.idToken?.toString();
    // const res = await axios.post(BIZ_API, data, {
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    // setBusinesses((prev) => [res.data, ...prev]);

    const newBiz: ProfileBusiness = {
      businessId: `biz-${Date.now()}`,
      ...data,
    };
    setBusinesses((prev) => [newBiz, ...prev]);
  };

  const handleUpdateBusiness = async (data: { name: string; category: string; description: string }) => {
    if (!editingBusiness) return;

    // const session = await fetchAuthSession();
    // const token = session.tokens?.idToken?.toString();
    // await axios.put(`${BIZ_API}/${editingBusiness.businessId}`, data, {
    //   headers: { Authorization: `Bearer ${token}` },
    // });

    setBusinesses((prev) =>
      prev.map((b) =>
        b.businessId === editingBusiness.businessId ? { ...b, ...data } : b
      )
    );
  };

  const handleDeleteBusiness = async (businessId: string) => {
    if (!confirm("Delete this business?")) return;

    // const session = await fetchAuthSession();
    // const token = session.tokens?.idToken?.toString();
    // await axios.delete(`${BIZ_API}/${businessId}`, {
    //   headers: { Authorization: `Bearer ${token}` },
    // });

    setBusinesses((prev) => prev.filter((b) => b.businessId !== businessId));
  };

  const handleEditReview = async (reviewId: string, comment: string) => {
    // const session = await fetchAuthSession();
    // const token = session.tokens?.idToken?.toString();
    // await axios.put(`${REV_API}/${reviewId}`, { comment }, {
    //   headers: { Authorization: `Bearer ${token}` },
    // });

    setReviews((prev) =>
      prev.map((r) => (r.reviewId === reviewId ? { ...r, comment } : r))
    );
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Delete this review?")) return;

    // const session = await fetchAuthSession();
    // const token = session.tokens?.idToken?.toString();
    // await axios.delete(`${REV_API}/${reviewId}`, {
    //   headers: { Authorization: `Bearer ${token}` },
    // });

    setReviews((prev) => prev.filter((r) => r.reviewId !== reviewId));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 text-gray-400">
        <div className="w-9 h-9 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin" />
        <p className="text-sm">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-16">

      <ProfileHeader
        email={email}
        businessCount={businesses.length}
        reviewCount={reviews.length}
        onAddBusiness={() => setShowAddBiz(true)}
      />

      <div className="border-t border-gray-100 my-4" />

      <div className="flex gap-6 px-8 mb-6">
        <button
          onClick={() => setTab("business")}
          className={`text-base font-semibold pb-1 border-b-2 transition-colors duration-150 ${
            tab === "business"
              ? "text-green-600 border-green-600"
              : "text-gray-700 border-transparent hover:text-green-500"
          }`}
        >
          Your Business
        </button>
        <button
          onClick={() => setTab("reviews")}
          className={`text-base font-semibold pb-1 border-b-2 transition-colors duration-150 ${
            tab === "reviews"
              ? "text-green-600 border-green-600"
              : "text-gray-700 border-transparent hover:text-green-500"
          }`}
        >
          Your Reviews
        </button>
      </div>

      {tab === "business" && (
        <BusinessListing
          businesses={businesses}
          onEdit={(biz) => setEditingBusiness(biz)}
          onDelete={handleDeleteBusiness}
        />
      )}

      {tab === "reviews" && (
        <ReviewListing
          reviews={reviews}
          onEdit={(review) => setEditingReview(review)}
          onDelete={handleDeleteReview}
        />
      )}

      {showAddBiz && (
        <BusinessModal
          onClose={() => setShowAddBiz(false)}
          onSubmit={handleAddBusiness}
        />
      )}

      {editingBusiness && (
        <BusinessModal
          existing={editingBusiness}
          onClose={() => setEditingBusiness(null)}
          onSubmit={handleUpdateBusiness}
        />
      )}

      {editingReview && (
        <EditReviewModal
          review={editingReview}
          onClose={() => setEditingReview(null)}
          onSubmit={handleEditReview}
        />
      )}

    </div>
  );
};

export default Profile;