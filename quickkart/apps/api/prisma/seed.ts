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
    { name: 'Amul Taaza Toned Milk', description: 'Fresh toned milk', mrp: 34, sellingPrice: 34, unit: '500ml', imageUrl: 'https://via.placeholder.com/150', categoryId: categories[0].id },
    { name: 'Britannia Daily Fresh White Bread', description: 'Soft white bread', mrp: 40, sellingPrice: 38, unit: '400g', imageUrl: 'https://via.placeholder.com/150', categoryId: categories[0].id },
    { name: 'Amul Butter', description: 'Pasteurised Butter', mrp: 58, sellingPrice: 56, unit: '100g', imageUrl: 'https://via.placeholder.com/150', categoryId: categories[0].id },
    { name: 'Nandini GoodLife Milk', description: 'UHT Milk', mrp: 60, sellingPrice: 58, unit: '1L', imageUrl: 'https://via.placeholder.com/150', categoryId: categories[0].id },
    { name: 'Kellogg\'s Corn Flakes', description: 'Breakfast cereal', mrp: 180, sellingPrice: 170, unit: '475g', imageUrl: 'https://via.placeholder.com/150', categoryId: categories[0].id },
    { name: 'Gowardhan Paneer', description: 'Fresh paneer', mrp: 95, sellingPrice: 90, unit: '200g', imageUrl: 'https://via.placeholder.com/150', categoryId: categories[0].id },
    
    // Fruits & Vegetables
    { name: 'Onion (Pyaz)', description: 'Fresh red onions', mrp: 40, sellingPrice: 32, unit: '1kg', imageUrl: 'https://via.placeholder.com/150', categoryId: categories[1].id },
    { name: 'Potato (Aloo)', description: 'Fresh potatoes', mrp: 30, sellingPrice: 25, unit: '1kg', imageUrl: 'https://via.placeholder.com/150', categoryId: categories[1].id },
    { name: 'Tomato (Tamatar)', description: 'Fresh red tomatoes', mrp: 50, sellingPrice: 42, unit: '1kg', imageUrl: 'https://via.placeholder.com/150', categoryId: categories[1].id },
    { name: 'Green Chilli', description: 'Fresh green chillies', mrp: 15, sellingPrice: 12, unit: '100g', imageUrl: 'https://via.placeholder.com/150', categoryId: categories[1].id },
    { name: 'Coriander Leaves', description: 'Fresh coriander (Dhaniya)', mrp: 20, sellingPrice: 15, unit: '1 bunch', imageUrl: 'https://via.placeholder.com/150', categoryId: categories[1].id },
    { name: 'Banana Robusta', description: 'Fresh bananas', mrp: 60, sellingPrice: 54, unit: '1 dozen', imageUrl: 'https://via.placeholder.com/150', categoryId: categories[1].id },
    
    // Snacks & Munchies
    { name: 'Haldiram\'s Bhujia Sev', description: 'Spicy tepary bean and gram flour noodles', mrp: 110, sellingPrice: 105, unit: '400g', imageUrl: 'https://via.placeholder.com/150', categoryId: categories[2].id },
    { name: 'Lays India\'s Magic Masala', description: 'Potato chips', mrp: 20, sellingPrice: 20, unit: '50g', imageUrl: 'https://via.placeholder.com/150', categoryId: categories[2].id },
    { name: 'Kurkure Masala Munch', description: 'Corn puff snacks', mrp: 20, sellingPrice: 20, unit: '90g', imageUrl: 'https://via.placeholder.com/150', categoryId: categories[2].id },
    { name: 'Britannia Good Day Cashew', description: 'Cookies', mrp: 30, sellingPrice: 28, unit: '120g', imageUrl: 'https://via.placeholder.com/150', categoryId: categories[2].id },
    { name: 'Bingo Mad Angles', description: 'Tomato Madness chips', mrp: 20, sellingPrice: 20, unit: '72g', imageUrl: 'https://via.placeholder.com/150', categoryId: categories[2].id },
    { name: 'Parle-G Gold', description: 'Glucose biscuits', mrp: 30, sellingPrice: 28, unit: '1kg', imageUrl: 'https://via.placeholder.com/150', categoryId: categories[2].id },
    
    // Cold Drinks & Juices
    { name: 'Thums Up', description: 'Carbonated water', mrp: 40, sellingPrice: 40, unit: '750ml', imageUrl: 'https://via.placeholder.com/150', categoryId: categories[3].id },
    { name: 'Coca-Cola', description: 'Original taste', mrp: 40, sellingPrice: 40, unit: '750ml', imageUrl: 'https://via.placeholder.com/150', categoryId: categories[3].id },
    { name: 'Sprite', description: 'Clear lime drink', mrp: 40, sellingPrice: 40, unit: '750ml', imageUrl: 'https://via.placeholder.com/150', categoryId: categories[3].id },
    { name: 'Tropicana 100% Orange Juice', description: 'Mixed fruit juice', mrp: 120, sellingPrice: 110, unit: '1L', imageUrl: 'https://via.placeholder.com/150', categoryId: categories[3].id },
    { name: 'Red Bull Energy Drink', description: 'Energy drink', mrp: 125, sellingPrice: 125, unit: '250ml', imageUrl: 'https://via.placeholder.com/150', categoryId: categories[3].id },
    { name: 'Kinley Mineral Water', description: 'Packaged drinking water', mrp: 20, sellingPrice: 20, unit: '1L', imageUrl: 'https://via.placeholder.com/150', categoryId: categories[3].id },
    
    // Instant Food
    { name: 'Maggi 2-Minute Noodles', description: 'Masala noodles', mrp: 14, sellingPrice: 14, unit: '70g', imageUrl: 'https://via.placeholder.com/150', categoryId: categories[4].id },
    { name: 'Yippee Magic Masala Noodles', description: 'Instant noodles', mrp: 15, sellingPrice: 15, unit: '70g', imageUrl: 'https://via.placeholder.com/150', categoryId: categories[4].id },
    { name: 'Knorr Classic Tomato Soup', description: 'Thick tomato soup', mrp: 55, sellingPrice: 52, unit: '53g', imageUrl: 'https://via.placeholder.com/150', categoryId: categories[4].id },
    { name: 'Bambino Roasted Vermicelli', description: 'Roasted sevaian', mrp: 60, sellingPrice: 58, unit: '500g', imageUrl: 'https://via.placeholder.com/150', categoryId: categories[4].id },
    { name: 'MTR Rava Idli Mix', description: 'Ready to cook mix', mrp: 115, sellingPrice: 110, unit: '500g', imageUrl: 'https://via.placeholder.com/150', categoryId: categories[4].id },
    { name: 'Tata Sampann Poha', description: 'Thick poha', mrp: 55, sellingPrice: 50, unit: '500g', imageUrl: 'https://via.placeholder.com/150', categoryId: categories[4].id },
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
    }
  }
  console.log(`Created ${createdProducts} new products`);

  // 4. Banners
  const bannersData = [
    { imageUrl: 'https://via.placeholder.com/800x200?text=Mega+Sale', linkUrl: '/sale', isActive: true },
    { imageUrl: 'https://via.placeholder.com/800x200?text=Fresh+Fruits+Daily', linkUrl: '/category/fruits', isActive: true },
  ];
  
  await prisma.banner.deleteMany({}); // refresh banners
  await prisma.banner.createMany({ data: bannersData });
  console.log('Created 2 banners');

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
