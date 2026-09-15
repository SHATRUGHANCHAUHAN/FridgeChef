'use server';

/**
 * @fileOverview Generates recipes based on ingredients and contextual factors like mood, weather, and meal type.
 *
 * - generateRecipes - A function that takes ingredients and context to return recipes.
 * - GenerateRecipesInput - The input type for the generateRecipes function.
 * - GenerateRecipesOutput - The return type for the generateRecipes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipesInputSchema = z.object({
  ingredients: z
    .string()
    .describe("A comma-separated list of ingredients the user has available."),
  language: z.string().describe("The language to generate the recipes in.").optional(),
  mood: z.string().describe("The user's current mood (e.g., Happy, Tired).").optional(),
  weather: z.string().describe("The current weather (e.g., Rainy, Sunny).").optional(),
  day: z.string().describe("The current day of the week.").optional(),
  festival: z.string().describe("Any special occasion or festival.").optional(),
  mealType: z.string().describe("The type of meal (e.g., Breakfast, Lunch, Dinner).").optional(),
});
export type GenerateRecipesInput = z.infer<typeof GenerateRecipesInputSchema>;

const RecipeSchema = z.object({
  title: z.string().describe('The title of the recipe.'),
  ingredients: z.array(z.string()).describe('A list of ingredients required for the recipe.'),
  instructions: z.array(z.string()).describe('Detailed, step-by-step instructions for preparing the recipe.'),
});

const GenerateRecipesOutputSchema = z.array(RecipeSchema).describe('A list of recipes tailored to ingredients and context.');
export type GenerateRecipesOutput = z.infer<typeof GenerateRecipesOutputSchema>;

export async function generateRecipes(input: GenerateRecipesInput): Promise<GenerateRecipesOutput> {
  return generateRecipesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipesPrompt',
  input: {schema: GenerateRecipesInputSchema},
  output: {schema: GenerateRecipesOutputSchema},
  prompt: `You are a world-class chef and culinary psychologist. 
  
  Given the following ingredients, suggest a list of recipes. 
  
  **Contextual Personalization:**
  - **Meal Type:** {{{mealType}}} (Crucial: Suggest appropriate food for this time of day)
  - **Mood:** {{{mood}}} (Suggest food that complements or improves this mood)
  - **Weather:** {{{weather}}} (Suggest comfort food for cold/rainy, light food for hot/sunny)
  - **Day:** {{{day}}} (Consider quick meals for weekdays or more involved ones for weekends)
  - **Occasion/Festival:** {{{festival}}} (If provided, try to incorporate traditional or celebratory elements)

  For each recipe, provide detailed, step-by-step instructions. Return instructions as a list of strings.

  Generate the entire response in the following language: {{{language}}}.

  Ingredients: {{{ingredients}}}

  Recipes:`,
});

const generateRecipesFlow = ai.defineFlow(
  {
    name: 'generateRecipesFlow',
    inputSchema: GenerateRecipesInputSchema,
    outputSchema: GenerateRecipesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
