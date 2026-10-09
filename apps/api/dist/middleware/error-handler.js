import { ZodError } from "zod";
export const errorHandler = (error, _request, response, next) => {
    if (error instanceof ZodError) {
        response.status(400).json({
            message: "Please check the submitted information.",
            fields: error.flatten().fieldErrors,
        });
        return;
    }
    const status = typeof error === "object" &&
        error !== null &&
        "status" in error &&
        typeof error.status === "number"
        ? error.status
        : 500;
    response.status(status).json({
        message: status === 500 ? "Internal server error." : error.message,
    });
    void next;
};
