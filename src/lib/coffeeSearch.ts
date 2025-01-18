export const searchCoffeeDetails = async (roaster: string, name: string, apiKey: string) => {
  const prompt = `Find details about this coffee bean from ${roaster} called "${name}".
  
Return a JSON object with ONLY these properties, using null for unknown values:
{
  "origin": "country or region name",
  "roastLevel": one of ["Light", "Medium-Light", "Medium", "Medium-Dark", "Dark"],
  "notes": ["note1", "note2", etc],
  "recommendedDose": number in grams (e.g. 18),
  "recommendedYield": number in ml (e.g. 36),
  "recommendedBrewTime": number in seconds (e.g. 25-35),
  "price": number in USD (e.g. 19.99),
  "weight": number in grams (e.g. 340),
  "temperature": number in Celsius (e.g. 93-96),
  "grindSize": number from 1-30 (where 1 is finest, 30 is coarsest),
  "sources": ["url1", "url2", etc]
}

Rules:
1. Return ONLY the JSON object, no other text
2. Use null for unknown values, don't guess
3. For arrays (notes, sources), use empty array [] if none found
4. All numbers must be plain numbers without units or ranges
5. Temperature must be in Celsius
6. Weight must be in grams`;

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
            content: 'You are a coffee expert API. Return only valid JSON objects with the exact structure requested. No explanations, no markdown, no additional text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch coffee details');
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();

    // Remove any potential markdown code block markers
    content = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    
    // Remove any text before the first { and after the last }
    content = content.substring(
      content.indexOf('{'),
      content.lastIndexOf('}') + 1
    );

    try {
      const parsedDetails = JSON.parse(content);

      // Type validation and cleanup
      const validatedDetails = {
        origin: typeof parsedDetails.origin === 'string' ? parsedDetails.origin : null,
        roastLevel: ['Light', 'Medium-Light', 'Medium', 'Medium-Dark', 'Dark'].includes(parsedDetails.roastLevel) 
          ? parsedDetails.roastLevel 
          : null,
        notes: Array.isArray(parsedDetails.notes) 
          ? parsedDetails.notes.filter(note => typeof note === 'string')
          : [],
        recommendedDose: typeof parsedDetails.recommendedDose === 'number' && !isNaN(parsedDetails.recommendedDose)
          ? Math.round(parsedDetails.recommendedDose * 10) / 10
          : null,
        recommendedYield: typeof parsedDetails.recommendedYield === 'number' && !isNaN(parsedDetails.recommendedYield)
          ? Math.round(parsedDetails.recommendedYield)
          : null,
        recommendedBrewTime: typeof parsedDetails.recommendedBrewTime === 'number' && !isNaN(parsedDetails.recommendedBrewTime)
          ? Math.round(parsedDetails.recommendedBrewTime)
          : null,
        price: typeof parsedDetails.price === 'number' && !isNaN(parsedDetails.price)
          ? Math.round(parsedDetails.price * 100) / 100
          : null,
        weight: typeof parsedDetails.weight === 'number' && !isNaN(parsedDetails.weight)
          ? Math.round(parsedDetails.weight)
          : null,
        temperature: typeof parsedDetails.temperature === 'number' && !isNaN(parsedDetails.temperature)
          ? Math.round(parsedDetails.temperature)
          : null,
        grindSize: typeof parsedDetails.grindSize === 'number' && !isNaN(parsedDetails.grindSize)
          ? Math.round(parsedDetails.grindSize)
          : null,
        sources: Array.isArray(parsedDetails.sources)
          ? parsedDetails.sources.filter(source => typeof source === 'string')
          : []
      };

      console.log('Validated coffee details:', validatedDetails);
      return validatedDetails;
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      console.log('Raw content:', data.choices[0].message.content);
      console.log('Cleaned content:', content);
      throw new Error('Invalid JSON response from API');
    }
  } catch (error) {
    console.error('Error searching coffee details:', error);
    throw error;
  }
};