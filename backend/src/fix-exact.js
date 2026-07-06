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

const exactImages = {
  "Fresh Red Apple": "https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg",
  "Fresh Potatoes": "https://upload.wikimedia.org/wikipedia/commons/a/ab/Patates.jpg",
  "Fresh Paneer": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Paneer_03.jpg/800px-Paneer_03.jpg"
};

const fixExactImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grocery');
    
    for (const [name, sourceUrl] of Object.entries(exactImages)) {
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
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixExactImages();
