import { ref, computed } from 'vue'

export interface UserProfile {
  id: string
  fullName: string
  email: string
  avatarUrl: string
  currentScore: number
  currentStreak: number
  totalSaved: number
  wasteReductionPercentage: number
}

const user = ref<UserProfile>({
  id: '1',
  fullName: 'Alex Smith',
  email: 'alex@example.com',
  avatarUrl: '',
  currentScore: 1950,
  currentStreak: 4,
  totalSaved: 156.78,
  wasteReductionPercentage: 73
})

const STORAGE_KEY = 'foodsaver_user'

export function useUser() {
  const initials = computed(() => {
    const names = user.value.fullName.split(' ')
    return names.map(n => n[0]).join('').toUpperCase()
  })

  const loadUser = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      user.value = JSON.parse(stored)
    } else {
      saveUser()
    }
  }

  const saveUser = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value))
  }

  const updateUser = (updates: Partial<UserProfile>) => {
    user.value = { ...user.value, ...updates }
    saveUser()
  }

  const addPoints = (points: number) => {
    user.value.currentScore += points
    saveUser()
  }

  return {
    user,
    initials,
    loadUser,
    saveUser,
    updateUser,
    addPoints
  }
}
