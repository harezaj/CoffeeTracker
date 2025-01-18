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
  apiKey: string,
  { signal }: { signal?: AbortSignal } = {}
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
      ?.filter(bean => bean.rank >= 4) // Only consider highly rated beans
      .sort((a, b) => b.rank - a.rank)
      .slice(0, 3);

    const commonNotes = topRatedBeans?.reduce((acc, bean) => {
      bean.notes.forEach(note => {
        if (!acc.includes(note)) acc.push(note);
      });
      return acc;
    }, [] as string[]);

    const roastPreference = topRatedBeans?.reduce((acc, bean) => {
      acc[bean.roastLevel] = (acc[bean.roastLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const favoriteRoasters = topRatedBeans?.map(bean => bean.roaster);

    prompt = `As a coffee expert, analyze these highly rated coffees from the user's journal:
      ${JSON.stringify(topRatedBeans, null, 2)}
      
      Key preferences identified:
      - Favorite flavor notes: ${commonNotes?.join(', ')}
      - Preferred roast levels: ${Object.entries(roastPreference || {}).map(([level, count]) => `${level} (${count}x)`).join(', ')}
      - Favorite roasters: ${favoriteRoasters?.join(', ')}
      
      Based on this analysis, recommend 3 specific coffee beans that would appeal to this user's taste profile.
      Consider these factors:
      1. Similar flavor profiles to their highest-rated coffees
      2. Matching roast level preferences
      3. Beans from roasters they trust or similar specialty coffee roasters
      4. Price points similar to their previous purchases
      
      Format your response as a JSON array of exactly 3 coffee beans.
      Each bean should have these properties:
      roaster (string), name (string), origin (string), roastLevel (string), notes (array of strings), 
      price (number), weight (number in grams).
      
      Make sure each recommendation includes:
      - A clear explanation of why it matches their preferences
      - Specific flavor notes that align with their taste profile
      - A roast level that matches their preferences
      - A price point similar to their previous purchases`;
  }

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a coffee expert specializing in specialty coffee recommendations. You have extensive knowledge of coffee roasters, origins, processing methods, and flavor profiles. Always provide specific, actionable recommendations based on user preferences and patterns.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
      signal, // Add the AbortController signal here
    });

    if (!response.ok) {
      throw new Error('Failed to get AI recommendations');
    }

    const data = await response.json();
    console.log("AI response:", data);

    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No valid JSON array found in AI response');
    }

    const recommendations = JSON.parse(jsonMatch[0]);

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
      generalNotes: rec.explanation || "", // Adding explanation from AI
    }));
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw error;
  }
};