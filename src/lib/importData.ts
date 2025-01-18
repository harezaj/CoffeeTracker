import { CoffeeBean } from "@/components/CoffeeCard";
import { createBean } from "./api";

const parsePrice = (price: string): number => {
  return Number(price);
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

const parseNotes = (notes: string | null): string[] => {
  if (!notes) return [];
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
    if (!item.Name && !item.name) continue;

    // Handle both old format and new format
    const isNewFormat = !!item.name;
    
    if (isNewFormat) {
      try {
        // For beans exported with cost analysis
        if (item.costAnalysis?.costSettings) {
          parseCostAnalysis(item.costAnalysis);
        }
        
        // Remove the costAnalysis field before creating the bean
        const { costAnalysis, ...beanData } = item;
        await createBean(beanData);
        console.log(`Imported: ${item.name}`);
      } catch (error) {
        console.error(`Failed to import ${item.name}:`, error);
      }
    } else {
      // Handle old format import
      const { gramsIn, mlOut, brewTime } = parseDoseAndTime(item["Dose and time"]);
      
      const beanData = {
        name: item.Name,
        roaster: item.Name.split(" ")[0],
        origin: "Not specified",
        roastLevel: parseRoastLevel(item.Roast),
        notes: parseNotes(item.Notes),
        generalNotes: item["Dose and time"] || "",
        rank: 3,
        gramsIn,
        mlOut,
        brewTime,
        temperature: 93,
        price: parsePrice(item.Price),
        weight: parseWeight(item.Oz),
        orderAgain: true,
        grindSize: parseGrindSize(item["Grind Setting"]),
        purchaseCount: 1,
      };

      try {
        await createBean(beanData);
        console.log(`Imported: ${item.Name}`);
      } catch (error) {
        console.error(`Failed to import ${item.Name}:`, error);
      }
    }
  }

  console.log("Import completed");
};
