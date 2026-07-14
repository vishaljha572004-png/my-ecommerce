require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const { cloudinary } = require('./config/cloudinary');
const Product = require('./models/Product.model');
const Category = require('./models/Category.model');


const uploadBufferToCloudinary = (buffer, folder, tag) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, tags: [tag], format: 'jpg' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};

const seedRealImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grocery');
    console.log('Connected to DB for seeding real images...');

    const products = await Product.find({});
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      try {
        console.log(`Processing product ${i+1}/${products.length}: ${product.name}`);
        const res = await fetch(`https://loremflickr.com/500/500/grocery,${encodeURIComponent(product.name.split(' ')[0])}`);
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const url = await uploadBufferToCloudinary(buffer, 'freshmart/products', 'product');
        product.images = [url];
        await product.save();
        console.log(` -> Updated with URL: ${url}`);
      } catch (err) {
        console.error(` -> Failed for ${product.name}:`, err.message);
      }
    }

    const categories = await Category.find({});
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      try {
        console.log(`Processing category ${i+1}/${categories.length}: ${category.name}`);
        const res = await fetch(`https://loremflickr.com/500/500/grocery,${encodeURIComponent(category.name.split(' ')[0])}`);
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const url = await uploadBufferToCloudinary(buffer, 'freshmart/categories', 'category');
        category.image = url;
        await category.save();
        console.log(` -> Updated with URL: ${url}`);
      } catch (err) {
        console.error(` -> Failed for ${category.name}:`, err.message);
      }
    }

    console.log('Successfully completed seeding real images.');
    process.exit(0);
  } catch (error) {
    console.error('Fatal Error:', error);
    process.exit(1);
  }
};

seedRealImages();
