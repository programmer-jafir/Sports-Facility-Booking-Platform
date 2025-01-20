import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import { UserServices } from "./user.service"

const createUserSignUp = catchAsync(async (req, res)=>{
    const result = await UserServices.createUserSignUpIntoDB(req.body);
    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "User registered successfully",
        data: result,
    })
})
const loginUser = catchAsync(async(req, res) => {
    const result = await UserServices.loginUser(req.body)
    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged in successfully",
        token:result.accessToken,
        data: result.userWithoutPassword,
    })
})

export const UserControllers ={
    createUserSignUp,
    loginUser,
}