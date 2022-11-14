import cheerio from 'cheerio';

export class CanalFiestaScraper {
    async scrapeList(url: string): Promise<String[]> {
        const response = await (await fetch(url)).text();
        const $ = cheerio.load(response);

        const strings = new Array();
        $("div.textoNoticia.top20 > table > tbody > tr > td > table > tbody").children().each((_index, listRow) => {
            strings.push($(listRow).children().slice(-2).map((_index, cell) => {
                return $(cell).text().trim();
            }).toArray().join(', '));
        });
        return strings;
    }
}
