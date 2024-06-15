import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { TUserRole } from "../modules/User/user.interface";

const auth = (...requiredRoles : TUserRole[])=>{
    return catchAsync(async( req: Request, res: Response, next: NextFunction) =>{
        
         const token = req.headers.authorization;

         // if the token is sent from the client
         if(!token){
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized')
         }

         // check if the token is valid

         jwt.verify(token, config.jwt_access_secret as string, function(err, decoded) {
            // err
            if(err){
                throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
            }
            const role = (decoded as JwtPayload).role
    if( requiredRoles && !requiredRoles.includes(role)){
      return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        statusCode: httpStatus.NOT_FOUND,
        message: 'You have no access to this route',
    })
    }
    // decoded undefined
    req.user = decoded as JwtPayload;
    req.userId = (decoded as JwtPayload)._id;
  next();
  });
    });
};

export default auth