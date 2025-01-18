import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface WishlistBean {
  name: string;
  roaster: string;
  notes?: string;
}

interface AddWishlistFormProps {
  onAdd: (bean: WishlistBean) => void;
}

export function AddWishlistForm({ onAdd }: AddWishlistFormProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newBean = {
      name: formData.get("name") as string,
      roaster: formData.get("roaster") as string,
      notes: formData.get("notes") as string,
    };

    onAdd(newBean);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" /> Add to Wishlist
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Coffee to Wishlist</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Bean Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roaster">Roaster</Label>
            <Input id="roaster" name="roaster" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Add any notes about why you want to try this coffee..."
            />
          </div>
          <Button type="submit" className="w-full">Add to Wishlist</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}