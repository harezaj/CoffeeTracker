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
import { supabase } from "@/integrations/supabase/client";

export function Settings() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [apiKey, setApiKey] = useState("");
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [costSettings, setCostSettings] = useState({
    milkPrice: "4.99",
    milkSize: "33.8",  // 1000ml in oz
    milkPerLatte: "6.8",  // 200ml in oz
    syrupPricePerLatte: "0.50",
  });

  useEffect(() => {
    const savedApiKey = localStorage.getItem('perplexity-api-key');
    if (savedApiKey) setApiKey(savedApiKey);

    const savedCostSettings = localStorage.getItem('costSettings');
    if (savedCostSettings) {
      setCostSettings(JSON.parse(savedCostSettings));
    }
  }, []);

  const handleExport = async () => {
    try {
      const { data: beans, error } = await supabase
        .from('coffee_beans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const beansWithCosts = beans.map(bean => {
        const costs = calculateCosts({
          id: bean.id,
          name: bean.name,
          roaster: bean.roaster,
          origin: bean.origin || '',
          roastLevel: bean.roast_level || '',
          notes: bean.notes || [],
          generalNotes: bean.general_notes || '',
          rank: bean.rank || 0,
          gramsIn: bean.grams_in || 0,
          mlOut: bean.ml_out || 0,
          brewTime: bean.brew_time || 0,
          temperature: bean.temperature || 0,
          price: bean.price || 0,
          weight: bean.weight || 0,
          orderAgain: !!bean.order_again,
          grindSize: bean.grind_size || 0,
          purchaseCount: bean.purchase_count || 0
        });
        
        return {
          id: bean.id,
          name: bean.name,
          roaster: bean.roaster,
          origin: bean.origin,
          roastLevel: bean.roast_level,
          notes: bean.notes,
          generalNotes: bean.general_notes,
          rank: bean.rank,
          gramsIn: bean.grams_in,
          mlOut: bean.ml_out,
          brewTime: bean.brew_time,
          temperature: bean.temperature,
          price: bean.price,
          weight: bean.weight,
          orderAgain: bean.order_again,
          grindSize: bean.grind_size,
          purchaseCount: bean.purchase_count,
          costAnalysis: {
            costPerGram: costs.costPerGram,
            costPerShot: costs.costPerShot,
            shotsPerBag: costs.shotsPerBag,
            costPerOz: costs.costPerOz,
            costPerLatte: costs.costPerLatte,
            costSettings: localStorage.getItem('costSettings') ? JSON.parse(localStorage.getItem('costSettings')!) : null
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
      console.error('Export error:', error);
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
                  <Label htmlFor="milkSize" className="dark:text-gray-300">Milk Size (oz)</Label>
                  <Input
                    id="milkSize"
                    type="number"
                    value={costSettings.milkSize}
                    onChange={(e) => handleCostSettingChange('milkSize', e.target.value)}
                    className="bg-white dark:bg-[#222222] border-coffee/20 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="milkPerLatte" className="dark:text-gray-300">Milk per Latte (oz)</Label>
                  <Input
                    id="milkPerLatte"
                    type="number"
                    value={costSettings.milkPerLatte}
                    onChange={(e) => handleCostSettingChange('milkPerLatte', e.target.value)}
                    className="bg-white dark:bg-[#222222] border-coffee/20 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="syrupPricePerLatte" className="dark:text-gray-300">Syrup Price per Latte ($)</Label>
                  <Input
                    id="syrupPricePerLatte"
                    type="number"
                    step="0.01"
                    value={costSettings.syrupPricePerLatte}
                    onChange={(e) => handleCostSettingChange('syrupPricePerLatte', e.target.value)}
                    className="bg-white dark:bg-[#222222] border-coffee/20 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                  />
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