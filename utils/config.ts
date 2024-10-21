import { parse, stringify } from 'yaml'
export  async function config() {
    let text = await Bun.file(`${process.cwd()}/config.yaml`).text() || " no config.yaml ";
    let replacer = process.env;
    for (let [key, value] of Object.entries(replacer)) {
        
        let regexp = new RegExp(`\\$\\{\\s*${key}\\s*\\}`, 'g');
        
        if(typeof value === undefined) {
            value = 'undefined';
        }
        text = text.replace(regexp, `${value}`);
    }
    text = parse(text);

    return text;
}