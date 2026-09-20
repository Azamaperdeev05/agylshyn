export interface SampleText {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  text: string;
}

export const SAMPLE_TEXTS: SampleText[] = [
  {
    id: "campus-life",
    title: "A Day on Campus",
    level: "Beginner",
    description: "Everyday conversation about studying, library visits, and friends.",
    text: `Yesterday, I went to the university.
I met my friend near the library.
We studied English together for two hours.
After that, we had lunch at a small cafe.
The weather was pleasant and sunny.
Tomorrow, we plan to visit the science museum.`,
  },
  {
    id: "coffee-culture",
    title: "The Art of Morning Coffee",
    level: "Intermediate",
    description: "Describing morning routines, aromatic coffee, and focused work.",
    text: `Every morning, Sarah grinds fresh coffee beans before the sun rises.
The rich aroma fills the kitchen and gently wakes her senses.
She believes that brewing coffee is not just a daily routine, but a peaceful ritual.
Sitting quietly by the window, she writes down her goals for the upcoming day.
Small, deliberate habits like this help her stay calm and productive.`,
  },
  {
    id: "language-acquisition",
    title: "The Science of Language Learning",
    level: "Advanced",
    description: "A nuanced exploration of cognitive linguistics and immersive listening.",
    text: `Acquiring fluency in a second language demands deliberate listening comprehension and consistent repetition.
When learners transcribe authentic spoken speech, they strengthen their acoustic memory and syntactic intuition.
Neurological research indicates that active auditory processing engages both hemispheres of the brain simultaneously.
Consequently, practicing dictation bridges the gap between passive recognition and confident spoken expression.
Overcoming initial hesitations fosters genuine communicative competence and intellectual resilience.`,
  },
];
