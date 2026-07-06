require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Product = require('./models/Product.model');
const { cloudinary } = require('./config/cloudinary');

const imagesMap = [
  { name: "Fresh Red Apple", path: "C:\\Users\\visha\\.gemini\\antigravity-ide\\brain\\13693f18-16b8-4c94-98a0-b008c660303d\\fresh_red_apple_1783355097009.png" },
  { name: "Organic Bananas", path: "C:\\Users\\visha\\.gemini\\antigravity-ide\\brain\\13693f18-16b8-4c94-98a0-b008c660303d\\organic_bananas_1783355105930.png" },
  { name: "Fresh Orange", path: "C:\\Users\\visha\\.gemini\\antigravity-ide\\brain\\13693f18-16b8-4c94-98a0-b008c660303d\\fresh_orange_1783355115506.png" },
  { name: "Fresh Potatoes", path: "C:\\Users\\visha\\.gemini\\antigravity-ide\\brain\\13693f18-16b8-4c94-98a0-b008c660303d\\fresh_potatoes_1783355125630.png" },
  { name: "Red Tomatoes", path: "C:\\Users\\visha\\.gemini\\antigravity-ide\\brain\\13693f18-16b8-4c94-98a0-b008c660303d\\red_tomatoes_1783355135038.png" },
  { name: "Fresh Carrots", path: "C:\\Users\\visha\\.gemini\\antigravity-ide\\brain\\13693f18-16b8-4c94-98a0-b008c660303d\\fresh_carrots_1783355152978.png" },
  { name: "Full Cream Milk", path: "C:\\Users\\visha\\.gemini\\antigravity-ide\\brain\\13693f18-16b8-4c94-98a0-b008c660303d\\full_cream_milk_1783355163464.png" },
  { name: "Salted Butter", path: "C:\\Users\\visha\\.gemini\\antigravity-ide\\brain\\13693f18-16b8-4c94-98a0-b008c660303d\\salted_butter_1783355173332.png" },
  { name: "Fresh Paneer", path: "C:\\Users\\visha\\.gemini\\antigravity-ide\\brain\\13693f18-16b8-4c94-98a0-b008c660303d\\fresh_paneer_1783355183780.png" },
  { name: "Whole Wheat Bread", path: "C:\\Users\\visha\\.gemini\\antigravity-ide\\brain\\13693f18-16b8-4c94-98a0-b008c660303d\\whole_wheat_bread_1783355193466.png" },
  { name: "Chocolate Cake", path: "C:\\Users\\visha\\.gemini\\antigravity-ide\\brain\\13693f18-16b8-4c94-98a0-b008c660303d\\chocolate_cake_1783355211476.png" },
  { name: "Fresh Muffins", path: "C:\\Users\\visha\\.gemini\\antigravity-ide\\brain\\13693f18-16b8-4c94-98a0-b008c660303d\\fresh_muffins_1783355220747.png" },
  { name: "Croissant", path: "C:\\Users\\visha\\.gemini\\antigravity-ide\\brain\\13693f18-16b8-4c94-98a0-b008c660303d\\fresh_muffins_1783355220747.png" },
  { name: "Potato Chips", path: "C:\\Users\\visha\\.gemini\\antigravity-ide\\brain\\13693f18-16b8-4c94-98a0-b008c660303d\\potato_chips_1783355231328.png" },
  { name: "Chocolate Chip Cookies", path: "C:\\Users\\visha\\.gemini\\antigravity-ide\\brain\\13693f18-16b8-4c94-98a0-b008c660303d\\chocolate_chip_cookies_1783355241765.png" },
  { name: "Salted Peanuts", path: "C:\\Users\\visha\\.gemini\\antigravity-ide\\brain\\13693f18-16b8-4c94-98a0-b008c660303d\\salted_peanuts_1783355251410.png" }
];

const fixWithGenerated = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grocery');
    
    for (const item of imagesMap) {
      const p = await Product.findOne({ name: item.name });
      if (p) {
        console.log(`Uploading & Fixing ${item.name}...`);
        try {
          const result = await cloudinary.uploader.upload(item.path, {
            folder: 'freshmart/products',
            tags: ['product'],
            format: 'jpg'
          });
          p.images = [result.secure_url];
          await p.save();
          console.log(`✅ Uploaded to Cloudinary: ${result.secure_url}`);
        } catch (e) {
          console.log(`❌ Failed for ${item.name}: ${e.message}`);
        }
      }
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixWithGenerated();
