import joi from "joi"

export const joiValidator = function (schema) {
    return async (req, res, next) => {

        let errRes = [];

        for (const key of Object.keys(schema)) {
            const { error } = schema[key].validate(req[key], { abortEarly: false });

            if (error) {
                error.details.forEach(element => {
                errRes.push({
                    key,
                    path:element.path,
                    message:element.message
                });
                });
            }
        }

        if (errRes.length > 0) {
            return res.status(400).json({ message: "validation error", errors: errRes });
        }

        next();
    }
}