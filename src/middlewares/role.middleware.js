import ApiError from "../utils/ApiError.js";

export const allowRoles = (roles = []) => {
    return (req, res, next) => {
        if (!req.role || !roles.includes(req.role)) {
            return next(new ApiError(403, "You do not have permission to perform this action"));
        }
        next();
    };
};
