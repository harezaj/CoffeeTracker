import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings as SettingsIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export function Settings() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [costSettings, setCostSettings] = useState({
    milkPrice: "4.99",
    milkSize: "1000",
    milkPerLatte: "200",
    syrupPrice: "12.99",
    syrupSize: "750",
    syrupPerLatte: "30",
  });

  useEffect(() => {
    const savedApiKey = localStorage.getItem('perplexity-api-key');
    if (savedApiKey) setApiKey(savedApiKey);

    const savedCostSettings = localStorage.getItem('costSettings');
    if (savedCostSettings) {
      setCostSettings(JSON.parse(savedCostSettings));
    }
  }, []);

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

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    localStorage.setItem('perplexity-api-key', value);
    toast({
      title: "Success",
      description: "API key saved successfully.",
    });
  };

  const handleCostSettingChange = (key: keyof typeof costSettings, value: string) => {
    const newSettings = { ...costSettings, [key]: value };
    setCostSettings(newSettings);
    localStorage.setItem('costSettings', JSON.stringify(newSettings));
    toast({
      title: "Success",
      description: "Cost settings saved successfully.",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="bg-white border-coffee/20 text-coffee-dark hover:bg-cream-dark/10"
        >
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your Coffee Bean Journey settings.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">API Configuration</h3>
              <div className="space-y-2">
                <Label htmlFor="apiKey">Perplexity API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder="Enter your API key"
                  className="bg-white border-coffee/20"
                />
                <p className="text-sm text-muted-foreground">
                  Required for AI recommendations. Get your API key from{" "}
                  <a
                    href="https://www.perplexity.ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-coffee hover:underline"
                  >
                    Perplexity AI
                  </a>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Cost Analysis Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="milkPrice">Milk Price ($)</Label>
                  <Input
                    id="milkPrice"
                    type="number"
                    step="0.01"
                    value={costSettings.milkPrice}
                    onChange={(e) => handleCostSettingChange('milkPrice', e.target.value)}
                    className="bg-white border-coffee/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="milkSize">Milk Size (ml)</Label>
                  <Input
                    id="milkSize"
                    type="number"
                    value={costSettings.milkSize}
                    onChange={(e) => handleCostSettingChange('milkSize', e.target.value)}
                    className="bg-white border-coffee/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="milkPerLatte">Milk per Latte (ml)</Label>
                  <Input
                    id="milkPerLatte"
                    type="number"
                    value={costSettings.milkPerLatte}
                    onChange={(e) => handleCostSettingChange('milkPerLatte', e.target.value)}
                    className="bg-white border-coffee/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="syrupPrice">Syrup Price ($)</Label>
                  <Input
                    id="syrupPrice"
                    type="number"
                    step="0.01"
                    value={costSettings.syrupPrice}
                    onChange={(e) => handleCostSettingChange('syrupPrice', e.target.value)}
                    className="bg-white border-coffee/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="syrupSize">Syrup Size (ml)</Label>
                  <Input
                    id="syrupSize"
                    type="number"
                    value={costSettings.syrupSize}
                    onChange={(e) => handleCostSettingChange('syrupSize', e.target.value)}
                    className="bg-white border-coffee/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="syrupPerLatte">Syrup per Latte (ml)</Label>
                  <Input
                    id="syrupPerLatte"
                    type="number"
                    value={costSettings.syrupPerLatte}
                    onChange={(e) => handleCostSettingChange('syrupPerLatte', e.target.value)}
                    className="bg-white border-coffee/20"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Data Management</h3>
              <Button
                variant="outline"
                onClick={handleExport}
                className="flex items-center gap-2 w-full justify-start bg-white border-coffee/20 text-coffee-dark hover:bg-cream-dark/10"
              >
                <Download className="h-4 w-4" />
                Export Journal
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}