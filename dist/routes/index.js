"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const record_routes_1 = __importDefault(require("./record.routes"));
const test_routes_1 = __importDefault(require("./test.routes"));
const execution_routes_1 = __importDefault(require("./execution.routes"));
const router = (0, express_1.Router)();
/**
 * Recording APIs
 */
router.use("/record", record_routes_1.default);
/**
 * Test APIs
 */
router.use("/test", test_routes_1.default);
/**
 * Execution Analytics APIs
 */
router.use("/executions", execution_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map