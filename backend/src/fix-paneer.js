require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Product = require('./models/Product.model');
const { cloudinary } = require('./config/cloudinary');

const uploadBufferToCloudinary = (buffer, folder, tag) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, tags: [tag] },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};

const fixExactImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grocery');
    
    const name = "Fresh Paneer";
    const sourceUrl = "https://images.unsplash.com/photo-1629168621743-346761012a9e?w=500&q=80";
    const p = await Product.findOne({ name });
    if (p) {
      console.log(`Fixing ${name}...`);
      const res = await fetch(sourceUrl);
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const url = await uploadBufferToCloudinary(buffer, 'freshmart/products', 'product');
      p.images = [url];
      await p.save();
      console.log(`✅ Fixed ${name} with URL: ${url}`);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixExactImages();
