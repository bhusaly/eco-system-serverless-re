import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
import { Search } from "lucide-react";
import BusinessCard from "./business-car";

// const API_URL = "https://85z743ntte.execute-api.us-east-1.amazonaws.com/business";

interface Business {
  id: string;
  name: string;
  description: string;
  businessId: string;
  category?: string;
  location?: string;
  [key: string]: any;
}

// ─── Dummy data (remove when API is live) ────────────────────────────────────
const DUMMY_BUSINESSES: Business[] = [
  {
    id: "1",
    businessId: "biz-001",
    name: "Green Grocer Co.",
    description:
      "Locally sourced organic produce delivered fresh to your door. Supporting sustainable farming.",
    category: "Food & Grocery",
    location: "Melbourne, VIC",
  },
  {
    id: "2",
    businessId: "biz-002",
    name: "SolarNest",
    description:
      "Residential and commercial solar panel installation. Helping homes go 100% renewable.",
    category: "Energy",
    location: "Sydney, NSW",
  },
  {
    id: "3",
    businessId: "biz-003",
    name: "EcoThreads",
    description:
      "Sustainable fashion made from recycled materials. Ethical supply chains, zero fast fashion.",
    category: "Fashion",
    location: "Brisbane, QLD",
  },
  {
    id: "4",
    businessId: "biz-004",
    name: "ReRoot Nursery",
    description:
      "Native plant nursery promoting biodiversity. Expert advice on eco-friendly gardening.",
    category: "Garden",
    location: "Perth, WA",
  },
  {
    id: "5",
    businessId: "biz-005",
    name: "CleanRide EV",
    description:
      "Electric vehicle rentals and charging infrastructure. Zero-emission transport for the city.",
    category: "Transport",
    location: "Adelaide, SA",
  },
  {
    id: "6",
    businessId: "biz-006",
    name: "Wholesome Bulk",
    description:
      "Package-free bulk food store. Bring your own containers and reduce plastic waste every shop.",
    category: "Food & Grocery",
    location: "Hobart, TAS",
  },
];
// ─────────────────────────────────────────────────────────────────────────────

const BusinessListing: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filtered, setFiltered] = useState<Business[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const nav = useNavigate();

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);

        // ── LIVE API (uncomment when ready) ──────────────────────────────────
        // const res = await axios.get(API_URL);
        // setBusinesses(res.data || []);
        // setFiltered(res.data || []);
        // ─────────────────────────────────────────────────────────────────────

        // ── Dummy data (remove when API is live) ──────────────────────────────
        setBusinesses(DUMMY_BUSINESSES);
        setFiltered(DUMMY_BUSINESSES);
        // ─────────────────────────────────────────────────────────────────────
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  // Search filter
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

  const handleCardClick = (business: Business) => {
    // nav(`/business/${business.businessId}`);
    console.log("Navigate to:", business.businessId);
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
                       shadow-md focus:outline-none focus:ring-2 focus:ring-green-500
                       text-sm text-gray-700 bg-white"
          />
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500 gap-3">
          <div className="w-9 h-9 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin" />
          <p className="text-sm">Loading businesses...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="text-center py-16 text-red-400 text-sm">
          {error}
        </div>
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
              key={biz.businessId || biz.id}
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