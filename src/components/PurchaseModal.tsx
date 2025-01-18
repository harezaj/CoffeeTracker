import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface PurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultPrice: number;
  defaultWeight: number;
  onSubmit: (price: number, weight: number, quantity: number) => void;
}

export function PurchaseModal({
  open,
  onOpenChange,
  defaultPrice,
  defaultWeight,
  onSubmit,
}: PurchaseModalProps) {
  const [price, setPrice] = useState(defaultPrice);
  const [weight, setWeight] = useState(defaultWeight);
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(price, weight, quantity);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Purchase</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price per bag ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (oz)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              min="0"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
            />
          </div>
          <Button type="submit" className="w-full">Add Purchase</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}