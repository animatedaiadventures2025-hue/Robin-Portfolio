// ============================================
// Nomad Gear — Product Data
// ============================================

const products = [
  {
    id: 1,
    name: "TrailMaster 65L Backpack",
    category: "Backpacks",
    price: 189,
    rating: 4.8,
    description: "A rugged 65-liter backpack designed for multi-day treks. Features adjustable suspension, rain cover, and hydration compatibility. Built with ripstop nylon for durability on the toughest trails.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop",
    badge: null
  },
  {
    id: 2,
    name: "SummitLite 2P Tent",
    category: "Tents",
    price: 299,
    rating: 4.7,
    description: "Ultralight 2-person tent weighing just 3.2 lbs. Quick-pitch design sets up in under 3 minutes. Full mesh inner for stargazing with a waterproof fly for storm protection.",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=600&fit=crop",
    badge: "New"
  },
  {
    id: 3,
    name: "NomadShell Rain Jacket",
    category: "Clothing",
    price: 129,
    originalPrice: 159,
    rating: 4.6,
    description: "3-layer waterproof-breathable jacket with fully sealed seams. Pit zips for ventilation, adjustable hood, and packable design that stuffs into its own pocket.",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=600&fit=crop",
    badge: "Sale"
  },
  {
    id: 4,
    name: "BaseCamp Sleeping Bag",
    category: "Gear",
    price: 149,
    rating: 4.5,
    description: "Comfort-rated to 20°F with premium 650-fill down insulation. Contoured hood, draft collar, and full-length zipper with anti-snag strip. Weighs just 2.8 lbs.",
    image: "https://images.pexels.com/photos/2582818/pexels-photo-2582818.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&dpr=1",
    badge: null
  },
  {
    id: 5,
    name: "RidgeWalker Hiking Boots",
    category: "Clothing",
    price: 179,
    rating: 4.9,
    description: "Waterproof full-grain leather boots with Vibram outsoles. Ankle support system and cushioned midsole for all-day comfort on rocky terrain. Break-in time: minimal.",
    image: "https://images.unsplash.com/photo-1520219306100-ec4afeeefe58?w=600&h=600&fit=crop",
    badge: null
  },
  {
    id: 6,
    name: "Pathfinder Trekking Poles",
    category: "Gear",
    price: 79,
    originalPrice: 99,
    rating: 4.4,
    description: "Carbon fiber trekking poles with cork grips and adjustable wrist straps. 3-section collapsible design packs down to 24 inches. Includes rubber tips and snow baskets.",
    image: "https://images.pexels.com/photos/1659437/pexels-photo-1659437.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&dpr=1",
    badge: "Sale"
  },
  {
    id: 7,
    name: "Horizon 40L Daypack",
    category: "Backpacks",
    price: 89,
    rating: 4.6,
    description: "Versatile 40-liter daypack with ventilated back panel and multiple access points. Laptop sleeve, hip belt pockets, and trekking pole attachment. Perfect for day hikes and travel.",
    image: "https://images.unsplash.com/photo-1622260614153-03223fb72052?w=600&h=600&fit=crop",
    badge: null
  },
  {
    id: 8,
    name: "AlpineDome 4P Tent",
    category: "Tents",
    price: 449,
    rating: 4.8,
    description: "4-season geodesic dome tent built for extreme conditions. Withstands 60+ mph winds with a snow load rating of 50 lbs/sq ft. Two doors, two vestibules, sleeps 4 comfortably.",
    image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600&h=600&fit=crop",
    badge: null
  },
  {
    id: 9,
    name: "SunGrid 20W Panel",
    category: "Gear",
    price: 59,
    rating: 4.3,
    description: "High-efficiency 20-watt solar panel for home and cabin use. Monocrystalline cells deliver consistent power output. Weather-resistant aluminum frame with 25-year performance warranty.",
    image: "https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&dpr=1",
    badge: "New"
  },
  {
    id: 10,
    name: "CloudRest Hammock",
    category: "Gear",
    price: 69,
    rating: 4.7,
    description: "Ultra-comfortable parachute nylon hammock with integrated bug net. Supports up to 500 lbs. Includes tree straps, carabiners, and compression sack. Sets up in 60 seconds.",
    image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=600&h=600&fit=crop",
    badge: null
  },
  {
    id: 11,
    name: "ThermoFlex Base Layer",
    category: "Clothing",
    price: 49,
    rating: 4.5,
    description: "Merino wool blend base layer with 4-way stretch. Naturally odor-resistant and moisture-wicking. Flatlock seams prevent chafing. Ideal for layering in cold conditions.",
    image: "https://images.pexels.com/photos/8436677/pexels-photo-8436677.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&dpr=1",
    badge: null
  },
  {
    id: 12,
    name: "Expedition Duffel 90L",
    category: "Backpacks",
    price: 139,
    originalPrice: 169,
    rating: 4.6,
    description: "Bombproof 90-liter duffel with backpack straps and reinforced bottom. Lockable zippers, internal mesh pockets, and ID window. Built to survive baggage handlers worldwide.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop",
    badge: "Sale"
  }
];
