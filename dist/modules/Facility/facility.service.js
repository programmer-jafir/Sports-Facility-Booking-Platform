"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacilityServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const facility_model_1 = require("./facility.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const createFacilityIntoDB = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield facility_model_1.Facility.create(payLoad);
    return result;
});
const getAllFacilityIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield facility_model_1.Facility.find();
    return result;
});
const updateFacilityIntoDB = (id, payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield facility_model_1.Facility.findByIdAndUpdate({ _id: id }, payLoad, { new: true });
    return result;
});
const deleteFacilityFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const deletedFacility = yield facility_model_1.Facility.findByIdAndUpdate(id, { isDeleted: true }, { new: true, session });
        if (!deletedFacility) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete facility');
        }
        yield session.commitTransaction();
        yield session.endSession();
        return deletedFacility;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
exports.FacilityServices = {
    createFacilityIntoDB,
    updateFacilityIntoDB,
    deleteFacilityFromDB,
    getAllFacilityIntoDB,
};
