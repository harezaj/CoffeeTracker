import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollectionTab } from "@/components/CollectionTab";
import { WishlistTab } from "@/components/WishlistTab";
import { useToast } from "@/components/ui/use-toast";
import { CoffeeBean } from "@/components/CoffeeCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Coffee, Sparkles, Download, Upload } from "lucide-react";
import { importCoffeeBeans } from "@/lib/importData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Index() {
  const { toast } = useToast();
  const [beans, setBeans] = useState<CoffeeBean[]>(() => {
    const saved = localStorage.getItem('coffeeBeans');
    return saved ? JSON.parse(saved) : [];
  });

  const [apiKey, setApiKey] = useState(() => localStorage.getItem('perplexity-api-key') || '');

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
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const jsonData = JSON.parse(e.target?.result as string);
            setBeans(jsonData);
            localStorage.setItem('coffeeBeans', JSON.stringify(jsonData));
            toast({
              title: "Success",
              description: "Coffee beans have been imported successfully.",
            });
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to parse JSON file.",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      };

      input.click();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import coffee beans.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    try {
      const jsonData = JSON.stringify(beans, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `coffee-journal-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Your coffee journal has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export coffee journal.",
        variant: "destructive",
      });
    }
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setApiKey(newKey);
    localStorage.setItem('perplexity-api-key', newKey);
    toast({
      title: "API Key Updated",
      description: "Your Perplexity API key has been saved.",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen bg-cream-light/50 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-8">
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
        <div className="flex gap-2">
          {beans.length === 0 && (
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-cream border-coffee/20 text-coffee-dark hover:bg-cream-dark/10"
              onClick={handleImport}
            >
              <Upload className="h-4 w-4" />
              Import Data
            </Button>
          )}
          {beans.length > 0 && (
            <>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-cream border-coffee/20 text-coffee-dark hover:bg-cream-dark/10"
                onClick={handleImport}
              >
                <Upload className="h-4 w-4" />
                Import
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-cream border-coffee/20 text-coffee-dark hover:bg-cream-dark/10"
                onClick={handleExport}
              >
                <Download className="h-4 w-4" />
                Export Journal
              </Button>
            </>
          )}
          <Link to="/recommendations">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-cream border-coffee/20 text-coffee-dark hover:bg-cream-dark/10"
            >
              <Sparkles className="h-4 w-4" />
              Get AI Recommendations
            </Button>
          </Link>
        </div>
      </div>
      
      <Tabs defaultValue="collection" className="space-y-6">
        <TabsList className="bg-cream border-coffee/20">
          <TabsTrigger 
            value="collection"
            className="data-[state=active]:bg-coffee data-[state=active]:text-cream"
          >
            Collection
          </TabsTrigger>
          <TabsTrigger 
            value="wishlist"
            className="data-[state=active]:bg-coffee data-[state=active]:text-cream"
          >
            Wishlist
          </TabsTrigger>
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

      <div className="mt-12 border-t pt-8">
        <div className="max-w-md mx-auto">
          <Label htmlFor="perplexity-api-key" className="text-coffee-dark">
            Perplexity API Key
          </Label>
          <div className="mt-2">
            <Input
              id="perplexity-api-key"
              type="password"
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder="Enter your Perplexity API key"
              className="w-full"
            />
            <p className="mt-2 text-sm text-gray-500">
              This API key will be used for auto-populating coffee details throughout the application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
