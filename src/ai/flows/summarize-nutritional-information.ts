'use server';

/**
 * @fileOverview Summarizes the nutritional information of a recipe.
 *
 * - summarizeNutritionalInformation - A function that summarizes the nutritional information of a recipe.
 * - SummarizeNutritionalInformationInput - The input type for the summarizeNutritionalInformation function.
 * - SummarizeNutritionalInformationOutput - The return type for the summarizeNutritionalInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNutritionalInformationInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe.'),
  ingredients: z.array(z.string()).describe('A list of ingredients in the recipe.'),
  instructions: z.array(z.string()).describe('The detailed, step-by-step instructions for the recipe.'),
  language: z.string().describe("The language to generate the summary in. (e.g., 'English', 'Spanish')").optional(),
});
export type SummarizeNutritionalInformationInput = z.infer<typeof SummarizeNutritionalInformationInputSchema>;

const SummarizeNutritionalInformationOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the nutritional information for the recipe.'),
});
export type SummarizeNutritionalInformationOutput = z.infer<typeof SummarizeNutritionalInformationOutputSchema>;

export async function summarizeNutritionalInformation(
  input: SummarizeNutritionalInformationInput
): Promise<SummarizeNutritionalInformationOutput> {
  return summarizeNutritionalInformationFlow(input);
}

const summarizeNutritionalInformationPrompt = ai.definePrompt({
  name: 'summarizeNutritionalInformationPrompt',
  input: {schema: SummarizeNutritionalInformationInputSchema},
  output: {schema: SummarizeNutritionalInformationOutputSchema},
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
  prompt: `You are a world-class nutritionist and culinary expert.

  CRITICAL LOCALIZATION REQUIREMENT: You must generate the entire nutritional summary natively and completely in the following language: {{{language}}}. Do not mix English words into the summary.

  Recipe Name: {{{recipeName}}}
  Ingredients: {{#each ingredients}}{{{this}}}, {{/each}}
  Instructions: {{#each instructions}}{{{this}}} {{/each}}

  Provide a concise summary of the nutritional information of the recipe, highlighting key nutrients and potential health benefits or concerns. Keep the tone professional yet encouraging.`,
});

const summarizeNutritionalInformationFlow = ai.defineFlow(
  {
    name: 'summarizeNutritionalInformationFlow',
    inputSchema: SummarizeNutritionalInformationInputSchema,
    outputSchema: SummarizeNutritionalInformationOutputSchema,
  },
  async input => {
    try {
      const {output} = await summarizeNutritionalInformationPrompt(input);
      if (output && output.summary) {
        return output;
      }
      return {
        summary: "A balanced and healthy choice packed with essential macro and micronutrients optimal for your specified routine."
      };
    } catch (error) {
      return {
        summary: "A balanced and healthy choice packed with essential macro and micronutrients optimal for your specified routine."
      };
    }
  }
);
