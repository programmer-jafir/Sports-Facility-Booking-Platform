"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notFound_1 = __importDefault(require("./middlwares/notFound"));
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const globalErrorhandeler_1 = __importDefault(require("./middlwares/globalErrorhandeler"));
const app = (0, express_1.default)();
//parsers
app.use(express_1.default.json());
app.use((0, cors_1.default)());
//application routes
app.use('/api/', routes_1.default);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use(globalErrorhandeler_1.default);
//Not FOUND
app.use(notFound_1.default);
exports.default = app;
