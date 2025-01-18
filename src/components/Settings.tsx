import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings as SettingsIcon, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useRef } from "react";
import { calculateCosts } from "@/lib/costCalculations";
import { importCoffeeData } from "@/lib/importData";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

export function Settings() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [apiKey, setApiKey] = useState("");
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [volumeUnits, setVolumeUnits] = useState({
    milkSize: 'ml',
    milkPerLatte: 'ml',
    syrupSize: 'ml',
    syrupPerLatte: 'ml'
  });
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

    const savedVolumeUnits = localStorage.getItem('volumeUnits');
    if (savedVolumeUnits) {
      setVolumeUnits(JSON.parse(savedVolumeUnits));
    }
  }, []);

  const handleExport = () => {
    try {
      const savedBeans = localStorage.getItem('coffeeBeans');
      const costSettings = localStorage.getItem('costSettings');
      const beans = savedBeans ? JSON.parse(savedBeans) : [];
      
      const beansWithCosts = beans.map(bean => {
        const costs = calculateCosts(bean);
        return {
          ...bean,
          costAnalysis: {
            costPerGram: costs.costPerGram,
            costPerShot: costs.costPerShot,
            shotsPerBag: costs.shotsPerBag,
            costPerOz: costs.costPerOz,
            costPerLatte: costs.costPerLatte,
            costSettings: costSettings ? JSON.parse(costSettings) : null
          }
        };
      });
      
      const jsonData = JSON.stringify(beansWithCosts, null, 2);
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

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      await importCoffeeData(data);
      
      toast({
        title: "Success",
        description: "Your coffee journal has been imported successfully.",
      });
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Error",
        description: "Failed to import coffee journal. Please check the file format.",
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

  const testApiKey = async () => {
    setIsTestingApi(true);
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant.'
            },
            {
              role: 'user',
              content: 'Return the word "success" if you can read this message.'
            }
          ],
          max_tokens: 10
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0]?.message?.content?.toLowerCase().includes('success')) {
        toast({
          title: "Success",
          description: "API key is valid and working correctly.",
        });
      } else {
        throw new Error('Unexpected API response');
      }
    } catch (error) {
      console.error('API test error:', error);
      toast({
        title: "Error",
        description: "Failed to verify API key. Please check if it's valid.",
        variant: "destructive",
      });
    } finally {
      setIsTestingApi(false);
    }
  };

  const convertToOz = (ml: string) => (Number(ml) / 29.5735).toFixed(1);
  const convertToMl = (oz: string) => (Number(oz) * 29.5735).toFixed(0);

  const handleVolumeUnitChange = (field: keyof typeof volumeUnits, value: 'ml' | 'oz') => {
    const newUnits = { ...volumeUnits, [field]: value };
    setVolumeUnits(newUnits);
    localStorage.setItem('volumeUnits', JSON.stringify(newUnits));

    const newSettings = { ...costSettings };
    if (value === 'oz') {
      newSettings[field] = convertToOz(costSettings[field]);
    } else {
      newSettings[field] = convertToMl(costSettings[field]);
    }
    setCostSettings(newSettings);
    localStorage.setItem('costSettings', JSON.stringify(newSettings));
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
      <DialogContent className="bg-white dark:bg-[#171717] dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Settings</DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Configure your Coffee Bean Journey settings.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium dark:text-white">API Configuration</h3>
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="dark:text-gray-300">Perplexity API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => handleApiKeyChange(e.target.value)}
                    placeholder="Enter your API key"
                    className="bg-white dark:bg-[#222222] border-coffee/20 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                  />
                  <Button
                    variant="outline"
                    onClick={testApiKey}
                    disabled={!apiKey || isTestingApi}
                    className="whitespace-nowrap dark:bg-[#222222] dark:border-gray-700 dark:text-white dark:hover:bg-[#2a2a2a]"
                  >
                    {isTestingApi ? "Testing..." : "Test Key"}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                  Required for AI recommendations. Get your API key from{" "}
                  <a
                    href="https://www.perplexity.ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-coffee dark:text-blue-400 hover:underline"
                  >
                    Perplexity AI
                  </a>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium dark:text-white">Cost Analysis Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="milkPrice" className="dark:text-gray-300">Milk Price ($)</Label>
                  <Input
                    id="milkPrice"
                    type="number"
                    step="0.01"
                    value={costSettings.milkPrice}
                    onChange={(e) => handleCostSettingChange('milkPrice', e.target.value)}
                    className="bg-white dark:bg-[#222222] border-coffee/20 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="milkSize" className="dark:text-gray-300">Milk Size</Label>
                  <div className="flex gap-2">
                    <Input
                      id="milkSize"
                      type="number"
                      value={costSettings.milkSize}
                      onChange={(e) => handleCostSettingChange('milkSize', e.target.value)}
                      className="bg-white dark:bg-[#222222] border-coffee/20 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                    />
                    <ToggleGroup
                      type="single"
                      value={volumeUnits.milkSize}
                      onValueChange={(value: 'ml' | 'oz') => handleVolumeUnitChange('milkSize', value)}
                      className="border rounded-md dark:border-gray-700"
                    >
                      <ToggleGroupItem value="ml" className="px-2 py-1 dark:text-gray-300 dark:data-[state=on]:bg-[#2a2a2a]">ml</ToggleGroupItem>
                      <ToggleGroupItem value="oz" className="px-2 py-1 dark:text-gray-300 dark:data-[state=on]:bg-[#2a2a2a]">oz</ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="milkPerLatte" className="dark:text-gray-300">Milk per Latte</Label>
                  <div className="flex gap-2">
                    <Input
                      id="milkPerLatte"
                      type="number"
                      value={costSettings.milkPerLatte}
                      onChange={(e) => handleCostSettingChange('milkPerLatte', e.target.value)}
                      className="bg-white dark:bg-[#222222] border-coffee/20 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                    />
                    <ToggleGroup
                      type="single"
                      value={volumeUnits.milkPerLatte}
                      onValueChange={(value: 'ml' | 'oz') => handleVolumeUnitChange('milkPerLatte', value)}
                      className="border rounded-md dark:border-gray-700"
                    >
                      <ToggleGroupItem value="ml" className="px-2 py-1 dark:text-gray-300 dark:data-[state=on]:bg-[#2a2a2a]">ml</ToggleGroupItem>
                      <ToggleGroupItem value="oz" className="px-2 py-1 dark:text-gray-300 dark:data-[state=on]:bg-[#2a2a2a]">oz</ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="syrupPrice" className="dark:text-gray-300">Syrup Price ($)</Label>
                  <Input
                    id="syrupPrice"
                    type="number"
                    step="0.01"
                    value={costSettings.syrupPrice}
                    onChange={(e) => handleCostSettingChange('syrupPrice', e.target.value)}
                    className="bg-white dark:bg-[#222222] border-coffee/20 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="syrupSize" className="dark:text-gray-300">Syrup Size</Label>
                  <div className="flex gap-2">
                    <Input
                      id="syrupSize"
                      type="number"
                      value={costSettings.syrupSize}
                      onChange={(e) => handleCostSettingChange('syrupSize', e.target.value)}
                      className="bg-white dark:bg-[#222222] border-coffee/20 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                    />
                    <ToggleGroup
                      type="single"
                      value={volumeUnits.syrupSize}
                      onValueChange={(value: 'ml' | 'oz') => handleVolumeUnitChange('syrupSize', value)}
                      className="border rounded-md dark:border-gray-700"
                    >
                      <ToggleGroupItem value="ml" className="px-2 py-1 dark:text-gray-300 dark:data-[state=on]:bg-[#2a2a2a]">ml</ToggleGroupItem>
                      <ToggleGroupItem value="oz" className="px-2 py-1 dark:text-gray-300 dark:data-[state=on]:bg-[#2a2a2a]">oz</ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="syrupPerLatte" className="dark:text-gray-300">Syrup per Latte</Label>
                  <div className="flex gap-2">
                    <Input
                      id="syrupPerLatte"
                      type="number"
                      value={costSettings.syrupPerLatte}
                      onChange={(e) => handleCostSettingChange('syrupPerLatte', e.target.value)}
                      className="bg-white dark:bg-[#222222] border-coffee/20 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                    />
                    <ToggleGroup
                      type="single"
                      value={volumeUnits.syrupPerLatte}
                      onValueChange={(value: 'ml' | 'oz') => handleVolumeUnitChange('syrupPerLatte', value)}
                      className="border rounded-md dark:border-gray-700"
                    >
                      <ToggleGroupItem value="ml" className="px-2 py-1 dark:text-gray-300 dark:data-[state=on]:bg-[#2a2a2a]">ml</ToggleGroupItem>
                      <ToggleGroupItem value="oz" className="px-2 py-1 dark:text-gray-300 dark:data-[state=on]:bg-[#2a2a2a]">oz</ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium dark:text-white">Data Management</h3>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={handleExport}
                  className="flex items-center gap-2 w-full justify-start bg-white dark:bg-[#222222] border-coffee/20 dark:border-gray-700 text-coffee-dark dark:text-white hover:bg-cream-dark/10 dark:hover:bg-[#2a2a2a]"
                >
                  <Download className="h-4 w-4" />
                  Export Journal
                </Button>
                <div className="relative">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImport}
                    accept=".json"
                    className="hidden"
                    id="import-file"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 w-full justify-start bg-white dark:bg-[#222222] border-coffee/20 dark:border-gray-700 text-coffee-dark dark:text-white hover:bg-cream-dark/10 dark:hover:bg-[#2a2a2a]"
                  >
                    <Upload className="h-4 w-4" />
                    Import Journal
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
