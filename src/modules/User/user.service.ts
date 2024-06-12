import { TLoginUser, TUser } from "./user.interface";
import { User } from "./user.model";

const createUserSignUpIntoDB = async(payLoad: TUser)=>{
    const result = await User.create(payLoad);
    return result;
}
const loginUser = async (payLoad: TLoginUser) =>{
    console.log(payLoad)
    return{};
}

export const UserServices = {
    createUserSignUpIntoDB,
    loginUser,
}