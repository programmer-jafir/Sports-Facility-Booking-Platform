import mongoose from "mongoose";
import { TFacility } from "./facility.interface";
import { Facility } from "./facility.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import QueryBuilder from "../../bilder/QueryBuilder";
import { FacilitySearchableFields } from "./facility.constant";

const createFacilityIntoDB = async (payLoad: TFacility) =>{
    const result = await Facility.create(payLoad);
    return result;
};
// const getAllFacilityIntoDB = async () =>{
//     const result = await Facility.find();
//     return result;
// };
const getAllFacilityIntoDB = async (query: Record<string, unknown>) =>{
  const facilityQuery = new QueryBuilder(
    Facility.find({ isDeleted: false }),
    query,
  )
    .search(FacilitySearchableFields) 
    .filter() 
    .sort() 
    .paginate() 
    .fields(); 

  const result = await facilityQuery.modelQuery; // execute the query
  const meta = await facilityQuery.countTotal(); // get total count for pagination

  return {
    meta,
    result,
  };
};
const getFacilityByIdIntoDB = async (id: string) => {
  const result = await Facility.findById(id);
  return result;
};
const updateFacilityIntoDB = async (id: string,
    payLoad: Partial<TFacility>,
) =>{
    const result = await Facility.findByIdAndUpdate({_id: id}, payLoad,
        { new: true});
    return result;
};

const deleteFacilityFromDB = async (id: string) => {
    const session = await mongoose.startSession();
  
    try {
      session.startTransaction();
  
      const deletedFacility = await Facility.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true, session },
      );
  
      if (!deletedFacility) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete facility');
      }  
  
      await session.commitTransaction();
      await session.endSession();
  
      return deletedFacility;
    } catch (err: any) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error(err);
    }
  };

export const FacilityServices = {
    createFacilityIntoDB,
    updateFacilityIntoDB,
    deleteFacilityFromDB,
    getAllFacilityIntoDB,
    getFacilityByIdIntoDB
}