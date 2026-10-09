export function validateBody(schema) {
    return (request, response, next) => {
        const result = schema.safeParse(request.body);
        if (!result.success) {
            response.status(400).json({ error: "Invalid request body" });
            return;
        }
        request.body = result.data;
        next();
    };
}
