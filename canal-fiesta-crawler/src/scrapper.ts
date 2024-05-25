import { load } from 'cheerio'
import Logger from "js-logger";
import { GenAIHelper } from './genAIHelper';

export class CanalFiestaScraper {
  private genAIHelper: GenAIHelper;

  constructor(genAIHelper: GenAIHelper) {
    this.genAIHelper = genAIHelper;
  }

  async scrapeList(url: string): Promise<string[]> {
    const response = await (await fetch(url)).text();
    const $ = load(response);

    // try with AI
    const strings: Array<string> = await this.genAIHelper.scrap($('body').text());
    if (strings.length == 50) {
      Logger.debug("AI scrapping extracted the songs");
      return strings;
    }
    Logger.debug("AI scrapping didn't work");

    // if it fails, try with the selectors
    const selectors = [
      "div.textoNoticia.top20 > table > tbody",
      "div.textoNoticia.top20 > table > tbody > tr > td > table > tbody"
    ];

    for (const selector of selectors) {
      try {
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
