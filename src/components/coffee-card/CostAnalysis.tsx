import { DollarSign } from "lucide-react";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

interface CostAnalysisProps {
  costs: {
    costPerShot: string;
    shotsPerBag: number;
    costPerOz: string;
    costPerLatte: string;
  };
  volumeUnit: 'ml' | 'oz';
  onVolumeUnitChange: (value: 'ml' | 'oz') => void;
}

export function CostAnalysis({ costs, volumeUnit, onVolumeUnitChange }: CostAnalysisProps) {
  return (
    <AccordionItem value="cost-analysis" className="border-none">
      <AccordionTrigger className="hover:no-underline py-2 px-4 bg-gray-50 dark:bg-[#171717] rounded-lg">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          <span className="font-medium dark:text-white">Cost Analysis</span>
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
              <span className="text-gray-600">Cost per Shot</span>
              <span className="font-medium">${costs.costPerShot}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Shots per Bag</span>
              <span className="font-medium">{costs.shotsPerBag}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Cost per oz</span>
              <span className="font-medium">${costs.costPerOz}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Cost per Latte</span>
              <span className="font-medium">${costs.costPerLatte}</span>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}