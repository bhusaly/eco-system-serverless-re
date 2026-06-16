import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search } from "lucide-react";
import BusinessCard from "./business-card";
import { BASE_URL } from "../../aws-config";

export interface Business {
  businessId: string;
  name: string;
  description: string;
  category?: string;
  [key: string]: any;
}

const BusinessListing: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filtered, setFiltered] = useState<Business[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const nav = useNavigate();

  // fetches all businesses from the API on page load
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/business`);
        setBusinesses(res.data || []);
        setFiltered(res.data || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  // filters businesses by name, description or category as user types
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(businesses);
      return;
    }
    const q = search.toLowerCase();
    const result = businesses.filter(
      (b) =>
        b.name?.toLowerCase().includes(q) ||
        b.description?.toLowerCase().includes(q) ||
        b.category?.toLowerCase().includes(q)
    );
    setFiltered(result);
  }, [search, businesses]);

  // navigates to the business detail page when a card is clicked
  const handleCardClick = (business: Business) => {
    nav(`/business/${business.businessId}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 pb-16">

      {/* Search bar */}
      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Businesses..."
            className="w-full pl-11 pr-5 py-3 border border-gray-200 rounded-full
                       shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500
                       text-sm text-gray-700 bg-white"
          />
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500 gap-3">
          <div className="w-9 h-9 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm">Loading businesses...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="text-center py-16 text-red-400 text-sm">{error}</div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400 text-sm">
          No matching businesses found.
        </div>
      )}

      {/* Business grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((biz) => (
            <BusinessCard
              key={biz.businessId}
              business={biz}
              onClick={handleCardClick}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default BusinessListing;