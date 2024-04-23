import { load } from 'cheerio'
import Logger from "js-logger";

export class CanalFiestaScraper {

    async scrapeList(url: string): Promise<string[]> {
        const selectors = [
            "div.textoNoticia.top20 > table > tbody",
            "div.textoNoticia.top20 > table > tbody > tr > td > table > tbody"
        ];
    
        for (const selector of selectors) {
            try {
                const response = await (await fetch(url)).text();
                const $ = load(response);
    
                const strings = new Array();
                $(selector).children().each((_index, listRow) => {
                    strings.push($(listRow).children().slice(-2).map((_index, cell) => {
                        return $(cell).text().trim();
                    }).toArray().reverse().join(', '));
                });
                if (strings.length == 50) {
                    return strings;
                }
            } catch (error) {
                Logger.debug("Error scraping list with selector:", selector, error);
            }
        }
    
        // Return an empty array if all selectors fail
        return [];
    }
}
