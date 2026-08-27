import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

import { Product, Category, HomepageSettings, GalleryItem, Quote, Dealership, CustomFilter } from './models/Schemas.js';

// Import initial data from client to seed database if empty
import { CATEGORIES, PRODUCTS } from './data/products.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// --- Database Connection & Seeding ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/asttoria';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connection established successfully.');
    await seedDatabase();
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
  });

async function seedDatabase() {
  try {
    // Seed Categories
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      console.log('Seeding initial categories...');
      // Filter out the 'all' option since it is UI-only
      const filteredCategories = CATEGORIES.filter(c => c.id !== 'all');
      await Category.insertMany(filteredCategories);
      console.log(`Seeded ${filteredCategories.length} categories.`);
    }

    // Seed Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Seeding initial products...');
      // Sanitize products to make sure specs matches schema
      const sanitizedProducts = PRODUCTS.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        short: p.short,
        img: p.img || '',
        dimensions: p.dimensions || '',
        specs: p.specs || [],
        applications: p.applications || [],
        sizes: p.sizes || []
      }));
      await Product.insertMany(sanitizedProducts);
      console.log(`Seeded ${sanitizedProducts.length} products.`);
    }

    // Seed Homepage Settings
    let settings = await HomepageSettings.findOne({});
    if (!settings) {
      console.log('Seeding default homepage settings...');
      await HomepageSettings.create({
        heroBadge: 'Gyproc Saint-Gobain Official Dealer',
        heroTitle: 'Premium False Ceiling & Partition Framework Solutions',
        heroSubtitle: 'Manufacturing and supplying ceiling systems, partition frameworks, insulation channels, T-grid systems, gypsum accessories and industrial framing products since 1996.',
        heroBgImage: 'https://images.pexels.com/photos/18289606/pexels-photo-18289606.jpeg?auto=compress&cs=tinysrgb&w=1200',
        heroStats: [
          { num: '29+', lbl: 'Years' },
          { num: '500+', lbl: 'Projects' },
          { num: '6', lbl: 'Product Lines' },
          { num: '100%', lbl: 'G.I. Steel' }
        ],
        aboutBadge: 'About ASTTORIA',
        aboutTitle: 'Trusted Since 1996',
        aboutDescription: 'ASTTORIA is a leading supplier and manufacturer of false ceiling frameworks, POP sections, partition channels, insulation systems, gypsum accessories and T-grid products. We provide customized solutions for residential, commercial and industrial projects.',
        aboutImage: 'https://images.pexels.com/photos/30990849/pexels-photo-30990849.jpeg?auto=compress&cs=tinysrgb&w=1200',
        aboutPoints: [
          'Custom manufacturing capability',
          '100% galvanized steel',
          'Bulk order specialists',
          'Pan-India delivery'
        ],
        featuresBadge: 'Why ASTTORIA',
        featuresTitle: 'Built on precision. Backed by experience.',
        featuresList: [
          { title: 'Custom Length Manufacturing', desc: 'Sections cut to your exact project specifications.' },
          { title: 'High Quality Galvanized Steel', desc: 'Corrosion-resistant G.I. with thick zinc coating.' },
          { title: 'Dealership of established brands', desc: 'Stockage of entire range of tiling, false ceiling and boarding materials' },
          { title: 'Bulk Orders Accepted', desc: 'Project-scale supply for contractors & builders.' },
          { title: 'Fast Delivery', desc: 'Quick dispatch across Mohali, Punjab and pan-India.' },
          { title: 'Industry Experience Since 1996', desc: 'Three decades of manufacturing expertise.' }
        ],
        productsBadge: 'Product Range',
        productsTitle: 'Complete framing & ceiling ecosystem',
        productsList: [
          {
            id: 'ceiling',
            num: '01',
            title: 'Ceiling Framework',
            desc: 'Broad & narrow ceiling sections, channels, angles.',
            img: 'https://images.pexels.com/photos/18289606/pexels-photo-18289606.jpeg?auto=compress&cs=tinysrgb&w=1200'
          },
          {
            id: 'pop',
            num: '02',
            title: 'POP Sections',
            desc: 'POP main, angle and cross profiles for plaster ceilings.',
            img: 'https://images.pexels.com/photos/32239084/pexels-photo-32239084.jpeg?auto=compress&cs=tinysrgb&w=1200'
          },
          {
            id: 'partition',
            num: '03',
            title: 'Partition Framework',
            desc: 'Studs and floor channels in 2" and 3" sizes.',
            img: 'https://images.pexels.com/photos/36003986/pexels-photo-36003986.jpeg?auto=compress&cs=tinysrgb&w=1200'
          },
          {
            id: 'insulation',
            num: '04',
            title: 'Insulation Products',
            desc: 'Hat channels & furring for acoustic and thermal systems.',
            img: 'https://images.pexels.com/photos/30990849/pexels-photo-30990849.jpeg?auto=compress&cs=tinysrgb&w=1200'
          },
          {
            id: 'tsection',
            num: '05',
            title: 'T-Section Products',
            desc: 'Complete T-grid suspended ceiling system.',
            img: 'https://images.pexels.com/photos/18289606/pexels-photo-18289606.jpeg?auto=compress&cs=tinysrgb&w=1200'
          },
          {
            id: 'accessories',
            num: '06',
            title: 'Accessories & Hardware',
            desc: 'Clips, cleets, screws, anchors and jointing material.',
            img: 'https://images.pexels.com/photos/30990849/pexels-photo-30990849.jpeg?auto=compress&cs=tinysrgb&w=1200'
          }
        ]
      });
      console.log('Seeded default homepage settings.');
    } else {
      // Check if new fields are missing on existing settings (migration)
      let needsSave = false;
      if (!settings.featuresBadge) {
        settings.featuresBadge = 'Why ASTTORIA';
        needsSave = true;
      }
      if (!settings.featuresTitle) {
        settings.featuresTitle = 'Built on precision. Backed by experience.';
        needsSave = true;
      }
      if (!settings.featuresList || settings.featuresList.length === 0) {
        settings.featuresList = [
          { title: 'Custom Length Manufacturing', desc: 'Sections cut to your exact project specifications.' },
          { title: 'High Quality Galvanized Steel', desc: 'Corrosion-resistant G.I. with thick zinc coating.' },
          { title: 'Dealership of established brands', desc: 'Stockage of entire range of tiling, false ceiling and boarding materials' },
          { title: 'Bulk Orders Accepted', desc: 'Project-scale supply for contractors & builders.' },
          { title: 'Fast Delivery', desc: 'Quick dispatch across Mohali, Punjab and pan-India.' },
          { title: 'Industry Experience Since 1996', desc: 'Three decades of manufacturing expertise.' }
        ];
        needsSave = true;
      }
      if (!settings.productsBadge) {
        settings.productsBadge = 'Product Range';
        needsSave = true;
      }
      if (!settings.productsTitle) {
        settings.productsTitle = 'Complete framing & ceiling ecosystem';
        needsSave = true;
      }
      if (!settings.productsList || settings.productsList.length === 0) {
        settings.productsList = [
          {
            id: 'ceiling',
            num: '01',
            title: 'Ceiling Framework',
            desc: 'Broad & narrow ceiling sections, channels, angles.',
            img: 'https://images.pexels.com/photos/18289606/pexels-photo-18289606.jpeg?auto=compress&cs=tinysrgb&w=1200'
          },
          {
            id: 'pop',
            num: '02',
            title: 'POP Sections',
            desc: 'POP main, angle and cross profiles for plaster ceilings.',
            img: 'https://images.pexels.com/photos/32239084/pexels-photo-32239084.jpeg?auto=compress&cs=tinysrgb&w=1200'
          },
          {
            id: 'partition',
            num: '03',
            title: 'Partition Framework',
            desc: 'Studs and floor channels in 2" and 3" sizes.',
            img: 'https://images.pexels.com/photos/36003986/pexels-photo-36003986.jpeg?auto=compress&cs=tinysrgb&w=1200'
          },
          {
            id: 'insulation',
            num: '04',
            title: 'Insulation Products',
            desc: 'Hat channels & furring for acoustic and thermal systems.',
            img: 'https://images.pexels.com/photos/30990849/pexels-photo-30990849.jpeg?auto=compress&cs=tinysrgb&w=1200'
          },
          {
            id: 'tsection',
            num: '05',
            title: 'T-Section Products',
            desc: 'Complete T-grid suspended ceiling system.',
            img: 'https://images.pexels.com/photos/18289606/pexels-photo-18289606.jpeg?auto=compress&cs=tinysrgb&w=1200'
          },
          {
            id: 'accessories',
            num: '06',
            title: 'Accessories & Hardware',
            desc: 'Clips, cleets, screws, anchors and jointing material.',
            img: 'https://images.pexels.com/photos/30990849/pexels-photo-30990849.jpeg?auto=compress&cs=tinysrgb&w=1200'
          }
        ];
        needsSave = true;
      }
      if (needsSave) {
        await settings.save();
        console.log('Migrated and updated existing homepage settings with new features & product range fields.');
      }
    }

    // Seed Gallery Items
    const galleryCount = await GalleryItem.countDocuments();
    if (galleryCount === 0) {
      console.log('Seeding default gallery items...');
      const defaultGallery = [
        {
          title: 'False Ceiling Grid installation',
          imageUrl: 'https://images.pexels.com/photos/18289606/pexels-photo-18289606.jpeg?auto=compress&cs=tinysrgb&w=800',
          description: 'A completed commercial grid ceiling installation with white powder coated T-sections.'
        },
        {
          title: 'Modern Drywall Partition',
          imageUrl: 'https://images.pexels.com/photos/36003986/pexels-photo-36003986.jpeg?auto=compress&cs=tinysrgb&w=800',
          description: 'Office cabins framing built with 3" heavy-duty vertical metal studs.'
        },
        {
          title: 'Acoustic Sound Insulation',
          imageUrl: 'https://images.pexels.com/photos/30990849/pexels-photo-30990849.jpeg?auto=compress&cs=tinysrgb&w=800',
          description: 'Hat-channel furring installed with sound isolation boards for studio insulation.'
        }
      ];
      await GalleryItem.insertMany(defaultGallery);
      console.log('Seeded default gallery items.');
    }
    
    // Seed Dealerships
    const dealershipCount = await Dealership.countDocuments();
    if (dealershipCount === 0) {
      console.log('Seeding default dealerships...');
      const defaultDealerships = [
        { name: 'Saint-Gobain Gyproc', logoUrl: 'https://placehold.co/200x80/0F172A/ffffff?text=Saint-Gobain+Gyproc' },
        { name: 'USG Boral', logoUrl: 'https://placehold.co/200x80/0F172A/ffffff?text=USG+Boral' },
        { name: 'Armstrong', logoUrl: 'https://placehold.co/200x80/0F172A/ffffff?text=Armstrong' },
        { name: 'Knauf', logoUrl: 'https://placehold.co/200x80/0F172A/ffffff?text=Knauf' }
      ];
      await Dealership.insertMany(defaultDealerships);
      console.log('Seeded default dealerships.');
    }

    // Seed Custom Filters
    const customFilterCount = await CustomFilter.countDocuments();
    if (customFilterCount === 0) {
      console.log('Seeding default custom filters...');
      const defaultFilters = [
        {
          name: 'Thickness',
          options: ['0.50 mm', '0.55 mm', '0.60 mm', '0.80 mm', '1.20 mm']
        },
        {
          name: 'Material Finish',
          options: ['Galvanized', 'Aluzinc', 'Prepainted', 'Powder Coated']
        }
      ];
      await CustomFilter.insertMany(defaultFilters);
      console.log('Seeded default custom filters.');
    }

    // Migrate Products: Set default company and empty customFilters array if missing
    await Product.updateMany(
      { company: { $exists: false } },
      { $set: { company: 'Saint-Gobain Gyproc' } }
    );
    await Product.updateMany(
      { customFilters: { $exists: false } },
      { $set: { customFilters: [] } }
    );
    console.log('Product migration checked/applied successfully.');

  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// --- Auth Middleware ---
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Access denied. Unauthorized.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session token.' });
  }
};

// --- API Router Endpoints ---

// 1. Admin Login & Verification
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USERNAME;
  const adminPass = process.env.ADMIN_PASSWORD;

  if (username === adminUser && password === adminPass) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({ success: true, token });
  }
  return res.status(400).json({ success: false, message: 'Invalid admin username or password.' });
});

app.get('/api/admin/verify', authMiddleware, (req, res) => {
  res.json({ success: true, user: req.user });
});

// 2. Products API
app.get('/api/products', async (req, res) => {
  try {
    const list = await Product.find({});
    res.json(list);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/products', authMiddleware, async (req, res) => {
  try {
    const { name, category, short, img, dimensions, specs, applications, sizes, company, customFilters } = req.body;
    if (!name || !category || !short) {
      return res.status(400).json({ success: false, message: 'Name, category and short description are required.' });
    }
    // Generate a unique id based on name
    const rawId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const suffix = Math.floor(1000 + Math.random() * 9000);
    const id = `${rawId}-${suffix}`;

    const newProduct = await Product.create({
      id, name, category, short, img, dimensions, specs, applications, sizes, company, customFilters
    });
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/products/:dbId', authMiddleware, async (req, res) => {
  try {
    const { dbId } = req.params;
    const { name, category, short, img, dimensions, specs, applications, sizes, company, customFilters } = req.body;
    
    const updated = await Product.findByIdAndUpdate(dbId, {
      name, category, short, img, dimensions, specs, applications, sizes, company, customFilters
    }, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/products/:dbId', authMiddleware, async (req, res) => {
  try {
    const { dbId } = req.params;
    const deleted = await Product.findByIdAndDelete(dbId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Categories API
app.get('/api/categories', async (req, res) => {
  try {
    const list = await Category.find({});
    res.json(list);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/categories', authMiddleware, async (req, res) => {
  try {
    const { id, label } = req.body;
    if (!id || !label) {
      return res.status(400).json({ success: false, message: 'Category ID and Label are required.' });
    }
    // Check if duplicate
    const exists = await Category.findOne({ id });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Category ID already exists.' });
    }

    const newCategory = await Category.create({ id, label });
    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/categories/:dbId', authMiddleware, async (req, res) => {
  try {
    const { dbId } = req.params;
    const { label } = req.body;
    if (!label) {
      return res.status(400).json({ success: false, message: 'Label is required.' });
    }
    const updated = await Category.findByIdAndUpdate(dbId, { label }, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/categories/:dbId', authMiddleware, async (req, res) => {
  try {
    const { dbId } = req.params;
    const cat = await Category.findById(dbId);
    if (!cat) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    
    // Optional: Delete products associated with this category or prevent deletion
    const productCount = await Product.countDocuments({ category: cat.id });
    if (productCount > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot delete category. There are still ${productCount} products associated with it.` 
      });
    }

    await Category.findByIdAndDelete(dbId);
    res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- Custom Filters API ---
app.get('/api/custom-filters', async (req, res) => {
  try {
    const list = await CustomFilter.find({});
    res.json(list);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/custom-filters', authMiddleware, async (req, res) => {
  try {
    const { name, options } = req.body;
    if (!name || !options || !Array.isArray(options)) {
      return res.status(400).json({ success: false, message: 'Filter name and options array are required.' });
    }
    const exists = await CustomFilter.findOne({ name });
    if (exists) {
      return res.status(400).json({ success: false, message: 'A filter group with this name already exists.' });
    }
    const newFilter = await CustomFilter.create({ name, options });
    res.status(201).json({ success: true, data: newFilter });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/custom-filters/:dbId', authMiddleware, async (req, res) => {
  try {
    const { dbId } = req.params;
    const { name, options } = req.body;
    if (!name || !options || !Array.isArray(options)) {
      return res.status(400).json({ success: false, message: 'Filter name and options array are required.' });
    }
    const updated = await CustomFilter.findByIdAndUpdate(dbId, { name, options }, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Filter group not found.' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/custom-filters/:dbId', authMiddleware, async (req, res) => {
  try {
    const { dbId } = req.params;
    const deleted = await CustomFilter.findByIdAndDelete(dbId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Filter group not found.' });
    }
    res.json({ success: true, message: 'Filter group deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. Homepage Settings API
app.get('/api/homepage-settings', async (req, res) => {
  try {
    let settings = await HomepageSettings.findOne({});
    if (!settings) {
      // If db was loaded without connect seed yet, return a blank template
      settings = await HomepageSettings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/homepage-settings', authMiddleware, async (req, res) => {
  try {
    const { 
      heroBadge, heroTitle, heroSubtitle, heroBgImage, heroStats,
      aboutBadge, aboutTitle, aboutDescription, aboutImage, aboutPoints,
      featuresBadge, featuresTitle, featuresList,
      productsBadge, productsTitle, productsList
    } = req.body;

    let settings = await HomepageSettings.findOne({});
    if (!settings) {
      settings = new HomepageSettings();
    }

    if (heroBadge !== undefined) settings.heroBadge = heroBadge;
    if (heroTitle !== undefined) settings.heroTitle = heroTitle;
    if (heroSubtitle !== undefined) settings.heroSubtitle = heroSubtitle;
    if (heroBgImage !== undefined) settings.heroBgImage = heroBgImage;
    if (heroStats !== undefined) settings.heroStats = heroStats;
    
    if (aboutBadge !== undefined) settings.aboutBadge = aboutBadge;
    if (aboutTitle !== undefined) settings.aboutTitle = aboutTitle;
    if (aboutDescription !== undefined) settings.aboutDescription = aboutDescription;
    if (aboutImage !== undefined) settings.aboutImage = aboutImage;
    if (aboutPoints !== undefined) settings.aboutPoints = aboutPoints;

    if (featuresBadge !== undefined) settings.featuresBadge = featuresBadge;
    if (featuresTitle !== undefined) settings.featuresTitle = featuresTitle;
    if (featuresList !== undefined) settings.featuresList = featuresList;

    if (productsBadge !== undefined) settings.productsBadge = productsBadge;
    if (productsTitle !== undefined) settings.productsTitle = productsTitle;
    if (productsList !== undefined) settings.productsList = productsList;

    await settings.save();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. Project Gallery API
app.get('/api/gallery', async (req, res) => {
  try {
    const list = await GalleryItem.find({}).sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/gallery', authMiddleware, async (req, res) => {
  try {
    const { title, imageUrl, description } = req.body;
    if (!title || !imageUrl) {
      return res.status(400).json({ success: false, message: 'Title and Image URL are required.' });
    }
    const newItem = await GalleryItem.create({ title, imageUrl, description });
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/gallery/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await GalleryItem.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Gallery item not found.' });
    }
    res.json({ success: true, message: 'Gallery item deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 6. Lead Quotes API
app.post('/api/quotes', async (req, res) => {
  try {
    const { 
      full_name, company_name, phone, email, project_location, 
      quantity_required, products_required, additional_requirements, contact_method 
    } = req.body;

    if (!full_name || !phone || !email) {
      return res.status(400).json({ success: false, message: 'Full name, phone, and email are required.' });
    }

    const newQuote = await Quote.create({
      full_name, company_name, phone, email, project_location, 
      quantity_required, products_required, additional_requirements, contact_method
    });

    res.status(201).json({ success: true, data: newQuote });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/quotes', authMiddleware, async (req, res) => {
  try {
    const list = await Quote.find({}).sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/quotes/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Quote.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Quote request not found.' });
    }
    res.json({ success: true, message: 'Quote request deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// 7. Dealerships API
app.get('/api/dealerships', async (req, res) => {
  try {
    const list = await Dealership.find({}).sort({ createdAt: 1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/dealerships', authMiddleware, async (req, res) => {
  try {
    const { name, logoUrl } = req.body;
    if (!name || !logoUrl) {
      return res.status(400).json({ success: false, message: 'Name and Logo URL are required.' });
    }
    const newDealership = await Dealership.create({ name, logoUrl });
    res.status(201).json({ success: true, data: newDealership });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/dealerships/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Dealership.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Dealership not found.' });
    }
    res.json({ success: true, message: 'Dealership deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
app.get('/', (req, res) => {
  res.send('Server is Running and connected to MongoDB.');
});

app.listen(PORT, () =>
  console.log(`Server listening on http://localhost:${PORT}`)
);