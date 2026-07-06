require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Product = require('./models/Product.model');

const checkImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grocery');
    
    const products = await Product.find({});
    for (const p of products) {
      if (p.images && p.images.length > 0) {
        try {
          const res = await fetch(p.images[0], { method: 'HEAD' });
          if (!res.ok) {
            console.log(`❌ Missing: ${p.name} (${p.images[0]})`);
          } else {
            console.log(`✅ OK: ${p.name}`);
          }
        } catch (e) {
          console.log(`❌ Error fetching: ${p.name}`);
        }
      }
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkImages();
