import React, { useState } from 'react';
import { Clock, Edit2, Trash2, Plus, Zap } from 'lucide-react';
import { useTimetableStore } from '@/store/timetable';
import type { WeeklySchedule, TimeSlot, DayOfWeek } from '@/types';

interface WeeklyScheduleViewProps {
  schedule: WeeklySchedule;
  onUpdate?: (schedule: WeeklySchedule) => void;
  isPremium?: boolean;
}

const DAYS: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const TimeSlotCard: React.FC<{
  slot: TimeSlot;
  day: DayOfWeek;
  index: number;
}> = ({ slot, day, index }) => {
  const bgColor = {
    LECTURE: 'bg-blue-50 border-l-4 border-blue-500',
    STUDY: 'bg-orange-50 border-l-4 border-orange-500',
    BREAK: 'bg-gray-50 border-l-4 border-gray-400',
    FREE: 'bg-white border-l-4 border-gray-200',
  }[slot.status];

  const textColor = {
    LECTURE: 'text-blue-700',
    STUDY: 'text-orange-700',
    BREAK: 'text-gray-600',
    FREE: 'text-gray-500',
  }[slot.status];

  return (
    <div className={`p-3 mb-2 rounded border ${bgColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">
            {slot.startTime} - {slot.endTime}
          </p>
          {slot.subject && (
            <p className={`text-sm font-semibold ${textColor}`}>{slot.subject}</p>
          )}
          {slot.topic && (
            <p className="text-xs text-gray-600">{slot.topic}</p>
          )}
          {slot.priority && (
            <span
              className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded ${
                slot.priority === 'HIGH'
                  ? 'bg-red-100 text-red-700'
                  : slot.priority === 'MEDIUM'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
              }`}
            >
              {slot.priority}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export const WeeklyScheduleView: React.FC<WeeklyScheduleViewProps> = ({
  schedule,
  isPremium = false,
}) => {
  const [expandedDay, setExpandedDay] = useState<DayOfWeek | null>('MONDAY');

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Clock size={22} className="text-orange-500" />
          Weekly Study Schedule
          {isPremium && schedule.isPremium && (
            <span className="ml-2 inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
              <Zap size={12} /> AI Generated
            </span>
          )}
        </h3>
        <span className="text-sm text-gray-600">
          Week {schedule.week}, {schedule.year}
        </span>
      </div>

      {/* Day Selector */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {DAYS.map((day) => (
          <button
            key={day}
            onClick={() => setExpandedDay(expandedDay === day ? null : day)}
            className={`py-2 px-1 text-xs font-semibold rounded transition ${
              expandedDay === day
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* Time Slots for Selected Day */}
      {expandedDay && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-4">{expandedDay}</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {schedule.days[expandedDay].length > 0 ? (
              schedule.days[expandedDay].map((slot, index) => (
                <TimeSlotCard key={`${expandedDay}-${index}`} slot={slot} day={expandedDay} index={index} />
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">No schedule for this day</p>
            )}
          </div>
        </div>
      )}

      {/* Study Hours Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded text-center">
            <p className="text-sm text-gray-600">Lecture Hours</p>
            <p className="text-2xl font-bold text-blue-600">
              {DAYS.reduce((sum, day) => {
                const lectureSlots = schedule.days[day].filter((s) => s.status === 'LECTURE');
                return sum + lectureSlots.length;
              }, 0)}
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded text-center">
            <p className="text-sm text-gray-600">Study Hours</p>
            <p className="text-2xl font-bold text-orange-600">
              {DAYS.reduce((sum, day) => {
                const studySlots = schedule.days[day].filter((s) => s.status === 'STUDY');
                return sum + studySlots.length;
              }, 0)}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded text-center">
            <p className="text-sm text-gray-600">Break Hours</p>
            <p className="text-2xl font-bold text-gray-600">
              {DAYS.reduce((sum, day) => {
                const breakSlots = schedule.days[day].filter((s) => s.status === 'BREAK');
                return sum + breakSlots.length;
              }, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
