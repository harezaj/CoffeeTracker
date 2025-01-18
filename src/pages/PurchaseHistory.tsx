import { useQuery } from "@tanstack/react-query";
import { fetchBeans } from "@/lib/api";
import { CoffeeBean } from "@/components/CoffeeCard";
import { CollectionTab } from "@/components/CollectionTab";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Coffee } from "lucide-react";

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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Coffee className="h-8 w-8 text-coffee" />
            <h1 className="text-4xl font-bold">Purchase History</h1>
          </div>
        </div>
      </div>
      <CollectionTab
        beans={purchasedBeans}
        onDelete={() => {}} // Purchases cannot be deleted
        onUpdate={() => {}} // Purchases cannot be updated
        onAdd={() => {}} // New purchases should be made from the collection page
      />
    </div>
  );
}