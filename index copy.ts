// Import the Genkit core libraries and plugins.
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';
import * as fs from 'fs';

const ai = genkit({
  plugins: [googleAI()],
  promptDir: './prompts',

});

// Define a simple flow that prompts an LLM to generate menu suggestions.

const startingPrompt = ai.prompt('startingPrompt');

const startingImage = fs.readFileSync('./images/image.png', 'base64');

export const newInspirationFlow = ai.defineFlow(
  {
    name: 'newInspirationFlow',
  },
  async (decorStyle) => {
    const { text } = await startingPrompt({
      decorStyle,
    });

  const { media } = await ai.generate({
    model: googleAI.model('gemini-2.5-flash-image'),
    prompt: [
      { text: text },
      { media: { url: `data:image/png;base64,${startingImage}` } },

    ],
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  return media;
});

export const inspirationFlow = ai.defineFlow(
  {
    name: 'inspirationFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (decorStyle) => {
    const { text } = await startingPrompt({
      decorStyle,
    });

    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-image'),
      prompt: text,
    });
    if (!media) {
      throw new Error('No media generated');
    }
    return media.url;
  }
);