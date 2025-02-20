export type ChatMemberType = {
  id: string
  name: string
  isOnline?: boolean
  bgColor: string
  textColor: string
  letter: string
}

// export type ChatMemberWithColorType = ChatMemberType & {
//   bg_color: string
// }

export type ChatMessageType = {
  _id: string
  workspaceId: string
  chatId: string
  senderId: string
  text: string
  name: string
  bgColor: string
  textColor: string
  // senderId: {
  //   _id: string
  //   name: string
  //   email: string
  // }
  createdAt: string
  updatedAt: string
}
