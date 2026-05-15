import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany();
  console.log('Users:', JSON.stringify(users, null, 2));
  
  const lowStockProducts = await prisma.product.findMany({
    where: { stock: { lt: 10, gt: 0 } }
  });
  console.log('Low Stock Products:', JSON.stringify(lowStockProducts, null, 2));
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
