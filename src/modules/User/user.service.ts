import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TLoginUser, TUser } from "./user.interface";
import { User } from "./user.model";

const createUserSignUpIntoDB = async(payLoad: TUser)=>{
    const result = await User.create(payLoad);
    return result;
}
const loginUser = async (payLoad: TLoginUser) =>{
    
    // checking if the user is exist
    const isUserExists = await User.findOne({email: payLoad?.email});
    console.log(isUserExists)
    if(!isUserExists){
        throw new AppError(httpStatus.NOT_FOUND, 'User is not found !')
    }
    return{};
}

export const UserServices = {
    createUserSignUpIntoDB,
    loginUser,
}