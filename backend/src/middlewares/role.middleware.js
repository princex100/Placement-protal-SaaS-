import ApiError from "../utils/ApiError.js";

export const allowRoles = (roles = []) => {
    return (req, res, next) => {
        console.log("==== ALLOW_ROLES DEBUG ====");
        console.log("req.originalUrl:", req.originalUrl);
        console.log("req.role:", req.role);
        console.log("roles required:", roles);
        if (!req.role || !roles.includes(req.role)) {
            console.log("==== ALLOW_ROLES FAILED ====");
            return next(new ApiError(403, "You do not have permission to perform this action"));
        }
        console.log("==== ALLOW_ROLES PASSED ====");
        next();
    };
};
