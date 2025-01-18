import { useQuery } from "@tanstack/react-query";
import { fetchBeans } from "@/lib/api";
import { CoffeeBean } from "@/components/CoffeeCard";
import { CollectionTab } from "@/components/CollectionTab";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Coffee, Menu } from "lucide-react";
import { Settings } from "@/components/Settings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PurchaseHistory() {
  const { data: beans = [], isLoading, error } = useQuery<CoffeeBean[]>({
    queryKey: ["coffee-beans"],
    queryFn: fetchBeans,
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading coffee beans</div>;
  }

  const purchasedBeans = beans.filter(bean => (bean.purchaseCount || 0) > 1);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Coffee className="h-12 w-12 text-coffee scale-x-[-1]" />
          <div className="flex flex-col">
            <h1 className="text-4xl font-black text-coffee-dark tracking-tight">
              Coffee Bean
            </h1>
            <span className="text-xl font-light text-coffee-dark tracking-wider">
              Journey
            </span>
          </div>
        </div>
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
                  My Collection
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
        beans={purchasedBeans}
        onDelete={() => {}}
        onUpdate={() => {}}
        onAdd={() => {}}
      />
    </div>
  );
}