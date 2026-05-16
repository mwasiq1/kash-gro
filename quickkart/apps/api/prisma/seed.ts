import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kashgro.com' },
    update: {},
    create: {
      email: 'admin@kashgro.com',
      name: 'KashGro Admin',
      role: Role.ADMIN,
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // 2. Categories
  const categoriesData = [
    { name: 'Dairy & Breakfast' },
    { name: 'Fruits & Vegetables' },
    { name: 'Snacks & Munchies' },
    { name: 'Cold Drinks & Juices' },
    { name: 'Instant Food' },
    { name: 'Bakery & Biscuits' },
    { name: 'Personal Care' },
    { name: 'Household & Cleaning' },
  ];

  const categories = [];
  for (const c of categoriesData) {
    const category = await prisma.category.upsert({
      where: { name: c.name },
      update: {},
      create: c,
    });
    categories.push(category);
  }
  console.log(`Created ${categories.length} categories`);

  // 3. Products
  const productsData = [
    // Dairy & Breakfast
    { name: 'Amul Taaza Toned Milk', description: 'Fresh toned milk', mrp: 34, price: 34, unit: '500ml', images: ['https://via.placeholder.com/150'], categoryId: categories[0].id, stock: 15 },
    { name: 'Britannia Daily Fresh White Bread', description: 'Soft white bread', mrp: 40, price: 38, unit: '400g', images: ['https://via.placeholder.com/150'], categoryId: categories[0].id, stock: 5 },
    { name: 'Amul Butter', description: 'Pasteurised Butter', mrp: 58, price: 56, unit: '100g', images: ['https://via.placeholder.com/150'], categoryId: categories[0].id, stock: 0 },
    { name: 'Nandini GoodLife Milk', description: 'UHT Milk', mrp: 60, price: 58, unit: '1L', images: ['https://via.placeholder.com/150'], categoryId: categories[0].id, stock: 20 },
    { name: 'Kellogg\'s Corn Flakes', description: 'Breakfast cereal', mrp: 180, price: 170, unit: '475g', images: ['https://via.placeholder.com/150'], categoryId: categories[0].id, stock: 8 },
    { name: 'Gowardhan Paneer', description: 'Fresh paneer', mrp: 95, price: 90, unit: '200g', images: ['https://via.placeholder.com/150'], categoryId: categories[0].id, stock: 12 },
    
    // Fruits & Vegetables
    { name: 'Onion (Pyaz)', description: 'Fresh red onions', mrp: 40, price: 32, unit: '1kg', images: ['https://via.placeholder.com/150'], categoryId: categories[1].id, stock: 50 },
    { name: 'Potato (Aloo)', description: 'Fresh potatoes', mrp: 30, price: 25, unit: '1kg', images: ['https://via.placeholder.com/150'], categoryId: categories[1].id, stock: 40 },
    { name: 'Tomato (Tamatar)', description: 'Fresh red tomatoes', mrp: 50, price: 42, unit: '1kg', images: ['https://via.placeholder.com/150'], categoryId: categories[1].id, stock: 2 },
    { name: 'Green Chilli', description: 'Fresh green chillies', mrp: 15, price: 12, unit: '100g', images: ['https://via.placeholder.com/150'], categoryId: categories[1].id, stock: 10 },
    { name: 'Coriander Leaves', description: 'Fresh coriander (Dhaniya)', mrp: 20, price: 15, unit: '1 bunch', images: ['https://via.placeholder.com/150'], categoryId: categories[1].id, stock: 15 },
    { name: 'Banana Robusta', description: 'Fresh bananas', mrp: 60, price: 54, unit: '1 dozen', images: ['https://via.placeholder.com/150'], categoryId: categories[1].id, stock: 5 },
    
    // Snacks & Munchies
    { name: 'Haldiram\'s Bhujia Sev', description: 'Spicy tepary bean and gram flour noodles', mrp: 110, price: 105, unit: '400g', images: ['https://via.placeholder.com/150'], categoryId: categories[2].id },
    { name: 'Lays India\'s Magic Masala', description: 'Potato chips', mrp: 20, price: 20, unit: '50g', images: ['https://via.placeholder.com/150'], categoryId: categories[2].id },
    { name: 'Kurkure Masala Munch', description: 'Corn puff snacks', mrp: 20, price: 20, unit: '90g', images: ['https://via.placeholder.com/150'], categoryId: categories[2].id },
    { name: 'Britannia Good Day Cashew', description: 'Cookies', mrp: 30, price: 28, unit: '120g', images: ['https://via.placeholder.com/150'], categoryId: categories[2].id },
    { name: 'Bingo Mad Angles', description: 'Tomato Madness chips', mrp: 20, price: 20, unit: '72g', images: ['https://via.placeholder.com/150'], categoryId: categories[2].id },
    { name: 'Parle-G Gold', description: 'Glucose biscuits', mrp: 30, price: 28, unit: '1kg', images: ['https://via.placeholder.com/150'], categoryId: categories[2].id },
    
    // Cold Drinks & Juices
    { name: 'Thums Up', description: 'Carbonated water', mrp: 40, price: 40, unit: '750ml', images: ['https://via.placeholder.com/150'], categoryId: categories[3].id },
    { name: 'Coca-Cola', description: 'Original taste', mrp: 40, price: 40, unit: '750ml', images: ['https://via.placeholder.com/150'], categoryId: categories[3].id },
    { name: 'Sprite', description: 'Clear lime drink', mrp: 40, price: 40, unit: '750ml', images: ['https://via.placeholder.com/150'], categoryId: categories[3].id },
    { name: 'Tropicana 100% Orange Juice', description: 'Mixed fruit juice', mrp: 120, price: 110, unit: '1L', images: ['https://via.placeholder.com/150'], categoryId: categories[3].id },
    { name: 'Red Bull Energy Drink', description: 'Energy drink', mrp: 125, price: 125, unit: '250ml', images: ['https://via.placeholder.com/150'], categoryId: categories[3].id },
    { name: 'Kinley Mineral Water', description: 'Packaged drinking water', mrp: 20, price: 20, unit: '1L', images: ['https://via.placeholder.com/150'], categoryId: categories[3].id },
    
    // Instant Food
    { name: 'Maggi 2-Minute Noodles', description: 'Masala noodles', mrp: 14, price: 14, unit: '70g', images: ['https://via.placeholder.com/150'], categoryId: categories[4].id },
    { name: 'Yippee Magic Masala Noodles', description: 'Instant noodles', mrp: 15, price: 15, unit: '70g', images: ['https://via.placeholder.com/150'], categoryId: categories[4].id },
    { name: 'Knorr Classic Tomato Soup', description: 'Thick tomato soup', mrp: 55, price: 52, unit: '53g', images: ['https://via.placeholder.com/150'], categoryId: categories[4].id },
    { name: 'Bambino Roasted Vermicelli', description: 'Roasted sevaian', mrp: 60, price: 58, unit: '500g', images: ['https://via.placeholder.com/150'], categoryId: categories[4].id },
    { name: 'MTR Rava Idli Mix', description: 'Ready to cook mix', mrp: 115, price: 110, unit: '500g', images: ['https://via.placeholder.com/150'], categoryId: categories[4].id },
    { name: 'Tata Sampann Poha', description: 'Thick poha', mrp: 55, price: 50, unit: '500g', images: ['https://via.placeholder.com/150'], categoryId: categories[4].id },
  ];

  let createdProducts = 0;
  for (const p of productsData) {
    // using random id for upsert condition as name might not be unique if not defined in schema.
    // wait, name is not unique in schema, so let's just create them. Actually, let's delete first to be idempotent.
    // or we can use `findFirst` to check if exists
    const exists = await prisma.product.findFirst({ where: { name: p.name } });
    if (!exists) {
      await prisma.product.create({ data: p });
      createdProducts++;
    } else {
      await prisma.product.update({
        where: { id: exists.id },
        data: { stock: p.stock },
      });
    }
  }
  console.log(`Created ${createdProducts} new products`);

  // 4. Banners
  const bannersData = [
    { imageUrl: 'https://via.placeholder.com/800x200?text=Mega+Sale', title: 'Mega Sale', linkUrl: '/sale', isActive: true },
    { imageUrl: 'https://via.placeholder.com/800x200?text=Fresh+Fruits+Daily', title: 'Fresh Fruits Daily', linkUrl: '/category/fruits', isActive: true },
  ];
  
  await prisma.banner.deleteMany({}); // refresh banners
  await prisma.banner.createMany({ data: bannersData });
  console.log('Created 2 banners');

  // 5. Promo Codes
  const promoData = [
    { code: 'WELCOME50', discountValue: 50, minOrderAmount: 200 },
    { code: 'SAVE100', discountValue: 100, minOrderAmount: 500 },
  ];

  for (const promo of promoData) {
    await prisma.promoCode.upsert({
      where: { code: promo.code },
      update: {},
      create: promo,
    });
  }
  console.log('Created 2 promo codes');

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
