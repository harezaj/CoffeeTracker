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
        <Link to="/" className="group flex items-center gap-4">
          <div className="relative">
            <Coffee 
              className="h-12 w-12 text-coffee scale-x-[-1] transition-all duration-300 origin-bottom group-hover:rotate-[30deg]" 
            />
            <div className="absolute -bottom-2 -right-2 w-1 h-1 bg-coffee rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-[droplet_1s_ease-in_infinite] before:content-[''] before:absolute before:w-1 before:h-3 before:bg-coffee before:rounded-full before:-top-3 before:left-0" />
          </div>
          <div className="flex flex-col transition-transform duration-300 group-hover:translate-x-2">
            <h1 className="text-5xl font-black text-coffee-dark tracking-tight hover:text-coffee transition-colors duration-300">
              Coffee Bean
            </h1>
            <span className="text-2xl font-light text-coffee-dark tracking-wider">Journey</span>
          </div>
        </Link>
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