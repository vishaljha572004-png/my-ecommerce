require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Product = require('./models/Product.model');

const fixPaneer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grocery');
    
    const p = await Product.findOne({ name: "Fresh Paneer" });
    if (p) {
      console.log(`Fixing Fresh Paneer...`);
      p.images = ["https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Paneer_03.jpg/800px-Paneer_03.jpg"];
      await p.save();
      console.log(`✅ Fixed Fresh Paneer directly!`);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixPaneer();
