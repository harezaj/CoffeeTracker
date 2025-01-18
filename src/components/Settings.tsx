import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { TestTube2, Upload, Mail } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

interface CostSettings {
  milkPrice: number;
  milkSize: number;
  milkPerLatte: number;
  syrupPrice: number;
  syrupSize: number;
  syrupPerLatte: number;
}

export function Settings() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('perplexity-api-key') || '');
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [milkUnit, setMilkUnit] = useState('ml');
  const [syrupUnit, setSyrupUnit] = useState('ml');
  const [costSettings, setCostSettings] = useState<CostSettings>(() => {
    const saved = localStorage.getItem('costSettings');
    return saved ? JSON.parse(saved) : {
      milkPrice: 4.99,
      milkSize: 1000,
      milkPerLatte: 200,
      syrupPrice: 12.99,
      syrupSize: 750,
      syrupPerLatte: 30,
    };
  });
  
  const [webhookUrl, setWebhookUrl] = useState(() => 
    localStorage.getItem('webhook-url') || ''
  );
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);

  const convertToMl = (value: number, fromUnit: string) => {
    return fromUnit === 'oz' ? value * 29.5735 : value;
  };

  const convertFromMl = (value: number, toUnit: string) => {
    return toUnit === 'oz' ? value / 29.5735 : value;
  };

  const handleCostSettingChange = (key: keyof CostSettings, value: string) => {
    let numValue = parseFloat(value) || 0;
    
    // Convert to ml for storage if the input was in oz
    if ((key === 'milkSize' || key === 'milkPerLatte') && milkUnit === 'oz') {
      numValue = convertToMl(numValue, 'oz');
    }
    if ((key === 'syrupSize' || key === 'syrupPerLatte') && syrupUnit === 'oz') {
      numValue = convertToMl(numValue, 'oz');
    }

    const newSettings = { ...costSettings, [key]: numValue };
    setCostSettings(newSettings);
    localStorage.setItem('costSettings', JSON.stringify(newSettings));
    toast({
      title: "Settings Updated",
      description: "Cost analysis settings have been saved.",
    });
  };

  const handleUnitChange = (type: 'milk' | 'syrup', newUnit: string) => {
    if (type === 'milk') {
      setMilkUnit(newUnit);
    } else {
      setSyrupUnit(newUnit);
    }
  };

  const getDisplayValue = (value: number, type: 'milk' | 'syrup') => {
    const unit = type === 'milk' ? milkUnit : syrupUnit;
    return convertFromMl(value, unit).toFixed(2);
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setApiKey(newKey);
    localStorage.setItem('perplexity-api-key', newKey);
    toast({
      title: "API Key Updated",
      description: "Your Perplexity API key has been saved.",
    });
  };

  const handleImport = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const jsonData = JSON.parse(e.target?.result as string);
            localStorage.setItem('coffeeBeans', JSON.stringify(jsonData));
            toast({
              title: "Success",
              description: "Coffee beans have been imported successfully. Please refresh the page to see the changes.",
            });
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to parse JSON file.",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      };

      input.click();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import coffee beans.",
        variant: "destructive",
      });
    }
  };

  const testApiConnection = async () => {
    if (!apiKey) {
      toast({
        title: "Error",
        description: "Please enter an API key first",
        variant: "destructive",
      });
      return;
    }

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
              content: 'Test connection'
            }
          ],
          max_tokens: 10
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "API connection test successful!",
        });
      } else {
        const error = await response.json();
        throw new Error(error.error?.message || 'API test failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to test API connection",
        variant: "destructive",
      });
    } finally {
      setIsTestingApi(false);
    }
  };

  const handleWebhookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWebhook = e.target.value;
    setWebhookUrl(newWebhook);
    localStorage.setItem('webhook-url', newWebhook);
    toast({
      title: "Webhook URL Updated",
      description: "Your Make.com webhook URL has been saved.",
    });
  };

  const testWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter a Make.com webhook URL first",
        variant: "destructive",
      });
      return;
    }

    setIsTestingWebhook(true);
    try {
      const beans = localStorage.getItem('coffeeBeans');
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          triggered_from: window.location.origin,
          coffee_data: beans,
        }),
      });

      toast({
        title: "Request Sent",
        description: "Test data was sent to Make.com. Please check your scenario's history to confirm it was triggered.",
      });
    } catch (error) {
      console.error("Error triggering webhook:", error);
      toast({
        title: "Error",
        description: "Failed to trigger the Make.com webhook. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="bg-cream border-coffee/20 text-coffee-dark hover:bg-cream-dark/10">
          Settings
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div>
            <Label htmlFor="perplexity-api-key">
              Perplexity API Key
            </Label>
            <div className="mt-2 flex gap-2">
              <Input
                id="perplexity-api-key"
                type="password"
                value={apiKey}
                onChange={handleApiKeyChange}
                placeholder="Enter your Perplexity API key"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="default"
                onClick={testApiConnection}
                disabled={isTestingApi}
                className="flex items-center gap-2 bg-cream border-coffee/20 text-coffee-dark hover:bg-cream-dark/10"
              >
                <TestTube2 className="h-4 w-4" />
                {isTestingApi ? "Testing..." : "Test"}
              </Button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              This API key will be used for auto-populating coffee details throughout the application.
            </p>
          </div>

          <div className="space-y-4">
            <Label>Daily Backup Settings</Label>
            <div className="space-y-2">
              <Label htmlFor="webhook">
                Make.com Webhook URL
              </Label>
              <div className="mt-2 flex gap-2">
                <Input
                  id="webhook"
                  type="url"
                  value={webhookUrl}
                  onChange={handleWebhookChange}
                  placeholder="Enter your Make.com webhook URL"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="default"
                  onClick={testWebhook}
                  disabled={isTestingWebhook}
                  className="flex items-center gap-2 bg-cream border-coffee/20 text-coffee-dark hover:bg-cream-dark/10"
                >
                  <Mail className="h-4 w-4" />
                  {isTestingWebhook ? "Testing..." : "Test"}
                </Button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Create a scenario in Make.com that triggers on webhook and sends an email with the data. The webhook will be called daily to backup your coffee journal.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Cost Analysis Settings</Label>
            
            <div className="space-y-2">
              <Label htmlFor="milk-price">Milk Price ($)</Label>
              <Input
                id="milk-price"
                type="number"
                value={costSettings.milkPrice}
                onChange={(e) => handleCostSettingChange('milkPrice', e.target.value)}
                step="0.01"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="milk-size">Milk Container Size</Label>
                <ToggleGroup
                  type="single"
                  value={milkUnit}
                  onValueChange={(value) => value && handleUnitChange('milk', value)}
                  className="border rounded-md"
                >
                  <ToggleGroupItem value="ml" className="px-2 py-1">ml</ToggleGroupItem>
                  <ToggleGroupItem value="oz" className="px-2 py-1">oz</ToggleGroupItem>
                </ToggleGroup>
              </div>
              <Input
                id="milk-size"
                type="number"
                value={getDisplayValue(costSettings.milkSize, 'milk')}
                onChange={(e) => handleCostSettingChange('milkSize', e.target.value)}
                min="0"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="milk-per-latte">Milk per Latte</Label>
                <span className="text-sm text-gray-500">{milkUnit}</span>
              </div>
              <Input
                id="milk-per-latte"
                type="number"
                value={getDisplayValue(costSettings.milkPerLatte, 'milk')}
                onChange={(e) => handleCostSettingChange('milkPerLatte', e.target.value)}
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="syrup-price">Syrup Price ($)</Label>
              <Input
                id="syrup-price"
                type="number"
                value={costSettings.syrupPrice}
                onChange={(e) => handleCostSettingChange('syrupPrice', e.target.value)}
                step="0.01"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="syrup-size">Syrup Bottle Size</Label>
                <ToggleGroup
                  type="single"
                  value={syrupUnit}
                  onValueChange={(value) => value && handleUnitChange('syrup', value)}
                  className="border rounded-md"
                >
                  <ToggleGroupItem value="ml" className="px-2 py-1">ml</ToggleGroupItem>
                  <ToggleGroupItem value="oz" className="px-2 py-1">oz</ToggleGroupItem>
                </ToggleGroup>
              </div>
              <Input
                id="syrup-size"
                type="number"
                value={getDisplayValue(costSettings.syrupSize, 'syrup')}
                onChange={(e) => handleCostSettingChange('syrupSize', e.target.value)}
                min="0"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="syrup-per-latte">Syrup per Latte</Label>
                <span className="text-sm text-gray-500">{syrupUnit}</span>
              </div>
              <Input
                id="syrup-per-latte"
                type="number"
                value={getDisplayValue(costSettings.syrupPerLatte, 'syrup')}
                onChange={(e) => handleCostSettingChange('syrupPerLatte', e.target.value)}
                min="0"
              />
            </div>
          </div>

          <div>
            <Label>Data Management</Label>
            <div className="mt-2">
              <Button
                variant="outline"
                className="w-full flex items-center gap-2 bg-cream border-coffee/20 text-coffee-dark hover:bg-cream-dark/10"
                onClick={handleImport}
              >
                <Upload className="h-4 w-4" />
                Import Data
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
