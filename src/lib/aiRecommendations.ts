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
      
      Return only a valid JSON array of exactly 3 coffee beans, no markdown, no comments.
      Each bean must have: roaster (string), name (string), origin (string), roastLevel (string), 
      notes (array of strings), price (number), weight (number in grams).`;
  } else {
    const topRatedBeans = request.journalEntries
      ?.filter(bean => bean.rank >= 4)
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

    prompt = `Based on these preferences from user's highest rated coffees:
      - Favorite notes: ${commonNotes?.join(', ')}
      - Preferred roasts: ${Object.entries(roastPreference || {}).map(([level, count]) => `${level} (${count}x)`).join(', ')}
      
      Return only a valid JSON array of exactly 3 coffee bean recommendations, no markdown, no comments.
      Each bean must have: roaster (string), name (string), origin (string), roastLevel (string), 
      notes (array of strings), price (number), weight (number in grams).`;
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
            content: 'You are a coffee expert. Return only valid JSON, no markdown, no comments.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
      signal,
    });

    if (!response.ok) {
      throw new Error('Failed to get AI recommendations');
    }

    const data = await response.json();
    console.log("AI response:", data);

    const content = data.choices[0].message.content;
    // Clean the content to ensure it's valid JSON
    const cleanedContent = content
      .replace(/```json\s*|\s*```/g, '') // Remove markdown code blocks
      .replace(/\/\/.*/g, '') // Remove single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove multi-line comments

    const recommendations = JSON.parse(cleanedContent);

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
      generalNotes: "",
    }));
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw error;
  }
};