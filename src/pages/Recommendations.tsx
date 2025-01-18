import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { CoffeeCard, type CoffeeBean } from "@/components/CoffeeCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Recommendations = () => {
  const [recommendationType, setRecommendationType] = useState<"preferences" | "journal">("preferences");
  const [preferences, setPreferences] = useState({
    roastLevel: "",
    notes: "",
    priceRange: "",
  });
  const { toast } = useToast();

  const { data: recommendations, isLoading, refetch } = useQuery({
    queryKey: ["recommendations", recommendationType, preferences],
    queryFn: async () => {
      // TODO: Implement Tavily API integration here
      // This is a placeholder that returns mock data
      return [
        {
          id: "rec1",
          roaster: "Sample Roaster",
          name: "Ethiopian Yirgacheffe",
          origin: "Ethiopia",
          roastLevel: "Medium",
          notes: ["Floral", "Citrus", "Bergamot"],
          rank: 4,
          gramsIn: 18,
          mlOut: 36,
          brewTime: 28,
          temperature: 93,
          price: 16.99,
          weight: 250,
          orderAgain: true,
          grindSize: 15,
        },
      ] as CoffeeBean[];
    },
    enabled: false, // Query won't run automatically
  });

  const handleGetRecommendations = () => {
    if (recommendationType === "preferences" && 
        (!preferences.roastLevel || !preferences.notes || !preferences.priceRange)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all preference fields before getting recommendations.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Getting Recommendations",
      description: recommendationType === "preferences" 
        ? "Analyzing your preferences to find the perfect coffee..."
        : "Analyzing your highest-rated coffees to find similar options...",
    });
    
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container py-12 space-y-12">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              Coffee Recommendations
            </h1>
            <p className="text-gray-600 text-lg">
              Get AI-powered suggestions based on your preferences or journal history
            </p>
          </div>
          <Link to="/">
            <Button variant="outline">Back to Journal</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="col-span-full md:col-span-1 space-y-6 bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900">
              Recommendation Method
            </h2>
            
            <RadioGroup
              value={recommendationType}
              onValueChange={(value: "preferences" | "journal") => setRecommendationType(value)}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="preferences" id="preferences" />
                <Label htmlFor="preferences">Based on Preferences</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="journal" id="journal" />
                <Label htmlFor="journal">Based on Journal History</Label>
              </div>
            </RadioGroup>

            {recommendationType === "preferences" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Preferred Roast Level</Label>
                  <Select
                    value={preferences.roastLevel}
                    onValueChange={(value) =>
                      setPreferences({ ...preferences, roastLevel: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Roast Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Flavor Notes</Label>
                  <Input
                    placeholder="e.g., fruity, chocolate, nutty"
                    value={preferences.notes}
                    onChange={(e) =>
                      setPreferences({ ...preferences, notes: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Price Range</Label>
                  <Select
                    value={preferences.priceRange}
                    onValueChange={(value) =>
                      setPreferences({ ...preferences, priceRange: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">Under $15</SelectItem>
                      <SelectItem value="mid">$15 - $25</SelectItem>
                      <SelectItem value="premium">Over $25</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {recommendationType === "journal" && (
              <p className="text-gray-600">
                We'll analyze your highest-rated coffee entries to find similar options you might enjoy.
              </p>
            )}

            <Button
              className="w-full"
              onClick={handleGetRecommendations}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Get Recommendations
            </Button>
          </div>

          <div className="col-span-full md:col-span-2 space-y-6">
            {recommendations?.length ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {recommendations.map((bean) => (
                  <CoffeeCard key={bean.id} bean={bean} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white/50 rounded-xl backdrop-blur-sm border border-gray-200 shadow-lg">
                <p className="text-gray-600 text-xl">
                  {recommendationType === "preferences"
                    ? "Fill in your preferences and click 'Get Recommendations' to discover new coffees!"
                    : "Click 'Get Recommendations' to find coffees similar to your highest-rated entries!"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;