require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category.model.js');

const fixCategoryImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grocery');
    console.log('Connected to DB');

    const categories = await Category.find({});
    let updated = 0;

    for (const cat of categories) {
      if (cat.image) {
        const placeholder = `https://placehold.co/500x500/EAF3FF/2563EB?text=${encodeURIComponent(cat.name)}`;
        cat.image = placeholder;
        await cat.save();
        updated++;
      } else if (!cat.image) {
        cat.image = `https://placehold.co/300x300/FACC15/16A34A?text=${encodeURIComponent(cat.name)}`;
        await cat.save();
        updated++;
      }
    }

    console.log(`Successfully updated ${updated} categories.`);
    process.exit(0);
  } catch (error) {
    console.error('Error fixing categories:', error);
    process.exit(1);
  }
};

fixCategoryImages();
