import { useEffect, useMemo, useState } from 'react';
import { StudySession } from '@/types/dashboard';

interface PlannerBoardProps {
  sessions: StudySession[];
  onReschedule: (sessionId: string, start: string, end: string) => void;
}

const slots = Array.from({ length: 24 }, (_, index) => `${String(index).padStart(2, '0')}:00`);
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const minuteTopClasses = [
  'top-[0%]',
  'top-[1.666667%]',
  'top-[3.333333%]',
  'top-[5%]',
  'top-[6.666667%]',
  'top-[8.333333%]',
  'top-[10%]',
  'top-[11.666667%]',
  'top-[13.333333%]',
  'top-[15%]',
  'top-[16.666667%]',
  'top-[18.333333%]',
  'top-[20%]',
  'top-[21.666667%]',
  'top-[23.333333%]',
  'top-[25%]',
  'top-[26.666667%]',
  'top-[28.333333%]',
  'top-[30%]',
  'top-[31.666667%]',
  'top-[33.333333%]',
  'top-[35%]',
  'top-[36.666667%]',
  'top-[38.333333%]',
  'top-[40%]',
  'top-[41.666667%]',
  'top-[43.333333%]',
  'top-[45%]',
  'top-[46.666667%]',
  'top-[48.333333%]',
  'top-[50%]',
  'top-[51.666667%]',
  'top-[53.333333%]',
  'top-[55%]',
  'top-[56.666667%]',
  'top-[58.333333%]',
  'top-[60%]',
  'top-[61.666667%]',
  'top-[63.333333%]',
  'top-[65%]',
  'top-[66.666667%]',
  'top-[68.333333%]',
  'top-[70%]',
  'top-[71.666667%]',
  'top-[73.333333%]',
  'top-[75%]',
  'top-[76.666667%]',
  'top-[78.333333%]',
  'top-[80%]',
  'top-[81.666667%]',
  'top-[83.333333%]',
  'top-[85%]',
  'top-[86.666667%]',
  'top-[88.333333%]',
  'top-[90%]',
  'top-[91.666667%]',
  'top-[93.333333%]',
  'top-[95%]',
  'top-[96.666667%]',
  'top-[98.333333%]',
] as const;

const formatSlotLabel = (slot: string): string => {
  const [hour] = slot.split(':').map(Number);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const twelveHour = hour % 12 || 12;
  return `${twelveHour}:00 ${suffix}`;
};

export const PlannerBoard = ({ sessions, onReschedule }: PlannerBoardProps): JSX.Element => {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  const mapped = useMemo(() => {
    return sessions.map((session) => {
      const date = new Date(session.start);
      const day = days[(date.getDay() + 6) % 7];
      const hour = `${String(date.getHours()).padStart(2, '0')}:00`;
      return { ...session, day, hour };
    });
  }, [sessions]);

  const dayWiseSessions = useMemo(() => {
    return days.map((day) => ({
      day,
      sessions: mapped
        .filter((item) => item.day === day)
        .sort((first, second) => new Date(first.start).getTime() - new Date(second.start).getTime()),
    }));
  }, [mapped]);

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

  const currentDayIndex = (now.getDay() + 6) % 7;
  const currentHourSlot = `${String(now.getHours()).padStart(2, '0')}:00`;
  const currentMinuteTopClass = minuteTopClasses[now.getMinutes()];
  const currentDayName = days[currentDayIndex];
  const currentTimeLabel = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="space-y-4">
      <div className="md:hidden space-y-3">
        {dayWiseSessions.map(({ day, sessions: daySessions }) => (
          <article
            key={day}
            className={`rounded-xl border p-3 ${
              day === currentDayName
                ? 'border-red-500/60 bg-red-500/10'
                : 'border-slate-700 bg-neutral-800/70'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-semibold text-slate-100">{day}</h4>
              {day === currentDayName ? (
                <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-300">
                  Now {currentTimeLabel}
                </span>
              ) : null}
            </div>
            <div className="mt-2 space-y-2">
              {daySessions.length > 0 ? (
                daySessions.map((session) => {
                  const startDate = new Date(session.start);
                  const endDate = new Date(session.end);
                  return (
                    <div key={session.id} className="rounded-lg border border-orange-800/50 bg-orange-500/10 p-2">
                      <p className="text-sm font-semibold text-orange-200">{session.title}</p>
                      <p className="text-xs text-slate-300">{session.subjectName}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {formatSlotLabel(`${String(startDate.getHours()).padStart(2, '0')}:00`)} -{' '}
                        {formatSlotLabel(`${String(endDate.getHours()).padStart(2, '0')}:00`)}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400">No sessions planned.</p>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-700 bg-neutral-900/70">
        <table className="min-w-[980px] w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="sticky left-0 z-20 w-[86px] border-b border-r border-slate-700 bg-neutral-900 px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Time
              </th>
              {days.map((day) => (
                <th
                  key={day}
                  className="border-b border-slate-700 bg-neutral-900 px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-300"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot}>
                <td className="sticky left-0 z-10 border-r border-slate-700 bg-neutral-900/95 px-3 py-3 text-[11px] font-semibold text-slate-400">
                  <div className="flex items-center justify-between gap-2">
                    <span>{formatSlotLabel(slot)}</span>
                    {slot === currentHourSlot ? (
                      <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-red-300">
                        {currentTimeLabel}
                      </span>
                    ) : null}
                  </div>
                </td>
                {days.map((day, dayIndex) => {
                  const block = mapped.find((item) => item.day === day && item.hour === slot);
                  const isCurrentSlot = slot === currentHourSlot;
                  const isCurrentDay = dayIndex === currentDayIndex;
                  return (
                    <td
                      key={`${day}-${slot}`}
                      className="relative h-[72px] min-w-[120px] border-b border-r border-slate-800 bg-neutral-900/40 p-2 align-top transition hover:bg-neutral-800/50"
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        const sessionId = event.dataTransfer.getData('text/plain');
                        if (sessionId) onDrop(day, slot, sessionId);
                      }}
                    >
                      {isCurrentSlot ? (
                        <>
                          <div
                            className={`pointer-events-none absolute left-0 right-0 z-20 border-t-2 border-red-500 ${currentMinuteTopClass}`}
                          />
                          {isCurrentDay ? (
                            <div
                              className={`pointer-events-none absolute -left-1.5 z-30 h-3 w-3 -translate-y-1/2 rounded-full bg-red-500 ${currentMinuteTopClass}`}
                            />
                          ) : null}
                        </>
                      ) : null}
                      {block ? (
                        <button
                          draggable
                          onDragStart={(event) => event.dataTransfer.setData('text/plain', block.id)}
                          className="w-full rounded-lg border border-orange-500/60 bg-gradient-to-r from-orange-500 to-orange-600 px-2 py-1.5 text-left text-[11px] text-white shadow-sm hover:brightness-105"
                        >
                          <p className="font-semibold leading-tight">{block.title}</p>
                          <p className="mt-0.5 opacity-90">{block.subjectName}</p>
                        </button>
                      ) : (
                        <div className="h-full w-full rounded-lg border border-dashed border-slate-700/70" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
