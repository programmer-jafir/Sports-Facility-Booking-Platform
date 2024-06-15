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
const getAllFacility = catchAsync(async(req,res)=>{

    const result  = await FacilityServices.getAllFacilityIntoDB();
    
    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "Facilities retrieved successfully",
        data: result
    })
})
const updateFacility = catchAsync(async(req,res)=>{
    const {id} = req.params;

    const result  = await FacilityServices.updateFacilityIntoDB(id, req.body);

    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "Facility updated successfully",
        data: result
    })
});

const deleteFacility = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await FacilityServices.deleteFacilityFromDB(id);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Facility deleted successfully',
      data: result,
    });
  });

export const FacultyControllers = {
    createFacility,
    getAllFacility,
    updateFacility,
    deleteFacility,
}