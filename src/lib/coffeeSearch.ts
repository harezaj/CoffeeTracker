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
    }`;

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
            content: 'You are a coffee expert. Provide accurate, detailed information about coffee beans. Return data in the exact JSON format requested.'
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
    
    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const details = JSON.parse(jsonMatch[0]);
    console.log('Parsed coffee details:', details);
    return details;
  } catch (error) {
    console.error('Error searching coffee details:', error);
    throw error;
  }
}