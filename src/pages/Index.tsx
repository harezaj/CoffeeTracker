import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollectionTab } from "@/components/CollectionTab";
import { WishlistTab } from "@/components/WishlistTab";
import { useToast } from "@/components/ui/use-toast";
import { CoffeeBean } from "@/components/CoffeeCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Coffee, Sparkles, Download } from "lucide-react";
import { importCoffeeBeans } from "@/lib/importData";

export default function Index() {
  const { toast } = useToast();
  const [beans, setBeans] = useState<CoffeeBean[]>(() => {
    const saved = localStorage.getItem('coffeeBeans');
    return saved ? JSON.parse(saved) : [];
  });

  const handleAddBean = (bean: Omit<CoffeeBean, "id">) => {
    const newBean = { ...bean, id: Math.random().toString(36).substr(2, 9) };
    const updatedBeans = [...beans, newBean];
    setBeans(updatedBeans);
    localStorage.setItem('coffeeBeans', JSON.stringify(updatedBeans));
    toast({
      title: "Success",
      description: `${bean.name} has been added to your collection.`,
    });
  };

  const handleDeleteBean = (id: string) => {
    const updatedBeans = beans.filter(bean => bean.id !== id);
    setBeans(updatedBeans);
    localStorage.setItem('coffeeBeans', JSON.stringify(updatedBeans));
    toast({
      title: "Success",
      description: "Coffee bean has been removed from your collection.",
    });
  };

  const handleUpdateBean = (id: string, updates: Partial<Omit<CoffeeBean, "id">>) => {
    const updatedBeans = beans.map(bean => 
      bean.id === id ? { ...bean, ...updates } : bean
    );
    setBeans(updatedBeans);
    localStorage.setItem('coffeeBeans', JSON.stringify(updatedBeans));
    toast({
      title: "Success",
      description: "Coffee bean has been updated.",
    });
  };

  const handleImport = async () => {
    try {
      await importCoffeeBeans();
      // Refresh the beans from localStorage after import
      const saved = localStorage.getItem('coffeeBeans');
      if (saved) {
        setBeans(JSON.parse(saved));
        toast({
          title: "Success",
          description: "Coffee beans have been imported successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import coffee beans.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Coffee className="h-10 w-10 text-coffee" />
          <h1 className="text-3xl font-bold">Coffee Bean Journey</h1>
        </div>
        <div className="flex gap-2">
          {beans.length === 0 && (
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleImport}
            >
              <Download className="h-4 w-4" />
              Import Data
            </Button>
          )}
          <Link to="/recommendations">
            <Button variant="outline" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Get AI Recommendations
            </Button>
          </Link>
        </div>
      </div>
      
      <Tabs defaultValue="collection" className="space-y-6">
        <TabsList>
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
  );
}