import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { CoffeeCard, type CoffeeBean } from "@/components/CoffeeCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Recommendations = () => {
  const [preferences, setPreferences] = useState({
    roastLevel: "",
    notes: "",
    priceRange: "",
  });
  const { toast } = useToast();

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["recommendations", preferences],
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
    // TODO: Implement form validation
    toast({
      title: "Getting Recommendations",
      description: "Analyzing your preferences to find the perfect coffee...",
    });
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
              Get AI-powered suggestions based on your preferences
            </p>
          </div>
          <Link to="/">
            <Button variant="outline">Back to Journal</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="col-span-full md:col-span-1 space-y-6 bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900">
              Your Preferences
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Preferred Roast Level
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={preferences.roastLevel}
                  onChange={(e) =>
                    setPreferences({ ...preferences, roastLevel: e.target.value })
                  }
                >
                  <option value="">Select Roast Level</option>
                  <option value="light">Light</option>
                  <option value="medium">Medium</option>
                  <option value="dark">Dark</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Flavor Notes
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 p-2"
                  placeholder="e.g., fruity, chocolate, nutty"
                  value={preferences.notes}
                  onChange={(e) =>
                    setPreferences({ ...preferences, notes: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Price Range
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={preferences.priceRange}
                  onChange={(e) =>
                    setPreferences({ ...preferences, priceRange: e.target.value })
                  }
                >
                  <option value="">Select Price Range</option>
                  <option value="budget">Under $15</option>
                  <option value="mid">$15 - $25</option>
                  <option value="premium">Over $25</option>
                </select>
              </div>

              <Button
                className="w-full"
                onClick={handleGetRecommendations}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get Recommendations
              </Button>
            </div>
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
                  Fill in your preferences and click "Get Recommendations" to
                  discover new coffees!
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