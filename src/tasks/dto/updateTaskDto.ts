export class UpdateTaskDto {
  title?: string
  description?: string
  status?: string
  dueDate?: Date
  projectId?: string
  flowIds?: string[]
  screenIds?: string[]
  assignedUserIds?: string[]
}
