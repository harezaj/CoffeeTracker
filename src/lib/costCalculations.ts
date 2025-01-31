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
  const costPerOz = ((bean.price / (bean.weight / 28.35)));

  const milkCostPerMl = milkPrice / milkSize;
  
  const costPerLatte = 
    costPerShot + 
    (milkCostPerMl * milkPerLatte) + 
    syrupPricePerLatte;
  
  return {
    costPerGram: costPerGram.toFixed(2),
    costPerShot: costPerShot.toFixed(2),
    shotsPerBag,
    costPerOz: costPerOz.toFixed(2),
    costPerLatte: costPerLatte.toFixed(2)
  };
};