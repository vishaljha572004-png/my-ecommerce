require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Product = require('./models/Product.model');
const Category = require('./models/Category.model');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grocery');
    console.log('Connected to DB...');

    // Wipe existing
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('Cleared existing junk products and categories.');

    // Define 5 high-quality categories
    const categoriesToInsert = [
      { name: 'Fruits', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=500&q=80' },
      { name: 'Vegetables', image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=500&q=80' },
      { name: 'Dairy & Milk', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=500&q=80' },
      { name: 'Bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80' },
      { name: 'Snacks', image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=500&q=80' }
    ];

    const createdCategories = await Category.insertMany(categoriesToInsert);
    const catMap = {};
    createdCategories.forEach(c => catMap[c.name] = c._id);

    // Define 10 high-quality products
    const productsToInsert = [
      { name: 'Fresh Red Apple', categoryId: catMap['Fruits'], price: 120, stock: 50, images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?auto=format&fit=crop&w=500&q=80'], description: 'Fresh and crispy red apples.' },
      { name: 'Organic Bananas', categoryId: catMap['Fruits'], price: 60, stock: 100, images: ['https://images.unsplash.com/photo-1571501679680-de32f1e7aad4?auto=format&fit=crop&w=500&q=80'], description: 'Naturally ripened organic bananas.' },
      { name: 'Fresh Orange', categoryId: catMap['Fruits'], price: 80, stock: 90, images: ['https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=500&q=80'], description: 'Sweet and juicy oranges.' },
      
      { name: 'Fresh Potatoes', categoryId: catMap['Vegetables'], price: 40, stock: 200, images: ['https://images.unsplash.com/photo-1518977673343-a4a623080d19?auto=format&fit=crop&w=500&q=80'], description: 'Farm fresh potatoes.' },
      { name: 'Red Tomatoes', categoryId: catMap['Vegetables'], price: 50, stock: 150, images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=500&q=80'], description: 'Juicy red tomatoes.' },
      { name: 'Fresh Carrots', categoryId: catMap['Vegetables'], price: 60, stock: 120, images: ['https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=500&q=80'], description: 'Crunchy orange carrots.' },
      
      { name: 'Full Cream Milk', categoryId: catMap['Dairy & Milk'], price: 65, stock: 80, images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=500&q=80'], description: 'Fresh full cream milk.' },
      { name: 'Salted Butter', categoryId: catMap['Dairy & Milk'], price: 250, stock: 40, images: ['https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=500&q=80'], description: 'Pure salted butter.' },
      { name: 'Fresh Paneer', categoryId: catMap['Dairy & Milk'], price: 90, stock: 50, images: ['https://images.unsplash.com/photo-1631451095764-9facf6248d28?auto=format&fit=crop&w=500&q=80'], description: 'Soft and fresh paneer.' },
      
      { name: 'Whole Wheat Bread', categoryId: catMap['Bakery'], price: 45, stock: 60, images: ['https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&w=500&q=80'], description: 'Freshly baked whole wheat bread.' },
      { name: 'Chocolate Cake', categoryId: catMap['Bakery'], price: 450, stock: 10, images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80'], description: 'Rich chocolate cake.' },
      { name: 'Croissant', categoryId: catMap['Bakery'], price: 70, stock: 30, images: ['https://images.unsplash.com/photo-1555507036-ab1f40ce887f?auto=format&fit=crop&w=500&q=80'], description: 'Buttery flaky croissants.' },
      
      { name: 'Potato Chips', categoryId: catMap['Snacks'], price: 20, stock: 300, images: ['https://images.unsplash.com/photo-1566478989037-e12483b969c5?auto=format&fit=crop&w=500&q=80'], description: 'Crispy potato chips.' },
      { name: 'Chocolate Chip Cookies', categoryId: catMap['Snacks'], price: 80, stock: 120, images: ['https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=500&q=80'], description: 'Delicious chocolate chip cookies.' },
      { name: 'Salted Peanuts', categoryId: catMap['Snacks'], price: 50, stock: 200, images: ['https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?auto=format&fit=crop&w=500&q=80'], description: 'Crunchy salted peanuts.' },

    ];

    await Product.insertMany(productsToInsert);
    console.log('Inserted 10 high-quality products.');
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
