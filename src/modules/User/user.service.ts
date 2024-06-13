import httpStatus from "http-status";
import bcrypt from "bcrypt";
import AppError from "../../errors/AppError";
import { TLoginUser, TUser } from "./user.interface";
import { User } from "./user.model";
import  jwt  from "jsonwebtoken";
import config from "../../config";

const createUserSignUpIntoDB = async(payLoad: TUser)=>{
    const result = await User.create(payLoad);
    return result;
}
const loginUser = async (payLoad: TLoginUser) =>{
    
    // checking if the user is exist

    const user = await User.isUserExistsByCustomEmail(payLoad.email)
   
    if(!user){
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !')
    }
    // checking if the password is correct

    if(! await User.isPasswordMatched(payLoad?.password, user?.password)){
        throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched !')
    }

    // create token sent to the client

    const jwtPayload = {
        userEmail: user.email,
        role: user.role,
    }
    const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, { expiresIn: '10d' });
      
    return{
        accessToken, 
    };
}

export const UserServices = {
    createUserSignUpIntoDB,
    loginUser,
}