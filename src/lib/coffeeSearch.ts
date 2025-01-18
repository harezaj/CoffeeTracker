export const searchCoffeeDetails = async (roaster: string, beanName: string, apiKey: string) => {
  const prompt = `As a coffee expert, provide detailed information about the "${beanName}" coffee bean from "${roaster}" roaster.
  Format your response as a JSON object with these properties:
  - origin (string, the country or region of origin)
  - roastLevel (string: "Light", "Medium-Light", "Medium", "Medium-Dark", or "Dark")
  - notes (array of strings representing flavor notes)
  - recommendedDose (number in grams)
  - recommendedYield (number in ml)
  - recommendedBrewTime (number in seconds)
  - price (number in USD)
  - weight (number in grams, typical package size)
  - temperature (number in Celsius)
  - grindSize (number between 1-30)
  
  Only include properties if you are confident about the information.
  Example format:
  {
    "origin": "Ethiopia",
    "roastLevel": "Medium",
    "notes": ["Chocolate", "Caramel", "Nuts"],
    "recommendedDose": 18,
    "recommendedYield": 36,
    "recommendedBrewTime": 28,
    "price": 19.99,
    "weight": 340,
    "temperature": 93,
    "grindSize": 15
  }`;

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
            content: 'You are a coffee expert with extensive knowledge of specialty coffee roasters and their offerings.'
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
      throw new Error('Failed to fetch coffee details');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error searching coffee details:', error);
    throw error;
  }
};