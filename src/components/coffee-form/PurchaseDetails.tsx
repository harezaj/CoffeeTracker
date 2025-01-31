import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useState } from "react";

interface PurchaseDetailsProps {
  defaultValues: {
    price: number;
    weight: number;
  };
  weightUnit: 'g' | 'oz';
  onWeightUnitChange: (value: 'g' | 'oz') => void;
}

export function PurchaseDetails({ defaultValues, weightUnit, onWeightUnitChange }: PurchaseDetailsProps) {
  // Keep track of the displayed weight value
  const [displayWeight, setDisplayWeight] = useState(
    weightUnit === 'oz' 
      ? (defaultValues.weight / 28.3495).toFixed(2) 
      : defaultValues.weight.toString()
  );

  // Update displayed weight when unit changes
  useEffect(() => {
    const numWeight = parseFloat(displayWeight);
    if (isNaN(numWeight)) return;

    if (weightUnit === 'oz') {
      setDisplayWeight((numWeight / 28.3495).toFixed(2));
    } else {
      setDisplayWeight((numWeight * 28.3495).toFixed(2));
    }
  }, [weightUnit]);

  // Handle weight input changes
  const handleWeightChange = (value: string) => {
    setDisplayWeight(value);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="price" className="dark:text-gray-200">Price ($)</Label>
        <Input 
          id="price" 
          name="price" 
          type="number" 
          step="0.01" 
          defaultValue={defaultValues.price} 
          required 
          className="dark:bg-[#1A1A1A] dark:border-gray-700 dark:text-white" 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="weight" className="dark:text-gray-200">Weight</Label>
        <div className="flex gap-2">
          <Input 
            id="weight" 
            name="weight" 
            type="number"
            step="0.01"
            value={displayWeight}
            onChange={(e) => handleWeightChange(e.target.value)}
            required 
            className="flex-1 dark:bg-[#1A1A1A] dark:border-gray-700 dark:text-white"
          />
          <ToggleGroup
            type="single"
            value={weightUnit}
            onValueChange={(value) => value && onWeightUnitChange(value as 'g' | 'oz')}
            className="border rounded-md dark:border-gray-700"
          >
            <ToggleGroupItem value="g" className="px-2 py-1 dark:data-[state=on]:bg-gray-700">g</ToggleGroupItem>
            <ToggleGroupItem value="oz" className="px-2 py-1 dark:data-[state=on]:bg-gray-700">oz</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
}
