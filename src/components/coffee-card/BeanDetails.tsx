import { Coffee } from "lucide-react";
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

interface BeanDetailsProps {
  bean: CoffeeBean;
  weightUnit: 'oz' | 'kg';
  onWeightUnitChange: (value: 'oz' | 'kg') => void;
}

export function BeanDetails({ bean, weightUnit, onWeightUnitChange }: BeanDetailsProps) {
  return (
    <AccordionItem value="bean-details" className="border-none">
      <AccordionTrigger className="hover:no-underline py-2 px-4 bg-gray-50 dark:bg-[#171717] rounded-lg">
        <div className="flex items-center gap-2">
          <Coffee className="h-4 w-4" />
          <span className="font-medium dark:text-white">Bean Details</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4 px-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">Weight Unit</span>
          <ToggleGroup
            type="single"
            value={weightUnit}
            onValueChange={(value) => value && onWeightUnitChange(value as 'oz' | 'kg')}
            className="border rounded-md"
          >
            <ToggleGroupItem value="oz" className="px-2 py-1">oz</ToggleGroupItem>
            <ToggleGroupItem value="kg" className="px-2 py-1">kg</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Origin</span>
              <span className="text-gray-600">{bean.origin}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Roast</span>
              <span className="text-gray-600">{bean.roastLevel}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Price</span>
              <span className="text-gray-600">${bean.price}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Weight</span>
              <span className="text-gray-600">
                {weightUnit === 'oz' ? (bean.weight / 28.35).toFixed(1) : (bean.weight / 1000).toFixed(2)} {weightUnit}
              </span>
            </div>
          </div>
        </div>
        {bean.generalNotes && (
          <div className="mt-4">
            <h4 className="text-gray-700 font-medium mb-2">Notes</h4>
            <p className="text-gray-600 whitespace-pre-wrap">{bean.generalNotes}</p>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}