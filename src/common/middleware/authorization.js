
export const authorization = function (role) {
    async (req, res, next) => {

        if (!role.includes(req.user.role)) {
            throw new error("UnAuthorized");
        }
        next();
    }
}
