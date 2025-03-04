"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Facility = void 0;
const mongoose_1 = require("mongoose");
const facilitySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    pricePerHour: {
        type: String,
        required: true,
        min: 0
    },
    location: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    img: {
        type: String,
        required: true
    }
});
exports.Facility = (0, mongoose_1.model)('Facility', facilitySchema);
