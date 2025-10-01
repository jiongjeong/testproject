<script setup lang="ts">
import { ref } from 'vue'
import { useUser } from '../composables/useUser'

const emit = defineEmits<{
  back: []
}>()

const { user, initials, updateUser } = useUser()

const showEditModal = ref(false)
const editForm = ref({
  fullName: user.value.fullName
})

const achievements = [
  { id: 1, name: 'First Save', icon: 'bi-star-fill', unlocked: true, color: 'text-warning' },
  { id: 2, name: 'Week Warrior', icon: 'bi-calendar-check-fill', unlocked: true, color: 'text-success' },
  { id: 3, name: '$100 Saver', icon: 'bi-currency-dollar', unlocked: true, color: 'text-primary' },
  { id: 4, name: 'Recipe Master', icon: 'bi-egg-fried', unlocked: false, color: 'text-muted' },
  { id: 5, name: 'Community Hero', icon: 'bi-people-fill', unlocked: false, color: 'text-muted' },
  { id: 6, name: 'Zero Waste', icon: 'bi-recycle', unlocked: false, color: 'text-muted' }
]

const handleSaveProfile = () => {
  updateUser({ fullName: editForm.value.fullName })
  showEditModal.value = false
}
</script>

<template>
  <div class="container-fluid p-4">
    <button class="btn btn-link text-decoration-none mb-3 p-0" @click="emit('back')">
      <i class="bi bi-arrow-left"></i> Back
    </button>

    <h1 class="h2 mb-4">Profile</h1>

    <div class="glass-card p-4 mb-4">
      <div class="d-flex align-items-center gap-3 mb-3">
        <div class="avatar-lg">{{ initials }}</div>
        <div class="flex-1">
          <h4 class="mb-1">{{ user.fullName }}</h4>
          <p class="text-muted mb-0">{{ user.email }}</p>
        </div>
        <button class="btn btn-outline-primary" @click="showEditModal = true">
          <i class="bi bi-pencil"></i> Edit Profile
        </button>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-6 col-md-3">
        <div class="glass-card stat-card p-3 text-center">
          <i class="bi bi-fire fs-3 text-warning"></i>
          <h4 class="mt-2 mb-1">{{ user.currentStreak }}</h4>
          <small class="text-muted">Day Streak</small>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="glass-card stat-card p-3 text-center">
          <i class="bi bi-currency-dollar fs-3 text-success"></i>
          <h4 class="mt-2 mb-1">${{ user.totalSaved.toFixed(2) }}</h4>
          <small class="text-muted">Total Saved</small>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="glass-card stat-card p-3 text-center">
          <i class="bi bi-graph-up fs-3 text-primary"></i>
          <h4 class="mt-2 mb-1">{{ user.wasteReductionPercentage }}%</h4>
          <small class="text-muted">Waste Reduction</small>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="glass-card stat-card p-3 text-center">
          <i class="bi bi-trophy fs-3 text-warning"></i>
          <h4 class="mt-2 mb-1">{{ user.currentScore }}</h4>
          <small class="text-muted">Current Score</small>
        </div>
      </div>
    </div>

    <div class="glass-card p-4 mb-4">
      <h3 class="h5 mb-4">Achievements</h3>
      <div class="row g-3">
        <div
          v-for="achievement in achievements"
          :key="achievement.id"
          class="col-6 col-md-4 col-lg-2"
        >
          <div class="text-center p-3 border rounded" :class="{ 'opacity-50': !achievement.unlocked }">
            <i class="fs-1" :class="[achievement.icon, achievement.color]"></i>
            <p class="mb-0 mt-2 small">{{ achievement.name }}</p>
            <i v-if="achievement.unlocked" class="bi bi-check-circle-fill text-success"></i>
            <i v-else class="bi bi-lock-fill text-muted"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="glass-card p-4">
      <h3 class="h5 mb-4">Settings</h3>
      <div class="d-flex flex-column gap-3">
        <div class="d-flex justify-content-between align-items-center pb-3 border-bottom">
          <div>
            <div class="fw-medium">Enable Notifications</div>
            <small class="text-muted">Receive alerts for expiring items</small>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" checked>
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center pb-3 border-bottom">
          <div>
            <div class="fw-medium">Dark Mode</div>
            <small class="text-muted">Switch to dark theme</small>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox">
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center pb-3 border-bottom">
          <div>
            <div class="fw-medium">Notification Frequency</div>
            <small class="text-muted">How often to receive notifications</small>
          </div>
          <select class="form-select" style="max-width: 200px;">
            <option>Daily</option>
            <option>Every 3 days</option>
            <option>Weekly</option>
          </select>
        </div>
        <div class="d-flex justify-content-between align-items-center pb-3 border-bottom">
          <button class="btn btn-outline-primary">
            <i class="bi bi-download"></i> Export Data
          </button>
        </div>
        <div>
          <button class="btn btn-destructive">
            <i class="bi bi-trash"></i> Delete Account
          </button>
        </div>
      </div>
    </div>

    <div v-if="showEditModal" class="modal fade show d-block" tabindex="-1" @click.self="showEditModal = false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Profile</h5>
            <button type="button" class="btn-close" @click="showEditModal = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSaveProfile">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input
                  v-model="editForm.fullName"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <div class="input-group">
                  <input
                    type="email"
                    class="form-control"
                    :value="user.email"
                    readonly
                  />
                  <span class="input-group-text">
                    <i class="bi bi-lock"></i>
                  </span>
                </div>
              </div>
              <button type="submit" class="btn btn-primary-gradient w-100">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show"></div>
    </div>
  </div>
</template>
