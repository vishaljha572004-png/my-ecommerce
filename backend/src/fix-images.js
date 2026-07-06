require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product.model.js');

const fixImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grocery');
    console.log('Connected to DB');

    const products = await Product.find({});
    let updated = 0;

    for (const product of products) {
      const placeholder = `https://placehold.co/500x500/EAF3FF/2563EB?text=${encodeURIComponent(product.name)}`;
      product.images = [placeholder];
      await product.save();
      updated++;
    }

    console.log(`Successfully updated ${updated} products with placehold.co images.`);
    process.exit(0);
  } catch (error) {
    console.error('Error fixing images:', error);
    process.exit(1);
  }
};

fixImages();
