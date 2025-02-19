export type WorkfolderType = {
  _id: string
  workspaceId: string
  workbucketId: string
  title: string
  order: number
  todos?: string[]
  createdAt: string
  updatedAt: string
}
