import { Star } from "lucide-react";

interface BeanRatingProps {
  rank: number;
  orderAgain: boolean;
}

export function BeanRating({ rank, orderAgain }: BeanRatingProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 transition-colors ${
              i < rank
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
        orderAgain 
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}>
        {orderAgain ? "Will Order Again" : "Won't Order Again"}
      </span>
    </div>
  );
}