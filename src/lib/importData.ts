import { CoffeeBean } from "@/components/CoffeeCard";
import { createBean } from "./api";

const parsePrice = (price: string | number): number => {
  return Number(price);
};

const parseWeight = (weight: string | number): number => {
  return Number(weight);
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
  return roast;
};

const parseGrindSize = (grind: string | number | null): number => {
  if (!grind) return 15;
  return Number(grind);
};

const parseNotes = (notes: string[] | string | null): string[] => {
  if (!notes) return [];
  if (Array.isArray(notes)) return notes;
  return notes.split(',').map(note => note.trim());
};

const parseCostAnalysis = (costAnalysis: any) => {
  if (costAnalysis?.costSettings) {
    localStorage.setItem('costSettings', JSON.stringify(costAnalysis.costSettings));
  }
  return {};
};

export const importCoffeeData = async (data: any[]) => {
  console.log("Starting to import coffee beans...");
  
  for (const item of data) {
    if (!item.name) continue;

    try {
      // For beans exported with cost analysis
      if (item.costAnalysis?.costSettings) {
        parseCostAnalysis(item.costAnalysis);
      }
      
      const beanData = {
        name: item.name,
        roaster: item.roaster,
        origin: item.origin || "Not specified",
        roastLevel: parseRoastLevel(item.roastLevel),
        notes: parseNotes(item.notes),
        generalNotes: item.generalNotes || "",
        rank: Number(item.rank) || 3,
        gramsIn: Number(item.gramsIn) || 18,
        mlOut: Number(item.mlOut) || 36,
        brewTime: Number(item.brewTime) || 25,
        temperature: Number(item.temperature) || 93,
        price: parsePrice(item.price),
        weight: parseWeight(item.weight),
        orderAgain: item.orderAgain !== false,
        grindSize: parseGrindSize(item.grindSize),
        purchaseCount: Number(item.purchaseCount) || 1,
      };

      await createBean(beanData);
      console.log(`Imported: ${item.name}`);
    } catch (error) {
      console.error(`Failed to import ${item.name}:`, error);
    }
  }

  console.log("Import completed");
};