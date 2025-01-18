import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { CoffeeCard, type CoffeeBean } from "@/components/CoffeeCard";
import { Button } from "@/components/ui/button";
import { Loader2, Coffee } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAIRecommendations } from "@/lib/aiRecommendations";
import { fetchBeans } from "@/lib/api";

const PERPLEXITY_API_KEY_STORAGE = 'perplexity-api-key';

const Recommendations = () => {
  const [recommendationType, setRecommendationType] = useState<"preferences" | "journal">("preferences");
  const [preferences, setPreferences] = useState({
    roastLevel: "",
    notes: "",
    priceRange: "",
  });
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem(PERPLEXITY_API_KEY_STORAGE) || "";
  });
  const { toast } = useToast();

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem(PERPLEXITY_API_KEY_STORAGE, apiKey);
    }
  }, [apiKey]);

  const { data: journalBeans } = useQuery({
    queryKey: ["beans"],
    queryFn: fetchBeans,
  });

  const { data: recommendations, isLoading, refetch } = useQuery({
    queryKey: ["recommendations", recommendationType, preferences],
    queryFn: async () => {
      if (!apiKey) {
        throw new Error("Please enter your Perplexity API key");
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
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="group flex items-center gap-4">
              <div className="relative">
                <Coffee 
                  className="h-16 w-16 text-coffee scale-x-[-1] transition-all duration-300 origin-bottom group-hover:rotate-[30deg]" 
                />
              </div>
              <div className="flex flex-col transition-transform duration-300 group-hover:translate-x-2">
                <h1 className="text-5xl font-black text-coffee-dark tracking-tight hover:text-coffee transition-colors duration-300">
                  Coffee Bean
                </h1>
                <span className="text-2xl font-light text-coffee-dark tracking-wider">Journey</span>
              </div>
            </Link>
            <Link to="/">
              <Button 
                variant="outline"
                className="border-coffee/20 text-coffee-dark hover:text-coffee hover:bg-cream/10 transition-colors"
              >
                Back to Journal
              </Button>
            </Link>
          </div>
        </header>

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

            <div className="pt-4 border-t border-coffee/20">
              <div className="space-y-2">
                <Label className="text-coffee-dark">Perplexity API Key</Label>
                <Input
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-background border-coffee/20"
                />
                <p className="text-sm text-coffee">
                  Get your API key from{" "}
                  <a
                    href="https://www.perplexity.ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-coffee-dark hover:underline"
                  >
                    Perplexity AI
                  </a>
                </p>
              </div>
            </div>

            <Button
              className="w-full bg-coffee hover:bg-coffee-dark text-white"
              onClick={handleGetRecommendations}
              disabled={isLoading || !apiKey}
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
