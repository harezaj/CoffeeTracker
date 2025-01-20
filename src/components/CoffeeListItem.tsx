import { CoffeeBean } from "./CoffeeCard";
import { ChevronRight } from "lucide-react";
import { Star } from "lucide-react";

interface CoffeeListItemProps {
  bean: CoffeeBean;
  onClick: () => void;
}

export function CoffeeListItem({ bean, onClick }: CoffeeListItemProps) {
  // Function to convert text to proper title case, handling special cases
  const toTitleCase = (str: string) => {
    // List of words that should not be capitalized (unless they're the first word)
    const minorWords = new Set(['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'in', 'to', 'at', 'by', 'of']);
    
    // Function to capitalize first letter of each word
    const capitalizeWord = (word: string) => {
      if (!word) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    };

    // Handle empty strings
    if (!str) return '';

    // Split by hyphens first, then handle each part
    const parts = str.split('-').map(part => {
      // For each hyphenated part, split by commas
      return part.split(',').map(subPart => {
        // Process each word in the subpart
        const words = subPart.trim().split(' ');
        return words.map((word, index) => {
          const lowerWord = word.toLowerCase();
          // Always capitalize first word or non-minor words
          return (index === 0 || !minorWords.has(lowerWord)) ? capitalizeWord(word) : lowerWord;
        }).join(' ');
      }).join(', '); // Rejoin comma parts
    }).join('-'); // Rejoin hyphenated parts

    return parts;
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