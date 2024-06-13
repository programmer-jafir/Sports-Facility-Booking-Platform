"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouters = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlwares/validateRequest"));
const auth_validation_1 = require("../Auth/auth.validation");
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router.post('/login', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.loginValidationSchema), user_controller_1.UserControllers.loginUser);
router.post('/signup', (0, validateRequest_1.default)(user_validation_1.UserValidation.createUserValidation), user_controller_1.UserControllers.createUserSignUp);
exports.UserRouters = router;
