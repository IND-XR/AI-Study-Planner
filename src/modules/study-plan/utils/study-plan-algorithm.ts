/**
 * AI Study Plan Generation Algorithm
 * 
 * This algorithm generates an optimized study plan based on:
 * 1. Available study hours
 * 2. Exam dates and weightage
 * 3. Topic difficulty and priority
 * 4. Estimated study hours per topic
 * 
 * Algorithm Steps:
 * 1. Calculate days remaining until each exam
 * 2. Prioritize topics by difficulty and exam urgency
 * 3. Distribute available hours across topics
 * 4. Create daily/weekly schedule with smart distribution
 * 5. Load-balance to avoid overload days
 */

import { Prisma } from '@prisma/client';

interface ExamData {
  id: string;
  name: string;
  examinationDate: Date;
  weightage: number;
  type: string;
  topics: {
    id: string;
    name: string;
    estimatedHours: number;
    difficulty: string;
    priority: number;
  }[];
}

interface StudyPlanInput {
  startDate: Date;
  endDate: Date;
  totalDailyHours: number;
  totalWeeklyHours?: number;
  distributionStrategy?: number; // 0 = equal, 1 = priority-based, 2 = difficulty-based
}

interface PlanItem {
  examId: string;
  topicId: string;
  scheduledDate: Date;
  allocatedHours: number;
  priority: number;
}

/**
 * Main algorithm function
 */
export async function generateStudyPlan(
  userId: string,
  exams: ExamData[],
  input: StudyPlanInput,
  prisma: any,
): Promise<{ items: PlanItem[] }> {
  const { startDate, endDate, totalDailyHours } = input;
  const distributionStrategy = input.distributionStrategy || 1; // priority-based by default

  // Flatten all topics with exam metadata
  const allTopics = exams.flatMap(exam =>
    exam.topics.map(topic => ({
      ...topic,
      examId: exam.id,
      examName: exam.name,
      examinationDate: exam.examinationDate,
      examWeightage: exam.weightage,
      daysUntilExam: Math.max(
        0,
        Math.ceil((exam.examinationDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      ),
    }))
  );

  // Sort topics by priority (urgent exams first, then by difficulty and priority)
  const sortedTopics = allTopics.sort((a, b) => {
    // Prioritize by days until exam (fewer days = higher priority)
    if (a.daysUntilExam !== b.daysUntilExam) {
      return a.daysUntilExam - b.daysUntilExam;
    }

    // Then by exam weightage
    if (a.examWeightage !== b.examWeightage) {
      return b.examWeightage - a.examWeightage;
    }

    // Then by difficulty (weak topics get more priority)
    const difficultyScore = { WEAK: 3, MEDIUM: 2, STRONG: 1 };
    if (difficultyScore[a.difficulty] !== difficultyScore[b.difficulty]) {
      return (difficultyScore[b.difficulty] || 0) - (difficultyScore[a.difficulty] || 0);
    }

    // Finally by explicit priority
    return b.priority - a.priority;
  });

  // Calculate total available hours
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalAvailableHours = totalDays * totalDailyHours;

  // Calculate required hours with buffer
  const totalRequiredHours = allTopics.reduce((sum, t) => sum + t.estimatedHours, 0);
  const hoursPerTopic = totalAvailableHours > 0 
    ? Math.min(totalAvailableHours, totalRequiredHours)
    : totalRequiredHours;

  // Allocate hours to each topic
  const topicAllocations = allocateHours(sortedTopics, hoursPerTopic, distributionStrategy);

  // Generate daily schedule
  const scheduleItems = createDailySchedule(
    topicAllocations,
    startDate,
    endDate,
    totalDailyHours
  );

  // Optimize schedule to avoid overloads
  const optimizedSchedule = optimizeSchedule(scheduleItems, totalDailyHours);

  return { items: optimizedSchedule };
}

/**
 * Allocate study hours to topics based on strategy
 */
function allocateHours(
  topics: any[],
  totalHours: number,
  strategy: number
): Map<string, number> {
  const allocations = new Map<string, number>();

  if (strategy === 0) {
    // Equal distribution
    const hoursPerTopic = totalHours / topics.length;
    topics.forEach(topic => {
      allocations.set(topic.id, Math.min(hoursPerTopic, topic.estimatedHours));
    });
  } else if (strategy === 1) {
    // Priority-based (Pareto principle: 80/20)
    const importantTopics = Math.ceil(topics.length * 0.3); // Top 30% of topics
    const normalTopics = topics.length - importantTopics;

    const importantHours = totalHours * 0.8;
    const normalHours = totalHours * 0.2;

    topics.slice(0, importantTopics).forEach(topic => {
      allocations.set(topic.id, Math.min(importantHours / importantTopics, topic.estimatedHours));
    });

    topics.slice(importantTopics).forEach(topic => {
      allocations.set(topic.id, Math.min(normalHours / normalTopics, topic.estimatedHours));
    });
  } else if (strategy === 2) {
    // Difficulty-based
    const weakTopics = topics.filter(t => t.difficulty === 'WEAK');
    const mediumTopics = topics.filter(t => t.difficulty === 'MEDIUM');
    const strongTopics = topics.filter(t => t.difficulty === 'STRONG');

    const weakHours = totalHours * 0.5;
    const mediumHours = totalHours * 0.35;
    const strongHours = totalHours * 0.15;

    weakTopics.forEach(topic => {
      allocations.set(topic.id, Math.min(weakHours / (weakTopics.length || 1), topic.estimatedHours));
    });

    mediumTopics.forEach(topic => {
      allocations.set(topic.id, Math.min(mediumHours / (mediumTopics.length || 1), topic.estimatedHours));
    });

    strongTopics.forEach(topic => {
      allocations.set(topic.id, Math.min(strongHours / (strongTopics.length || 1), topic.estimatedHours));
    });
  }

  return allocations;
}

/**
 * Create daily schedule distribution
 */
function createDailySchedule(
  allocations: Map<string, number>,
  startDate: Date,
  endDate: Date,
  dailyHours: number
): PlanItem[] {
  const items: PlanItem[] = [];
  const currentDate = new Date(startDate);
  const topicsArray = Array.from(allocations.entries());

  let topicIndex = 0;

  while (currentDate <= endDate) {
    let remainingHours = dailyHours;
    let sessionIndex = 0;

    while (remainingHours > 0 && topicsArray.length > 0) {
      const [topicId, allocatedHours] = topicsArray[topicIndex % topicsArray.length];
      const existingAllocation = allocations.get(topicId) || 0;
      const sessionsPerTopic = Math.ceil(existingAllocation / dailyHours);
      const hoursPerSession = existingAllocation / Math.max(sessionsPerTopic, 1);

      const sessionHours = Math.min(hoursPerSession, remainingHours, 4); // Max 4 hours per session
      
      // Find topic topic in allocations who want this topicId
      const topicDetail = topicsArray.find(([id]) => id === topicId)?.[0];
      if (sessionHours > 0) {
        items.push({
          examId: '', // Will be set after finding the exam
          topicId,
          scheduledDate: new Date(currentDate),
          allocatedHours: sessionHours,
          priority: sessionIndex,
        });

        remainingHours -= sessionHours;
        sessionIndex++;
      }

      topicIndex++;
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return items;
}

/**
 * Optimize schedule to avoid overloads and improve efficiency
 */
function optimizeSchedule(items: PlanItem[], maxDailyHours: number): PlanItem[] {
  const dailyLoads = new Map<string, number>();

  // Calculate daily loads
  items.forEach(item => {
    const dateKey = item.scheduledDate.toISOString().split('T')[0];
    const currentLoad = dailyLoads.get(dateKey) || 0;
    dailyLoads.set(dateKey, currentLoad + item.allocatedHours);
  });

  // Redistribute overloaded days
  const optimized: PlanItem[] = [];

  items.forEach(item => {
    const dateKey = item.scheduledDate.toISOString().split('T')[0];
    const dayLoad = dailyLoads.get(dateKey) || 0;

    if (dayLoad > maxDailyHours) {
      // Reduce hours for this item
      const scaleFactor = maxDailyHours / dayLoad;
      item.allocatedHours *= scaleFactor;
    }

    optimized.push(item);
  });

  return optimized;
}
