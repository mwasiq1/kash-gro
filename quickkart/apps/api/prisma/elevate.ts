import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const targetEmail = "mwasiq12345@gmail.com";
  
  const user = await prisma.user.findUnique({
    where: { email: targetEmail }
  });

  if (!user) {
    console.log(`User with email ${targetEmail} not found. Make sure you have signed in on the storefront at least once.`);
    return;
  }

  const updatedUser = await prisma.user.update({
    where: { email: targetEmail },
    data: { role: 'ADMIN' }
  });

  console.log(`SUCCESS: Role for ${updatedUser.email} has been updated to ${updatedUser.role}.`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
