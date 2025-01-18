import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollectionTab } from "@/components/WishlistTab";
import { WishlistTab } from "@/components/WishlistTab";
import { Settings } from "@/components/Settings";
import { Link } from "react-router-dom";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Coffee Bean Tracker</h1>
        <div className="flex gap-4">
          <Link to="/purchase-history">
            <Button variant="outline" className="gap-2">
              <History className="w-4 h-4" />
              Purchase History
            </Button>
          </Link>
          <Settings />
        </div>
      </div>

      <Tabs defaultValue="collection">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="collection">Collection</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
        </TabsList>
        <TabsContent value="collection">
          <CollectionTab />
        </TabsContent>
        <TabsContent value="wishlist">
          <WishlistTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}