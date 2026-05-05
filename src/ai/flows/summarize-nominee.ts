'use server';

/**
 * @fileOverview Summarizes a nominee's platform using AI.
 *
 * - summarizeNominee - A function that generates a summary of a nominee's platform.
 * - SummarizeNomineeInput - The input type for the summarizeNominee function.
 * - SummarizeNomineeOutput - The return type for the summarizeNominee function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNomineeInputSchema = z.object({
  bio: z
    .string()
    .describe('A description of the nominee\'s bio.'),
  language: z
    .enum(['es', 'en'])
    .optional()
    .default('es')
    .describe('The target language for the summary.'),
});
export type SummarizeNomineeInput = z.infer<typeof SummarizeNomineeInputSchema>;

const SummarizeNomineeOutputSchema = z.object({
  summary: z.string().describe('A structured, high-impact summary of the nominee\'s trajectory.'),
  headline: z.string().describe('A short, catchy headline for the nominee profile.'),
});
export type SummarizeNomineeOutput = z.infer<typeof SummarizeNomineeOutputSchema>;

export async function summarizeNominee(input: SummarizeNomineeInput): Promise<SummarizeNomineeOutput> {
  return summarizeNomineeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeNomineePrompt',
  input: {schema: SummarizeNomineeInputSchema},
  output: {schema: SummarizeNomineeOutputSchema},
  prompt: `
    Eres un experto en comunicación corporativa, filantropía y liderazgo global. 
    Tu tarea es transformar la biografía de un nominado de los "Latin American Leaders Awards" en un resumen ejecutivo de alto impacto.

    INSTRUCCIONES:
    1. El idioma de salida DEBE ser: {{language}}.
    2. El tono debe ser profesional, inspirador y fáctico.
    3. Destaca los logros más significativos, el impacto social y la visión del nominado.
    4. El resumen debe tener entre 2 y 3 párrafos cortos.
    5. Genera también un "headline" (eslogan o título corto) que capture la esencia de su liderazgo.

    BIOGRAFÍA DEL NOMINADO:
    {{{bio}}}
  `,
});

const summarizeNomineeFlow = ai.defineFlow(
  {
    name: 'summarizeNomineeFlow',
    inputSchema: SummarizeNomineeInputSchema,
    outputSchema: SummarizeNomineeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
