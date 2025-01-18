import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UpdateCoffeeForm } from "./UpdateCoffeeForm";
import { Trash2, Star, DollarSign, Coffee, Timer, Plus } from "lucide-react";
import { PurchaseModal } from "./PurchaseModal";
import { calculateCosts } from "@/lib/costCalculations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { useState } from "react";

export interface CoffeeBean {
  id: string;
  roaster: string;
  name: string;
  origin: string;
  roastLevel: string;
  notes: string[];
  generalNotes?: string;
  rank: number;
  gramsIn: number;
  mlOut: number;
  brewTime: number;
  temperature: number;
  price: number;
  weight: number;
  orderAgain: boolean;
  grindSize: number;
  purchaseCount: number;
}

export interface CoffeeCardProps {
  bean: CoffeeBean;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Omit<CoffeeBean, "id">>) => void;
  isRecommendation?: boolean;
}

const convertToOz = (ml: number) => (ml / 29.5735).toFixed(1);
const convertToKg = (oz: number) => (oz * 0.0283495).toFixed(2);

export function CoffeeCard({ bean, onDelete, onUpdate, isRecommendation = false }: CoffeeCardProps) {
  const costs = calculateCosts(bean);
  const [volumeUnit, setVolumeUnit] = useState<'ml' | 'oz'>('ml');
  const [weightUnit, setWeightUnit] = useState<'oz' | 'kg'>('oz');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const displayVolume = (ml: number) => {
    return volumeUnit === 'ml' ? ml : convertToOz(ml);
  };

  const displayWeight = (oz: number) => {
    return weightUnit === 'oz' ? oz.toFixed(1) : convertToKg(oz);
  };

  const handlePurchase = (price: number, weight: number, quantity: number) => {
    if (onUpdate) {
      onUpdate(bean.id, {
        price,
        weight,
        purchaseCount: (bean.purchaseCount || 0) + quantity,
      });
    }
  };

  if (isRecommendation) {
    return (
      <Card className="w-full overflow-hidden group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-900 backdrop-blur-sm border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700">
        <CardHeader className="bg-gradient-to-br from-white dark:from-gray-800 to-gray-50 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800 pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                {bean.name}
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">by {bean.roaster}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400"
              asChild
            >
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(
                  `${bean.roaster} ${bean.name} coffee`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-3 space-y-3 dark:bg-gray-900">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">${bean.price}</span>
            <span className="text-gray-600 dark:text-gray-300">{(bean.weight / 28.35).toFixed(1)} oz</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {bean.notes.map((note) => (
              <span
                key={note}
                className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {note}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-900 backdrop-blur-sm border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700">
      <CardHeader className="bg-gradient-to-br from-white dark:from-gray-800 to-gray-50 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
              {bean.name}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">by {bean.roaster}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Purchased {bean.purchaseCount || 1} time{(bean.purchaseCount || 1) !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-green-600"
              onClick={() => setShowPurchaseModal(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
            {onUpdate && <UpdateCoffeeForm bean={bean} onUpdate={onUpdate} />}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-red-600"
                onClick={() => onDelete(bean.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-3 dark:bg-gray-900">
        <div className="flex flex-wrap gap-2 mb-3">
          {bean.notes.map((note) => (
            <span
              key={note}
              className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {note}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 transition-colors ${
                  i < bean.rank
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
            bean.orderAgain 
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}>
            {bean.orderAgain ? "Will Order Again" : "Won't Order Again"}
          </span>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="bean-details" className="border-none">
            <AccordionTrigger className="hover:no-underline py-2 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
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
                  onValueChange={(value) => value && setWeightUnit(value as 'oz' | 'kg')}
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

          <AccordionItem value="brew-details" className="border-none">
            <AccordionTrigger className="hover:no-underline py-2 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
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
                  onValueChange={(value) => value && setVolumeUnit(value as 'ml' | 'oz')}
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

          <AccordionItem value="cost-analysis" className="border-none">
            <AccordionTrigger className="hover:no-underline py-2 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
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
                  onValueChange={(value) => value && setVolumeUnit(value as 'ml' | 'oz')}
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
        </Accordion>
      </CardContent>

      <PurchaseModal
        open={showPurchaseModal}
        onOpenChange={setShowPurchaseModal}
        defaultPrice={bean.price}
        defaultWeight={bean.weight}
        onSubmit={handlePurchase}
      />
    </Card>
  );
}
