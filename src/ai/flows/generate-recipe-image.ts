'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipeImageInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe to generate an image for.'),
});
export type GenerateRecipeImageInput = z.infer<typeof GenerateRecipeImageInputSchema>;

const GenerateRecipeImageOutputSchema = z.object({
  imageUrl: z.string().describe('The base64 data URI of the generated image.'),
});
export type GenerateRecipeImageOutput = z.infer<typeof GenerateRecipeImageOutputSchema>;

export async function generateRecipeImage(
  input: GenerateRecipeImageInput
): Promise<GenerateRecipeImageOutput> {
  return generateRecipeImageFlow(input);
}

const generateRecipeImageFlow = ai.defineFlow(
  {
    name: 'generateRecipeImageFlow',
    inputSchema: GenerateRecipeImageInputSchema,
    outputSchema: GenerateRecipeImageOutputSchema,
  },
  async input => {
    const { media } = await ai.generate({
      model: 'googleai/imagen-3.0-generate-001',
      prompt: `A professional, high-resolution food photography shot of ${input.recipeName}. Beautifully plated, delicious looking, cinematic studio lighting, high detail, vibrant culinary colors.`,
    });

    if (!media || !media.url) {
      throw new Error('Image generation returned no media result.');
    }

    return {
      imageUrl: media.url,
    };
  }
);
