import { useQuery } from "@tanstack/react-query";
import { fetchBeans } from "@/lib/api";
import { CoffeeBean } from "@/components/CoffeeCard";
import { CollectionTab } from "@/components/CollectionTab";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Coffee } from "lucide-react";

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

  // Filter beans to only show those with purchaseCount > 1
  const purchasedBeans = beans.filter(bean => (bean.purchaseCount || 0) > 1);

  return (
    <div className="container mx-auto py-8">
      <header className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="group flex items-center gap-4">
            <div className="relative">
              <Coffee 
                className="h-12 w-12 text-coffee scale-x-[-1] transition-all duration-300 origin-bottom group-hover:rotate-[30deg]" 
              />
            </div>
            <div className="flex flex-col transition-transform duration-300 group-hover:translate-x-2">
              <h1 className="text-4xl font-black text-coffee-dark tracking-tight hover:text-coffee transition-colors duration-300">
                Coffee Bean
              </h1>
              <span className="text-xl font-light text-coffee-dark tracking-wider">Journey</span>
            </div>
          </Link>
          <Link to="/">
            <Button 
              variant="outline"
              className="border-coffee/20 text-coffee-dark hover:text-coffee hover:bg-cream/10 transition-colors"
            >
              Back to Journal
            </Button>
          </Link>
        </div>
      </header>

      <CollectionTab
        beans={purchasedBeans}
        onDelete={() => {}} // Purchases cannot be deleted
        onUpdate={() => {}} // Purchases cannot be updated
        onAdd={() => {}} // New purchases should be made from the collection page
      />
    </div>
  );
}