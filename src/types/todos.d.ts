// about todo
export type TodoType = {
  _id: string
  workfolderId: string
  title: string
  assignments: AssignmentType[]
  status: 'pending' | 'processing' | 'completed'
  note: string
  checklists: CheckListType[]
  deadline: number | null
}

export type TodoFormatedType = {
  _id: string
  workfolderId: string
  title: string
  assignments: AssignmentFormatedType[]
  status: 'pending' | 'processing' | 'completed'
  note: string
  checklists: CheckListType[]
  deadline: number | null
}

export type CheckListType = {
  id: number
  text: string
  isChecked: boolean
}
export type AssignmentType = {
  _id: string
  userId: {
    _id: string
    name: string
    bgColor: string
    textColor: string
  }
}

export type AssignmentFormatedType = {
  userId: string
  name: string
  bgColor: string
  textColor: string
}

export type TodoCreateType = {
  title: string
  deadline: number | null
  assignments: {
    userId: string
  }[]
}

export type TodoEditType = {
  _id: string
  workfolderId: {
    id: string
    name: string
  }
  title: string
  assignments: {
    userId: string
    name: string
  }[]
  status: {
    id: string
    name: string
  }
  note: string
  checklists: CheckListType[]
  deadline: number | null
}
