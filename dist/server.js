"use strict";
// import mongoose from 'mongoose';
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
// import app from './app';
// import config from './config';
// async function main() {
//     await mongoose.connect(config.db_url as string);
//     try {
//         app.listen(config.port, () => {
//             console.log(`Example app listening on port ${config.port}`)
//         });
//     } catch (err) {
//         console.log(err)
//     }
// }
// main()
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const database_1 = __importDefault(require("./config/database"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, database_1.default)();
            app_1.default.listen(config_1.default.port, () => {
                console.log(`Example app listening on port ${config_1.default.port}`);
            });
        }
        catch (err) {
            console.log(err);
        }
    });
}
main();
