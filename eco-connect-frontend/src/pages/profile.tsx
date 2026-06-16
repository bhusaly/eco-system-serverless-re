import { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import type { ProfileBusiness } from "../components/profile/business-listing";
import type { ProfileReview } from "../components/profile/reviews-listing";
import ProfileHeader from "../components/profile/profile-header";
import BusinessListing from "../components/profile/business-listing";
import ReviewListing from "../components/profile/reviews-listing";
import BusinessModal from "../components/profile/business-form-modal";
import EditReviewModal from "../components/profile/edit-review-modal";
import { BASE_URL } from "../aws-config";

type Tab = "business" | "reviews";

const Profile = () => {
  const [email, setEmail] = useState("");
  const [businesses, setBusinesses] = useState<ProfileBusiness[]>([]);
  const [reviews, setReviews] = useState<ProfileReview[]>([]);
  const [tab, setTab] = useState<Tab>("business");
  const [loading, setLoading] = useState(true);

  // modal state
  const [showAddBiz, setShowAddBiz] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<ProfileBusiness | null>(null);
  const [editingReview, setEditingReview] = useState<ProfileReview | null>(null);

  const nav = useNavigate();

  // fetches the logged in user's businesses and reviews on page load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        // get current user and their auth token from cognito
        const user = await getCurrentUser();
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();
        const headers = { Authorization: token };
        console.log(headers)
        const [bizRes, revRes] = await Promise.all([
          axios.get(`${BASE_URL}/business/users`, { headers }),
          axios.get(`${BASE_URL}/reviews/users`, { headers }),
        ]);

        setEmail(user.signInDetails?.loginId || "");
        setBusinesses(bizRes.data || []);
        setReviews(revRes.data || []);
      } catch {
        // if not logged in, redirect to login page
        nav("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // creates a new business and adds it to the top of the list
  const handleAddBusiness = async (data: { name: string; category: string; description: string }) => {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    const res = await axios.post(`${BASE_URL}/business`, data, {
      headers: { Authorization: token },
    });
    setBusinesses((prev) => [res.data, ...prev]);
  };

  // updates an existing business and reflects the change in the list
  const handleUpdateBusiness = async (data: { name: string; category: string; description: string }) => {
    if (!editingBusiness) return;
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    await axios.put(`${BASE_URL}/business/${editingBusiness.businessId}`, data, {
      headers: { Authorization: token },
    });
    setBusinesses((prev) =>
      prev.map((b) =>
        b.businessId === editingBusiness.businessId ? { ...b, ...data } : b
      )
    );
  };

  // deletes a business after user confirms
  const handleDeleteBusiness = async (businessId: string) => {
    if (!confirm("Delete this business?")) return;
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    await axios.delete(`${BASE_URL}/business/${businessId}`, {
      headers: { Authorization: token },
    });
    setBusinesses((prev) => prev.filter((b) => b.businessId !== businessId));
  };

  // updates a review comment and reflects the change in the list
  const handleEditReview = async (reviewId: string, comment: string) => {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    const review = reviews.find((r) => r.reviewId === reviewId);
    await axios.put(`${BASE_URL}/reviews/${review?.businesId}/${reviewId}`, {
      businessId: review?.businesId,
      comment,
    }, {
      headers: { Authorization: token },
    });
    setReviews((prev) =>
      prev.map((r) => (r.reviewId === reviewId ? { ...r, comment } : r))
    );
  };

  // deletes a review after user confirms
  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Delete this review?")) return;
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    const review = reviews.find((r) => r.reviewId === reviewId);
    await axios.delete(`${BASE_URL}/reviews/${review?.businesId}/${reviewId}`, {
      headers: { Authorization: token },
    });
    setReviews((prev) => prev.filter((r) => r.reviewId !== reviewId));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 text-gray-400">
        <div className="w-9 h-9 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
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

      {/* Tab switcher */}
      <div className="flex gap-6 px-8 mb-6">
        <button
          onClick={() => setTab("business")}
          className={`text-base font-semibold pb-1 border-b-2 transition-colors duration-150 ${tab === "business"
              ? "text-indigo-600 border-indigo-600"
              : "text-gray-700 border-transparent hover:text-indigo-500"
            }`}
        >
          Your Business
        </button>
        <button
          onClick={() => setTab("reviews")}
          className={`text-base font-semibold pb-1 border-b-2 transition-colors duration-150 ${tab === "reviews"
              ? "text-indigo-600 border-indigo-600"
              : "text-gray-700 border-transparent hover:text-indigo-500"
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

      {/* Add business modal */}
      {showAddBiz && (
        <BusinessModal
          onClose={() => setShowAddBiz(false)}
          onSubmit={handleAddBusiness}
        />
      )}

      {/* Edit business modal */}
      {editingBusiness && (
        <BusinessModal
          existing={editingBusiness}
          onClose={() => setEditingBusiness(null)}
          onSubmit={handleUpdateBusiness}
        />
      )}

      {/* Edit review modal */}
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