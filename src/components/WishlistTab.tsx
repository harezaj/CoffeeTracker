import { useState } from "react";
import { WishlistItem } from "./WishlistItem";
import { AddWishlistForm } from "./AddWishlistForm";
import { useToast } from "./ui/use-toast";

export function WishlistTab() {
  const { toast } = useToast();
  const [wishlistBeans, setWishlistBeans] = useState(() => {
    const saved = localStorage.getItem('wishlistBeans');
    return saved ? JSON.parse(saved) : [];
  });

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Wishlist
        </h2>
        <AddWishlistForm onAdd={handleAddToWishlist} />
      </div>
      
      {wishlistBeans.length === 0 ? (
        <div className="text-center py-12 bg-white/50 dark:bg-[#171717] rounded-xl backdrop-blur-sm border border-gray-200 dark:border-gray-800">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
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
    </div>
  );
}