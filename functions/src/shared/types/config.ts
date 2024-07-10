export type Config = {
    domain: string;
    sitename: string;
    description: string;
    keywords?: string[];
    translate?: string[];
    categories?: [{ [key: string]: string }];
};
