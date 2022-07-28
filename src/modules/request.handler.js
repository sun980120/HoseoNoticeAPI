'use strict';

const wrap = (handler) =>
    async (req, res, next) => {
        try {
            const response = await handler(req, res, next);
            res.json({ "success": true, response: response, "error": null })
            // res.json(response);
            next();
        } catch (err) {
            next(err);
        }
    };
export default wrap