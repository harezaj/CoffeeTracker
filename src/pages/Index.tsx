import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollectionTab } from "@/components/CollectionTab";
import { WishlistTab } from "@/components/WishlistTab";
import { Settings } from "@/components/Settings";
import { Link } from "react-router-dom";
import { Coffee, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBeans, createBean, updateBean, deleteBean } from "@/lib/api";
import type { CoffeeBean } from "@/components/CoffeeCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Index() {
  const queryClient = useQueryClient();

  const { data: beans = [] } = useQuery({
    queryKey: ['beans'],
    queryFn: fetchBeans
  });

  const createMutation = useMutation({
    mutationFn: createBean,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beans'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Omit<CoffeeBean, "id">> }) => 
      updateBean(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beans'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBean,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beans'] });
    },
  });

  const handleAdd = (bean: Omit<CoffeeBean, "id">) => {
    createMutation.mutate(bean);
  };

  const handleUpdate = (id: string, updates: Partial<Omit<CoffeeBean, "id">>) => {
    updateMutation.mutate({ id, updates });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
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
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/purchase-history" className="cursor-pointer">
                  Purchase History
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/recommendations" className="cursor-pointer">
                  AI Recommendations
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Settings />
        </div>
      </div>

      <Tabs defaultValue="collection">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="collection">Collection</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
        </TabsList>
        <TabsContent value="collection">
          <CollectionTab 
            beans={beans}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onAdd={handleAdd}
          />
        </TabsContent>
        <TabsContent value="wishlist">
          <WishlistTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}