'use server';

import {
  generateRecipes,
  GenerateRecipesInput,
  GenerateRecipesOutput,
} from '@/ai/flows/generate-recipes-from-ingredients';
import {
  summarizeNutritionalInformation,
  SummarizeNutritionalInformationInput,
} from '@/ai/flows/summarize-nutritional-information';
import {
  generateRecipeImage,
  GenerateRecipeImageInput,
} from '@/ai/flows/generate-recipe-image';
import { z } from 'zod';

const GenerateRecipesActionSchema = z.object({
  ingredients: z.string().min(3, { message: 'Please enter at least one ingredient.' }),
  language: z.string(),
  mood: z.string().optional(),
  weather: z.string().optional(),
  day: z.string().optional(),
  festival: z.string().optional(),
  mealType: z.string().optional(),
});

type GenerateRecipesActionResult = 
  | { success: true; data: GenerateRecipesOutput }
  | { success: false; error: string };

export async function generateRecipesAction(
  prevState: any,
  formData: FormData
): Promise<GenerateRecipesActionResult> {
  const validatedFields = GenerateRecipesActionSchema.safeParse({
    ingredients: formData.get('ingredients'),
    language: formData.get('language'),
    mood: formData.get('mood'),
    weather: formData.get('weather'),
    day: formData.get('day'),
    festival: formData.get('festival'),
    mealType: formData.get('mealType'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors.ingredients?.[0] || 'Invalid input.',
    };
  }

  try {
    const recipes = await generateRecipes(validatedFields.data);
    if (recipes.length === 0) {
      return { success: false, error: 'Could not generate recipes. Try different ingredients or context.' };
    }
    return { success: true, data: recipes };
  } catch (error: any) {
    console.error('Error generating recipes:', error);
    return { success: false, error: error.message || 'An unexpected error occurred. Please try again later.' };
  }
}

type SummarizeNutritionalInfoActionResult =
  | { success: true; data: string }
  | { success: false; error: string };

export async function summarizeNutritionalInfoAction(
  input: SummarizeNutritionalInformationInput
): Promise<SummarizeNutritionalInfoActionResult> {
  try {
    const result = await summarizeNutritionalInformation(input);
    return { success: true, data: result.summary };
  } catch (error: any) {
    console.error('Error summarizing nutritional info:', error);
    return { success: false, error: error.message || 'Failed to get nutritional information.' };
  }
}

type GenerateRecipeImageActionResult =
  | { success: true; data: string }
  | { success: false; error: string };

export async function generateRecipeImageAction(
  input: GenerateRecipeImageInput
): Promise<GenerateRecipeImageActionResult> {
  try {
    const result = await generateRecipeImage(input);
    return { success: true, data: result.imageUrl };
  } catch (error: any) {
    console.error('Error generating recipe image:', error);
    return { success: false, error: error.message || 'Failed to generate recipe image.' };
  }
}
