import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings as SettingsIcon, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Settings() {
  const { toast } = useToast();

  const handleExport = () => {
    try {
      const savedBeans = localStorage.getItem('coffeeBeans');
      const beans = savedBeans ? JSON.parse(savedBeans) : [];
      
      const jsonData = JSON.stringify(beans, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `coffee-journal-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Your coffee journal has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export coffee journal.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="bg-cream border-coffee/20 text-coffee-dark hover:bg-cream-dark/10"
        >
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-cream">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your Coffee Bean Journey settings.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Data Management</h3>
            <Button
              variant="outline"
              onClick={handleExport}
              className="flex items-center gap-2 w-full justify-start bg-cream border-coffee/20 text-coffee-dark hover:bg-cream-dark/10"
            >
              <Download className="h-4 w-4" />
              Export Journal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}