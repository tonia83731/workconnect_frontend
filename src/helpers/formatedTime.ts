import dayjs from 'dayjs'
export const formatedTime = (date: string | number | null) => {
  if (date) {
    return dayjs(date).format('YYYY-MM-DD')
  }
}

export const formatedTimeToTimestamp = (date: string | number | null) => {
  if (typeof date === 'number') return date
  const formated_date = date ? new Date(date) : new Date()
  formated_date.setHours(23, 59, 59, 999)
  return formated_date.getTime()
}
