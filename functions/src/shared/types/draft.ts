export type Draft = {
    siteId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export function draftFactory(
    siteId: string,
    content: string
): Draft;
export function draftFactory(
    siteId: string,
    content: string,
    createdAt?: Date,
    updatedAt?: Date
): Draft {
    return {
        siteId,
        content,
        createdAt: createdAt || new Date(),
        updatedAt: updatedAt || new Date()
    }
}