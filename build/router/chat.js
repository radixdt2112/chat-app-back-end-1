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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var verifyToken_1 = require("../middleware/verifyToken");
var chatServices_1 = require("../services/chatServices");
var router = express_1.default.Router();
// API: Getting Chat between two users
router.get('/', verifyToken_1.verifyToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, to, from, privateChat;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.query, to = _a.to, from = _a.from;
                if (((_b = req.payload) === null || _b === void 0 ? void 0 : _b.id) !== to) {
                    res.status(400).send('Bad Request');
                }
                if (!(typeof to == 'string' && typeof from == 'string')) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, chatServices_1.chatHistory)(to, from)];
            case 1:
                privateChat = _c.sent();
                res.send(privateChat);
                return [3 /*break*/, 3];
            case 2:
                res.status(400).send('Bad Request');
                _c.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
// API: Set Read messages
router.put('/read-messages', verifyToken_1.verifyToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, from, to, success;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.query, from = _a.from, to = _a.to;
                if (((_b = req.payload) === null || _b === void 0 ? void 0 : _b.id) !== to) {
                    res.status(400).send('Bad Request');
                }
                if (!(typeof from == 'string' && typeof to == 'string')) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, chatServices_1.changeMessageStatus)(from, to)];
            case 1:
                success = _c.sent();
                if (success) {
                    res.send('Successfully updated message status');
                }
                else {
                    res.send('error when updating message status');
                }
                return [3 /*break*/, 3];
            case 2:
                res.send('bad request');
                _c.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
