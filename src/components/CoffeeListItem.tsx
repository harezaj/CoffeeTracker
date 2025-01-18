import { CoffeeBean } from "./CoffeeCard";
import { ChevronRight } from "lucide-react";
import { Star } from "lucide-react";

interface CoffeeListItemProps {
  bean: CoffeeBean;
  onClick: () => void;
}

export function CoffeeListItem({ bean, onClick }: CoffeeListItemProps) {
  // Function to convert text to title case
  const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-3 bg-white hover:bg-cream-light border-b border-cream-dark cursor-pointer group transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-base font-semibold text-coffee-dark group-hover:text-coffee">
              {toTitleCase(bean.name)}
            </h3>
            <p className="text-sm text-coffee">By {toTitleCase(bean.roaster)}</p>
            {bean.notes && (
              <p className="text-sm text-coffee mt-1 italic">
                {bean.notes.map(note => toTitleCase(note)).join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < bean.rank
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <div className="text-sm text-coffee">
          {toTitleCase(bean.roastLevel)}
        </div>
        <ChevronRight className="w-4 h-4 text-coffee group-hover:text-coffee-dark" />
      </div>
    </div>
  );
}