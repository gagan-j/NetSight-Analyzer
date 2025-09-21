
'use server';

import {
  suggestSimulationParameters,
  type SuggestSimulationParametersInput,
  type SuggestSimulationParametersOutput,
} from '@/ai/flows/ai-suggest-simulation-parameters';

export async function getAiSuggestions(
  input: SuggestSimulationParametersInput
): Promise<SuggestSimulationParametersOutput> {
  try {
    const result = await suggestSimulationParameters(input);
    return result;
  } catch (error) {
    console.error('AI suggestion failed:', error);
    throw new Error('Failed to get AI suggestions. Please try again.');
  }
}
