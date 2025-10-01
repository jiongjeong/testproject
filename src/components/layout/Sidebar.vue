<script setup lang="ts">
import { useUser } from '../../composables/useUser'
import { useNotifications } from '../../composables/useNotifications'

defineProps<{
  currentView: string
  sidebarOpen: boolean
}>()

const emit = defineEmits<{
  setView: [view: string]
}>()

const { user, initials } = useUser()
const { unreadCount } = useNotifications()
</script>

<template>
  <div class="sidebar" :class="{ 'show': sidebarOpen }">
    <div class="p-4">
      <div class="d-flex align-items-center gap-2 mb-4">
        <span class="fs-4">🥬</span>
        <h3 class="text-gradient-green mb-0">FoodSaver</h3>
      </div>

      <nav class="d-flex flex-column gap-1 mb-4">
        <a
          href="#"
          class="nav-link"
          :class="{ 'active': currentView === 'dashboard' }"
          @click.prevent="emit('setView', 'dashboard')"
        >
          <i class="bi bi-house-door"></i>
          <span>Dashboard</span>
        </a>
        <a
          href="#"
          class="nav-link"
          :class="{ 'active': currentView === 'recipes' }"
          @click.prevent="emit('setView', 'recipes')"
        >
          <i class="bi bi-egg-fried"></i>
          <span>Recipes</span>
        </a>
        <a
          href="#"
          class="nav-link"
          :class="{ 'active': currentView === 'chat' }"
          @click.prevent="emit('setView', 'chat')"
        >
          <i class="bi bi-robot"></i>
          <span>AI Chat</span>
        </a>
        <a
          href="#"
          class="nav-link"
          :class="{ 'active': currentView === 'community' }"
          @click.prevent="emit('setView', 'community')"
        >
          <i class="bi bi-people"></i>
          <span>Community</span>
        </a>
        <a
          href="#"
          class="nav-link"
          :class="{ 'active': currentView === 'analytics' }"
          @click.prevent="emit('setView', 'analytics')"
        >
          <i class="bi bi-bar-chart"></i>
          <span>Analytics</span>
        </a>
        <a
          href="#"
          class="nav-link"
          :class="{ 'active': currentView === 'leaderboard' }"
          @click.prevent="emit('setView', 'leaderboard')"
        >
          <i class="bi bi-trophy"></i>
          <span>Leaderboard</span>
        </a>
      </nav>
    </div>

    <div class="mt-auto p-3 border-top">
      <a
        href="#"
        class="nav-link position-relative"
        @click.prevent="emit('setView', 'notifications')"
      >
        <i class="bi bi-bell"></i>
        <span>Notifications</span>
        <span v-if="unreadCount > 0" class="badge bg-danger rounded-pill ms-auto">
          {{ unreadCount }}
        </span>
      </a>
      <a
        href="#"
        class="nav-link"
        @click.prevent="emit('setView', 'profile')"
      >
        <div class="avatar">{{ initials }}</div>
        <span>{{ user.fullName }}</span>
      </a>
    </div>
  </div>
</template>
