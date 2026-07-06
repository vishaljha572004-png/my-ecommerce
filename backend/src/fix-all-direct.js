require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Product = require('./models/Product.model');

const exactImages = {
  "Organic Bananas": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/800px-Banana-Single.jpg",
  "Fresh Orange": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Orange-Fruit-Pieces.jpg/800px-Orange-Fruit-Pieces.jpg",
  "Red Tomatoes": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Tomato_je.jpg/800px-Tomato_je.jpg",
  "Fresh Carrots": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Carrots_at_Ljubljana_Central_Market.jpg/800px-Carrots_at_Ljubljana_Central_Market.jpg",
  "Full Cream Milk": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Glass_of_Milk_%2833657535532%29.jpg/800px-Glass_of_Milk_%2833657535532%29.jpg",
  "Salted Butter": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Butter_on_a_white_plate.jpg/800px-Butter_on_a_white_plate.jpg",
  "Whole Wheat Bread": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Fresh_made_bread_05.jpg/800px-Fresh_made_bread_05.jpg",
  "Chocolate Cake": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Pound_layer_cake.jpg/800px-Pound_layer_cake.jpg",
  "Chocolate Chip Cookies": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/2ChocolateChipCookies.jpg/800px-2ChocolateChipCookies.jpg",
  "Salted Peanuts": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Peanut_9417.jpg/800px-Peanut_9417.jpg"
};

const fixAllImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grocery');
    
    for (const [name, url] of Object.entries(exactImages)) {
      const p = await Product.findOne({ name });
      if (p) {
        console.log(`Fixing ${name}...`);
        p.images = [url];
        await p.save();
        console.log(`✅ Fixed ${name} directly!`);
      }
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixAllImages();
