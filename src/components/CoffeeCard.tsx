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
    <Card className="w-full overflow-hidden group hover:shadow-xl transition-all duration-300 bg-white border-cream hover:border-coffee/20">
      <CardHeader className="bg-gradient-to-br from-cream to-cream-light border-b border-cream pb-4">
        <CardTitle className="text-coffee-dark group-hover:text-coffee transition-colors">
          {bean.name}
        </CardTitle>
        <p className="text-coffee/80 text-sm font-medium">by {bean.roaster}</p>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-coffee-dark font-medium">Origin</span>
            <span className="text-coffee ml-2">{bean.origin}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-coffee-dark font-medium">Roast</span>
            <span className="text-coffee ml-2">{bean.roastLevel}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-coffee-dark font-medium">Rating</span>
            <div className="flex ml-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 transition-colors ${
                    i < bean.rating
                      ? "fill-coffee text-coffee"
                      : "text-cream-dark"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-coffee-dark font-medium">Tasting Notes</span>
          <div className="flex flex-wrap gap-2">
            {bean.tastingNotes.map((note) => (
              <span
                key={note}
                className="px-3 py-1 rounded-full bg-cream text-coffee text-sm font-medium hover:bg-cream-dark transition-colors"
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