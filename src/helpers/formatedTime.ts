export const convertTimeToTimestamp = (date: string | null): number | null => {
  if (!date) return null
  const formated_date = date ? new Date(date) : new Date()
  formated_date.setHours(23, 59, 59, 999)
  return formated_date.getTime()
}
