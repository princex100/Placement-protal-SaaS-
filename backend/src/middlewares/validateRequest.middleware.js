import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";

export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    console.log("VALIDATE REQUEST RAN!");
    console.log("REQ.BODY IS:", req.body);
    console.log("ERRORS ARE:", errors.array());
    
    if (!errors.isEmpty()) {
         const formattedErrors = errors.array().map((err) => ({
            field: err.path || err.param,
            message: err.msg
       }));

        return next(
            new ApiError(
                400,
                "Request validation failed",
                false,
                formattedErrors
            )
        );
   }
    
    next();
};
