import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollectionTab } from "@/components/CollectionTab";
import { WishlistTab } from "@/components/WishlistTab";
import { useToast } from "@/components/ui/use-toast";
import { CoffeeBean } from "@/components/CoffeeCard";

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

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Coffee Bean Journey</h1>
      
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