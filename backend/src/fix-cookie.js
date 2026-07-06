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

const fixCookie = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grocery');
    
    const p = await Product.findOne({ name: "Chocolate Chip Cookies" });
    if (p) {
      console.log(`Fixing Chocolate Chip Cookies...`);
      try {
        const res = await fetch(`https://loremflickr.com/500/500/cookie,food?lock=${Math.floor(Math.random()*1000)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const url = await uploadBufferToCloudinary(buffer, 'freshmart/products', 'product');
        p.images = [url];
        await p.save();
        console.log(`✅ Fixed Chocolate Chip Cookies: ${url}`);
      } catch (e) {
        console.log(`❌ Failed: ${e.message}`);
      }
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixCookie();
