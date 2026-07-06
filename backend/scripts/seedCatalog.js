const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../src/models/Category.model');
const Product = require('../src/models/Product.model');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

const catalog = [
  {
    name: 'Fruits',
    description: 'Fresh and organic seasonal fruits',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&q=80',
    banner: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1200&q=80',
    products: [
      { name: 'Apple', price: 120, unit: '1 kg', images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?w=500&q=80'] },
      { name: 'Banana', price: 60, unit: '1 dozen', images: ['https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500&q=80'] },
      { name: 'Orange', price: 80, unit: '1 kg', images: ['https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=500&q=80'] },
      { name: 'Mango', price: 150, unit: '1 kg', images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&q=80'] },
      { name: 'Grapes', price: 90, unit: '500 g', images: ['https://images.unsplash.com/photo-1596365548674-63be84bc78ce?w=500&q=80'] },
      { name: 'Pomegranate', price: 180, unit: '1 kg', images: ['https://images.unsplash.com/photo-1615486171439-0158a1bbba69?w=500&q=80'] },
    ]
  },
  {
    name: 'Vegetables',
    description: 'Daily fresh vegetables sourced from farms',
    image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=500&q=80',
    banner: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=1200&q=80',
    products: [
      { name: 'Potato', price: 30, unit: '1 kg', images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80'] },
      { name: 'Onion', price: 40, unit: '1 kg', images: ['https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?w=500&q=80'] },
      { name: 'Tomato', price: 50, unit: '1 kg', images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&q=80'] },
      { name: 'Carrot', price: 60, unit: '1 kg', images: ['https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&q=80'] },
      { name: 'Cabbage', price: 40, unit: '1 pc', images: ['https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=500&q=80'] },
      { name: 'Capsicum', price: 70, unit: '500 g', images: ['https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&q=80'] },
    ]
  },
  {
    name: 'Dairy & Milk',
    description: 'Fresh dairy products and everyday milk',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500&q=80',
    banner: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=1200&q=80',
    products: [
      { name: 'Amul Gold Milk', price: 66, unit: '1 L', images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&q=80'] },
      { name: 'Mother Dairy Toned Milk', price: 54, unit: '1 L', images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80'] },
      { name: 'Butter', price: 55, unit: '100 g', images: ['https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&q=80'] },
      { name: 'Paneer', price: 90, unit: '200 g', images: ['https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=80'] },
      { name: 'Cheese', price: 120, unit: '200 g', images: ['https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&q=80'] },
      { name: 'Curd', price: 35, unit: '400 g', images: ['https://images.unsplash.com/photo-1571212515416-fef01ea59357?w=500&q=80'] },
    ]
  },
  {
    name: 'Bakery',
    description: 'Freshly baked breads, buns and cookies',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80',
    banner: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80',
    products: [
      { name: 'Bread', price: 40, unit: '1 pack', images: ['https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=500&q=80'] },
      { name: 'Brown Bread', price: 50, unit: '1 pack', images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80'] },
      { name: 'Burger Buns', price: 30, unit: '4 pcs', images: ['https://images.unsplash.com/photo-1576856526187-578d387600ab?w=500&q=80'] },
      { name: 'Cake', price: 350, unit: '500 g', images: ['https://images.unsplash.com/photo-1578985545062-69928b1eaeb1?w=500&q=80'] },
      { name: 'Muffins', price: 60, unit: '2 pcs', images: ['https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500&q=80'] },
      { name: 'Cookies', price: 80, unit: '200 g', images: ['https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&q=80'] },
    ]
  },
  {
    name: 'Beverages',
    description: 'Cold drinks, juices and mineral water',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80',
    banner: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=1200&q=80',
    products: [
      { name: 'Coca-Cola', price: 40, unit: '750 ml', images: ['https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80'] },
      { name: 'Pepsi', price: 40, unit: '750 ml', images: ['https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=500&q=80'] },
      { name: 'Sprite', price: 40, unit: '750 ml', images: ['https://images.unsplash.com/photo-1625772299848-391b6a515d06?w=500&q=80'] },
      { name: 'Tropicana Juice', price: 110, unit: '1 L', images: ['https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&q=80'] },
      { name: 'Red Bull', price: 125, unit: '250 ml', images: ['https://images.unsplash.com/photo-1621262947265-f48bf2b39f75?w=500&q=80'] },
      { name: 'Mineral Water', price: 20, unit: '1 L', images: ['https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=500&q=80'] },
    ]
  },
  {
    name: 'Snacks',
    description: 'Crisps, bhujia and biscuits for tea time',
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500&q=80',
    banner: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=1200&q=80',
    products: [
      { name: 'Lay\'s Chips', price: 20, unit: '50 g', images: ['https://images.unsplash.com/photo-1566478989037-e924e305926c?w=500&q=80'] },
      { name: 'Kurkure', price: 20, unit: '90 g', images: ['https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=500&q=80'] },
      { name: 'Haldiram Bhujia', price: 100, unit: '400 g', images: ['https://images.unsplash.com/photo-1604152002577-fb126131c9a6?w=500&q=80'] },
      { name: 'Parle-G', price: 10, unit: '130 g', images: ['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&q=80'] },
      { name: 'Good Day Biscuits', price: 30, unit: '250 g', images: ['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&q=80'] },
      { name: 'Cadbury Dairy Milk', price: 40, unit: '50 g', images: ['https://images.unsplash.com/photo-1629813876807-6bcfc7e0c4a4?w=500&q=80'] },
    ]
  },
  {
    name: 'Grocery Essentials',
    description: 'Rice, atta, dal, oil and daily staples',
    image: 'https://images.unsplash.com/photo-1587049352847-4d4b122e20de?w=500&q=80',
    banner: 'https://images.unsplash.com/photo-1587049352847-4d4b122e20de?w=1200&q=80',
    products: [
      { name: 'Aashirvaad Atta', price: 220, unit: '5 kg', images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80'] },
      { name: 'Tata Salt', price: 24, unit: '1 kg', images: ['https://images.unsplash.com/photo-1625902183204-6f0ce1df0340?w=500&q=80'] },
      { name: 'India Gate Rice', price: 180, unit: '1 kg', images: ['https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=500&q=80'] },
      { name: 'Fortune Oil', price: 135, unit: '1 L', images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80'] },
      { name: 'Maggi Noodles', price: 14, unit: '70 g', images: ['https://images.unsplash.com/photo-1612929633738-8fe01f7c8136?w=500&q=80'] },
      { name: 'Toor Dal', price: 160, unit: '1 kg', images: ['https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80'] },
    ]
  },
  {
    name: 'Personal Care',
    description: 'Soaps, shampoos, and oral care',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80',
    banner: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=1200&q=80',
    products: [
      { name: 'Colgate Toothpaste', price: 90, unit: '100 g', images: ['https://images.unsplash.com/photo-1596395354972-23c34e749a21?w=500&q=80'] },
      { name: 'Dove Soap', price: 55, unit: '100 g', images: ['https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=500&q=80'] },
      { name: 'Sunsilk Shampoo', price: 150, unit: '340 ml', images: ['https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=500&q=80'] },
      { name: 'Nivea Face Wash', price: 165, unit: '100 ml', images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80'] },
      { name: 'Lux Soap', price: 35, unit: '100 g', images: ['https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=500&q=80'] },
      { name: 'Hand Wash', price: 99, unit: '200 ml', images: ['https://images.unsplash.com/photo-1584305574647-0cc959aab339?w=500&q=80'] },
    ]
  },
  {
    name: 'Household Items',
    description: 'Cleaning supplies and household essentials',
    image: 'https://images.unsplash.com/photo-1584820927498-cafe4c132831?w=500&q=80',
    banner: 'https://images.unsplash.com/photo-1584820927498-cafe4c132831?w=1200&q=80',
    products: [
      { name: 'Surf Excel', price: 190, unit: '1 kg', images: ['https://images.unsplash.com/photo-1585832770485-e68a5db0eb20?w=500&q=80'] },
      { name: 'Ariel Detergent', price: 210, unit: '1 kg', images: ['https://images.unsplash.com/photo-1585832770485-e68a5db0eb20?w=500&q=80'] },
      { name: 'Vim Dishwash Gel', price: 115, unit: '500 ml', images: ['https://images.unsplash.com/photo-1584820927498-cafe4c132831?w=500&q=80'] },
      { name: 'Harpic Toilet Cleaner', price: 95, unit: '500 ml', images: ['https://images.unsplash.com/photo-1584820927498-cafe4c132831?w=500&q=80'] },
      { name: 'Lizol Floor Cleaner', price: 105, unit: '500 ml', images: ['https://images.unsplash.com/photo-1584820927498-cafe4c132831?w=500&q=80'] },
      { name: 'Garbage Bags', price: 75, unit: '30 pcs', images: ['https://images.unsplash.com/photo-1605600659903-88891f42ab6b?w=500&q=80'] },
    ]
  }
];

const seedCatalog = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing categories and products');

    let displayOrder = 1;

    for (const catData of catalog) {
      // Create Category
      const category = new Category({
        name: catData.name,
        description: catData.description,
        image: catData.image,
        banner: catData.banner,
        displayOrder: displayOrder++
      });
      await category.save();

      // Create Products for Category
      for (const prodData of catData.products) {
        const product = new Product({
          name: prodData.name,
          categoryId: category._id,
          unit: prodData.unit,
          price: prodData.price,
          stock: 100, // default stock
          images: prodData.images,
          isActive: true
        });
        await product.save();
      }
      console.log(`Created category: ${catData.name} with ${catData.products.length} products`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedCatalog();
