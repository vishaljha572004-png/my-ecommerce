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

const imageMap = {
  "Organic Bananas": "banana,fruit",
  "Fresh Orange": "orange,fruit,citrus",
  "Red Tomatoes": "tomato,vegetable",
  "Fresh Carrots": "carrot,vegetable",
  "Full Cream Milk": "milk,glass",
  "Salted Butter": "butter,yellow",
  "Whole Wheat Bread": "bread,loaf",
  "Chocolate Cake": "chocolate,cake",
  "Chocolate Chip Cookies": "cookie,chocolate",
  "Salted Peanuts": "peanuts,nuts"
};

const fixLoremImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grocery');
    
    for (const [name, keywords] of Object.entries(imageMap)) {
      const p = await Product.findOne({ name });
      if (p) {
        console.log(`Fixing ${name} using ${keywords}...`);
        try {
          // Add a random timestamp so loremflickr gives a fresh image if we retry
          const res = await fetch(`https://loremflickr.com/500/500/${keywords}?lock=${Math.floor(Math.random()*1000)}`);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          
          const arrayBuffer = await res.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const url = await uploadBufferToCloudinary(buffer, 'freshmart/products', 'product');
          p.images = [url];
          await p.save();
          console.log(`✅ Fixed ${name}: ${url}`);
        } catch (e) {
          console.log(`❌ Failed for ${name}: ${e.message}`);
        }
      }
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixLoremImages();
