"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var https_1 = require("https");
var socket_io_1 = require("socket.io");
var cors_1 = __importDefault(require("cors"));
var uniqueRoomPrivateChat_1 = require("../utils/uniqueRoomPrivateChat");
var chatServices_1 = require("../services/chatServices");
var express_session_1 = __importDefault(require("express-session"));
var fs_1 = __importDefault(require("fs"));
var connect_mongo_1 = __importDefault(require("connect-mongo"));
require('dotenv').config();
Promise.resolve().then(function () { return __importStar(require('../dbConfig')); });
var router_1 = __importDefault(require("../router"));
var passport_1 = __importDefault(require("passport"));
var app = (0, express_1.default)();
var port = process.env.PORT || 9000;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    credentials: true,
    origin: [
        'http://localhost:3000',
        'https://chat-application-two-eta.vercel.app'
    ],
    methods: ['GET,HEAD,PUT,PATCH,POST,DELETE']
}));
app.use(express_1.default.urlencoded({ extended: true }));
// app.use(helmet())
// app.use(compression())
app.use((0, express_session_1.default)({
    secret: process.env.JWT_SECRET_KEY || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new connect_mongo_1.default({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/chatApp'
    })
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use('/api', router_1.default);
app.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.send('Chat App Running...');
        return [2 /*return*/];
    });
}); });
var server = (0, https_1.createServer)({
    key: fs_1.default.readFileSync(__dirname + '/../../server.key'),
    cert: fs_1.default.readFileSync(__dirname + '/../../server.cert')
}, app);
var io = new socket_io_1.Server(server, {
    cors: {
        origin: [
            'http://localhost:3000',
            'https://chat-application-two-eta.vercel.app'
        ],
        credentials: true,
        methods: ['GET,HEAD,PUT,PATCH,POST,DELETE']
    }
});
var allClients = {};
io.on('connection', function (socket) {
    // allClients.push(socket.id)
    // socket.on('join_room', (data) => {
    //     const { userName, room } = data // Data sent from client when join_room event emitted
    //     socket.join(room) // Join the user to a socket room
    //     let createdTime = Date.now() // Current timestamp
    //     // Send message to all users currently in the room, apart from the user that just joined
    //     io.to(room).emit('user_join_room', {
    //         message: `${userName} has joined the chat room`,
    //         from: userName,
    //         to: '',
    //         room: room,
    //         createdAt: createdTime,
    //         type: 'joined'
    //     })
    // })
    socket.on('login', function (data) {
        allClients[socket.id] = data.id;
        var activeUsers = [];
        for (var _i = 0, _a = Object.values(allClients); _i < _a.length; _i++) {
            var iterator = _a[_i];
            activeUsers.push(iterator);
        }
        io.emit('online_users', activeUsers);
    });
    socket.on('user_join_private_chat', function (data) {
        var room = data.room;
        var privateChatId = (0, uniqueRoomPrivateChat_1.uniqueRoomPrivateChat)(room);
        socket.join(privateChatId);
    });
    socket.on('private_message', function (data) {
        var from = data.from, to = data.to, message = data.message, room = data.room;
        var privateChatId = (0, uniqueRoomPrivateChat_1.uniqueRoomPrivateChat)(room);
        socket.join(privateChatId);
        var createdTime = Date.now(); // Current timestamp
        (0, chatServices_1.saveMessage)({
            from: from,
            to: to,
            message: message,
            privateChatId: privateChatId,
            unread: true
        });
        io.emit('incoming_message', {
            from: from,
            to: to
        });
        io.to(privateChatId).emit('receive_private_message', {
            message: message,
            from: from,
            to: to,
            privateChatId: privateChatId,
            createdAt: createdTime,
            type: 'chat',
            unread: true
        });
    });
    socket.on('disconnect', function () {
        io.emit('offline', allClients[socket.id]);
        delete allClients[socket.id];
        console.log(socket.id + ' ==== diconnected');
    });
});
server.listen(port, function () {
    return console.log("Server is listening at https://localhost:".concat(port));
});
exports.default = app;
