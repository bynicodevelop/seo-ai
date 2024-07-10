export default defineEventHandler(async (event) => {
    const method = event.method;

    const body = await readBody(event);

    return{
        method,
        body
    }
});