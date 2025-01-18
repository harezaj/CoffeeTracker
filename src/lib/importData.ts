import { CoffeeBean } from "@/components/CoffeeCard";
import { createBean } from "./api";

const parsePrice = (price: string): number => {
  return Number(price.replace('$', ''));
};

const parseWeight = (oz: string): number => {
  // Convert oz to grams (1 oz ≈ 28.3495 g)
  return Math.round(Number(oz) * 28.3495);
};

const parseDoseAndTime = (doseTime: string | null): { gramsIn: number; mlOut: number; brewTime: number } => {
  if (!doseTime) return { gramsIn: 18, mlOut: 36, brewTime: 25 };
  
  const match = doseTime.match(/(\d+)g?\s*in\s*,?\s*(\d+)g?\s*out\s*in\s*(\d+)(?:-\d+)?s/);
  if (match) {
    return {
      gramsIn: Number(match[1]),
      mlOut: Number(match[2]),
      brewTime: Number(match[3])
    };
  }
  return { gramsIn: 18, mlOut: 36, brewTime: 25 };
};

const parseRoastLevel = (roast: string | null): string => {
  if (!roast) return "Medium";
  return roast as string;
};

const parseGrindSize = (grind: string | null): number => {
  if (!grind) return 15;
  return Number(grind);
};

export const importCoffeeBeans = async () => {
  const data = [
    {
      "Name": "Onyx Monarch",
      "Roast": "Dark",
      "Notes": "Did 10.5. 30s got me 50g",
      "Price": "$16.15",
      "Oz": "10",
      "Grind Setting": "10",
      "Dose and time": "19g in, 47g out in 23-27s"
    },
    {
      "Name": "Prodigal Milk Blend",
      "Roast": null,
      "Notes": null,
      "Price": "$14.50",
      "Oz": "8.81849",
      "Grind Setting": null,
      "Dose and time": null
    },
    {
      "Name": "B&W The Traditional",
      "Roast": "Dark",
      "Notes": null,
      "Price": "$15.20",
      "Oz": "12",
      "Grind Setting": null,
      "Dose and time": null
    },
    {
      "Name": "La Prima Cafe Studioso",
      "Roast": "Medium",
      "Notes": null,
      "Price": "$19.85",
      "Oz": "16",
      "Grind Setting": "11",
      "Dose and time": null
    },
    {
      "Name": "La Prima Bar",
      "Roast": "Medium Dark",
      "Notes": null,
      "Price": "$19.30",
      "Oz": "16",
      "Grind Setting": "12",
      "Dose and time": null
    },
    {
      "Name": "La Prima Miscela Bar",
      "Roast": "Light",
      "Notes": null,
      "Price": "$18.50",
      "Oz": "16",
      "Grind Setting": "12",
      "Dose and time": null
    },
    {
      "Name": "B&W The Classic",
      "Roast": "Medium Dark",
      "Notes": null,
      "Price": "$36.00",
      "Oz": "32",
      "Grind Setting": null,
      "Dose and time": "Ratio 1:2 in 24s"
    },
    {
      "Name": "Devocion Toro",
      "Roast": null,
      "Notes": null,
      "Price": "$18.00",
      "Oz": "12",
      "Grind Setting": "12",
      "Dose and time": "12"
    },
    {
      "Name": "Olympia Morning Sun",
      "Roast": "Medium Dark",
      "Notes": null,
      "Price": "$14.40",
      "Oz": "12",
      "Grind Setting": "11",
      "Dose and time": "22g in, 56g out in 25-30s"
    },
    {
      "Name": "Onyx Tropical Weather",
      "Roast": "Light",
      "Notes": "19g in , 46 out in 28s",
      "Price": "$18.70",
      "Oz": "10",
      "Grind Setting": "10",
      "Dose and time": "18g in, 50g out in 25s - might need to go half coarser"
    }
  ];

  console.log("Starting to import coffee beans...");
  
  for (const item of data) {
    if (!item.Name) continue;

    const { gramsIn, mlOut, brewTime } = parseDoseAndTime(item["Dose and time"]);
    
    const beanData = {
      name: item.Name,
      roaster: item.Name.split(" ")[0], // Extract roaster from name
      origin: "Not specified",
      roastLevel: parseRoastLevel(item.Roast),
      notes: item.Notes ? [item.Notes] : [],
      rank: 3, // Default rank
      gramsIn,
      mlOut,
      brewTime,
      temperature: 93, // Default temperature
      price: parsePrice(item.Price),
      weight: parseWeight(item.Oz),
      orderAgain: true, // Default to true
      grindSize: parseGrindSize(item["Grind Setting"])
    };

    try {
      await createBean(beanData);
      console.log(`Imported: ${item.Name}`);
    } catch (error) {
      console.error(`Failed to import ${item.Name}:`, error);
    }
  }

  console.log("Import completed");
};
