import { load } from 'cheerio'

export class CanalFiestaScraper {
    async scrapeList(url: string): Promise<string[]> {
        const response = await (await fetch(url)).text();
        const $ = load(response);

        const strings = new Array();
        $("div.textoNoticia.top20 > table > tbody > tr > td > table > tbody").children().each((_index, listRow) => {
            strings.push($(listRow).children().slice(-2).map((_index, cell) => {
                return $(cell).text().trim();
            }).toArray().reverse().join(', '));
        });
        return strings;
    }
}
