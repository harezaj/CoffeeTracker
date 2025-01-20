import { ExternalLink, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UpdateCoffeeForm } from "../UpdateCoffeeForm";
import { CardHeader, CardTitle } from "@/components/ui/card";
import type { CoffeeBean } from "../CoffeeCard";

interface CoffeeCardHeaderProps {
  bean: CoffeeBean;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Omit<CoffeeBean, "id">>) => void;
  isRecommendation?: boolean;
  onPurchaseClick?: () => void;
}

export function CoffeeCardHeader({ 
  bean, 
  onDelete, 
  onUpdate, 
  isRecommendation,
  onPurchaseClick 
}: CoffeeCardHeaderProps) {
  return (
    <CardHeader className="bg-gradient-to-br from-white dark:from-[#171717] to-gray-50 dark:to-[#121212] border-b border-gray-100 dark:border-gray-800 pb-4">
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
            {bean.name}
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">by {bean.roaster}</p>
          {!isRecommendation && (
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Purchased {bean.purchaseCount || 1} time{(bean.purchaseCount || 1) !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isRecommendation ? (
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
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-green-600"
                onClick={onPurchaseClick}
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
            </>
          )}
        </div>
      </div>
    </CardHeader>
  );
}