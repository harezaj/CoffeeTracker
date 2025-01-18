import { useState } from "react";
import { Link } from "react-router-dom";
import { CoffeeCard, type CoffeeBean } from "@/components/CoffeeCard";
import { CoffeeListItem } from "@/components/CoffeeListItem";
import { AddCoffeeForm } from "@/components/AddCoffeeForm";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBeans, createBean, deleteBean, updateBean } from "@/lib/api";
import { populateJournal } from "@/lib/sampleData";
import { importCoffeeBeans } from "@/lib/importData";
import { LayoutGrid, List, X, ChevronDown } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { WishlistItem } from "@/components/WishlistItem";
import { AddWishlistForm } from "@/components/AddWishlistForm";

type SortField = 'name' | 'roaster' | 'rank';

const Index = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [version, setVersion] = useState("1.2.1");
  const [isPopulating, setIsPopulating] = useState(false);
  const [viewMode, setViewMode] = useState<'tiles' | 'list'>('tiles');
  const [selectedBean, setSelectedBean] = useState<CoffeeBean | null>(null);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [wishlistBeans, setWishlistBeans] = useState(() => {
    const saved = localStorage.getItem('wishlistBeans');
    return saved ? JSON.parse(saved) : [];
  });

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

  const handleAddToWishlist = (bean: { name: string; roaster: string; notes?: string }) => {
    const newBean = { ...bean, id: Math.random().toString(36).substr(2, 9) };
    const updatedWishlist = [...wishlistBeans, newBean];
    setWishlistBeans(updatedWishlist);
    localStorage.setItem('wishlistBeans', JSON.stringify(updatedWishlist));
    toast({
      title: "Success",
      description: `${bean.name} has been added to your wishlist.`,
    });
  };

  const handleDeleteFromWishlist = (id: string) => {
    const updatedWishlist = wishlistBeans.filter((bean: any) => bean.id !== id);
    setWishlistBeans(updatedWishlist);
    localStorage.setItem('wishlistBeans', JSON.stringify(updatedWishlist));
    toast({
      title: "Success",
      description: "Coffee bean has been removed from your wishlist.",
    });
  };

  const sortBeans = (beans: CoffeeBean[]) => {
    return [...beans].sort((a, b) => {
      const modifier = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'rank') {
        return (b.rank - a.rank) * modifier;
      }
      return a[sortField].localeCompare(b[sortField]) * modifier;
    });
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
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

  const sortedBeans = sortBeans(beans);

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
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    Sort by <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleSort('name')}>
                    Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('roaster')}>
                    Roaster {sortField === 'roaster' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('rank')}>
                    Ranking {sortField === 'rank' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'tiles' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('tiles')}
                  className="rounded-none"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="rounded-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
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
            <AddCoffeeForm onAdd={handleAddBean} />
          </div>
        </div>

        {beans.length === 0 ? (
          <div className="text-center py-16 bg-white/50 rounded-xl backdrop-blur-sm border border-gray-200 shadow-lg animate-fade-in">
            <p className="text-gray-600 text-xl">
              No coffee beans added yet. Start by adding your first coffee bean!
            </p>
          </div>
        ) : (
          <div className="space-y-12 animate-fade-in">
            <section>
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">
                Your Collection
              </h2>
              {viewMode === 'tiles' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sortedBeans.map((bean) => (
                    <CoffeeCard 
                      key={bean.id} 
                      bean={bean} 
                      onDelete={handleDeleteBean}
                      onUpdate={handleUpdateBean}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                  {sortedBeans.map((bean) => (
                    <CoffeeListItem
                      key={bean.id}
                      bean={bean}
                      onClick={() => setSelectedBean(bean)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-gray-900">
              Wishlist
            </h2>
            <AddWishlistForm onAdd={handleAddToWishlist} />
          </div>
          
          {wishlistBeans.length === 0 ? (
            <div className="text-center py-12 bg-white/50 rounded-xl backdrop-blur-sm border border-gray-200">
              <p className="text-gray-600 text-lg">
                Your wishlist is empty. Add some coffee beans you'd like to try!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistBeans.map((bean: any) => (
                <WishlistItem
                  key={bean.id}
                  bean={bean}
                  onDelete={handleDeleteFromWishlist}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <Dialog open={!!selectedBean} onOpenChange={() => setSelectedBean(null)}>
        <DialogContent className="max-w-3xl">
          {selectedBean && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
                onClick={() => setSelectedBean(null)}
              >
                <X className="h-4 w-4" />
              </Button>
              <CoffeeCard
                bean={selectedBean}
                onDelete={handleDeleteBean}
                onUpdate={handleUpdateBean}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
