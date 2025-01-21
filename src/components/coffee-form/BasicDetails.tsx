import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BasicDetailsProps {
  defaultValues: {
    name: string;
    roaster: string;
    origin: string;
    roastLevel: string;
  };
}

export function BasicDetails({ defaultValues }: BasicDetailsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="dark:text-gray-200">Bean Name</Label>
          <Input 
            id="name" 
            name="name" 
            defaultValue={defaultValues.name} 
            required 
            className="dark:bg-[#1A1A1A] dark:border-gray-700 dark:text-white" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="roaster" className="dark:text-gray-200">Roaster</Label>
          <Input 
            id="roaster" 
            name="roaster" 
            defaultValue={defaultValues.roaster} 
            required 
            className="dark:bg-[#1A1A1A] dark:border-gray-700 dark:text-white" 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="origin" className="dark:text-gray-200">Origin</Label>
          <Input 
            id="origin" 
            name="origin" 
            defaultValue={defaultValues.origin} 
            required 
            className="dark:bg-[#1A1A1A] dark:border-gray-700 dark:text-white" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="roastLevel" className="dark:text-gray-200">Roast Level</Label>
          <select
            id="roastLevel"
            name="roastLevel"
            defaultValue={defaultValues.roastLevel}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#1A1A1A] dark:border-gray-700 dark:text-white"
            required
          >
            <option value="Light">Light</option>
            <option value="Medium-Light">Medium-Light</option>
            <option value="Medium">Medium</option>
            <option value="Medium-Dark">Medium-Dark</option>
            <option value="Dark">Dark</option>
          </select>
        </div>
      </div>
    </>
  );
}