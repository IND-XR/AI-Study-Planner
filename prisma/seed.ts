import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (in correct order to respect foreign keys)
  await prisma.progressRecord.deleteMany();
  await prisma.studyPlanItem.deleteMany();
  await prisma.studyPlan.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.user.deleteMany();


  // Hash password for the new user
  const hashedPassword = await bcrypt.hash('Test@1234', 10);

  // Create a single new user
  const newUser = await prisma.user.create({
    data: {
      id: 'user-001',
      enrollmentNumber: 'ENR2026001',
      name: 'Test User',
      role: 'STUDENT',
      password: hashedPassword,
      course: 'BTech IT',
      department: 'IT',
      semester: 4,
    },
  });

  console.log('✅ Created new user:', newUser.enrollmentNumber);

  // Create subjects for student1
  const mathSubject = await prisma.subject.create({
    data: {
      name: 'Mathematics',
      userId: student1.id,
      description: 'Advanced Mathematics course',
      semester: 6,
      priority: 9,
      color: '#3B82F6',
    },
  });

  const cseSubject = await prisma.subject.create({
    data: {
      name: 'Data Structures',
      userId: student1.id,
      description: 'Data Structures and Algorithms',
      semester: 6,
      priority: 8,
      color: '#EF4444',
    },
  });

  console.log('✅ Created subjects for student1');

  // Create exams for Mathematics
  const mathExam1 = await prisma.exam.create({
    data: {
      name: 'Midterm',
      type: 'Midterm',
      userId: student1.id,
      subjectId: mathSubject.id,
      description: 'Mathematics Midterm Exam',
      totalMarks: 100,
      targetScore: 85,
      examinationDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      weightage: 30,
    },
  });

  const mathExam2 = await prisma.exam.create({
    data: {
      name: 'Endterm',
      type: 'Endterm',
      userId: student1.id,
      subjectId: mathSubject.id,
      description: 'Mathematics Final Exam',
      totalMarks: 100,
      targetScore: 90,
      examinationDate: new Date(new Date().getTime() + 120 * 24 * 60 * 60 * 1000), // 120 days from now
      weightage: 70,
    },
  });

  // Create exams for Data Structures
  const dsExam = await prisma.exam.create({
    data: {
      name: 'Midterm',
      type: 'Midterm',
      userId: student1.id,
      subjectId: cseSubject.id,
      description: 'Data Structures Midterm Exam',
      totalMarks: 100,
      targetScore: 80,
      examinationDate: new Date(new Date().getTime() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      weightage: 50,
    },
  });

  console.log('✅ Created exams');

  // Create topics for Mathematics Midterm
  const algebra = await prisma.topic.create({
    data: {
      name: 'Algebra',
      userId: student1.id,
      subjectId: mathSubject.id,
      examId: mathExam1.id,
      description: 'Linear and Quadratic equations',
      difficulty: 'medium',
      estimatedHours: 10,
      priority: 8,
    },
  });

  const geometry = await prisma.topic.create({
    data: {
      name: 'Geometry',
      userId: student1.id,
      subjectId: mathSubject.id,
      examId: mathExam1.id,
      description: 'Coordinate and Analytic Geometry',
      difficulty: 'hard',
      estimatedHours: 15,
      priority: 7,
    },
  });

  const trigonometry = await prisma.topic.create({
    data: {
      name: 'Trigonometry',
      userId: student1.id,
      subjectId: mathSubject.id,
      examId: mathExam2.id,
      description: 'Trigonometric functions and identities',
      difficulty: 'medium',
      estimatedHours: 12,
      priority: 6,
    },
  });

  // Create topics for Data Structures
  const arrays = await prisma.topic.create({
    data: {
      name: 'Arrays',
      userId: student1.id,
      subjectId: cseSubject.id,
      examId: dsExam.id,
      description: 'Arrays and dynamic arrays',
      difficulty: 'easy',
      estimatedHours: 8,
      priority: 8,
    },
  });

  const linkedList = await prisma.topic.create({
    data: {
      name: 'Linked Lists',
      userId: student1.id,
      subjectId: cseSubject.id,
      examId: dsExam.id,
      description: 'Singly and Doubly Linked Lists',
      difficulty: 'medium',
      estimatedHours: 12,
      priority: 7,
    },
  });

  console.log('✅ Created topics');

  // Create study plan
  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

  const studyPlan = await prisma.studyPlan.create({
    data: {
      userId: student1.id,
      startDate,
      endDate,
      totalWeeklyHours: 20,
      totalDailyHours: 3,
      description: 'Study plan for Mathematics and Data Structures',
      isActive: true,
    },
  });

  console.log('✅ Created study plan');

  // Create study plan items
  await prisma.studyPlanItem.create({
    data: {
      studyPlanId: studyPlan.id,
      examId: mathExam1.id,
      topicId: algebra.id,
      scheduledDate: new Date(startDate.getTime() + 1 * 24 * 60 * 60 * 1000),
      allocatedHours: 2,
      priority: 8,
    },
  });

  await prisma.studyPlanItem.create({
    data: {
      studyPlanId: studyPlan.id,
      examId: mathExam1.id,
      topicId: geometry.id,
      scheduledDate: new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000),
      allocatedHours: 2.5,
      priority: 7,
    },
  });

  await prisma.studyPlanItem.create({
    data: {
      studyPlanId: studyPlan.id,
      examId: dsExam.id,
      topicId: arrays.id,
      scheduledDate: new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000),
      allocatedHours: 2,
      priority: 8,
    },
  });

  console.log('✅ Created study plan items');

  // Create progress records
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.progressRecord.create({
    data: {
      userId: student1.id,
      topicId: algebra.id,
      studyDate: today,
      hoursSpent: 2,
      confidenceLevel: 'Good',
      notes: 'Completed linear equations and graphing',
      rating: 4,
    },
  });

  await prisma.progressRecord.create({
    data: {
      userId: student1.id,
      topicId: geometry.id,
      studyDate: today,
      hoursSpent: 1.5,
      confidenceLevel: 'Average',
      notes: 'Practiced coordinate geometry problems',
      rating: 3.5,
    },
  });

  await prisma.progressRecord.create({
    data: {
      userId: student1.id,
      topicId: arrays.id,
      studyDate: today,
      hoursSpent: 2,
      confidenceLevel: 'Good',
      notes: 'Covered array operations and sorting',
      rating: 4,
    },
  });

  console.log('✅ Created progress records');

  console.log('✅ Database seed completed successfully! 🎉');
  console.log('\n📝 Test Account Credentials:');
  console.log('');
  console.log('🔐 ADMIN USER:');
  console.log('  Enrollment: admin001');
  console.log('  Password: Password123@');
  console.log('  Role: Admin');
  console.log('');
  console.log('📚 STUDENT USERS:');
  console.log('  Student 1:');
  console.log('    Enrollment: 12234567');
  console.log('    Password: Password123@');
  console.log('    Name: John Doe');
  console.log('');
  console.log('  Student 2:');
  console.log('    Enrollment: 12234568');
  console.log('    Password: Password123@');
  console.log('    Name: Jane Smith');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
