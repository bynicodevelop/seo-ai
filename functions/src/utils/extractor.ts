import { load } from 'cheerio';
import { isEmpty } from 'lodash';

const regex = [
    /[\n\t]/g,
    /<iframe.*?<\/iframe>/gi,
    /\s{2,}/g
]

export const cleanContentToString = (content: string): string => {
    let cleanedContent = content;

    regex.forEach((reg) => {
        cleanedContent = cleanedContent.replace(
reg,
' '
);
    });

    return cleanedContent.trim();
}

export const extractContent = async (data: string) => {
    const selector = await load(data);

    let content = selector('body article').text();
    if (isEmpty(content)) {
        content = selector('body main').text();
    }
    if (isEmpty(content)) {
        content = selector('body').text();
    }
    return content;
}