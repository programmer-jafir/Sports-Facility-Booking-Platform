import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FacilityServices } from "./facility.service";

const createFacility = catchAsync(async(req,res)=>{
    // creating facility
    const facility  = await FacilityServices.createFacilityIntoDB(req.body);
    // extract _id
    const { _id, ...facilityWithoutId } = facility.toObject();
    // _id with facility
    const result = { _id: _id, ...facilityWithoutId };
    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "Facility added successfully",
        data: result
    })
})

export const FacultyControllers = {
    createFacility,
}