import { request, response } from 'express';

export const isAdminRole = (req, res, next) => {
    if (!req.user) {
        return res.status(500).json({
            msg: "You want to validate a user without validating the token"
        })
    }

    const { role, name } = req.user;

    if (role !== "ADMIN_ROLE") {
        return res.status(401).json({
            msg: `${name} is not an ADMIN_ROLE, you cannot use this endpoint`
        })
    }
    next();
}

export const hasRoleAuthorized = (...roles) => { 
    return (req = request, res = response, next) => {
        if (!req.user) {
            return res.status(500).json({
                msg: "You want to validate a user without validating the token"
            })
        }

        if (!roles.includes(req.user.role)) { 
            return res.status(401).json({
                msg: `The service requires one of the following authorized roles ${roles}`
            })
        }
        next();
    }
}