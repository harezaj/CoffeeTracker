import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollectionTab } from "@/components/CollectionTab";
import { WishlistTab } from "@/components/WishlistTab";
import { Settings } from "@/components/Settings";
import { Link, useNavigate } from "react-router-dom";
import { Coffee, LogOut, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBeans, createBean, updateBean, deleteBean } from "@/lib/api";
import type { CoffeeBean } from "@/components/CoffeeCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

export default function Index() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ username: string | null; avatar_url: string | null } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .maybeSingle();  // Changed from .single() to .maybeSingle()
        setProfile(data || { username: null, avatar_url: null });  // Provide default value if no profile found
      }
    };
    fetchProfile();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } else {
      navigate('/auth');
    }
  };

  const { data: beans = [], isLoading, error } = useQuery({
    queryKey: ['beans'],
    queryFn: fetchBeans,
  });

  const createMutation = useMutation({
    mutationFn: createBean,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beans'] });
      toast({
        title: "Success",
        description: "Coffee bean added successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add coffee bean. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Omit<CoffeeBean, "id">> }) => 
      updateBean(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beans'] });
      toast({
        title: "Success",
        description: "Coffee bean updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update coffee bean. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBean,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beans'] });
      toast({
        title: "Success",
        description: "Coffee bean deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete coffee bean. Please try again.",
        variant: "destructive",
      });
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

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 p-4 rounded-lg">
          <h2 className="text-red-800 dark:text-red-200 text-lg font-semibold">Error Loading Data</h2>
          <p className="text-red-600 dark:text-red-300">Failed to load coffee beans. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="relative">
            <Coffee className="h-12 w-12 text-coffee dark:text-white scale-x-[-1] transform transition-transform group-hover:scale-x-[-1.1] group-hover:scale-y-[1.1]" />
            <div className="absolute top-0 left-1/2 w-1 h-1 bg-coffee dark:bg-white rounded-full opacity-0 group-hover:animate-[droplet_1s_ease-in-out_infinite]" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-4xl font-black text-coffee-dark dark:text-white tracking-tight group-hover:text-coffee dark:group-hover:text-gray-300 transition-colors">
              Coffee Bean
            </h1>
            <span className="text-xl font-light text-coffee-dark dark:text-gray-400 tracking-wider group-hover:text-coffee dark:group-hover:text-gray-500 transition-colors">
              Journey
            </span>
          </div>
        </Link>
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarFallback>
                    {profile?.username?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
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
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600 dark:text-red-400 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Settings />
        </div>
      </div>

      <Tabs defaultValue="collection" className="dark:border-gray-800">
        <TabsList className="grid w-full grid-cols-2 dark:bg-[#171717]">
          <TabsTrigger value="collection" className="dark:data-[state=active]:bg-[#222222]">Collection</TabsTrigger>
          <TabsTrigger value="wishlist" className="dark:data-[state=active]:bg-[#222222]">Wishlist</TabsTrigger>
        </TabsList>
        <TabsContent value="collection">
          <CollectionTab 
            beans={beans}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onAdd={handleAdd}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="wishlist">
          <WishlistTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}