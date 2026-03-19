import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth/password';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@exam.com' },
    update: {
      username: 'admin',
      passwordHash: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
    create: {
      username: 'admin',
      email: 'admin@exam.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log('Created admin:', admin.email);

  // Create student users
  const studentPassword = await hashPassword('student123');

  const student1 = await prisma.user.upsert({
    where: { email: 'student@exam.com' },
    update: {
      username: 'student1',
      passwordHash: studentPassword,
      role: 'STUDENT',
      studentNo: 'STU001',
      className: 'CS-2024',
      status: 'ACTIVE',
    },
    create: {
      username: 'student1',
      email: 'student@exam.com',
      passwordHash: studentPassword,
      role: 'STUDENT',
      studentNo: 'STU001',
      className: 'CS-2024',
      status: 'ACTIVE',
    },
  });
  console.log('Created student:', student1.email);

  const student2 = await prisma.user.upsert({
    where: { email: 'student2@exam.com' },
    update: {
      username: 'student2',
      passwordHash: studentPassword,
      role: 'STUDENT',
      studentNo: 'STU002',
      className: 'CS-2024',
      status: 'ACTIVE',
    },
    create: {
      username: 'student2',
      email: 'student2@exam.com',
      passwordHash: studentPassword,
      role: 'STUDENT',
      studentNo: 'STU002',
      className: 'CS-2024',
      status: 'ACTIVE',
    },
  });
  console.log('Created student:', student2.email);

  // Create sample subjects
  const csSubject = await prisma.subject.upsert({
    where: { code: 'CS101' },
    update: {
      name: 'Introduction to Computer Science',
      description: 'Fundamentals of computer science',
    },
    create: {
      name: 'Introduction to Computer Science',
      code: 'CS101',
      description: 'Fundamentals of computer science',
    },
  });
  console.log('Created subject:', csSubject.name);

  const mathSubject = await prisma.subject.upsert({
    where: { code: 'MATH101' },
    update: {
      name: 'Calculus I',
      description: 'Introduction to calculus',
    },
    create: {
      name: 'Calculus I',
      code: 'MATH101',
      description: 'Introduction to calculus',
    },
  });
  console.log('Created subject:', mathSubject.name);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
