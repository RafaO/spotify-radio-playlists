import Logger from "js-logger";
import { GoogleGenerativeAI, GenerationConfig } from "@google/generative-ai";

export class GenAIHelper {
    private genAI: GoogleGenerativeAI;

    constructor(genAI: GoogleGenerativeAI) {
        this.genAI = genAI;
    }

    async scrap(content: string): Promise<string[]> {
        const generationConfig: GenerationConfig = {
          temperature: 1,
          topP: 0.95,
          topK: 64,
          maxOutputTokens: 8192,
          responseMimeType: "text/plain",
        };
    
        const model = this.genAI.getGenerativeModel({
          generationConfig: generationConfig,
          model: "gemini-1.5-flash",
        });
    
        const prompt = "Extract a list of songs from the following text, respond only with a list of songs and artists split by line in the format format song, artist" + content;
    
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        Logger.debug("genAi response: " + text);
    
        // process output
        const strings = new Array();
        const results = text.split(/\n/);
        for (const item of results) {
          if (item) {
            strings.push(item);
          }
        }
        return strings;
    }
}
