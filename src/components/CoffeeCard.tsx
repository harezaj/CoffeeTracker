import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface CoffeeBean {
  id: string;
  roaster: string;
  name: string;
  origin: string;
  roastLevel: string;
  notes: string[];
  rank: number;
  gramsIn: number;
  mlOut: number;
  brewTime: number;
  temperature: number;
  price: number;
  weight: number;
  orderAgain: boolean;
  grindSize: number;
}

export function CoffeeCard({ bean }: { bean: CoffeeBean }) {
  return (
    <Card className="w-full overflow-hidden group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-gray-200 hover:border-gray-300">
      <CardHeader className="bg-gradient-to-br from-white to-gray-50 border-b border-gray-100 pb-4">
        <CardTitle className="text-gray-900 group-hover:text-gray-700 transition-colors">
          {bean.name}
        </CardTitle>
        <p className="text-gray-600 text-sm font-medium">by {bean.roaster}</p>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">Origin</span>
              <span className="text-gray-600">{bean.origin}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">Roast</span>
              <span className="text-gray-600">{bean.roastLevel}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">Rank</span>
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
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">Price</span>
              <span className="text-gray-600">${bean.price}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">Weight</span>
              <span className="text-gray-600">{bean.weight}g</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">Order Again</span>
              <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                bean.orderAgain 
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {bean.orderAgain ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-gray-700 font-medium mb-2">Brew Details</h4>
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
                <span className="font-medium">{bean.mlOut}ml</span>
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
        </div>

        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-gray-700 font-medium mb-2">Tasting Notes</h4>
          <div className="flex flex-wrap gap-2">
            {bean.notes.map((note) => (
              <span
                key={note}
                className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                {note}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}