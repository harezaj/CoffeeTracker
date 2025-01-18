import { useQuery } from "@tanstack/react-query";
import { fetchBeans } from "@/lib/api";
import { CoffeeBean } from "@/components/CoffeeCard";
import { CollectionTab } from "@/components/CollectionTab";

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
      <h1 className="text-4xl font-bold mb-8">Purchase History</h1>
      <CollectionTab
        beans={purchasedBeans}
        onDelete={() => {}} // Purchases cannot be deleted
        onUpdate={() => {}} // Purchases cannot be updated
        onAdd={() => {}} // New purchases should be made from the collection page
      />
    </div>
  );
}