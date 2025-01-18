import { CoffeeBean } from "@/components/CoffeeCard";

interface RecommendationRequest {
  type: "preferences" | "journal";
  preferences?: {
    roastLevel: string;
    notes: string;
    priceRange: string;
    brewMethod: string;
    minRating: number;
  };
  journalEntries?: CoffeeBean[];
}

const PREMIUM_US_ROASTERS = [
  "Onyx", "Counter Culture", "Intelligentsia", "Blue Bottle", "Stumptown",
  "Verve", "Heart", "Ritual", "Equator", "PT's", "Ruby", "Sweet Bloom",
  "George Howell", "Madcap", "Metric", "Passenger", "Red Bird", "Temple",
  "Olympia", "Brandywine", "Ceremony", "Commonwealth", "Dune", "Little Wolf"
];

export const getAIRecommendations = async (
  request: RecommendationRequest,
  apiKey: string,
  { signal }: { signal?: AbortSignal } = {}
): Promise<CoffeeBean[]> => {
  console.log("Getting AI recommendations for:", request);

  const isPremiumRequest = request.preferences?.priceRange === "premium" && 
                          request.preferences?.minRating >= 4;

  let prompt = "";
  if (request.type === "preferences") {
    prompt = `As a coffee expert, recommend 3 specific whole bean coffee products (NOT food items, NOT chocolate covered beans, ONLY coffee beans) that match these preferences:
      - Roast Level: ${request.preferences?.roastLevel}
      - Desired Flavor Notes: ${request.preferences?.notes}
      - Price Range: ${request.preferences?.priceRange}
      - Brew Method: ${request.preferences?.brewMethod}
      ${isPremiumRequest ? `ONLY recommend beans from these premium US roasters: ${PREMIUM_US_ROASTERS.join(', ')}` : 
      'Prioritize beans from established US specialty coffee roasters'}
      
      Return only a valid JSON array of exactly 3 coffee beans, no markdown, no comments.
      Each bean must have: roaster (string), name (string), origin (string), roastLevel (string), 
      notes (array of strings), price (number), weight (number in grams).
      
      IMPORTANT RULES:
      - ONLY recommend whole bean coffee products, no food items
      - Names should be actual coffee product names
      - Prices should be realistic for specialty coffee ($14-30 per bag)
      - Weight should be realistic (usually 250g-340g)`;
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
      
      Recommend 3 specific whole bean coffee products (NOT food items, NOT chocolate covered beans, ONLY coffee beans).
      ${isPremiumRequest ? `ONLY recommend beans from these premium US roasters: ${PREMIUM_US_ROASTERS.join(', ')}` : 
      'Prioritize beans from established US specialty coffee roasters'}
      
      Return only a valid JSON array of exactly 3 coffee beans, no markdown, no comments.
      Each bean must have: roaster (string), name (string), origin (string), roastLevel (string), 
      notes (array of strings), price (number), weight (number in grams).
      
      IMPORTANT RULES:
      - ONLY recommend whole bean coffee products, no food items
      - Names should be actual coffee product names
      - Prices should be realistic for specialty coffee ($14-30 per bag)
      - Weight should be realistic (usually 250g-340g)`;
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
            content: 'You are a coffee expert specializing in specialty coffee beans. Return only valid JSON, no markdown, no comments.'
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
    const cleanedContent = content
      .replace(/```json\s*|\s*```/g, '')
      .replace(/\/\/.*/g, '')
      .replace(/\/\*[\s\S]*?\*\//g, '');

    const recommendations = JSON.parse(cleanedContent);

    // Validate recommendations
    const validatedRecs = recommendations.filter((rec: any) => {
      // Ensure it's a coffee product (has required fields and realistic values)
      const isValidProduct = 
        rec.roaster && 
        rec.name && 
        rec.origin && 
        rec.roastLevel &&
        Array.isArray(rec.notes) &&
        typeof rec.price === 'number' &&
        typeof rec.weight === 'number' &&
        rec.price >= 14 && 
        rec.price <= 30 &&
        rec.weight >= 250 && 
        rec.weight <= 1000;

      // For premium requests, ensure roaster is in the premium list
      if (isPremiumRequest) {
        return isValidProduct && PREMIUM_US_ROASTERS.includes(rec.roaster);
      }

      return isValidProduct;
    });

    // If we don't have enough valid recommendations, throw an error
    if (validatedRecs.length < 3) {
      throw new Error('Not enough valid recommendations received');
    }

    return validatedRecs.slice(0, 3).map((rec: any, index: number) => ({
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
      grindSize: 10,
      generalNotes: "",
    }));
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw error;
  }
};