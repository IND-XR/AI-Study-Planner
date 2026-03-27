import { useMemo } from 'react';
import { StudySession } from '@/types/dashboard';

interface PlannerBoardProps {
  sessions: StudySession[];
  onReschedule: (sessionId: string, start: string, end: string) => void;
}

const slots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const PlannerBoard = ({ sessions, onReschedule }: PlannerBoardProps): JSX.Element => {
  const mapped = useMemo(() => {
    return sessions.map((session) => {
      const date = new Date(session.start);
      const day = days[(date.getDay() + 6) % 7];
      const hour = `${String(date.getHours()).padStart(2, '0')}:00`;
      return { ...session, day, hour };
    });
  }, [sessions]);

  const onDrop = (day: string, slot: string, sessionId: string): void => {
    const now = new Date();
    const dayIndex = days.indexOf(day);
    const target = new Date(now);
    target.setDate(now.getDate() - ((now.getDay() + 6) % 7) + dayIndex);
    const [hours] = slot.split(':').map(Number);
    target.setHours(hours, 0, 0, 0);

    const end = new Date(target);
    end.setHours(target.getHours() + 1);

    onReschedule(sessionId, target.toISOString(), end.toISOString());
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-2">
        <thead>
          <tr>
            <th className="text-left text-xs text-slate-500">Time</th>
            {days.map((day) => (
              <th key={day} className="text-left text-xs text-slate-500">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slots.map((slot) => (
            <tr key={slot}>
              <td className="pr-3 text-xs text-slate-500">{slot}</td>
              {days.map((day) => {
                const block = mapped.find((item) => item.day === day && item.hour === slot);
                return (
                  <td
                    key={`${day}-${slot}`}
                    className="h-20 min-w-[130px] rounded-xl border border-slate-200 bg-slate-50 p-1 align-top dark:border-neutral-800 dark:bg-neutral-800/40"
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      const sessionId = event.dataTransfer.getData('text/plain');
                      if (sessionId) onDrop(day, slot, sessionId);
                    }}
                  >
                    {block ? (
                      <button
                        draggable
                        onDragStart={(event) => event.dataTransfer.setData('text/plain', block.id)}
                        className="w-full rounded-lg bg-primary-500 px-2 py-1 text-left text-xs text-white"
                      >
                        <p className="font-semibold">{block.title}</p>
                        <p className="opacity-90">{block.subjectName}</p>
                      </button>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
