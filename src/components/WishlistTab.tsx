import { useState, useEffect } from "react";
import { WishlistItem } from "./WishlistItem";
import { AddWishlistForm } from "./AddWishlistForm";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WishlistBean {
  id: string;
  name: string;
  roaster: string;
  notes?: string;
}

export function WishlistTab() {
  const { toast } = useToast();
  const [wishlistBeans, setWishlistBeans] = useState<WishlistBean[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const { data, error } = await supabase
        .from('wishlist_beans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWishlistBeans(data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to load wishlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToWishlist = async (bean: { name: string; roaster: string; notes?: string }) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('wishlist_beans')
        .insert([{ ...bean, user_id: session.session.user.id }])
        .select()
        .single();

      if (error) throw error;

      setWishlistBeans([data, ...wishlistBeans]);
      toast({
        title: "Success",
        description: `${bean.name} has been added to your wishlist.`,
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to add to wishlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFromWishlist = async (id: string) => {
    try {
      const { error } = await supabase
        .from('wishlist_beans')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setWishlistBeans(wishlistBeans.filter(bean => bean.id !== id));
      toast({
        title: "Success",
        description: "Coffee bean has been removed from your wishlist.",
      });
    } catch (error) {
      console.error('Error deleting from wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove from wishlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
            Wishlist
          </h2>
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-10 w-32 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-48 bg-white dark:bg-[#171717] rounded-lg border border-gray-200 dark:border-gray-800 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

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
          {wishlistBeans.map((bean) => (
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