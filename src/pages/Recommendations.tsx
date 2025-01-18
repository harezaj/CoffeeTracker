import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { CoffeeCard, type CoffeeBean } from "@/components/CoffeeCard";
import { Button } from "@/components/ui/button";
import { Loader2, Coffee, Menu } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAIRecommendations } from "@/lib/aiRecommendations";
import { fetchBeans } from "@/lib/api";
import { Settings } from "@/components/Settings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Recommendations = () => {
  const [recommendationType, setRecommendationType] = useState<"preferences" | "journal">("preferences");
  const [preferences, setPreferences] = useState({
    roastLevel: "",
    notes: "",
    priceRange: "",
  });
  const { toast } = useToast();

  const { data: journalBeans } = useQuery({
    queryKey: ["beans"],
    queryFn: fetchBeans,
  });

  const { data: recommendations, isLoading, refetch } = useQuery({
    queryKey: ["recommendations", recommendationType, preferences],
    queryFn: async () => {
      const apiKey = localStorage.getItem('perplexity-api-key');
      
      if (!apiKey) {
        throw new Error("Please enter your Perplexity API key in the settings section");
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds timeout

      try {
        const result = await getAIRecommendations(
          {
            type: recommendationType,
            preferences: recommendationType === "preferences" ? preferences : undefined,
            journalEntries: recommendationType === "journal" ? journalBeans : undefined,
          },
          apiKey,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);
        return result;
      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          throw new Error("Request timed out after 60 seconds");
        }
        throw error;
      }
    },
    enabled: false,
    retry: false,
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
    <div className="min-h-screen bg-background">
      <div className="container py-8 space-y-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative">
              <Coffee className="h-12 w-12 text-coffee scale-x-[-1]" />
              <div className="absolute top-0 left-1/2 w-1 h-1 bg-coffee rounded-full opacity-0 group-hover:animate-[droplet_1s_ease-in-out_infinite]" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-4xl font-black text-coffee-dark tracking-tight group-hover:text-coffee transition-colors">
                Coffee Bean
              </h1>
              <span className="text-xl font-light text-coffee-dark tracking-wider group-hover:text-coffee transition-colors">
                Journey
              </span>
            </div>
          </Link>
          <div className="flex gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/" className="cursor-pointer">
                    Collection
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/purchase-history" className="cursor-pointer">
                    Purchase History
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Settings />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6 bg-cream-light/50 backdrop-blur-sm p-6 rounded-xl border border-coffee/20 shadow-lg">
            <h2 className="text-2xl font-semibold text-coffee-dark">
              Recommendation Settings
            </h2>

            <RadioGroup
              value={recommendationType}
              onValueChange={(value: "preferences" | "journal") => setRecommendationType(value)}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="preferences" id="preferences" />
                <Label htmlFor="preferences" className="text-coffee-dark">Based on Preferences</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="journal" id="journal" />
                <Label htmlFor="journal" className="text-coffee-dark">Based on Journal History</Label>
              </div>
            </RadioGroup>

            {recommendationType === "preferences" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-coffee-dark">Preferred Roast Level</Label>
                  <Select
                    value={preferences.roastLevel}
                    onValueChange={(value) =>
                      setPreferences({ ...preferences, roastLevel: value })
                    }
                  >
                    <SelectTrigger className="bg-background border-coffee/20">
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
                  <Label className="text-coffee-dark">Flavor Notes</Label>
                  <Input
                    placeholder="e.g., fruity, chocolate, nutty"
                    value={preferences.notes}
                    onChange={(e) =>
                      setPreferences({ ...preferences, notes: e.target.value })
                    }
                    className="bg-background border-coffee/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-coffee-dark">Price Range</Label>
                  <Select
                    value={preferences.priceRange}
                    onValueChange={(value) =>
                      setPreferences({ ...preferences, priceRange: value })
                    }
                  >
                    <SelectTrigger className="bg-background border-coffee/20">
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
              <p className="text-coffee">
                We'll analyze your highest-rated coffee entries to find similar options you might enjoy.
              </p>
            )}

            <Button
              className="w-full bg-coffee hover:bg-coffee-dark text-white"
              onClick={handleGetRecommendations}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Get Recommendations
            </Button>
          </div>

          <div className="md:col-span-2 space-y-6">
            {recommendations?.length ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {recommendations.map((bean) => (
                  <CoffeeCard key={bean.id} bean={bean} isRecommendation={true} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-cream-light/50 backdrop-blur-sm rounded-xl border border-coffee/20 shadow-lg">
                <p className="text-coffee-dark text-xl">
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