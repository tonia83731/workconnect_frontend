export type WorkspaceFormType = {
  title: string
  account: string
}

export type WorkspaceType = {
  _id: string
  title: string
  account: string
  memberCount: number
  adminCount: number
  invites: string[]
  members: {
    _id: string
    userId: string
    isAdmin: boolean
  }[]
  createdAt: string
  updatedAt: string
  isDisabled?: boolean
}

export type UserInvitationsType = {
  id: string
  account: string
  title: string
  members_count: number
  invites_count: number
}
