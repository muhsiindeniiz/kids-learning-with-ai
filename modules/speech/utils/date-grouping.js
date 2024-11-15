import { formatDistanceToNow, isToday, isYesterday } from 'date-fns'

export const groupSessionsByDate = sessions => {
  if (!sessions.length) return {}

  return sessions.reduce((groups, session) => {
    const date = new Date(session.createdAt)
    let group = getDateGroup(date)

    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(session)
    return groups
  }, {})
}

const getDateGroup = date => {
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'

  const distance = formatDistanceToNow(date, { addSuffix: true })
  return formatDistanceGroup(distance)
}

const formatDistanceGroup = distance => {
  if (distance.includes('days')) {
    const days = parseInt(distance.match(/\d+/)?.[0] || '0')
    if (days <= 7) return `Previous ${days} days`
    if (days <= 30) return 'Previous month'
  }

  if (distance.includes('months')) {
    const months = parseInt(distance.match(/\d+/)?.[0] || '0')
    return `${months} ${months === 1 ? 'month' : 'months'} ago`
  }

  if (distance.includes('years')) {
    const years = parseInt(distance.match(/\d+/)?.[0] || '0')
    return `${years} ${years === 1 ? 'year' : 'years'} ago`
  }

  return distance
}
