import React, { useState } from "react";
import { X } from "lucide-react";
import type { ProfileBusiness } from "./business-listing";
import { Button } from "../shared/Button";

// interface definig
interface BusinessModalProps {
  onClose: () => void;
  onSubmit: (data: { name: string; category: string; description: string }) => Promise<void>;
  existing?: ProfileBusiness;
}

const BusinessModal: React.FC<BusinessModalProps> = ({ onClose, onSubmit, existing }) => {
  const isEdit = !!existing;
// states for business add 
  const [name, setName]               = useState(existing?.name || "");
  const [category, setCategory]       = useState(existing?.category || "");
  const [description, setDescription] = useState(existing?.description || "");
  const [loading, setLoading]         = useState(false);
// submit function
  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) return;
    try {
      setLoading(true);
      await onSubmit({ name, category, description });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>
{/* state handing based on add r edit  */}
        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
          {isEdit ? "Edit Business" : "Add Business"}
        </h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full mb-3 px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full mb-6 px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 resize-none"
        />

        <Button variant="info" className="w-full py-3 text-base" onClick={handleSubmit}>
          {loading ? "Please wait..." : "Enter"}
        </Button>
      </div>
    </div>
  );
};

export default BusinessModal;