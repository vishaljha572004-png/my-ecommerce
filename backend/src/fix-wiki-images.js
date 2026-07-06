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
  "Fresh Red Apple": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/800px-Red_Apple.jpg",
  "Organic Bananas": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/800px-Banana-Single.jpg",
  "Fresh Orange": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Oranges_-_whole-halved-segment.jpg/800px-Oranges_-_whole-halved-segment.jpg",
  "Fresh Potatoes": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Patates.jpg/800px-Patates.jpg",
  "Red Tomatoes": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Tomato_je.jpg/800px-Tomato_je.jpg",
  "Fresh Carrots": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Carrots_at_Ljubljana_Central_Market.jpg/800px-Carrots_at_Ljubljana_Central_Market.jpg",
  "Full Cream Milk": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Glass_of_Milk_%2833657535532%29.jpg/800px-Glass_of_Milk_%2833657535532%29.jpg",
  "Salted Butter": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Butter_03.jpg/800px-Butter_03.jpg",
  "Fresh Paneer": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Paneer_03.jpg/800px-Paneer_03.jpg",
  "Whole Wheat Bread": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Fresh_made_bread_05.jpg/800px-Fresh_made_bread_05.jpg",
  "Chocolate Cake": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Pound_layer_cake.jpg/800px-Pound_layer_cake.jpg",
  "Fresh Muffins": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Muffin_NIH.jpg/800px-Muffin_NIH.jpg",
  "Potato Chips": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Potato-Chips.jpg/800px-Potato-Chips.jpg",
  "Chocolate Chip Cookies": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/2ChocolateChipCookies.jpg/800px-2ChocolateChipCookies.jpg",
  "Salted Peanuts": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Peanut_9417.jpg/800px-Peanut_9417.jpg"
};

const fixWikimediaImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grocery');
    
    for (const [name, sourceUrl] of Object.entries(exactImages)) {
      const p = await Product.findOne({ name });
      if (p) {
        console.log(`Fixing ${name}...`);
        try {
          const res = await fetch(sourceUrl, {
            headers: {
              'User-Agent': 'MyEcommerceAppBot/1.0 (https://localhost; test@example.com)'
            }
          });
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

fixWikimediaImages();
