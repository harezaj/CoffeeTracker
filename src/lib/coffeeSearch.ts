export const searchCoffeeDetails = async (roaster: string, name: string, apiKey: string) => {
  const prompt = `Find details about this coffee bean:
    Roaster: ${roaster}
    Bean Name: ${name}
    
    Return a JSON object with these properties (use null if not found):
    {
      "origin": string,
      "roastLevel": "Light" | "Medium-Light" | "Medium" | "Medium-Dark" | "Dark",
      "notes": string[],
      "recommendedDose": number (in grams),
      "recommendedYield": number (in ml),
      "recommendedBrewTime": number (in seconds),
      "price": number (in USD),
      "weight": number (in grams),
      "temperature": number (in Celsius),
      "grindSize": number (1-30 scale),
      "sources": string[]
    }
    
    Important: Ensure the response is valid JSON. Do not include any explanatory text outside the JSON object.`;

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
            content: 'You are a coffee expert. Provide accurate, detailed information about coffee beans. Return data in the exact JSON format requested, with no additional text or formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch coffee details');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Clean up the content to ensure we only have JSON
    const cleanedContent = content.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
    
    try {
      const details = JSON.parse(cleanedContent);
      console.log('Parsed coffee details:', details);
      
      // Validate the response structure
      const validatedDetails = {
        origin: details.origin || null,
        roastLevel: details.roastLevel || null,
        notes: Array.isArray(details.notes) ? details.notes : [],
        recommendedDose: typeof details.recommendedDose === 'number' ? details.recommendedDose : null,
        recommendedYield: typeof details.recommendedYield === 'number' ? details.recommendedYield : null,
        recommendedBrewTime: typeof details.recommendedBrewTime === 'number' ? details.recommendedBrewTime : null,
        price: typeof details.price === 'number' ? details.price : null,
        weight: typeof details.weight === 'number' ? details.weight : null,
        temperature: typeof details.temperature === 'number' ? details.temperature : null,
        grindSize: typeof details.grindSize === 'number' ? details.grindSize : null,
        sources: Array.isArray(details.sources) ? details.sources : []
      };

      return validatedDetails;
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      console.log('Content that failed to parse:', cleanedContent);
      throw new Error('Invalid JSON response from API');
    }
  } catch (error) {
    console.error('Error searching coffee details:', error);
    throw error;
  }
}