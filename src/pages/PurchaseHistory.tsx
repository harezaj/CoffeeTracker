import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBeans, updateBean } from "@/lib/api";
import { CoffeeBean } from "@/components/CoffeeCard";
import { CollectionTab } from "@/components/CollectionTab";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Coffee, Menu } from "lucide-react";
import { Settings } from "@/components/Settings";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PurchaseHistory() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: beans = [], isLoading, error } = useQuery({
    queryKey: ["coffee-beans"],
    queryFn: fetchBeans,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Omit<CoffeeBean, "id">> }) => 
      updateBean(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coffee-beans"] });
      toast({
        title: "Success",
        description: "Purchase count updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update purchase count. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUpdate = (id: string, updates: Partial<Omit<CoffeeBean, "id">>) => {
    updateMutation.mutate({ id, updates });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading coffee beans</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="relative">
            <Coffee className="h-12 w-12 text-coffee dark:text-white scale-x-[-1]" />
            <div className="absolute top-0 left-1/2 w-1 h-1 bg-coffee dark:bg-white rounded-full opacity-0 group-hover:animate-[droplet_1s_ease-in-out_infinite]" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-4xl font-black text-coffee-dark dark:text-white tracking-tight group-hover:text-coffee dark:group-hover:text-cream transition-colors">
              Coffee Bean
            </h1>
            <span className="text-xl font-light text-coffee-dark dark:text-white tracking-wider group-hover:text-coffee dark:group-hover:text-cream transition-colors">
              Journey
            </span>
          </div>
        </Link>
        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/" className="cursor-pointer">
                  Collection
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

      <CollectionTab
        beans={beans}
        onDelete={() => {}}
        onUpdate={handleUpdate}
        onAdd={() => {}}
      />
    </div>
  );
}