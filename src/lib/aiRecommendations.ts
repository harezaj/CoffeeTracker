import { CoffeeBean } from "@/components/CoffeeCard";

interface RecommendationRequest {
  type: "preferences" | "journal";
  preferences?: {
    roastLevel: string;
    notes: string;
    priceRange: string;
  };
  journalEntries?: CoffeeBean[];
}

export const getAIRecommendations = async (
  request: RecommendationRequest,
  apiKey: string
): Promise<CoffeeBean[]> => {
  console.log("Getting AI recommendations for:", request);

  let prompt = "";
  if (request.type === "preferences") {
    prompt = `As a coffee expert, recommend 3 specific coffee beans that match these preferences:
      - Roast Level: ${request.preferences?.roastLevel}
      - Desired Flavor Notes: ${request.preferences?.notes}
      - Price Range: ${request.preferences?.priceRange}
      
      Format each recommendation as a coffee bean with these exact properties:
      roaster, name, origin, roastLevel, notes (as array), price, weight (in grams).
      Focus on real, available coffees from known roasters.`;
  } else {
    const topRatedBeans = request.journalEntries
      ?.sort((a, b) => b.rank - a.rank)
      .slice(0, 3);

    prompt = `As a coffee expert, analyze these highly rated coffees from my journal:
      ${JSON.stringify(topRatedBeans, null, 2)}
      
      Recommend 3 specific coffee beans that match my taste profile based on these entries.
      Format each recommendation as a coffee bean with these exact properties:
      roaster, name, origin, roastLevel, notes (as array), price, weight (in grams).
      Focus on real, available coffees from known roasters.`;
  }

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
            content: 'You are a coffee expert who provides specific, real-world coffee recommendations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI recommendations');
    }

    const data = await response.json();
    console.log("AI response:", data);

    // Parse the AI response and convert it to CoffeeBean objects
    // This is a simplified example - you'd need to parse the actual AI response
    const recommendations: CoffeeBean[] = data.choices[0].message.content
      .split('\n\n')
      .map((rec: string, index: number) => ({
        id: `ai-rec-${index}`,
        roaster: "Sample Roaster",
        name: "AI Recommended Coffee",
        origin: "Various",
        roastLevel: "Medium",
        notes: ["Chocolate", "Nutty"],
        rank: 0,
        gramsIn: 18,
        mlOut: 36,
        brewTime: 28,
        temperature: 93,
        price: 16.99,
        weight: 250,
        orderAgain: false,
        grindSize: 15,
      }));

    return recommendations;
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw error;
  }
};