import { CoffeeBean } from "@/components/CoffeeCard";

export const calculateCosts = (bean: CoffeeBean) => {
  const costSettings = localStorage.getItem('costSettings');
  const {
    milkPrice = 4.99,
    milkSize = 1000, // in ml
    milkPerLatte = 200, // in ml
    syrupPricePerLatte = 0.50,
  } = costSettings ? JSON.parse(costSettings) : {};

  // Convert all inputs to numbers and validate
  const beanPrice = Number(bean.price) || 0;
  const beanWeight = Number(bean.weight) || 1; // prevent division by zero
  const beanGramsIn = Number(bean.gramsIn) || 1; // prevent division by zero
  const milkPriceNum = Number(milkPrice) || 0;
  const milkSizeNum = Number(milkSize) || 1; // prevent division by zero
  const milkPerLatteNum = Number(milkPerLatte) || 0;
  const syrupPrice = Number(syrupPricePerLatte) || 0;

  // Calculate cost per gram of coffee
  const costPerGram = beanPrice / beanWeight;
  
  // Calculate cost for one shot of espresso
  const costPerShot = costPerGram * beanGramsIn;
  
  // Calculate how many shots you can get from one bag
  const shotsPerBag = Math.floor(beanWeight / beanGramsIn);
  
  // Calculate cost per ounce (28.35g = 1oz)
  const costPerOz = beanPrice / (beanWeight / 28.35);

  // Calculate milk cost per ml
  const milkCostPerMl = milkPriceNum / milkSizeNum;
  
  // Calculate total milk cost for one latte
  const milkCostPerLatte = milkCostPerMl * milkPerLatteNum;
  
  // Calculate total cost for one latte (shot + milk + syrup)
  const costPerLatte = costPerShot + milkCostPerLatte + syrupPrice;
  
  return {
    costPerGram: costPerGram > 0 ? costPerGram.toFixed(2) : "0.00",
    costPerShot: costPerShot > 0 ? costPerShot.toFixed(2) : "0.00",
    shotsPerBag: shotsPerBag > 0 ? shotsPerBag : 0,
    costPerOz: costPerOz > 0 ? costPerOz.toFixed(2) : "0.00",
    costPerLatte: costPerLatte > 0 ? costPerLatte.toFixed(2) : "0.00"
  };
};