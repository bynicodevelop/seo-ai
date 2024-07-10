export type DomainQuery = {
    name: string;
}

export type ApiResponse<T> = {
    status: number;
    data: T;
}

export type ErrorResponse = {
    message: string;
}

export type CategoryQuery = {
    categorySlug: string;
}