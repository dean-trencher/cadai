import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    console.log('Received messages:', messages);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `You are a CAD AI assistant that creates 3D objects. Always respond with a JSON object containing:
1. "description": Brief explanation of the object
2. "parameters": Object with these exact properties:
   - length (number): Length in mm (50-200)
   - width (number): Width in mm (10-100)
   - height (number): Height in mm (10-100)
   - holeDiameter (number): Hole diameter in mm (4-20)
   - holeSpacing (number): Spacing between holes in mm (10-50)
   - filletRadius (number): Fillet radius in mm (1-10)

Example response:
{
  "description": "A laptop stand with elevated design",
  "parameters": {
    "length": 150,
    "width": 30,
    "height": 25,
    "holeDiameter": 8,
    "holeSpacing": 20,
    "filletRadius": 3
  }
}

Always include both description and parameters in your response.` 
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);
    
    const aiMessage = data.choices[0].message.content;

    return new Response(JSON.stringify({ message: aiMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-completion function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
