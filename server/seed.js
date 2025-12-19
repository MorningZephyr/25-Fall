// Populate the db with initial items
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant-db';

const menuItems = [
  {
    name: 'Classic Poke Bowl',
    description: 'Salmon, rice, greens, house sauce',
    price: 10.99,
    category: 'main',
    available: true
  },
  {
    name: 'Spicy Tuna Bowl',
    description: 'Tuna, spicy mayo, cucumber',
    price: 11.99,
    category: 'main',
    available: true
  },
  {
    name: 'Veggie Bowl',
    description: 'Tofu, avocado, mixed veggies',
    price: 9.99,
    category: 'main',
    available: true
  },
  {
    name: 'Chips & Salsa',
    description: 'Crispy chips with fresh salsa',
    price: 3.50,
    category: 'appetizer',
    available: true
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing menu items
    await MenuItem.deleteMany({});
    console.log('🧹 Cleared existing menu items');

    // Insert new menu items
    const insertedItems = await MenuItem.insertMany(menuItems);
    console.log(`✅ Successfully seeded ${insertedItems.length} menu items`);

    // Display the seeded items
    console.log('\n📋 Seeded Menu Items:');
    insertedItems.forEach(item => {
      console.log(`- ${item.name}: $${item.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

