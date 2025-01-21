import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface OrderAgainToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function OrderAgainToggle({ checked, onCheckedChange }: OrderAgainToggleProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="orderAgain" className="dark:text-gray-200">Order Again</Label>
        <Switch
          id="orderAgain"
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
      </div>
    </div>
  );
}