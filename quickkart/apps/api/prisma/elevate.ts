import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const targetEmail = "mwasiq12345@gmail.com";
  
  const user = await prisma.user.findUnique({
    where: { email: targetEmail }
  });

  if (!user) {
    console.log(`User ${targetEmail} not found. Please sign in on the storefront first to sync your account to the DB.`);
    return;
  }

  const updatedUser = await prisma.user.update({
    where: { email: targetEmail },
    data: { role: 'ADMIN' }
  });

  console.log(`SUCCESS: ${updatedUser.email} is now an ADMIN.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
