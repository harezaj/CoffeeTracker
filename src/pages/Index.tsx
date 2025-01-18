import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollectionTab } from "@/components/CollectionTab";
import { WishlistTab } from "@/components/WishlistTab";
import { useToast } from "@/components/ui/use-toast";
import { CoffeeBean } from "@/components/CoffeeCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Coffee, Sparkles, Download } from "lucide-react";
import { Settings } from "@/components/Settings";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { createBean, updateBean, deleteBean } from "@/lib/api";

export default function Index() {
  const { toast } = useToast();
  const [beans, setBeans] = useState<CoffeeBean[]>(() => {
    const saved = localStorage.getItem('coffeeBeans');
    return saved ? JSON.parse(saved) : [];
  });
  const [showExportReminder, setShowExportReminder] = useState(false);

  useEffect(() => {
    const checkLastReminder = () => {
      const lastReminder = localStorage.getItem('lastExportReminder');
      const today = new Date().toDateString();
      
      if (!lastReminder || lastReminder !== today) {
        setShowExportReminder(true);
        localStorage.setItem('lastExportReminder', today);
      }
    };

    checkLastReminder();
  }, []);

  const handleAddBean = async (bean: Omit<CoffeeBean, "id">) => {
    try {
      const newBean = await createBean(bean);
      setBeans(prev => [...prev, newBean]);
      toast({
        title: "Success",
        description: "Coffee bean added successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add coffee bean.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateBean = async (id: string, updates: Partial<Omit<CoffeeBean, "id">>) => {
    try {
      const updatedBean = await updateBean(id, updates);
      setBeans(prev => prev.map(bean => bean.id === id ? updatedBean : bean));
      toast({
        title: "Success",
        description: "Coffee bean updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update coffee bean.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBean = async (id: string) => {
    try {
      await deleteBean(id);
      setBeans(prev => prev.filter(bean => bean.id !== id));
      toast({
        title: "Success",
        description: "Coffee bean deleted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete coffee bean.",
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
      setShowExportReminder(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export coffee journal.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen bg-cream-light/50 backdrop-blur-sm">
      <AlertDialog open={showExportReminder} onOpenChange={setShowExportReminder}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Daily Backup Reminder</AlertDialogTitle>
            <AlertDialogDescription>
              It's time for your daily coffee journal backup! Would you like to export your journal now?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Remind Me Later</AlertDialogCancel>
            <AlertDialogAction onClick={handleExport}>Export Now</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
          {beans.length > 0 && (
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-cream border-coffee/20 text-coffee-dark hover:bg-cream-dark/10"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
              Export Journal
            </Button>
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
          <Settings />
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
    </div>
  );
}