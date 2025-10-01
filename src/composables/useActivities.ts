import { ref } from 'vue'

export interface Activity {
  id: string
  userId: string
  actionType: 'added' | 'used' | 'wasted' | 'shared' | 'recipe_created'
  foodItemId?: string
  value?: number
  description: string
  createdAt: string
}

const activities = ref<Activity[]>([])
const STORAGE_KEY = 'foodsaver_activities'

export function useActivities() {
  const loadActivities = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      activities.value = JSON.parse(stored)
    } else {
      initializeSampleActivities()
    }
  }

  const saveActivities = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities.value))
  }

  const addActivity = (activity: Omit<Activity, 'id' | 'userId' | 'createdAt'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
      userId: '1',
      createdAt: new Date().toISOString()
    }
    activities.value.push(newActivity)
    saveActivities()
  }

  const getRecentActivities = (limit: number = 5) => {
    return [...activities.value]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
  }

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  const initializeSampleActivities = () => {
    const baseTime = Date.now()
    const samples: Omit<Activity, 'id' | 'userId' | 'createdAt'>[] = [
      {
        actionType: 'used',
        value: 3.49,
        description: 'Used Eggs before expiration'
      },
      {
        actionType: 'used',
        value: 4.99,
        description: 'Used Tomatoes before expiration'
      },
      {
        actionType: 'used',
        value: 6.99,
        description: 'Used Ground Beef before expiration'
      },
      {
        actionType: 'wasted',
        value: 2.99,
        description: 'Lettuce expired'
      },
      {
        actionType: 'wasted',
        value: 1.99,
        description: 'Bananas expired'
      }
    ]

    samples.forEach((sample, index) => {
      const activity: Activity = {
        ...sample,
        id: (baseTime - index * 86400000).toString(),
        userId: '1',
        createdAt: new Date(baseTime - (index + 1) * 86400000).toISOString()
      }
      activities.value.push(activity)
    })
    saveActivities()
  }

  return {
    activities,
    loadActivities,
    addActivity,
    getRecentActivities,
    getRelativeTime
  }
}
