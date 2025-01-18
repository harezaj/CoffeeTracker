import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface CoffeeBean {
  id: string;
  name: string;
  roaster: string;
  origin: string;
  roastLevel: string;
  rating: number;
  tastingNotes: string[];
}

export function CoffeeCard({ bean }: { bean: CoffeeBean }) {
  return (
    <Card className="w-full max-w-md bg-cream hover:bg-cream-light transition-colors">
      <CardHeader>
        <CardTitle className="text-coffee-dark">{bean.name}</CardTitle>
        <p className="text-coffee text-sm">by {bean.roaster}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-coffee-dark font-semibold">Origin:</span>
            <span className="text-coffee">{bean.origin}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-coffee-dark font-semibold">Roast:</span>
            <span className="text-coffee">{bean.roastLevel}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-coffee-dark font-semibold">Rating:</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < bean.rating ? "fill-coffee text-coffee" : "text-coffee-light"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-coffee-dark font-semibold">Tasting Notes:</span>
            <div className="flex flex-wrap gap-2">
              {bean.tastingNotes.map((note) => (
                <span
                  key={note}
                  className="px-2 py-1 rounded-full bg-coffee/10 text-coffee text-sm"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}