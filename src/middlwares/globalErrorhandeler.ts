/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ErrorRequestHandler, NextFunction } from "express";
import { ZodError, ZodIssue } from "zod";
import config from "../config";
import AppError from "../errors/AppError";
import { TErrorSources } from "../interface/error";
import { handleZodError } from "./handelZodError";
import { handleValidationError } from "./handelValidationError";
import handleCastError from "./handelCastError";
import handleDuplicateError from "./handelDuplicateError";

const globalErrorHandeller: ErrorRequestHandler = (err,
   req,
    res,
     next
    )=>
    {
    
    //  setting default values
      let statusCode = 500;
      let message =  'Something went worong!';
      
      let errorSources: TErrorSources =[{
        path: '',
        message: 'Something went wrong',
      }];

      

      if(err instanceof ZodError){

        const simplifiedError = handleZodError(err)
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorSources = simplifiedError?.errorSources;
      }else if(err?.name === 'ValidationError'){
        const simplifiedError = handleValidationError(err)
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorSources = simplifiedError?.errorSources;
      }else if(err?.name === 'CastError'){
        const simplifiedError = handleCastError(err)
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorSources = simplifiedError?.errorSources;
      }else if(err?.code === 11000){
        const simplifiedError = handleDuplicateError(err)
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorSources = simplifiedError?.errorSources;
      }
      else if(err instanceof AppError){
        statusCode = err?.statusCode;
        message = err?.message;
        errorSources = [{
          path: '',
          message: err?.message,
        }];
      }
      else if(err instanceof Error){
        statusCode = err?.statusCode;
        message = err?.message;
        errorSources = [{
          path: '',
          message: err?.message,
        }];
      }
      
      // ultimatfe return
      return res.status(statusCode).json({
        sucess: false,
        message,
        errorSources,
        stack: config.NODE_ENV === 'development' ? err?.stack : null
      })
    }

    export default globalErrorHandeller