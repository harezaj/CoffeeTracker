import { CoffeeBean } from "@/components/CoffeeCard";

export const calculateCosts = (bean: CoffeeBean) => {
  const costSettings = localStorage.getItem('costSettings');
  const {
    milkPrice = 4.99,
    milkSize = 1000,
    milkPerLatte = 200,
    syrupPricePerLatte = 0.50,
  } = costSettings ? JSON.parse(costSettings) : {};

  const costPerGram = bean.price / bean.weight;
  const costPerShot = costPerGram * bean.gramsIn;
  const shotsPerBag = Math.floor(bean.weight / bean.gramsIn);
  const costPerOz = bean.price / (bean.weight / 28.35);

  const milkCostPerMl = milkPrice / milkSize;
  
  // Ensure all calculations return numbers
  const shotCost = isFinite(costPerShot) ? costPerShot : 0;
  const milkCost = isFinite(milkCostPerMl * milkPerLatte) ? milkCostPerMl * milkPerLatte : 0;
  const costPerLatte = shotCost + milkCost + syrupPricePerLatte;
  
  return {
    costPerGram: isFinite(costPerGram) ? costPerGram.toFixed(2) : "0.00",
    costPerShot: isFinite(costPerShot) ? costPerShot.toFixed(2) : "0.00",
    shotsPerBag,
    costPerOz: isFinite(costPerOz) ? costPerOz.toFixed(2) : "0.00",
    costPerLatte: isFinite(costPerLatte) ? costPerLatte.toFixed(2) : "0.00"
  };
};