require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Product = require('./models/Product.model');

const fixImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grocery');
    console.log('Connected to DB...');

    
    await Product.updateOne(
      { name: 'Croissant' },
      { 
        $set: { 
          name: 'Fresh Muffins', 
          images: ['https://res.cloudinary.com/dncjgxs3r/image/upload/v1783351222/freshmart/products/ntp5zos1fhxk3pveneba.jpg'],
          description: 'Delicious fresh baked muffins.'
        } 
      }
    );

    
    await Product.updateOne(
      { name: 'Potato Chips' },
      { 
        $set: { 
          images: ['https://res.cloudinary.com/dncjgxs3r/image/upload/v1783351248/freshmart/products/jy7kcrko2b5wbyvmqm1p.jpg']
        } 
      }
    );

    console.log('Fixed broken images successfully.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixImages();
