import { CoffeeBean } from "./CoffeeCard";
import { ChevronRight } from "lucide-react";
import { Star } from "lucide-react";

interface CoffeeListItemProps {
  bean: CoffeeBean;
  onClick: () => void;
}

export function CoffeeListItem({ bean, onClick }: CoffeeListItemProps) {
  const toTitleCase = (str: string) => {
    if (!str) return '';
    return str.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-3 bg-white dark:bg-[#171717] hover:bg-cream-light dark:hover:bg-[#222222] border-b border-cream-dark dark:border-gray-800 cursor-pointer group transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-base font-semibold text-coffee-dark dark:text-white group-hover:text-coffee dark:group-hover:text-gray-300">
              {toTitleCase(bean.name)}
            </h3>
            <p className="text-sm text-coffee dark:text-gray-400">By {toTitleCase(bean.roaster)}</p>
            {bean.notes && bean.notes.length > 0 && (
              <p className="text-sm text-coffee dark:text-gray-500 mt-1 italic">
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
                  : "text-gray-300 dark:text-gray-600"
              }`}
            />
          ))}
        </div>
        <div className="text-sm text-coffee dark:text-gray-400">
          {toTitleCase(bean.roastLevel)}
        </div>
        <ChevronRight className="w-4 h-4 text-coffee dark:text-gray-400 group-hover:text-coffee-dark dark:group-hover:text-white" />
      </div>
    </div>
  );
}