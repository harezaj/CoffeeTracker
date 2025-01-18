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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-gray-600 text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-red-600 text-xl">Error loading coffee beans</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container py-12 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                Coffee Bean Journal
              </h1>
              <HoverCard>
                <HoverCardTrigger>
                  <span className="text-sm text-gray-500 cursor-help">v{version}</span>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Version History</h4>
                    <div className="text-sm space-y-1">
                      <p>1.0.0 - Initial coffee journal implementation</p>
                      <p>1.1.0 - Added list/tile view toggle</p>
                      <p>1.2.0 - Enhanced recommendations</p>
                      <p>1.2.1 - Added API key storage</p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            <p className="text-gray-600 text-lg">
              Track your coffee journey and discover new favorites
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/recommendations">
              <Button variant="outline">Get AI Recommendations</Button>
            </Link>
            {beans.length === 0 && (
              <>
                <Button 
                  variant="outline" 
                  onClick={handlePopulateJournal}
                  disabled={isPopulating}
                >
                  {isPopulating ? "Adding Samples..." : "Add Sample Beans"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleImportData}
                  disabled={isPopulating}
                >
                  Import Your Beans
                </Button>
              </>
            )}
          </div>
        </div>

        <Tabs defaultValue="collection" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="collection">Collection</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          </TabsList>
          <TabsContent value="collection">
            <CollectionTab
              beans={beans}
              onDelete={handleDeleteBean}
              onUpdate={handleUpdateBean}
              onAdd={handleAddBean}
            />
          </TabsContent>
          <TabsContent value="wishlist">
            <WishlistTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;