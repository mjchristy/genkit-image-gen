// Import the Genkit core libraries and plugins.
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';

const ai = genkit({
  plugins: [
    googleAI(),
  ],
});


// Define a simple flow that prompts an LLM to generate menu suggestions.

const startingPrompt = ai.definePrompt({
  name: 'startingPrompt',
  input: { schema: z.object({ decorStyle: z.string() }) },
  model: googleAI.model('gemini-2.5-flash'),
  prompt: `Please expand on the idea of {{decorStyle}} to help Gemini make a great image. IMPORTANT: PLEASE say in the prompt that you want to modify the existing image to use the decor style specified.`,
});

//source image on disk for now

const startingImage = 
fs.readFileSync('./images/image.png', 'base64');

export const inspirationFlow = ai.defineFlow(
  {
    name: 'inspirationFlow',
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

  //writes to disk - this is the old way

  if (media) {
    const inspoDir = 'inspo';
    if (!fs.existsSync(inspoDir)) {
      fs.mkdirSync(inspoDir, { recursive: true });
    }

    const mediaParts = Array.isArray(media) ? media : [media];
    mediaParts.forEach((mediaPart: any, index: number) => {
      if (mediaPart.url) {
        const [meta, data] = mediaPart.url.split(',');
        if (meta && data) {
          const extension = meta.split(';')[0].split('/')[1];
          const filename = `inspo_${Date.now()}_${index}.${extension || 'png'}`;
          const buffer = Buffer.from(data, 'base64');
          fs.writeFileSync(path.join(inspoDir, filename), buffer);
        }
      }
    });
  }

  return media;
});
