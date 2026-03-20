// migrateProducts.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const MERCH = [
  {
    name: "Nexora 'Source Code' Hoodie (White)",
    price: 2800, 
    image: "/images/White.png", 
    tag: "Heavyweight Cotton",
    shipsIn: "3-5 Days",
    sizes: ["M", "L", "XL", "XXL"],
    category: "Hoodies",
    active: true
  },
   {
    name: "Nexora 'Source Code' Hoodie (Black)",
    price: 2800, 
    image: "/images/Black.png", 
    tag: "Heavyweight Cotton",
    shipsIn: "3-5 Days",
    sizes: ["M", "L", "XL", "XXL"],
    category: "Hoodies",
    active: true
  },
   {
    name: "Nexora 'Source Code' Hoodie (Beige)",
    price: 2800, 
    image: "/images/Beige.png", 
    tag: "Heavyweight Cotton",
    shipsIn: "3-5 Days",
    sizes: ["M", "L", "XL", "XXL"],
    category: "Hoodies",
    active: true
  },
  {
    name: "Nexora 'Source Code' Hoodie (Burgundy)",
    price: 2800, 
    image: "/images/Burgundy.png", 
    tag: "Heavyweight Cotton",
    shipsIn: "3-5 Days",
    sizes: ["M", "L", "XL", "XXL"],
    category: "Hoodies",
    active: true
  },
  {
    name: "Agency Sweatshirt (Burgundy)",
    price: 2000,
    image: "/images/Burgundy_sweat.png",
    tag: "Limited Drop",
    shipsIn: "3-5 Days",
    sizes: ["S", "M", "L", "XL"],
    category: "Sweatshirts",
    active: true
  },
  {
    name: "Agency Sweatshirt (White)",
    price: 2000,
    image: "/images/White_sweat.png",
    tag: "Limited Drop",
    shipsIn: "3-5 Days",
    sizes: ["S", "M", "L", "XL"],
    category: "Sweatshirts",
    active: true
  },
  {
    name: "Agency Sweatshirt (Beige)",
    price: 2000,
    image: "/images/Beige_sweat.png",
    tag: "Limited Drop",
    shipsIn: "3-5 Days",
    sizes: ["S", "M", "L", "XL"],
    category: "Sweatshirts",
    active: true
  },
  {
    name: "Agency Sweatshirt (Black)",
    price: 2000,
    image: "/images/Black_sweat.png",
    tag: "Limited Drop",
    shipsIn: "3-5 Days",
    sizes: ["S", "M", "L", "XL"],
    category: "Sweatshirts",
    active: true
  },
  {
    name: "Nexora Developer Tee (White)",
    price: 750,
    image: "/images/White_tee.png",
    tag: "Essential",
    shipsIn: "2 Days",
    sizes: ["S", "M", "L", "XL"],
    category: "T-Shirts",
    active: true
  },
  {
    name: "Nexora Developer Tee (Black)",
    price: 750,
    image: "/images/Black_tee.png",
    tag: "Essential",
    shipsIn: "2 Days",
    sizes: ["S", "M", "L", "XL"],
    category: "T-Shirts",
    active: true
  },
  {
    name: "Nexora Developer Tee (Beige)",
    price: 750,
    image: "/images/Beige_tee.png",
    tag: "Essential",
    shipsIn: "2 Days",
    sizes: ["S", "M", "L", "XL"],
    category: "T-Shirts",
    active: true
  },
  {
    name: "Nexora Developer Tee (Burgundy)",
    price: 750,
    image: "/images/Burgundy_tee.png",
    tag: "Essential",
    shipsIn: "2 Days",
    sizes: ["S", "M", "L", "XL"],
    category: "T-Shirts",
    active: true
  }
];

async function migrate() {
  console.log("Starting migration...");
  for (const item of MERCH) {
    try {
      await addDoc(collection(db, "products"), item);
      console.log(`Migrated: ${item.name}`);
    } catch (e) {
      console.error(`Error migrating ${item.name}:`, e);
    }
  }
  console.log("Migration complete!");
}

migrate();
