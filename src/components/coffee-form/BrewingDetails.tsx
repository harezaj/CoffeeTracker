import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BrewingDetailsProps {
  defaultValues: {
    gramsIn: number;
    mlOut: number;
    brewTime: number;
    temperature: number;
    grindSize: number;
  };
}

export function BrewingDetails({ defaultValues }: BrewingDetailsProps) {
  return (
    <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
      <h4 className="text-gray-900 dark:text-white font-medium mb-4">Brew Details</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gramsIn" className="dark:text-gray-200">Dose (g)</Label>
          <Input 
            id="gramsIn" 
            name="gramsIn" 
            type="number" 
            step="0.1" 
            defaultValue={defaultValues.gramsIn} 
            required 
            className="dark:bg-[#1A1A1A] dark:border-gray-700 dark:text-white" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mlOut" className="dark:text-gray-200">Yield (ml)</Label>
          <Input 
            id="mlOut" 
            name="mlOut" 
            type="number" 
            step="0.1" 
            defaultValue={defaultValues.mlOut} 
            required 
            className="dark:bg-[#1A1A1A] dark:border-gray-700 dark:text-white" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="brewTime" className="dark:text-gray-200">Brew Time (s)</Label>
          <Input 
            id="brewTime" 
            name="brewTime" 
            type="number" 
            defaultValue={defaultValues.brewTime} 
            required 
            className="dark:bg-[#1A1A1A] dark:border-gray-700 dark:text-white" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="temperature" className="dark:text-gray-200">Temperature (°C)</Label>
          <Input 
            id="temperature" 
            name="temperature" 
            type="number" 
            defaultValue={defaultValues.temperature} 
            required 
            className="dark:bg-[#1A1A1A] dark:border-gray-700 dark:text-white" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="grindSize" className="dark:text-gray-200">Grind Size</Label>
          <Input 
            id="grindSize" 
            name="grindSize" 
            type="number" 
            step="0.1" 
            defaultValue={defaultValues.grindSize} 
            required 
            className="dark:bg-[#1A1A1A] dark:border-gray-700 dark:text-white" 
          />
        </div>
      </div>
    </div>
  );
}