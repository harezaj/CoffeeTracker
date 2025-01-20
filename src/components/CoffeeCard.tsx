import { Card, CardContent } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { useState } from "react";
import { calculateCosts } from "@/lib/costCalculations";
import { PurchaseModal } from "./PurchaseModal";
import { CoffeeCardHeader } from "./coffee-card/CoffeeCardHeader";
import { TastingNotes } from "./coffee-card/TastingNotes";
import { BeanRating } from "./coffee-card/BeanRating";
import { BeanDetails } from "./coffee-card/BeanDetails";
import { BrewDetails } from "./coffee-card/BrewDetails";
import { CostAnalysis } from "./coffee-card/CostAnalysis";

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

export function CoffeeCard({ bean, onDelete, onUpdate, isRecommendation = false }: CoffeeCardProps) {
  const costs = calculateCosts(bean);
  const [volumeUnit, setVolumeUnit] = useState<'ml' | 'oz'>('ml');
  const [weightUnit, setWeightUnit] = useState<'oz' | 'kg'>('oz');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const toTitleCase = (str: string) => {
    if (!str) return '';
    return str.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const displayVolume = (ml: number) => {
    return volumeUnit === 'ml' ? ml : Number(convertToOz(ml));
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
      <Card className="w-full overflow-hidden group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-[#121212] backdrop-blur-sm border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700">
        <CoffeeCardHeader bean={bean} isRecommendation={true} />
        <CardContent className="pt-3 space-y-3 dark:bg-[#121212]">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">${bean.price}</span>
            <span className="text-gray-600 dark:text-gray-300">{(bean.weight / 28.35).toFixed(1)} oz</span>
          </div>
          <TastingNotes notes={bean.notes} toTitleCase={toTitleCase} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-[#121212] backdrop-blur-sm border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700">
      <CoffeeCardHeader
        bean={bean}
        onDelete={onDelete}
        onUpdate={onUpdate}
        onPurchaseClick={() => setShowPurchaseModal(true)}
      />
      <CardContent className="pt-3 dark:bg-[#121212]">
        <TastingNotes notes={bean.notes} toTitleCase={toTitleCase} />
        <BeanRating rank={bean.rank} orderAgain={bean.orderAgain} />

        <Accordion type="single" collapsible className="space-y-4">
          <BeanDetails
            bean={bean}
            weightUnit={weightUnit}
            onWeightUnitChange={setWeightUnit}
          />
          <BrewDetails
            bean={bean}
            volumeUnit={volumeUnit}
            onVolumeUnitChange={setVolumeUnit}
            displayVolume={displayVolume}
          />
          <CostAnalysis
            costs={costs}
            volumeUnit={volumeUnit}
            onVolumeUnitChange={setVolumeUnit}
          />
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