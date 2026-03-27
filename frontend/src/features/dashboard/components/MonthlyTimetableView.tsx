import React, { useState } from 'react';
import { Calendar, Plus, CheckCircle, Trash2, Zap } from 'lucide-react';
import { useTimetableStore } from '@/store/timetable';
import type { MonthlyTimetable, StudySession } from '@/types';

interface MonthlyTimetableViewProps {
  timetable: MonthlyTimetable;
  isPremium?: boolean;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const MonthlyTimetableView: React.FC<MonthlyTimetableViewProps> = ({
  timetable,
  isPremium = false,
}) => {
  const { markSessionCompleted, deleteStudySession } = useTimetableStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredSessions = timetable.studySessions.filter((session) => {
    if (filter === 'pending') return !session.completed;
    if (filter === 'completed') return session.completed;
    return true;
  });

  const completedCount = timetable.studySessions.filter((s) => s.completed).length;
  const completionPercentage = Math.round(
    (completedCount / timetable.studySessions.length) * 100
  ) || 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Calendar size={22} className="text-orange-500" />
          {MONTH_NAMES[timetable.month - 1]} {timetable.year}
          {timetable.aiGenerated && isPremium && (
            <span className="ml-2 inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
              <Zap size={12} /> AI Optimized
            </span>
          )}
        </h3>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 bg-gray-50 p-4 rounded">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-700">Progress</p>
          <p className="text-sm font-bold text-orange-600">
            {completedCount} / {timetable.studySessions.length} completed
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-orange-400 to-orange-600 h-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-2">{completionPercentage}% Complete</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {(['all', 'pending', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 font-medium text-sm transition ${
              filter === f
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Study Sessions List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <div
              key={session.id}
              className={`p-4 border rounded-lg transition ${
                session.completed
                  ? 'bg-green-50 border-green-200'
                  : 'bg-orange-50 border-orange-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => markSessionCompleted(timetable.id, session.id)}
                      className={`flex-shrink-0 transition ${
                        session.completed
                          ? 'text-green-600'
                          : 'text-gray-400 hover:text-orange-500'
                      }`}
                      title={session.completed ? 'Completed' : 'Mark as complete'}
                    >
                      <CheckCircle size={20} fill={session.completed ? 'currentColor' : 'none'} />
                    </button>
                    <div>
                      <h4 className="font-semibold text-gray-800">{session.subject}</h4>
                      <p className="text-sm text-gray-600">{session.topic}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {new Date(session.date).toLocaleDateString()} {session.startTime} -
                          {session.endTime}
                        </span>
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
                            session.priority === 'HIGH'
                              ? 'bg-red-100 text-red-700'
                              : session.priority === 'MEDIUM'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {session.priority}
                        </span>
                      </div>
                      {session.notes && (
                        <p className="text-sm text-gray-600 mt-2 italic">Note: {session.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteStudySession(timetable.id, session.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-red-600 transition"
                  title="Delete session"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">
            {filter === 'completed' ? 'No completed sessions yet' : 'No pending sessions'}
          </p>
        )}
      </div>

      {/* Exam Dates Section */}
      {timetable.examDates.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3">Upcoming Exams</h4>
          <div className="space-y-2">
            {timetable.examDates.map((exam) => (
              <div key={exam.examId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-sm text-gray-800">{exam.examName}</p>
                  <p className="text-xs text-gray-600">
                    {new Date(exam.date).toLocaleDateString()} ({exam.type})
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    exam.priority === 'HIGH'
                      ? 'bg-red-100 text-red-700'
                      : exam.priority === 'MEDIUM'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                  }`}
                >
                  {exam.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
