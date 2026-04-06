"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AddStudentPage() {
  const [form, setForm] = useState({
    name: "",
    enrollmentNumber: "",
    password: "",
    degreeId: "",
    semester: "1",
    section: "",
  });
  const [degrees, setDegrees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Fetch degrees on component mount
  useEffect(() => {
    const fetchDegrees = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch("http://localhost:3000/api/degrees", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setDegrees(data.data || data || []);
        }
      } catch (err) {
        console.error("Failed to fetch degrees:", err);
      }
    };
    fetchDegrees();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("http://localhost:3000/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          enrollmentNumber: form.enrollmentNumber,
          password: form.password,
          degreeId: form.degreeId,
          semester: parseInt(form.semester),
          section: form.section,
        }),
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to create student");
      }
      
      setSuccess("Student created successfully!");
      setForm({ name: "", enrollmentNumber: "", password: "", degreeId: "", semester: "1", section: "" });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Error creating student");
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
          <h1 className="text-2xl font-bold text-white">Add New Student</h1>
          <p className="text-orange-100 text-sm mt-1">Enroll a new student in the system</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Enrollment Number</label>
            <input
              name="enrollmentNumber"
              value={form.enrollmentNumber}
              onChange={handleChange}
              placeholder="e.g. 2023001"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Secure password"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Degree Program</label>
            <select
              id="degree-program"
              title="Degree Program"
              name="degreeId"
              value={form.degreeId}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Select a degree</option>
              {degrees.map((degree: any) => (
                <option key={degree.id} value={degree.id}>
                  {degree.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Semester</label>
            <select
              id="semester"
              title="Semester"
              name="semester"
              value={form.semester}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Section</label>
            <input
              name="section"
              value={form.section}
              onChange={handleChange}
              placeholder="e.g. A"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !form.degreeId}
            className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Student"}
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
