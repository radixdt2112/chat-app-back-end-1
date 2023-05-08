export const uniqueRoomPrivateChat = (room: string) => {
    let splitUsers: string[] = room.split('--with--') // ['username2', 'username1']

    let makeUniqueRoom = splitUsers.sort((a: string, b: string) =>
        a < b ? -1 : 1
    )
    let updatedRoomName = `${makeUniqueRoom[0]}--with--${makeUniqueRoom[1]}` // 'username1--with--username2'
    return updatedRoomName
}
