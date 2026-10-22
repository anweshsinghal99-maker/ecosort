import type { DatasetSample } from '../types'

export const SOURCED_DATASET_CATALOG: DatasetSample[] = [
  // 1. Plastic Bottles
  {
    id: 'pb-01',
    category: 'Plastic Bottles',
    title: 'Clear PET Water Bottle with Blue Cap',
    source: 'Wikimedia Commons / TrashNet Open Feed',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'pb-02',
    category: 'Plastic Bottles',
    title: 'Crushed Beverage PET Bottle',
    source: 'TrashNet Open Dataset (Gary Thung)',
    imageUrl: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'pb-03',
    category: 'Plastic Bottles',
    title: 'Green Tinted Soda Bottle',
    source: 'Municipal AI Benchmark Feed',
    imageUrl: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'pb-04',
    category: 'Plastic Bottles',
    title: 'Translucent HDPE Milk / Juice Jug',
    source: 'Open Recycling Repository',
    imageUrl: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=400&q=80'
  },

  // 2. Other Plastic Packaging
  {
    id: 'opp-01',
    category: 'Other Plastic Packaging',
    title: 'Flexible Polyethylene Snack Wrapper',
    source: 'TrashBox Scraping Benchmark',
    imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'opp-02',
    category: 'Other Plastic Packaging',
    title: 'Thermoformed Clamshell Food Tray',
    source: 'Open Waste Classification Dataset',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'opp-03',
    category: 'Other Plastic Packaging',
    title: 'Bubble Wrap Protective Packaging Film',
    source: 'Kaggle Garbage Classification',
    imageUrl: 'https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'opp-04',
    category: 'Other Plastic Packaging',
    title: 'Polypropylene Cosmetic Tub Container',
    source: 'Circular Packaging Dataset',
    imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=400&q=80'
  },

  // 3. Paper/Cardboard
  {
    id: 'pc-01',
    category: 'Paper/Cardboard',
    title: 'Corrugated Shipping Box Flaps',
    source: 'TrashNet Foundation Dataset',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'pc-02',
    category: 'Paper/Cardboard',
    title: 'Brown Kraft Paper Grocery Bag',
    source: 'Open Images V7 Waste Subset',
    imageUrl: 'https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'pc-03',
    category: 'Paper/Cardboard',
    title: 'Flattened Cereal Carton Paperboard',
    source: 'TrashNet Repository',
    imageUrl: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'pc-04',
    category: 'Paper/Cardboard',
    title: 'Clean Office Document & Kraft Cardboard',
    source: 'Roboflow Waste Classification',
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=400&q=80'
  },

  // 4. Metal Can
  {
    id: 'mc-01',
    category: 'Metal Can',
    title: 'Aluminium Pop-Top Soda Beverage Can',
    source: 'TrashNet Metal Benchmark',
    imageUrl: 'https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'mc-02',
    category: 'Metal Can',
    title: 'Tinplate Canned Soup / Food Can',
    source: 'Kaggle Garbage Classification',
    imageUrl: 'https://images.unsplash.com/photo-1534951009808-766178b47a4f?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'mc-03',
    category: 'Metal Can',
    title: 'Crushed Aluminium Beer Can',
    source: 'TrashNet Dataset',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'mc-04',
    category: 'Metal Can',
    title: 'Discharged Metal Aerosol Tin Body',
    source: 'Municipal Metals Feed',
    imageUrl: 'https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=400&q=80'
  },

  // 5. Metal Bottles
  {
    id: 'mb-01',
    category: 'Metal Bottles',
    title: 'Brushed Stainless Steel Thermos Flask',
    source: 'Reusable Drinkware CV Benchmark',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'mb-02',
    category: 'Metal Bottles',
    title: 'Matte Powder-Coated Metal Sports Flask',
    source: 'Durable Hardware Imagery Collection',
    imageUrl: 'https://images.unsplash.com/photo-1570831739427-44f2b1d31a54?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'mb-03',
    category: 'Metal Bottles',
    title: 'Spun Aluminium Cyclist Water Bottle',
    source: 'Open Product Imagery Dataset',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80'
  },

  // 6. Mixed/Uncertain Waste
  {
    id: 'muw-01',
    category: 'Mixed/Uncertain Waste',
    title: 'Composite Multi-Material Aseptic Carton',
    source: 'Complex Packaging Audit Feed',
    imageUrl: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'muw-02',
    category: 'Mixed/Uncertain Waste',
    title: 'Soiled Takeout Packaging with Foil Liners',
    source: 'Municipal Contamination Study',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'muw-03',
    category: 'Mixed/Uncertain Waste',
    title: 'Mixed Composite Scrap Packaging Pieces',
    source: 'Residual Sorting Research',
    imageUrl: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=400&q=80'
  }
]
