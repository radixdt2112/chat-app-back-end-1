"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueRoomPrivateChat = void 0;
var uniqueRoomPrivateChat = function (room) {
    var splitUsers = room.split('--with--'); // ['username2', 'username1']
    var makeUniqueRoom = splitUsers.sort(function (a, b) {
        return a < b ? -1 : 1;
    });
    var updatedRoomName = "".concat(makeUniqueRoom[0], "--with--").concat(makeUniqueRoom[1]); // 'username1--with--username2'
    return updatedRoomName;
};
exports.uniqueRoomPrivateChat = uniqueRoomPrivateChat;
