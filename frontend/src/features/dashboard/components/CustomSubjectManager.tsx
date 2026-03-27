import React, { useState } from 'react';
import { BookMarked, Plus, Trash2, Target } from 'lucide-react';
import { useTimetableStore } from '@/store/timetable';
import type { CustomStudySubject } from '@/types';

export const CustomSubjectManager: React.FC = () => {
  const { customSubjects, addCustomSubject, deleteCustomSubject, updateCustomSubject, isPremiumUser } = useTimetableStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
    targetHours: 5,
  });

  const handleAddSubject = () => {
    if (!formData.name) {
      alert('Please enter subject name');
      return;
    }

    const newSubject: CustomStudySubject = {
      id: `subject-${Date.now()}`,
      userId: 'user-1',
      name: formData.name,
      category: formData.category || undefined,
      priority: formData.priority,
      targetHours: formData.targetHours,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addCustomSubject(newSubject);
    setFormData({
      name: '',
      category: '',
      priority: 'MEDIUM',
      targetHours: 5,
    });
    setShowForm(false);
  };

  const handleUpdatePriority = (subjectId: string, priority: 'LOW' | 'MEDIUM' | 'HIGH') => {
    updateCustomSubject(subjectId, { priority });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <BookMarked size={22} className="text-orange-500" />
          Custom Study Subjects
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded font-medium hover:bg-orange-600 transition"
        >
          <Plus size={18} /> Add Subject
        </button>
      </div>

      {/* Add Subject Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <h4 className="font-semibold text-gray-800 mb-4">Add Custom Study Subject</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., DSA Coding, Design Patterns, FIR"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                placeholder="e.g., Programming, Theory, Practical"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Hours/Week
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.targetHours}
                  onChange={(e) => setFormData({ ...formData, targetHours: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddSubject}
              className="px-4 py-2 bg-orange-500 text-white rounded font-medium hover:bg-orange-600 transition"
            >
              Save Subject
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded font-medium hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Subjects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {customSubjects.length > 0 ? (
          customSubjects.map((subject) => (
            <div
              key={subject.id}
              className={`p-4 rounded-lg border-l-4 transition ${
                subject.priority === 'HIGH'
                  ? 'border-l-red-500 bg-red-50 border border-red-200'
                  : subject.priority === 'MEDIUM'
                    ? 'border-l-yellow-500 bg-yellow-50 border border-yellow-200'
                    : 'border-l-green-500 bg-green-50 border border-green-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{subject.name}</h4>
                  {subject.category && (
                    <p className="text-sm text-gray-600 mt-1">📂 {subject.category}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                        subject.priority === 'HIGH'
                          ? 'bg-red-100 text-red-700'
                          : subject.priority === 'MEDIUM'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {subject.priority}
                    </span>
                    {subject.targetHours && (
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <Target size={14} /> {subject.targetHours} hrs/week
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteCustomSubject(subject.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-red-600 transition"
                  title="Delete subject"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Priority Buttons */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                {(['LOW', 'MEDIUM', 'HIGH'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => handleUpdatePriority(subject.id, p)}
                    className={`text-xs px-2 py-1 rounded font-medium transition ${
                      subject.priority === p
                        ? p === 'HIGH'
                          ? 'bg-red-500 text-white'
                          : p === 'MEDIUM'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-8 text-gray-500">
            <p>No custom subjects yet. Add one to get started!</p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-green-50 rounded border border-green-200">
        <p className="text-sm text-green-800">
          <span className="font-semibold">💡 Example subjects:</span> DSA Coding, Design Patterns, Competitive Programming, System Design, Frontend Development, etc.
        </p>
      </div>

      {/* Premium Info */}
      {!isPremiumUser && (
        <div className="mt-4 p-4 bg-purple-50 rounded border border-purple-200">
          <p className="text-sm text-purple-800">
            <span className="font-semibold">✨ Upgrade to Premium (₹50):</span> Get AI-optimized timetables that automatically include your custom subjects in the study schedule.
          </p>
        </div>
      )}
    </div>
  );
};
