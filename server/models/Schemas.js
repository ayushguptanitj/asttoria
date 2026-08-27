import mongoose from 'mongoose';

// --- Category Schema ---
const CategorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  label: { type: String, required: true }
});
// --- Custom Filter Schema ---
const CustomFilterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  options: [{ type: String, required: true }]
});
// --- Product Schema ---
const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true }, // Maps to Category.id
  short: { type: String, required: true },
  img: { type: String, default: '' },
  dimensions: { type: String, default: '' },
  specs: [{
    label: { type: String, required: true },
    value: { type: String, required: true }
  }],
  applications: [{ type: String }],
  sizes: [{ type: String }],
  company: { type: String, default: '' },
  customFilters: [{
    name: { type: String, required: true },
    value: { type: String, required: true }
  }],
  brochureUrl: { type: String, default: '' }
});

// --- Homepage Settings Schema ---
const HomepageSettingsSchema = new mongoose.Schema({
  // Hero Section
  heroBadge: { type: String, default: 'Gyproc Saint-Gobain Official Dealer' },
  heroTitle: { type: String, default: 'Premium False Ceiling & Partition Framework Solutions' },
  heroSubtitle: { type: String, default: 'Manufacturing and supplying ceiling systems, partition frameworks, insulation channels, T-grid systems, gypsum accessories and industrial framing products since 1996.' },
  heroBgImage: { type: String, default: 'https://images.pexels.com/photos/18289606/pexels-photo-18289606.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  heroStats: [{
    num: { type: String, required: true },
    lbl: { type: String, required: true }
  }],

  // About Section
  aboutBadge: { type: String, default: 'About ASTTORIA' },
  aboutTitle: { type: String, default: 'Trusted Since 1996' },
  aboutDescription: { type: String, default: 'ASTTORIA is a leading supplier and manufacturer of false ceiling frameworks, POP sections, partition channels, insulation systems, gypsum accessories and T-grid products. We provide customized solutions for residential, commercial and industrial projects.' },
  aboutImage: { type: String, default: 'https://images.pexels.com/photos/30990849/pexels-photo-30990849.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  aboutPoints: [{ type: String }],

  // Features Section
  featuresBadge: { type: String, default: 'Why ASTTORIA' },
  featuresTitle: { type: String, default: 'Built on precision. Backed by experience.' },
  featuresList: [{
    title: { type: String, required: true },
    desc: { type: String, required: true }
  }],

  // Products Section
  productsBadge: { type: String, default: 'Product Range' },
  productsTitle: { type: String, default: 'Complete framing & ceiling ecosystem' },
  productsList: [{
    id: { type: String, required: true },
    num: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    img: { type: String, required: true }
  }]
});

// --- Gallery Item Schema ---
const GalleryItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// --- Quote / Inquiry Schema ---
const QuoteSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  company_name: { type: String, default: '' },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  project_location: { type: String, default: '' },
  quantity_required: { type: String, default: '' },
  products_required: [{ type: String }],
  additional_requirements: { type: String, default: '' },
  contact_method: { type: String, default: 'Phone' },
  createdAt: { type: Date, default: Date.now }
});

// --- Dealership Schema ---
const DealershipSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Category = mongoose.model('Category', CategorySchema);
export const Product = mongoose.model('Product', ProductSchema);
export const HomepageSettings = mongoose.model('HomepageSettings', HomepageSettingsSchema);
export const GalleryItem = mongoose.model('GalleryItem', GalleryItemSchema);
export const Quote = mongoose.model('Quote', QuoteSchema);
export const Dealership = mongoose.model('Dealership', DealershipSchema);
export const CustomFilter = mongoose.model('CustomFilter', CustomFilterSchema);

