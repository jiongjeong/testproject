<script setup lang="ts">
import { ref } from 'vue'

interface SharedItem {
  id: string
  foodName: string
  quantity: string
  daysUntilExpiration: number
  distance: number
  sharedBy: string
  avatar: string
}

const sharedItems = ref<SharedItem[]>([
  {
    id: '1',
    foodName: 'Apples',
    quantity: '3 pieces',
    daysUntilExpiration: 2,
    distance: 0.3,
    sharedBy: 'Sarah Chen',
    avatar: 'SC'
  },
  {
    id: '2',
    foodName: 'Milk',
    quantity: '1 liter',
    daysUntilExpiration: 1,
    distance: 0.7,
    sharedBy: 'Michael Tan',
    avatar: 'MT'
  },
  {
    id: '3',
    foodName: 'Bread',
    quantity: '1 loaf',
    daysUntilExpiration: 3,
    distance: 1.2,
    sharedBy: 'Emily Wong',
    avatar: 'EW'
  }
])

const mySharedItems = ref<any[]>([])

const handleRequest = (item: SharedItem) => {
  alert(`Request sent to ${item.sharedBy} for ${item.foodName}!`)
}

const handleShareFood = () => {
  alert('Share food feature: Select items from your inventory to share with neighbors')
}
</script>

<template>
  <div class="container-fluid p-4">
    <div class="mb-4">
      <h1 class="h2 mb-2">Community Food Sharing</h1>
      <p class="text-muted">Share expiring food with neighbors to reduce waste</p>
    </div>

    <div class="glass-card p-4 mb-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="h5 mb-0">My Shared Items</h3>
        <button class="btn btn-primary-gradient" @click="handleShareFood">
          <i class="bi bi-plus-lg"></i> Share Food
        </button>
      </div>

      <div v-if="mySharedItems.length === 0" class="text-center py-4">
        <i class="bi bi-share fs-1 text-muted"></i>
        <p class="text-muted mt-3">You haven't shared any items yet</p>
      </div>
    </div>

    <div class="glass-card p-4">
      <h3 class="h5 mb-4">Available Near You</h3>

      <div class="row g-4">
        <div
          v-for="item in sharedItems"
          :key="item.id"
          class="col-12 col-md-6 col-lg-4"
        >
          <div class="card h-100">
            <div class="card-body">
              <div class="mb-3">
                <h5 class="card-title mb-2">{{ item.foodName }}</h5>
                <p class="text-muted mb-0">{{ item.quantity }}</p>
              </div>

              <div class="mb-3">
                <span class="badge badge-warning-orange">
                  Expires in {{ item.daysUntilExpiration }} day{{ item.daysUntilExpiration !== 1 ? 's' : '' }}
                </span>
                <span class="badge bg-light text-dark ms-2">
                  <i class="bi bi-geo-alt"></i> {{ item.distance }} km away
                </span>
              </div>

              <div class="d-flex align-items-center gap-2 mb-3">
                <div class="avatar" style="width: 32px; height: 32px; font-size: 0.75rem;">
                  {{ item.avatar }}
                </div>
                <small class="text-muted">Shared by {{ item.sharedBy }}</small>
              </div>

              <button
                class="btn btn-primary-gradient w-100"
                @click="handleRequest(item)"
              >
                Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
