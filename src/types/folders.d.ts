export type WorkfolderType = {
  _id: string
  workspaceId: string
  workbucketId: string
  title: string
  order: number
  todos: TodoType[]
  createdAt: string
  updatedAt: string
}
