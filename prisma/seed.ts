// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('securepassword123', 10);

  const developerUser = await prisma.user.create({
    data: {
      id: 'uuid-developer-1',
      email: 'developer2@example.com',
      password: hashedPassword,
      tasks: {
        create: [
          {
            id: 'uuid-task-dev-1',
            title: 'Master TypeScript Architecture',
            description: 'Refactor the app into a clean three-layer pattern.',
            completed: true,
          },
        ],
      },
    },
  });

  console.log(`Successfully seeded database with user: ${developerUser.email}`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
