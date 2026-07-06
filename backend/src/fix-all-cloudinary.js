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

const fixAllCloudinary = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grocery');
    
    for (const [name, sourceUrl] of Object.entries(exactImages)) {
      const p = await Product.findOne({ name });
      if (p) {
        console.log(`Fixing ${name}...`);
        try {
          const res = await fetch(sourceUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          
          const arrayBuffer = await res.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const url = await uploadBufferToCloudinary(buffer, 'freshmart/products', 'product');
          p.images = [url];
          await p.save();
          console.log(`✅ Uploaded to Cloudinary & fixed ${name}: ${url}`);
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

fixAllCloudinary();
