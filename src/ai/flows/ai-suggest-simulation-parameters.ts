'use server';
/**
 * @fileOverview AI-powered suggestion of simulation parameters based on user goals.
 *
 * - suggestSimulationParameters - A function to suggest simulation parameters.
 * - SuggestSimulationParametersInput - The input type for the suggestSimulationParameters function.
 * - SuggestSimulationParametersOutput - The return type for the suggestSimulationParameters function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSimulationParametersInputSchema = z.object({
  networkType: z.enum(['4G', '5G']).describe('The type of network to simulate (4G or 5G).'),
  goal: z
    .string()
    .describe(
      'The primary goal of the simulation, such as maximizing throughput or minimizing BER.'
    ),
  userConstraints: z
    .string()
    .optional()
    .describe(
      'Any specific constraints or preferences the user has regarding simulation parameters.'
    ),
});
export type SuggestSimulationParametersInput = z.infer<
  typeof SuggestSimulationParametersInputSchema
>;

const SuggestSimulationParametersOutputSchema = z.object({
  suggestedParameters: z
    .object({
      modulation: z.string().describe('Suggested modulation scheme.'),
      bandwidth: z.number().describe('Suggested bandwidth (in MHz).'),
      distance: z.number().describe('Suggested distance (in meters).'),
      noiseLevel: z.number().describe('Suggested noise level (in dBm).'),
    })
    .describe('Suggested simulation parameters based on the user goal.'),
  reasoning: z
    .string()
    .describe('Explanation of why these parameters are suggested.'),
});

export type SuggestSimulationParametersOutput = z.infer<
  typeof SuggestSimulationParametersOutputSchema
>;

export async function suggestSimulationParameters(
  input: SuggestSimulationParametersInput
): Promise<SuggestSimulationParametersOutput> {
  return suggestSimulationParametersFlow(input);
}

const suggestSimulationParametersPrompt = ai.definePrompt({
  name: 'suggestSimulationParametersPrompt',
  input: {schema: SuggestSimulationParametersInputSchema},
  output: {schema: SuggestSimulationParametersOutputSchema},
  prompt: `You are an AI assistant specialized in suggesting optimal simulation parameters for network simulations.

  Based on the user's specified network type ({{{networkType}}}) and goal ({{{goal}}}), you will suggest appropriate simulation parameters.
  Take into account any user-specified constraints ({{{userConstraints}}}).

  Consider the interdependencies and relationships between parameters to provide an intelligent guess.
  The suggested parameters should be typical/possible values in the 4G/5G landscape. Only select commonly used and possible values.

  Return the suggested parameters, and a short reasoning for each of them.

  Ensure that the suggested parameters are appropriate for the specified network type and goal.
  Here is the desired output format:
  { 
      "suggestedParameters": {
            "modulation": "",
            "bandwidth": "",
            "distance": "",
            "noiseLevel": ""
       },
       "reasoning": ""
  }
`,
});

const suggestSimulationParametersFlow = ai.defineFlow(
  {
    name: 'suggestSimulationParametersFlow',
    inputSchema: SuggestSimulationParametersInputSchema,
    outputSchema: SuggestSimulationParametersOutputSchema,
  },
  async input => {
    const {output} = await suggestSimulationParametersPrompt(input);
    return output!;
  }
);
