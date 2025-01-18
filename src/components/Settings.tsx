import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { TestTube2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Settings() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('perplexity-api-key') || '');
  const [isTestingApi, setIsTestingApi] = useState(false);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setApiKey(newKey);
    localStorage.setItem('perplexity-api-key', newKey);
    toast({
      title: "API Key Updated",
      description: "Your Perplexity API key has been saved.",
    });
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
        <div className="mt-6">
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
      </SheetContent>
    </Sheet>
  );
}