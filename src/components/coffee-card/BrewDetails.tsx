import { Timer } from "lucide-react";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import type { CoffeeBean } from "../CoffeeCard";

interface BrewDetailsProps {
  bean: CoffeeBean;
  volumeUnit: 'ml' | 'oz';
  onVolumeUnitChange: (value: 'ml' | 'oz') => void;
  displayVolume: (ml: number) => number;
}

export function BrewDetails({ 
  bean, 
  volumeUnit, 
  onVolumeUnitChange,
  displayVolume 
}: BrewDetailsProps) {
  return (
    <AccordionItem value="brew-details" className="border-none">
      <AccordionTrigger className="hover:no-underline py-2 px-4 bg-gray-50 dark:bg-[#171717] rounded-lg">
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4" />
          <span className="font-medium dark:text-white">Brew Details</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4 px-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">Volume Unit</span>
          <ToggleGroup
            type="single"
            value={volumeUnit}
            onValueChange={(value) => value && onVolumeUnitChange(value as 'ml' | 'oz')}
            className="border rounded-md"
          >
            <ToggleGroupItem value="ml" className="px-2 py-1">ml</ToggleGroupItem>
            <ToggleGroupItem value="oz" className="px-2 py-1">oz</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Grind Size</span>
              <span className="font-medium">{bean.grindSize}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Dose</span>
              <span className="font-medium">{bean.gramsIn}g</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Yield</span>
              <span className="font-medium">{displayVolume(bean.mlOut)}{volumeUnit}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Time</span>
              <span className="font-medium">{bean.brewTime}s</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Temperature</span>
              <span className="font-medium">{bean.temperature}°C</span>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}