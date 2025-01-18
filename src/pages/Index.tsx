import { useState } from "react";
import { Link } from "react-router-dom";
import { type CoffeeBean } from "@/components/CoffeeCard";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBeans, createBean, deleteBean, updateBean } from "@/lib/api";
import { populateJournal } from "@/lib/sampleData";
import { importCoffeeBeans } from "@/lib/importData";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollectionTab } from "@/components/CollectionTab";
import { WishlistTab } from "@/components/WishlistTab";
import { Coffee } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [version, setVersion] = useState("1.2.1");
  const [isPopulating, setIsPopulating] = useState(false);

  const { data: beans = [], isLoading, error } = useQuery({
    queryKey: ['beans'],
    queryFn: fetchBeans,
  });

  const handlePopulateJournal = async () => {
    setIsPopulating(true);
    try {
      await populateJournal();
      queryClient.invalidateQueries({ queryKey: ['beans'] });
      toast({
        title: "Success",
        description: "Sample coffee beans have been added to your journal.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add sample coffee beans",
        variant: "destructive",
      });
    } finally {
      setIsPopulating(false);
    }
  };

  const handleImportData = async () => {
    setIsPopulating(true);
    try {
      await importCoffeeBeans();
      queryClient.invalidateQueries({ queryKey: ['beans'] });
      toast({
        title: "Success",
        description: "Coffee beans have been imported to your journal.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import coffee beans",
        variant: "destructive",
      });
    } finally {
      setIsPopulating(false);
    }
  };

  const createBeanMutation = useMutation({
    mutationFn: createBean,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['beans'] });
      setVersion(prev => {
        const [major, minor, patch] = prev.split('.').map(Number);
        return `${major}.${minor}.${patch + 1}`;
      });
      toast({
        title: "Success",
        description: `${data.name} has been added to your collection.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add coffee bean",
        variant: "destructive",
      });
      console.error('Error creating bean:', error);
    },
  });

  const updateBeanMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Omit<CoffeeBean, "id">> }) => 
      updateBean(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['beans'] });
      toast({
        title: "Success",
        description: `${data.name} has been updated.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update coffee bean",
        variant: "destructive",
      });
      console.error('Error updating bean:', error);
    },
  });

  const deleteBeanMutation = useMutation({
    mutationFn: deleteBean,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['beans'] });
      toast({
        title: "Success",
        description: "Coffee bean has been removed from your collection.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete coffee bean",
        variant: "destructive",
      });
      console.error('Error deleting bean:', error);
    },
  });

  const handleAddBean = (newBean: Omit<CoffeeBean, "id">) => {
    createBeanMutation.mutate(newBean);
  };

  const handleUpdateBean = (id: string, updates: Partial<Omit<CoffeeBean, "id">>) => {
    updateBeanMutation.mutate({ id, updates });
  };

  const handleDeleteBean = (id: string) => {
    deleteBeanMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-light to-white flex items-center justify-center">
        <div className="text-coffee-dark text-xl animate-pulse">Loading your coffee journal...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-light to-white flex items-center justify-center">
        <div className="text-red-600 text-xl">Error loading coffee beans</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-light to-white">
      <div className="container py-8 space-y-8">
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Coffee className="h-10 w-10 text-coffee" />
              <div>
                <h1 className="text-4xl font-bold text-coffee-dark">
                  Coffee Bean Journal
                </h1>
                <div className="flex items-center gap-2">
                  <HoverCard>
                    <HoverCardTrigger>
                      <span className="text-sm text-coffee hover:text-coffee-dark transition-colors cursor-help">
                        v{version}
                      </span>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 bg-white/80 backdrop-blur-sm">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-coffee-dark">Version History</h4>
                        <div className="text-sm space-y-1 text-coffee">
                          <p>1.0.0 - Initial coffee journal implementation</p>
                          <p>1.1.0 - Added list/tile view toggle</p>
                          <p>1.2.0 - Enhanced recommendations</p>
                          <p>1.2.1 - Added API key storage</p>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  <span className="text-sm text-coffee">•</span>
                  <span className="text-sm text-coffee">Track your coffee journey</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Link to="/recommendations">
                <Button 
                  variant="outline"
                  className="bg-white/80 hover:bg-white transition-colors border-coffee/20 text-coffee-dark hover:text-coffee"
                >
                  Get AI Recommendations
                </Button>
              </Link>
              {beans.length === 0 && (
                <>
                  <Button 
                    variant="outline"
                    className="bg-white/80 hover:bg-white transition-colors border-coffee/20 text-coffee-dark hover:text-coffee"
                    onClick={handlePopulateJournal}
                    disabled={isPopulating}
                  >
                    {isPopulating ? "Adding Samples..." : "Add Sample Beans"}
                  </Button>
                  <Button 
                    variant="outline"
                    className="bg-white/80 hover:bg-white transition-colors border-coffee/20 text-coffee-dark hover:text-coffee"
                    onClick={handleImportData}
                    disabled={isPopulating}
                  >
                    Import Your Beans
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>

        <Tabs defaultValue="collection" className="w-full">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 bg-white/80 backdrop-blur-sm">
            <TabsTrigger 
              value="collection"
              className="data-[state=active]:bg-coffee data-[state=active]:text-white"
            >
              Collection
            </TabsTrigger>
            <TabsTrigger 
              value="wishlist"
              className="data-[state=active]:bg-coffee data-[state=active]:text-white"
            >
              Wishlist
            </TabsTrigger>
          </TabsList>
          <TabsContent value="collection" className="mt-6">
            <CollectionTab
              beans={beans}
              onDelete={handleDeleteBean}
              onUpdate={handleUpdateBean}
              onAdd={handleAddBean}
            />
          </TabsContent>
          <TabsContent value="wishlist" className="mt-6">
            <WishlistTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;