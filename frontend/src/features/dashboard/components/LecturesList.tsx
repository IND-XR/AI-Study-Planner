import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useTimetableStore } from '@/store/timetable';
import type { Lecture, DayOfWeek } from '@/types';

interface LecturesListProps {
  course: string;
  semester: number;
}

const DAYS_ORDER: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export const LecturesList: React.FC<LecturesListProps> = ({ course, semester }) => {
  const { lectures, getLecturesForDay, addLecture, deleteLecture } = useTimetableStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    instructorName: '',
    startTime: '09:00',
    endTime: '10:30',
    classroom: '',
    day: 'MONDAY' as DayOfWeek,
  });

  const courseLectures = lectures.filter((l) => l.course === course && l.semester === semester);
  const lecturesByDay = DAYS_ORDER.map((day) => ({
    day,
    lectures: courseLectures.filter((l) => l.day === day),
  }));

  const handleAddLecture = () => {
    if (!formData.subject || !formData.instructorName) {
      alert('Please fill in all fields');
      return;
    }

    const newLecture: Lecture = {
      id: `lecture-${Date.now()}`,
      ...formData,
      course,
      semester,
      isRecurring: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addLecture(newLecture);
    setFormData({
      subject: '',
      instructorName: '',
      startTime: '09:00',
      endTime: '10:30',
      classroom: '',
      day: 'MONDAY',
    });
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <BookOpen size={22} className="text-orange-500" />
          College Lectures ({course} - Semester {semester})
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded font-medium hover:bg-orange-600 transition"
        >
          <Plus size={18} /> Add Lecture
        </button>
      </div>

      {/* Add Lecture Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <h4 className="font-semibold text-gray-800 mb-4">Add New Lecture</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Subject Name"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
            />
            <input
              type="text"
              placeholder="Instructor Name"
              value={formData.instructorName}
              onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
            />
            <select
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: e.target.value as DayOfWeek })}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
            >
              {DAYS_ORDER.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
            />
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
            />
            <input
              type="text"
              placeholder="Classroom (optional)"
              value={formData.classroom}
              onChange={(e) => setFormData({ ...formData, classroom: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddLecture}
              className="px-4 py-2 bg-orange-500 text-white rounded font-medium hover:bg-orange-600 transition"
            >
              Save Lecture
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

      {/* Lectures by Day */}
      <div className="space-y-4">
        {lecturesByDay.map(({ day, lectures: dayLectures }) => (
          <div key={day} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h4 className="font-semibold text-gray-800">{day}</h4>
            </div>
            <div className="p-4">
              {dayLectures.length > 0 ? (
                <div className="space-y-3">
                  {dayLectures.map((lecture) => (
                    <div
                      key={lecture.id}
                      className="flex items-start justify-between p-3 bg-blue-50 rounded border border-blue-200"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{lecture.subject}</p>
                        <p className="text-sm text-gray-600">
                          {lecture.instructorName} • {lecture.startTime} - {lecture.endTime}
                        </p>
                        {lecture.classroom && (
                          <p className="text-sm text-gray-500">📍 {lecture.classroom}</p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteLecture(lecture.id)}
                        className="flex-shrink-0 text-gray-400 hover:text-red-600 transition"
                        title="Delete lecture"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No lectures scheduled</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200 flex gap-3">
        <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold">💡 Tip:</p>
          <p>Add your college lecture timings here. These will automatically appear on your weekly timetable during 9 AM - 5 PM (lecture hours).</p>
        </div>
      </div>
    </div>
  );
};
