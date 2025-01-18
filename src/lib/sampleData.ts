import { createBean } from "./api";

const sampleBeans = [
  {
    name: "Ethiopia Yirgacheffe",
    roaster: "Blue Bottle Coffee",
    origin: "Ethiopia",
    roastLevel: "Light",
    notes: ["Floral", "Citrus", "Bergamot"],
    rank: 5,
    gramsIn: 18,
    mlOut: 36,
    brewTime: 28,
    temperature: 94,
    price: 19.99,
    weight: 340,
    orderAgain: true,
    grindSize: 15,
    purchaseCount: 1
  },
  {
    name: "Guatemala Antigua",
    roaster: "Stumptown Coffee",
    origin: "Guatemala",
    roastLevel: "Medium",
    notes: ["Chocolate", "Orange", "Caramel"],
    rank: 4,
    gramsIn: 18,
    mlOut: 36,
    brewTime: 30,
    temperature: 93,
    price: 16.99,
    weight: 340,
    orderAgain: true,
    grindSize: 16,
    purchaseCount: 1
  },
  {
    name: "Sumatra Mandheling",
    roaster: "Intelligentsia",
    origin: "Indonesia",
    roastLevel: "Dark",
    notes: ["Earthy", "Cedar", "Dark Chocolate"],
    rank: 3,
    gramsIn: 18,
    mlOut: 36,
    brewTime: 32,
    temperature: 92,
    price: 18.99,
    weight: 340,
    orderAgain: false,
    grindSize: 14,
    purchaseCount: 1
  },
  {
    name: "Kenya AA",
    roaster: "Counter Culture",
    origin: "Kenya",
    roastLevel: "Medium-Light",
    notes: ["Blackberry", "Lemon", "Brown Sugar"],
    rank: 5,
    gramsIn: 18,
    mlOut: 36,
    brewTime: 29,
    temperature: 94,
    price: 21.99,
    weight: 340,
    orderAgain: true,
    grindSize: 15,
    purchaseCount: 1
  },
  {
    name: "Colombia Supremo",
    roaster: "Verve Coffee",
    origin: "Colombia",
    roastLevel: "Medium",
    notes: ["Nuts", "Caramel", "Red Apple"],
    rank: 4,
    gramsIn: 18,
    mlOut: 36,
    brewTime: 30,
    temperature: 93,
    price: 17.99,
    weight: 340,
    orderAgain: true,
    grindSize: 16,
    purchaseCount: 1
  }
];

export const populateJournal = async () => {
  console.log("Starting to populate journal with sample beans...");
  for (const bean of sampleBeans) {
    try {
      await createBean(bean);
      console.log(`Added ${bean.name} to journal`);
    } catch (error) {
      console.error(`Error adding ${bean.name}:`, error);
    }
  }
  console.log("Finished populating journal");
};