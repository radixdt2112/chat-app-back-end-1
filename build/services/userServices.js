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
exports.addUserInChatList = exports.checkUserToInChatListOfFrom = exports.getUserChatListById = exports.getUserByEmail = exports.createUser = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var privateChat_1 = require("../models/privateChat");
var user_1 = require("../models/user");
var uniqueRoomPrivateChat_1 = require("../utils/uniqueRoomPrivateChat");
var lodash_1 = __importDefault(require("lodash"));
var generateToken_1 = require("../utils/generateToken");
var createUser = function (name, email) { return __awaiter(void 0, void 0, void 0, function () {
    var data, user, result, token, token, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                data = new user_1.Users({
                    name: name,
                    email: email,
                    chatList: [],
                    bio: null,
                    image: null
                });
                return [4 /*yield*/, user_1.Users.findOne({ email: email })];
            case 1:
                user = _a.sent();
                if (!!user) return [3 /*break*/, 3];
                return [4 /*yield*/, data.save()];
            case 2:
                result = _a.sent();
                if (result) {
                    token = (0, generateToken_1.generateToken)({
                        id: result._id.toString(),
                        name: result.name
                    });
                    return [2 /*return*/, {
                            token: token,
                            id: result._id.toString(),
                            name: result.name
                        }];
                }
                else {
                    return [2 /*return*/, { statusCode: 500, message: 'Unable to create user' }];
                }
                return [3 /*break*/, 4];
            case 3:
                token = (0, generateToken_1.generateToken)({
                    id: user._id.toString(),
                    name: user.name
                });
                return [2 /*return*/, {
                        token: token,
                        id: user._id.toString(),
                        name: user.name
                    }];
            case 4: return [3 /*break*/, 6];
            case 5:
                e_1 = _a.sent();
                return [2 /*return*/, {
                        statusCode: 500,
                        message: "Unable to create user \n ".concat(JSON.stringify(e_1))
                    }];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.createUser = createUser;
var updateUser = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_1.Users.findByIdAndUpdate(id, {
                    $push: { contacts: '641be405d0924e3f35e813aa' }
                })];
            case 1:
                result = _a.sent();
                console.log('createUser :>>', result);
                return [2 /*return*/];
        }
    });
}); };
var deleteUser = function () { };
var getUsers = function () { };
var getUserByEmail = function (email) { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, user_1.Users.find({
                        email: email
                    })
                        .populate('chatList', '_id name')
                        .select('name id')];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result[0]];
            case 2:
                err_1 = _a.sent();
                throw err_1;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUserByEmail = getUserByEmail;
var getUserChatListById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var result, privateChatIds_1, chatListObj_1, chatUsersId_1, response_1, privateChatIdLatestRecords, to, unreadMessages_1, chatIds, userIdInChatList, uniqueId, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                return [4 /*yield*/, user_1.Users.findById(id)
                        .populate('chatList', '_id name')
                        .select('_id')];
            case 1:
                result = _a.sent();
                if (!result) return [3 /*break*/, 5];
                if (!(result.chatList && result.chatList.length > 0)) return [3 /*break*/, 4];
                privateChatIds_1 = [];
                chatListObj_1 = {};
                chatUsersId_1 = [];
                response_1 = [];
                result.chatList.forEach(function (item) {
                    if (!chatListObj_1[item._id]) {
                        chatListObj_1[item._id] = item;
                    }
                    chatUsersId_1.push(item._id);
                    privateChatIds_1.push((0, uniqueRoomPrivateChat_1.uniqueRoomPrivateChat)("".concat(id, "--with--").concat(item._id)));
                });
                return [4 /*yield*/, privateChat_1.PrivateChatModel.aggregate([
                        {
                            $match: {
                                privateChatId: {
                                    $in: privateChatIds_1
                                }
                            }
                        },
                        { $sort: { createdAt: -1 } },
                        {
                            $group: {
                                _id: '$privateChatId',
                                latestRecord: { $first: '$$ROOT' } // Select the first document of each group (i.e., the last transaction)
                            }
                        },
                        { $sort: { createdAt: -1 } },
                        {
                            $project: {
                                latestRecord: {
                                    from: 1,
                                    to: 1
                                }
                            }
                        }
                    ])
                    // console.log('privateChatIdLatestRecords :>',privateChatIdLatestRecords)
                ];
            case 2:
                privateChatIdLatestRecords = _a.sent();
                to = new mongoose_1.default.Types.ObjectId(id);
                return [4 /*yield*/, privateChat_1.PrivateChatModel.aggregate([
                        {
                            $match: {
                                to: to,
                                from: {
                                    $in: chatUsersId_1
                                },
                                unread: true
                            }
                        },
                        {
                            $group: {
                                _id: '$from',
                                count: { $sum: 1 }
                            }
                        }
                    ])
                    // console.log('unreadMessages :>', unreadMessages)
                ];
            case 3:
                unreadMessages_1 = _a.sent();
                // console.log('unreadMessages :>', unreadMessages)
                privateChatIdLatestRecords.forEach(function (item) {
                    var findUnReadMessage = null;
                    if (unreadMessages_1.length > 0) {
                        findUnReadMessage = unreadMessages_1.find(function (y) {
                            return y._id.toString() ===
                                item.latestRecord.from.toString();
                        });
                    }
                    if (!findUnReadMessage) {
                        var obj = {
                            _id: item.latestRecord.from.toString() === id
                                ? item.latestRecord.to.toString()
                                : item.latestRecord.from.toString(),
                            name: chatListObj_1[item.latestRecord.from.toString() === id
                                ? item.latestRecord.to.toString()
                                : item.latestRecord.from.toString()].name,
                            unReadMessagesCount: 0
                        };
                        response_1.push(obj);
                    }
                    else {
                        response_1.push({
                            _id: item.latestRecord.from.toString(),
                            name: chatListObj_1[item.latestRecord.from].name,
                            unReadMessagesCount: findUnReadMessage.count
                        });
                    }
                });
                chatIds = response_1.map(function (item) { return item._id; });
                userIdInChatList = chatUsersId_1.map(function (item) {
                    return item.toString();
                });
                uniqueId = lodash_1.default.difference(userIdInChatList, chatIds);
                uniqueId.forEach(function (item) {
                    response_1.push({
                        _id: item,
                        name: chatListObj_1[item].name,
                        unReadMessagesCount: 0
                    });
                });
                return [2 /*return*/, response_1];
            case 4: return [2 /*return*/, []];
            case 5: return [2 /*return*/, []];
            case 6: return [3 /*break*/, 8];
            case 7:
                err_2 = _a.sent();
                throw err_2;
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.getUserChatListById = getUserChatListById;
var checkUserToInChatListOfFrom = function (user1, user2) { return __awaiter(void 0, void 0, void 0, function () {
    var findUser, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, user_1.Users.findById(user2)
                        .populate({
                        path: 'chatList',
                        match: { _id: user1 },
                        select: '_id'
                    })
                        .select('_id')];
            case 1:
                findUser = _a.sent();
                if (!(findUser && findUser.chatList && findUser.chatList.length === 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, user_1.Users.findByIdAndUpdate(user2, {
                        $push: { chatList: user1 }
                    })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                err_3 = _a.sent();
                console.log(err_3);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.checkUserToInChatListOfFrom = checkUserToInChatListOfFrom;
var addUserInChatList = function (loggedInUserId, friendId) { return __awaiter(void 0, void 0, void 0, function () {
    var findUser, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, user_1.Users.findById(loggedInUserId)
                        .populate({
                        path: 'chatList',
                        match: { _id: friendId },
                        select: '_id'
                    })
                        .select('_id')];
            case 1:
                findUser = _a.sent();
                if (!findUser) {
                    return [2 /*return*/, {
                            statusCode: 404,
                            message: 'User not found.'
                        }];
                }
                if (!(findUser.chatList && findUser.chatList.length === 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, user_1.Users.findByIdAndUpdate(loggedInUserId, {
                        $push: { chatList: friendId }
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/, {
                        statusCode: 200,
                        message: 'User added to chat-list.'
                    }];
            case 3: return [2 /*return*/, {
                    statusCode: 409,
                    message: 'User already added in chat list.'
                }];
            case 4: return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                return [2 /*return*/, {
                        statusCode: 500,
                        message: 'Found error in adding user into the chat-list.'
                    }];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.addUserInChatList = addUserInChatList;
