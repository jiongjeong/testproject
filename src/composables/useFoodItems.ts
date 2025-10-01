import { ref, computed } from 'vue'

export interface FoodItem {
  id: string
  userId: string
  name: string
  category: string
  expirationDate: string
  quantity: number
  unit: string
  price: number
  status: 'active' | 'used' | 'expired' | 'shared'
  createdAt: string
  updatedAt: string
}

const foodItems = ref<FoodItem[]>([])
const STORAGE_KEY = 'foodsaver_food_items'

export function useFoodItems() {
  const activeFoodItems = computed(() =>
    foodItems.value.filter(item => item.status === 'active')
  )

  const getDaysUntilExpiration = (expirationDate: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expDate = new Date(expirationDate)
    expDate.setHours(0, 0, 0, 0)
    const diff = expDate.getTime() - today.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const getExpirationBadgeClass = (days: number) => {
    if (days <= 1) return 'badge-expired'
    if (days <= 3) return 'badge-warning-orange'
    if (days <= 7) return 'badge-warning-yellow'
    return 'badge-safe'
  }

  const getExpirationText = (days: number) => {
    if (days < 0) return 'Expired'
    if (days === 0) return 'Today'
    if (days === 1) return '1 day'
    return `${days} days`
  }

  const expiringSoon = computed(() =>
    activeFoodItems.value.filter(item => {
      const days = getDaysUntilExpiration(item.expirationDate)
      return days >= 0 && days <= 7
    }).length
  )

  const expired = computed(() =>
    activeFoodItems.value.filter(item =>
      getDaysUntilExpiration(item.expirationDate) < 0
    ).length
  )

  const potentialLoss = computed(() =>
    activeFoodItems.value
      .filter(item => getDaysUntilExpiration(item.expirationDate) < 0)
      .reduce((sum, item) => sum + item.price, 0)
  )

  const loadFoodItems = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      foodItems.value = JSON.parse(stored)
    } else {
      initializeSampleData()
    }
  }

  const saveFoodItems = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(foodItems.value))
  }

  const addFoodItem = (item: Omit<FoodItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const newItem: FoodItem = {
      ...item,
      id: Date.now().toString(),
      userId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    foodItems.value.push(newItem)
    saveFoodItems()
    return newItem
  }

  const updateFoodItem = (id: string, updates: Partial<FoodItem>) => {
    const index = foodItems.value.findIndex(item => item.id === id)
    if (index !== -1) {
      foodItems.value[index] = {
        ...foodItems.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      saveFoodItems()
    }
  }

  const deleteFoodItem = (id: string) => {
    foodItems.value = foodItems.value.filter(item => item.id !== id)
    saveFoodItems()
  }

  const initializeSampleData = () => {
    const today = new Date()
    const samples: Omit<FoodItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'Apples',
        category: 'Fruits & Vegetables',
        expirationDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: 6,
        unit: 'pieces',
        price: 3.99,
        status: 'active'
      },
      {
        name: 'Milk',
        category: 'Dairy & Eggs',
        expirationDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: 1,
        unit: 'liter',
        price: 2.49,
        status: 'active'
      },
      {
        name: 'Chicken Breast',
        category: 'Meat & Poultry',
        expirationDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: 500,
        unit: 'grams',
        price: 8.99,
        status: 'active'
      },
      {
        name: 'Bread',
        category: 'Bakery',
        expirationDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: 1,
        unit: 'loaf',
        price: 2.99,
        status: 'active'
      },
      {
        name: 'Yogurt',
        category: 'Dairy & Eggs',
        expirationDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: 4,
        unit: 'cups',
        price: 4.99,
        status: 'active'
      }
    ]

    samples.forEach(sample => addFoodItem(sample))
  }

  return {
    foodItems,
    activeFoodItems,
    expiringSoon,
    expired,
    potentialLoss,
    getDaysUntilExpiration,
    getExpirationBadgeClass,
    getExpirationText,
    loadFoodItems,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem
  }
}
