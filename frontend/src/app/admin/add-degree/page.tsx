"use client";
import { useState } from "react";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AddDegreePage() {
  const [form, setForm] = useState({
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("http://localhost:3000/api/degrees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to create degree");
      }
      
      setSuccess("Degree created successfully!");
      setForm({ name: "" });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Error creating degree");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] p-6">
      <Link href="/admin" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8">
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>
      
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-8">
          <h1 className="text-2xl font-bold text-white">Add New Degree</h1>
          <p className="text-orange-100 text-sm mt-1">Create a new academic degree program</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Degree Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Bachelor of Technology"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Degree"}
          </button>
          
          {success && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
              <CheckCircle size={20} />
              <span className="text-sm font-medium">{success}</span>
            </div>
          )}
          
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              <AlertCircle size={20} />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
