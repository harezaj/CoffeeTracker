import { CoffeeBean } from "./CoffeeCard";
import { ChevronRight } from "lucide-react";
import { Star } from "lucide-react";

interface CoffeeListItemProps {
  bean: CoffeeBean;
  onClick: () => void;
}

export function CoffeeListItem({ bean, onClick }: CoffeeListItemProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 border-b border-gray-200 cursor-pointer group transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700">
              {bean.name}
            </h3>
            <p className="text-sm text-gray-600">by {bean.roaster}</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < bean.rank
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <span>{bean.origin}</span>
          <span>•</span>
          <span>{bean.roastLevel}</span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
      </div>
    </div>
  );
}