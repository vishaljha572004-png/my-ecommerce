require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Product = require('./models/Product.model');
const { cloudinary } = require('./config/cloudinary');

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

const fixBrokenImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grocery');
    
    const missing = ["Fresh Red Apple", "Fresh Potatoes", "Fresh Paneer"];
    const products = await Product.find({ name: { $in: missing } });
    
    for (const p of products) {
      console.log(`Fixing ${p.name}...`);
      const res = await fetch(`https://loremflickr.com/500/500/grocery,${encodeURIComponent(p.name.split(' ')[1])}`);
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const url = await uploadBufferToCloudinary(buffer, 'freshmart/products', 'product');
      p.images = [url];
      await p.save();
      console.log(`✅ Fixed ${p.name} with URL: ${url}`);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixBrokenImages();
