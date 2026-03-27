import { useEffect, useMemo } from 'react';
import { useDashboardStore } from '@/store/dashboard';

export const useDashboardBoot = (): void => {
  const initialize = useDashboardStore((state) => state.initialize);

  useEffect(() => {
    void initialize();
  }, [initialize]);
};

export const useSmartInsight = (): string => {
  const overview = useDashboardStore((state) => state.overview);
  const subjects = useDashboardStore((state) => state.subjects);

  return useMemo(() => {
    const weakSubjects = subjects.filter((subject) => subject.weakScore >= 55);

    if (overview.status === 'BEHIND') {
      return 'You are behind schedule. Prioritize weak subjects and enable catch-up planning.';
    }

    if (weakSubjects.length) {
      return `You’re on track. Revise ${weakSubjects[0].name} today (low retention detected).`;
    }

    return 'Great momentum. Keep consistency to maintain your streak and productivity score.';
  }, [overview.status, subjects]);
};
