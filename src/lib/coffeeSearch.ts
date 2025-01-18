export interface CoffeeDetails {
  origin?: string;
  roastLevel?: string;
  notes?: string[];
  recommendedDose?: number;
  recommendedYield?: number;
  recommendedBrewTime?: number;
  price?: number;
  weight?: number;
  temperature?: number;
  grindSize?: number;
  sources?: string[];
}

export async function searchCoffeeDetails(
  roaster: string,
  name: string,
  apiKey: string
): Promise<CoffeeDetails> {
  console.log("Searching coffee details for:", roaster, name);
  
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
            content: 'You are a coffee expert assistant. Return only a valid JSON object with coffee details, no markdown, no comments.'
          },
          {
            role: 'user',
            content: `Find details about this coffee:
              Roaster: ${roaster}
              Name: ${name}
              
              Return a JSON object with these fields (include only if confident):
              {
                "origin": "Country or region of origin",
                "roastLevel": "One of: Light, Medium-Light, Medium, Medium-Dark, Dark",
                "notes": ["Array of flavor notes"],
                "recommendedDose": number (in grams),
                "recommendedYield": number (in ml),
                "recommendedBrewTime": number (in seconds),
                "price": number (in USD),
                "weight": number (in grams),
                "temperature": number (in Celsius),
                "grindSize": number (from 1-30),
                "sources": ["Array of sources used"]
              }`
          }
        ],
        temperature: 0.1,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      console.error('API response not ok:', await response.text());
      throw new Error('Failed to fetch coffee details');
    }

    const data = await response.json();
    console.log("API response:", data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid API response format');
    }

    const content = data.choices[0].message.content;
    console.log("Raw content:", content);

    // Clean the content to ensure it's valid JSON
    const cleanedContent = content
      .replace(/```json\s*|\s*```/g, '') // Remove markdown code blocks
      .replace(/\/\/.*/g, '') // Remove single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove multi-line comments

    const parsedData = JSON.parse(cleanedContent);
    console.log("Parsed data:", parsedData);

    // Validate and clean the data
    const cleanedData: CoffeeDetails = {
      origin: typeof parsedData.origin === 'string' ? parsedData.origin : undefined,
      roastLevel: ['Light', 'Medium-Light', 'Medium', 'Medium-Dark', 'Dark'].includes(parsedData.roastLevel) 
        ? parsedData.roastLevel 
        : undefined,
      notes: Array.isArray(parsedData.notes) ? parsedData.notes.filter(note => typeof note === 'string') : undefined,
      recommendedDose: typeof parsedData.recommendedDose === 'number' ? Math.round(parsedData.recommendedDose * 10) / 10 : undefined,
      recommendedYield: typeof parsedData.recommendedYield === 'number' ? Math.round(parsedData.recommendedYield) : undefined,
      recommendedBrewTime: typeof parsedData.recommendedBrewTime === 'number' ? Math.round(parsedData.recommendedBrewTime) : undefined,
      price: typeof parsedData.price === 'number' ? Math.round(parsedData.price * 100) / 100 : undefined,
      weight: typeof parsedData.weight === 'number' ? Math.round(parsedData.weight) : undefined,
      temperature: typeof parsedData.temperature === 'number' ? Math.round(parsedData.temperature) : undefined,
      grindSize: typeof parsedData.grindSize === 'number' ? Math.round(parsedData.grindSize) : undefined,
      sources: Array.isArray(parsedData.sources) ? parsedData.sources.filter(source => typeof source === 'string') : undefined,
    };

    console.log("Cleaned data:", cleanedData);
    return cleanedData;
  } catch (error) {
    console.error('Error in searchCoffeeDetails:', error);
    throw error;
  }
}