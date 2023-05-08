"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var SECRET_KEY = process.env.JWT_SECRET_KEY || 'mysecretkey';
var generateToken = function (user) {
    var payload = {
        id: user.id,
        username: user.name
    };
    return jsonwebtoken_1.default.sign(payload, SECRET_KEY, { expiresIn: '7d' });
};
exports.generateToken = generateToken;
