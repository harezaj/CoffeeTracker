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
      
      Format your response as a JSON array of exactly 3 coffee beans. Each bean should have these properties:
      roaster (string), name (string), origin (string), roastLevel (string), notes (array of strings), 
      price (number), weight (number in grams).
      
      Example format:
      [
        {
          "roaster": "Counter Culture",
          "name": "Big Trouble",
          "origin": "Latin America",
          "roastLevel": "Medium",
          "notes": ["Caramel", "Nuts", "Chocolate"],
          "price": 17.99,
          "weight": 340
        }
      ]`;
  } else {
    const topRatedBeans = request.journalEntries
      ?.sort((a, b) => b.rank - a.rank)
      .slice(0, 3);

    prompt = `As a coffee expert, analyze these highly rated coffees from my journal:
      ${JSON.stringify(topRatedBeans, null, 2)}
      
      Recommend 3 specific coffee beans similar to these. Format your response as a JSON array of exactly 3 coffee beans.
      Each bean should have these properties:
      roaster (string), name (string), origin (string), roastLevel (string), notes (array of strings), 
      price (number), weight (number in grams).`;
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
            content: 'You are a coffee expert. Always respond with valid JSON arrays containing coffee recommendations.'
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

    // Extract the content from the AI response
    const content = data.choices[0].message.content;
    
    // Find the JSON array in the response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No valid JSON array found in AI response');
    }

    // Parse the JSON array
    const recommendations = JSON.parse(jsonMatch[0]);

    // Convert the parsed recommendations to CoffeeBean objects
    return recommendations.map((rec: any, index: number) => ({
      id: `ai-rec-${index}`,
      roaster: rec.roaster,
      name: rec.name,
      origin: rec.origin,
      roastLevel: rec.roastLevel,
      notes: rec.notes,
      rank: 0,
      gramsIn: 18,
      mlOut: 36,
      brewTime: 28,
      temperature: 93,
      price: rec.price,
      weight: rec.weight,
      orderAgain: false,
      grindSize: 15,
    }));
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw error;
  }
};