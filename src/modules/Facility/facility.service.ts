import { TFacility } from "./facility.interface";
import { Facility } from "./facility.model";

const createFacilityIntoDB = async (payLoad: TFacility) =>{
    const result = await Facility.create(payLoad);
    return result;
}
const updateFacilityIntoDB = async (id: string,
    payLoad: Partial<TFacility>,
) =>{
    const result = await Facility.findByIdAndUpdate({_id: id}, payLoad,
        { new: true});
    return result;
}

export const FacilityServices = {
    createFacilityIntoDB,
    updateFacilityIntoDB,
}