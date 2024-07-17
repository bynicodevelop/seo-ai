const regex = [
    /[\n\t]/g,
    /<iframe.*?<\/iframe>/gi,
    /\s{2,}/g
]

export const cleanContentToString = (content: string): string => {
    let cleanedContent = content;

    regex.forEach((reg) => {
        cleanedContent = cleanedContent.replace(reg, ' ');
    });

    return cleanedContent.trim();
}