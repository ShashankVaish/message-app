const asyncAwaitHandler = (func) => {
    return async (req, res, next) => {
        try {
            await func(req, res, next);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Controller is not working in asyncHandler",
            });
            console.error(error);
        }
    };
}
export { asyncAwaitHandler };