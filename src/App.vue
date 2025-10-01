<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'
import Sidebar from './components/layout/Sidebar.vue'
import MobileHeader from './components/layout/MobileHeader.vue'
import DashboardView from './views/DashboardView.vue'
import RecipesView from './views/RecipesView.vue'
import ChatView from './views/ChatView.vue'
import CommunityView from './views/CommunityView.vue'
import AnalyticsView from './views/AnalyticsView.vue'
import LeaderboardView from './views/LeaderboardView.vue'
import ProfileView from './views/ProfileView.vue'
import NotificationsView from './views/NotificationsView.vue'
import { useUser } from './composables/useUser'
import { useFoodItems } from './composables/useFoodItems'
import { useNotifications } from './composables/useNotifications'
import { useActivities } from './composables/useActivities'
import { useRecipes } from './composables/useRecipes'

const currentView = ref('dashboard')
const sidebarOpen = ref(false)

const { loadUser } = useUser()
const { loadFoodItems } = useFoodItems()
const { loadNotifications } = useNotifications()
const { loadActivities } = useActivities()
const { loadRecipes } = useRecipes()

provide('currentView', currentView)

onMounted(() => {
  loadUser()
  loadFoodItems()
  loadNotifications()
  loadActivities()
  loadRecipes()
})

const setView = (view: string) => {
  currentView.value = view
  sidebarOpen.value = false
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <div>
    <MobileHeader
      @toggle-sidebar="toggleSidebar"
    />

    <div
      class="sidebar-overlay"
      :class="{ 'show': sidebarOpen }"
      @click="sidebarOpen = false"
    ></div>

    <Sidebar
      :current-view="currentView"
      :sidebar-open="sidebarOpen"
      @set-view="setView"
    />

    <div class="main-content" :class="{ 'full-width': !sidebarOpen }">
      <Transition name="fade" mode="out-in">
        <DashboardView v-if="currentView === 'dashboard'" />
        <RecipesView v-else-if="currentView === 'recipes'" />
        <ChatView v-else-if="currentView === 'chat'" />
        <CommunityView v-else-if="currentView === 'community'" />
        <AnalyticsView v-else-if="currentView === 'analytics'" />
        <LeaderboardView v-else-if="currentView === 'leaderboard'" />
        <ProfileView v-else-if="currentView === 'profile'" @back="setView('dashboard')" />
        <NotificationsView v-else-if="currentView === 'notifications'" @back="setView('dashboard')" />
      </Transition>
    </div>
  </div>
</template>

<style>
@import './style.css';
</style>
