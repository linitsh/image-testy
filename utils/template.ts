
export function template(text: string, replacer: Record<string, any>) {
    for (let [key, value] of Object.entries(replacer)) {
        let regexp = new RegExp(`\\{\\s*${key.toUpperCase()}\\s*\\}`, 'g');
        if (typeof value === 'object') {
            value = JSON.stringify(value,null,2);
        }
        if(typeof value === undefined) {
            value = 'undefined';
        }
        text = text.replace(regexp, `${value}`);
    }

    return text;
}