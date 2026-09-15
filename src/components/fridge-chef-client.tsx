'use client';

import { useState, useEffect, useActionState } from 'react';
import { generateRecipesAction, summarizeNutritionalInfoAction, generateRecipeImageAction } from '@/app/actions';
import type { GenerateRecipesOutput } from '@/ai/flows/generate-recipes-from-ingredients';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Logo } from '@/components/logo';
import { Input } from '@/components/ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  ChefHat, CookingPot, GlassWater, LeafyGreen, Loader2, Utensils, 
  Sparkles, BookOpen, Globe, Heart, CloudSun, Smile, PartyPopper, Clock
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils';

type Recipe = GenerateRecipesOutput[0];

const translations = {
  en: {
    whatsInYourFridge: "What's in your fridge?",
    placeholder: "e.g., rice, broccoli, soy sauce...",
    generateRecipes: "Generate Recipes",
    startNewSearch: "Start New Search",
    craftingCulinary: "Crafting your culinary creations...",
    aiChefWorking: "Our AI chef is looking through the pantry. Your recipes will be ready soon!",
    welcome: "Welcome to FridgeChef!",
    welcomeSub: "Enter ingredients, mood, and weather to get personalized recipe ideas.",
    recipeIdeas: "Recipe Ideas",
    ingredients: "Ingredients",
    nutritionalSummary: "Nutritional Summary",
    instructions: "Instructions",
    noNutrition: "No nutritional information available.",
    language: "Language",
    favorites: "Favorites",
    kitchenVibe: "Kitchen Vibe",
    mood: "Mood",
    weather: "Weather",
    festival: "Festival / Occasion",
    happy: "Happy",
    tired: "Tired",
    energetic: "Energetic",
    calm: "Calm",
    sunny: "Sunny",
    rainy: "Rainy",
    cold: "Cold",
    hot: "Hot",
    festivalPlaceholder: "e.g., Diwali, Christmas...",
    mealTime: "Meal Time",
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner"
  },
  es: {
    whatsInYourFridge: "¿Qué hay en tu nevera?",
    placeholder: "Ej., arroz, brócoli, salsa de soja...",
    generateRecipes: "Generar Recetas",
    startNewSearch: "Nueva Búsqueda",
    craftingCulinary: "Creando tus creaciones...",
    aiChefWorking: "Nuestro chef está en la despensa. ¡Listos en un momento!",
    welcome: "¡Bienvenido a FridgeChef!",
    welcomeSub: "Ingresa ingredientes, ánimo y clima para ideas personalizadas.",
    recipeIdeas: "Ideas de Recetas",
    ingredients: "Ingredientes",
    nutritionalSummary: "Resumen Nutricional",
    instructions: "Instrucciones",
    noNutrition: "Sin información nutricional.",
    language: "Idioma",
    favorites: "Favoritos",
    kitchenVibe: "Vibra de Cocina",
    mood: "Ánimo",
    weather: "Clima",
    festival: "Festival / Ocasión",
    happy: "Feliz",
    tired: "Cansado",
    energetic: "Enérgico",
    calm: "Tranquilo",
    sunny: "Soleado",
    rainy: "Lluvioso",
    cold: "Frío",
    hot: "Calor",
    festivalPlaceholder: "Ej., Navidad...",
    mealTime: "Hora de Comer",
    breakfast: "Desayuno",
    lunch: "Almuerzo",
    dinner: "Cena"
  },
  fr: {
    whatsInYourFridge: "Qu'y a-t-il dans votre frigo ?",
    placeholder: "Ex : riz, brocoli, sauce soja...",
    generateRecipes: "Générer des Recettes",
    startNewSearch: "Nouvelle Recherche",
    craftingCulinary: "Création de vos recettes...",
    aiChefWorking: "Notre chef IA regarde dans le garde-manger. Prêt bientôt !",
    welcome: "Bienvenue sur FridgeChef !",
    welcomeSub: "Entrez ingrédients, humeur et météo pour des idées personnalisées.",
    recipeIdeas: "Idées de Recettes",
    ingredients: "Ingrédients",
    nutritionalSummary: "Résumé Nutritionnel",
    instructions: "Instructions",
    noNutrition: "Aucune information nutritionnelle.",
    language: "Langue",
    favorites: "Favoris",
    kitchenVibe: "Ambiance Cuisine",
    mood: "Humeur",
    weather: "Météo",
    festival: "Festival / Occasion",
    happy: "Heureux",
    tired: "Fatigué",
    energetic: "Énergique",
    calm: "Calme",
    sunny: "Ensoleillé",
    rainy: "Pluvieux",
    cold: "Froid",
    hot: "Chaud",
    festivalPlaceholder: "Ex : Noël...",
    mealTime: "Moment du Repas",
    breakfast: "Petit Déjeuner",
    lunch: "Déjeuner",
    dinner: "Dîner"
  },
  hi: {
    whatsInYourFridge: "आपके फ्रिज में क्या है?",
    placeholder: "उदा., चावल, आलू, प्याज...",
    generateRecipes: "रेसिपी बनाएं",
    startNewSearch: "नई खोज",
    craftingCulinary: "आपकी स्वादिष्ट रेसिपी तैयार की जा रही हैं...",
    aiChefWorking: "हमारा एआई शेफ रसोई में देख रहा है। आपकी रेसिपी जल्द ही तैयार हो जाएंगी!",
    welcome: "FridgeChef में आपका स्वागत है!",
    welcomeSub: "व्यक्तिगत विचारों के लिए सामग्री, मूड और मौसम दर्ज करें।",
    recipeIdeas: "रेसिपी आइडिया",
    ingredients: "सामग्री",
    nutritionalSummary: "पोषण सारांश",
    instructions: "विधि",
    noNutrition: "कोई पोषण संबंधी जानकारी उपलब्ध नहीं है।",
    language: "भाषा",
    favorites: "पसंदीदा",
    kitchenVibe: "किचन वाइब",
    mood: "मूड",
    weather: "मौसम",
    festival: "त्योहार / अवसर",
    happy: "खुश",
    tired: "थका हुआ",
    energetic: "ऊर्जावान",
    calm: "शांत",
    sunny: "धूप",
    rainy: "बरसात",
    cold: "ठंड",
    hot: "गर्मी",
    festivalPlaceholder: "उदा., दिवाली, होली...",
    mealTime: "भोजन का समय",
    breakfast: "नाश्ता",
    lunch: "दोपहर का भोजन",
    dinner: "रात का खाना"
  },
  gu: {
    whatsInYourFridge: "તમારા ફ્રિજમાં શું છે?",
    placeholder: "દા.ત., ચોખા, બ્રોકોલી...",
    generateRecipes: "રેસિપી બનાવો",
    startNewSearch: "નવી શોધ",
    craftingCulinary: "તમારી વાનગીઓ તૈયાર થઈ રહી છે...",
    aiChefWorking: "અમારો AI શેફ રસોડામાં શોધી રહ્યો છે. તમારી રેસિપી ટૂંક સમયમાં તૈયાર થઈ જશે!",
    welcome: "FridgeChef માં સ્વાગત છે!",
    welcomeSub: "વ્યક્તિગત વિચારો માટે સામગ્રી, મૂડ અને હવામાન દાખલ કરો.",
    recipeIdeas: "રેસિપી આઈડિયા",
    ingredients: "સામગ્રી",
    nutritionalSummary: "પોષણ સારાંશ",
    instructions: "રીત",
    noNutrition: "કોઈ પોષણ માહિતી ઉપલબ્ધ નથી.",
    language: "ભાષા",
    favorites: "મનપસંદ",
    kitchenVibe: "রসওડું વાઇબ",
    mood: "મૂડ",
    weather: "હવામાન",
    festival: "તહેવાર / પ્રસંગ",
    happy: "ખુશ",
    tired: "થાકેલા",
    energetic: "ઉર્જાવાન",
    calm: "શાંત",
    sunny: "તડકો",
    rainy: "વરસાદ",
    cold: "ઠંડી",
    hot: "ગરમી",
    festivalPlaceholder: "દા.ત., દિવાળી...",
    mealTime: "જમવાનો સમય",
    breakfast: "નાસ્તો",
    lunch: "બપોરનું ભોજન",
    dinner: "રાત્રિનું ભોજન"
  },
  ta: {
    whatsInYourFridge: "உங்கள் பிரிட்ஜில் என்ன இருக்கிறது?",
    placeholder: "உதாரணமாக, அரிசி, வெங்காயம்...",
    generateRecipes: "சமையல் குறிப்புகளை உருவாக்கு",
    startNewSearch: "புதிய தேடல்",
    craftingCulinary: "உங்கள் சமையல் குறிப்புகள் தயாராகின்றன...",
    aiChefWorking: "எங்கள் AI செஃப் சமையலறையைச் சோதிக்கிறார். சமையல் குறிப்புகள் விரைவில் தயாராகும்!",
    welcome: "FridgeChefக்கு வரவேற்கிறோம்!",
    welcomeSub: "தனிப்பயனாக்கப்பட்ட யோசனைகளுக்கு பொருட்கள், மனநிலை மற்றும் வானிலையை உள்ளிடவும்.",
    recipeIdeas: "சமையல் யோசனைகள்",
    ingredients: "பொருட்கள்",
    nutritionalSummary: "ஊட்டச்சத்து சுருக்கம்",
    instructions: "செய்முறை",
    noNutrition: "ஊட்டச்சத்து தகவல் எதுவும் இல்லை.",
    language: "மொழி",
    favorites: "பிடித்தவை",
    kitchenVibe: "சமையலறை சூழல்",
    mood: "மனநிலை",
    weather: "வானிலை",
    festival: "திருவிழா / நிகழ்வு",
    happy: "மகிழ்ச்சி",
    tired: "சோர்வு",
    energetic: "துடிப்பு",
    calm: "அமைதி",
    sunny: "வெயில்",
    rainy: "மழை",
    cold: "குளிர்",
    hot: "வெப்பம்",
    festivalPlaceholder: "உதாரணமாக, தீபாவளி...",
    mealTime: "உணவு நேரம்",
    breakfast: "காலை உணவு",
    lunch: "மதிய உணவு",
    dinner: "இரவு உணவு"
  },
  or: {
    whatsInYourFridge: "ଆପଣଙ୍କ ଫ୍ରିଜରେ କ'ଣ ଅଛି?",
    placeholder: "ଯେପରିକି, ଭାତ, ଆଳୁ...",
    generateRecipes: "ରେସିପି ପ୍ରସ୍ତուତ କରନ୍ତု",
    startNewSearch: "ନୂତନ ସନ୍ଧାନ",
    craftingCulinary: "ଆପଣଙ୍କ ପାଇଁ ରେସିପି ପ୍ରସ୍ତୁତ ହେଉଛି...",
    aiChefWorking: "ଆମର AI ରୋଷେଇଆ କାମ କରୁଛନ୍ତି, ଶୀଘ୍ର ପ୍ରସ୍ତուତ ହୋଇଯିବ!",
    welcome: "FridgeChef କୁ ସ୍ୱାଗତ!",
    welcomeSub: "ନିଜ ପସନ୍ଦର ରେସିପି ପାଇଁ ସାମଗ୍ରୀ, ମନୋଭାବ ଏବଂ ପାଣିପାଗ ଦିଅନ୍ତୁ।",
    recipeIdeas: "ରେସିପି ଆଇଡିଆ",
    ingredients: "ସାମଗ୍ରୀ",
    nutritionalSummary: "ପୋଷଣ ସାରାଂଶ",
    instructions: "ପ୍ରଣାଳୀ",
    noNutrition: "କୌଣସି ପୋଷଣ ସୂଚନା ନାହିଁ।",
    language: "ଭାଷା",
    favorites: "ପସନ୍ଦିତ",
    kitchenVibe: "ରୋଷେଇ ଘର ମାହୋଲ",
    mood: "ମନୋଭାବ",
    weather: "ପାଣିପାଗ",
    festival: "ପର୍ବ / ଅବସର",
    happy: "ଖୁସି",
    tired: "ଥକିଯାଇଥିବା",
    energetic: "ଉତ୍ସାਹୀ",
    calm: "ଶାନ୍ତ",
    sunny: "ଖରା",
    rainy: "ବର୍ଷା",
    cold: "ଥଣ୍ଡา",
    hot: "ଗରମ",
    festivalPlaceholder: "ଯେପରିକି, ଦୀପାବଳି...",
    mealTime: "ଭୋਜନ ସମୟ",
    breakfast: "ଜଳଖିଆ",
    lunch: "ମଧ୍ୟାହ୍ନ ଭୋଜନ",
    dinner: "ରାତ୍ରି ଭୋଜନ"
  },
  pa: {
    whatsInYourFridge: "ਤੁਹਾਡੇ ਫਰਿੱਜ ਵਿੱਚ ਕੀ ਹੈ?",
    placeholder: "ਜਿਵੇਂ ਕਿ, ਚੌਲ, ਆਲੂ, ਪਿਆਜ਼...",
    generateRecipes: "ਵਿਅੰਜਨ ਬਣਾਓ",
    startNewSearch: "ਨਵੀਂ ਖੋਜ",
    craftingCulinary: "ਤੁਹਾਡੀ ਸੁਆਦੀ ਰੈਸਿਪੀ ਤਿਆਰ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...",
    aiChefWorking: "ਸਾਡਾ AI ਸ਼ੈੱਫ ਰਸੋਈ ਵਿੱਚ ਦੇਖ ਰਿਹਾ ਹੈ। ਤੁਹਾਡੀ ਰੈਸਿਪੀ ਜਲਦੀ ਤਿਆਰ ਹੋ ਜਾਵੇਗੀ!",
    welcome: "FridgeChef ਵਿੱਚ ਸੁਆਗਤ ਹੈ!",
    welcomeSub: "ਨਿੱਜੀ ਵਿਚਾਰਾਂ ਲਈ ਸਮੱਗਰੀ, ਮੂਡ ਅਤੇ ਮੌਸਮ ਦਰਜ ਕਰੋ।",
    recipeIdeas: "ਵਿਅੰਜਨ ਵਿਚਾਰ",
    ingredients: "ਸਮੱਗਰੀ",
    nutritionalSummary: "ਪੋਸ਼ਣ ਸੰਬੰਧੀ ਸਾਰ",
    instructions: "ਤਰੀਕਾ",
    noNutrition: "ਕੋਈ ਪੋਸ਼ਣ ਸੰਬੰਧੀ ਜਾਣਕਾਰੀ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।",
    language: "ਭਾਸ਼ਾ",
    favorites: "ਮਨਪਸੰਦ",
    kitchenVibe: "ਕਿਚਨ ਵਾਈਬ",
    mood: "ਮੂਡ",
    weather: "ਮੌਸਮ",
    festival: "ਤਿਉਹਾਰ / ਮੌਕਾ",
    happy: "ਖੁਸ਼",
    tired: "ਥੱਕਿਆ ਹੋਇਆ",
    energetic: "ਉਰਜਾਵਾਨ",
    calm: "ਸ਼ਾਂਤ",
    sunny: "ਧੁੱਪ",
    rainy: "ਮੀਂਹ",
    cold: "ਠੰਡ",
    hot: "ਗਰਮੀ",
    festivalPlaceholder: "ਜਿਵੇਂ ਕਿ, ਦਿਵਾਲੀ...",
    mealTime: "ਭੋਜਨ ਦਾ ਸਮਾਂ",
    breakfast: "ਨਾਸ਼ਤਾ",
    lunch: "ਦੁਪਹਿਰ ਦਾ ਖਾਣਾ",
    dinner: "ਰਾਤ ਦਾ ਖਾਣਾ"
  },
  ur: {
    whatsInYourFridge: "آپ کے فریج میں کیا ہے؟",
    placeholder: "مثال کے طور پر، چاول، آلو، پیاز...",
    generateRecipes: "ترکیبیں بنائیں",
    startNewSearch: "نئی تلاش",
    craftingCulinary: "آپ کی لذیذ ترکیبیں تیار کی جا رہی ہیں...",
    aiChefWorking: "ہمارا AI شیف باورچی خانے میں دیکھ رہا ہے۔ آپ کی ترکیبیں جلد تیار ہو جائیں گی!",
    welcome: "FridgeChef میں خوش آمدید!",
    welcomeSub: "اپنی پسندیدہ ترکیبوں کے لیے اجزاء، موڈ اور موسم درج کریں۔",
    recipeIdeas: "ترکیب کے آئیڈیاز",
    ingredients: "اجزاء",
    nutritionalSummary: "غذائی خلاصہ",
    instructions: "طریقہ کار",
    noNutrition: "غذائیت کی کوئی معلومات دستیاب نہیں ہے۔",
    language: "زبان",
    favorites: "پسندیدہ",
    kitchenVibe: "کچن وائب",
    mood: "موڈ",
    weather: "موسم",
    festival: "تہوار / موقع",
    happy: "خوش",
    tired: "تھکا ہوا",
    energetic: "توانا",
    calm: "پرسکون",
    sunny: "دھوپ",
    rainy: "بارش",
    cold: "سردی",
    hot: "گرمی",
    festivalPlaceholder: "مثال کے طور پر، عید...",
    mealTime: "کھانے کا وقت",
    breakfast: "ناشتہ",
    lunch: "دوپہر کا کھانا",
    dinner: "رات کا کھانا"
  }
};

export function FridgeChefClient() {
  const { toast } = useToast();
  const [language, setLanguage] = useState<keyof typeof translations>('en');

  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [nutritionalInfo, setNutritionalInfo] = useState<string | null>(null);
  const [recipeImage, setRecipeImage] = useState<string | null>(null);
  const [isFetchingNutrition, setIsFetchingNutrition] = useState(false);
  const [isFetchingImage, setIsFetchingImage] = useState(false);
  const [formKey, setFormKey] = useState(Date.now());
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  const [generateRecipesState, formAction, isPending] = useActionState(generateRecipesAction, null);

  const t = translations[language] || translations['en'];

  useEffect(() => {
    if (generateRecipesState?.success) {
      setRecipes(generateRecipesState.data);
      setSelectedRecipe(generateRecipesState.data[0]);
    } else if (generateRecipesState?.error) {
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description: generateRecipesState.error,
      });
    }
  }, [generateRecipesState, toast]);

  useEffect(() => {
    if (selectedRecipe) {
      const fetchDetails = async () => {
        setIsFetchingNutrition(true);
        setNutritionalInfo(null);
        setIsFetchingImage(true);
        setRecipeImage(null);

        try {
          const nutritionResult = await summarizeNutritionalInfoAction({
            recipeName: selectedRecipe.title,
            ingredients: selectedRecipe.ingredients,
            instructions: selectedRecipe.instructions,
            language: language
          });

          if (nutritionResult.success) {
            setNutritionalInfo(nutritionResult.data);
          } else {
            toast({
              variant: 'destructive',
              title: 'Nutrition Info Error',
              description: nutritionResult.error,
            });
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsFetchingNutrition(false);
        }

        try {
          const imageResult = await generateRecipeImageAction({
            recipeName: selectedRecipe.title,
          });

          if (imageResult.success) {
            setRecipeImage(imageResult.data);
          } else {
            toast({
              variant: 'destructive',
              title: 'Image Error',
              description: imageResult.error,
            });
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsFetchingImage(false);
        }
      };
      fetchDetails();
    }
  }, [selectedRecipe, toast, language]);

  const handleNewSearch = () => {
    setRecipes(null);
    setSelectedRecipe(null);
    setNutritionalInfo(null);
    setRecipeImage(null);
    setFormKey(Date.now());
  };

  const toggleFavorite = (recipe: Recipe) => {
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.some(fav => fav.title === recipe.title);
      if (isFavorite) {
        return prevFavorites.filter(fav => fav.title !== recipe.title);
      } else {
        return [...prevFavorites, recipe];
      }
    });
  };

  const isFavorite = (recipe: Recipe) => favorites.some(fav => fav.title === recipe.title);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-screen-2xl">
      <header className="flex justify-center mb-10">
        <Logo />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside className="lg:col-span-4 xl:col-span-3 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="sticky top-8 space-y-6"
          >
            <Card className="bg-card/70 border-border/50 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 font-headline text-xl">
                  <ChefHat size={24} className="text-primary-foreground" />
                  {t.whatsInYourFridge}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form key={formKey} action={formAction} className="space-y-4">
                  <Textarea
                    name="ingredients"
                    placeholder={t.placeholder}
                    className="min-h-[120px] text-base bg-background/50 focus-visible:ring-primary-foreground"
                    required
                  />
                  
                  <Separator className="opacity-50" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      <Sparkles size={16} />
                      {t.kitchenVibe}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium flex items-center gap-1"><Smile size={12}/>{t.mood}</label>
                        <Select name="mood" defaultValue="calm">
                          <SelectTrigger className="h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="happy">{t.happy}</SelectItem>
                            <SelectItem value="tired">{t.tired}</SelectItem>
                            <SelectItem value="energetic">{t.energetic}</SelectItem>
                            <SelectItem value="calm">{t.calm}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium flex items-center gap-1"><CloudSun size={12}/>{t.weather}</label>
                        <Select name="weather" defaultValue="sunny">
                          <SelectTrigger className="h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sunny">{t.sunny}</SelectItem>
                            <SelectItem value="rainy">{t.rainy}</SelectItem>
                            <SelectItem value="cold">{t.cold}</SelectItem>
                            <SelectItem value="hot">{t.hot}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium flex items-center gap-1"><Clock size={12}/>{t.mealTime}</label>
                        <Select name="mealType" defaultValue="lunch">
                          <SelectTrigger className="h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="breakfast">{t.breakfast}</SelectItem>
                            <SelectItem value="lunch">{t.lunch}</SelectItem>
                            <SelectItem value="dinner">{t.dinner}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium flex items-center gap-1"><PartyPopper size={12}/>{t.festival}</label>
                        <Input 
                          name="festival" 
                          placeholder={t.festivalPlaceholder || "Occasion"} 
                          className="h-9 text-xs"
                        />
                      </div>
                    </div>
                    
                    <input type="hidden" name="day" value={new Date().toLocaleDateString('en-US', { weekday: 'long' })} />
                    <input type="hidden" name="language" value={language} />

                    <div className="space-y-1">
                      <label className="text-xs font-medium flex items-center gap-1"><Globe size={12}/>{t.language}</label>
                      <Select onValueChange={(value: keyof typeof translations) => setLanguage(value)} defaultValue={language}>
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="hi">हिन्दी</SelectItem>
                          <SelectItem value="gu">ગુજરાતી</SelectItem>
                          <SelectItem value="ta">தமிழ்</SelectItem>
                          <SelectItem value="or">ଓଡ଼િଆ</SelectItem>
                          <SelectItem value="pa">ਪੰਜਾਬੀ</SelectItem>
                          <SelectItem value="ur">اردو</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold" disabled={isPending}>
                    {isPending ? <Loader2 className="animate-spin" /> : <Sparkles className="mr-2" />}
                    {t.generateRecipes}
                  </Button>
                </form>
                {recipes && (
                   <Button variant="ghost" className="w-full text-xs" onClick={handleNewSearch}>
                     {t.startNewSearch}
                   </Button>
                )}
              </CardContent>
            </Card>

            {favorites.length > 0 && (
              <Card className="bg-card/70 border-border/50 shadow-md">
                <CardHeader className="py-3">
                  <CardTitle className="flex items-center gap-2 text-md">
                    <Heart size={18} className="text-primary-foreground" />
                    {t.favorites}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 pb-3">
                  <ScrollArea className="h-[120px]">
                    <div className="space-y-1">
                      {favorites.map((fav, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          className="w-full justify-start text-xs h-8 px-2"
                          onClick={() => setSelectedRecipe(fav)}
                        >
                          <span className="truncate">{fav.title}</span>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </aside>

        <main className="lg:col-span-8 xl:col-span-9 min-h-[600px]">
          <AnimatePresence mode="wait">
            {isPending && !recipes ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-[500px] border-2 border-dashed border-border/30 rounded-2xl text-center"
              >
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <h3 className="text-xl font-bold">{t.craftingCulinary}</h3>
                <p className="text-muted-foreground mt-2">{t.aiChefWorking}</p>
              </motion.div>
            ) : !recipes ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-[500px] border-2 border-dashed border-border/30 rounded-2xl text-center p-8"
              >
                <CookingPot className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                <h2 className="text-2xl font-bold">{t.welcome}</h2>
                <p className="text-muted-foreground mt-2 max-w-md">{t.welcomeSub}</p>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <Card className="bg-card/70 border-border/50 shadow-sm overflow-hidden">
                  <CardHeader className="bg-muted/30 py-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen size={20} className="text-primary-foreground" />
                      {t.recipeIdeas}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {recipes.map((recipe, index) => (
                        <Button
                          key={index}
                          variant={selectedRecipe?.title === recipe.title ? "default" : "outline"}
                          className={cn(
                            "rounded-full transition-all text-sm",
                            selectedRecipe?.title === recipe.title ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-primary/10"
                          )}
                          onClick={() => setSelectedRecipe(recipe)}
                        >
                          {recipe.title}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <AnimatePresence mode="wait">
                  {selectedRecipe && (
                    <motion.div
                      key={selectedRecipe.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="bg-card/70 border-border/50 shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-6">
                          <CardTitle className="text-3xl font-headline tracking-tight">{selectedRecipe.title}</CardTitle>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-full hover:bg-primary/20"
                            onClick={() => toggleFavorite(selectedRecipe)}
                          >
                            <Heart className={cn("w-6 h-6 transition-all", isFavorite(selectedRecipe) ? "fill-red-500 text-red-500 scale-110" : "text-muted-foreground")} />
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-10">
                          <div className="relative w-full h-[320px] rounded-xl overflow-hidden bg-muted/30 border border-border/40 shadow-inner flex items-center justify-center">
                            {isFetchingImage ? (
                              <div className="flex flex-col items-center gap-2">
                                <Loader2 className="h-8 w-8 animate-spin text-primary-foreground" />
                                <p className="text-xs text-muted-foreground animate-pulse">Generating meal image...</p>
                              </div>
                            ) : recipeImage ? (
                              <img 
                                src={recipeImage} 
                                alt={selectedRecipe.title}
                                className="w-full h-full object-cover rounded-xl transition-all duration-300"
                              />
                            ) : (
                              <div className="flex flex-col items-center text-muted-foreground/30 gap-2">
                                <CookingPot size={48} />
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                              <h3 className="text-xl font-bold flex items-center gap-2 font-headline border-b pb-2">
                                <LeafyGreen className="text-primary-foreground" size={20}/>
                                {t.ingredients}
                              </h3>
                              <ul className="grid grid-cols-1 gap-2 bg-muted/20 p-4 rounded-xl border border-border/40">
                                {selectedRecipe.ingredients.map((ing, i) => (
                                  <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    {ing}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="space-y-4">
                              <h3 className="text-xl font-bold flex items-center gap-2 font-headline border-b pb-2">
                                <GlassWater className="text-primary-foreground" size={20}/>
                                {t.nutritionalSummary}
                              </h3>
                              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 min-h-[100px]">
                                {isFetchingNutrition ? (
                                  <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                    <Skeleton className="h-4 w-4/6" />
                                  </div>
                                ) : (
                                  <p className="text-sm leading-relaxed text-muted-foreground italic">
                                    {nutritionalInfo || t.noNutrition}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-6">
                            <h3 className="text-xl font-bold flex items-center gap-2 font-headline border-b pb-2">
                              <Utensils className="text-primary-foreground" size={20}/>
                              {t.instructions}
                            </h3>
                            <div className="prose prose-neutral dark:prose-invert max-w-none">
                              <ol className="space-y-4 marker:text-primary marker:font-bold">
                                {selectedRecipe.instructions.map((step, i) => (
                                  <li key={i} className="pl-2">
                                    <p className="text-foreground/90">{step}</p>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
