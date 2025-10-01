<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRecipes } from '../composables/useRecipes'
import AddRecipeModal from '../components/recipes/AddRecipeModal.vue'

const { bookmarkedRecipes, customRecipes, suggestedRecipes, toggleBookmark } = useRecipes()

const activeTab = ref<'suggested' | 'bookmarked' | 'custom'>('suggested')
const searchQuery = ref('')
const showAddModal = ref(false)

const displayedRecipes = computed(() => {
  let recipeList = []
  if (activeTab.value === 'suggested') recipeList = suggestedRecipes.value
  else if (activeTab.value === 'bookmarked') recipeList = bookmarkedRecipes.value
  else recipeList = customRecipes.value

  if (searchQuery.value) {
    recipeList = recipeList.filter(r =>
      r.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.ingredients.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  return recipeList
})

const handleToggleBookmark = (id: string) => {
  toggleBookmark(id)
}
</script>

<template>
  <div class="container-fluid p-4">
    <div class="mb-4">
      <h1 class="h2 mb-2">Recipe Suggestions</h1>
      <p class="text-muted">Find recipes based on your ingredients</p>
    </div>

    <div class="glass-card p-4 mb-4">
      <input
        v-model="searchQuery"
        type="text"
        class="form-control mb-4"
        placeholder="Search recipes..."
      />

      <ul class="nav nav-tabs mb-4">
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: activeTab === 'suggested' }"
            href="#"
            @click.prevent="activeTab = 'suggested'"
          >
            Suggested Recipes
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: activeTab === 'bookmarked' }"
            href="#"
            @click.prevent="activeTab = 'bookmarked'"
          >
            Bookmarked
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: activeTab === 'custom' }"
            href="#"
            @click.prevent="activeTab = 'custom'"
          >
            Custom Recipes
          </a>
        </li>
      </ul>

      <div v-if="activeTab === 'custom'" class="mb-4">
        <button class="btn btn-primary-gradient" @click="showAddModal = true">
          <i class="bi bi-plus-lg"></i> Add Custom Recipe
        </button>
      </div>

      <div v-if="displayedRecipes.length === 0" class="text-center py-5">
        <i class="bi bi-egg-fried fs-1 text-muted"></i>
        <p class="text-muted mt-3">No recipes found</p>
      </div>

      <div v-else class="row g-4">
        <div
          v-for="recipe in displayedRecipes"
          :key="recipe.id"
          class="col-12 col-md-6 col-lg-4"
        >
          <div class="card recipe-card h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <h5 class="card-title mb-0">{{ recipe.name }}</h5>
                <button
                  class="btn btn-link p-0 text-warning"
                  @click="handleToggleBookmark(recipe.id)"
                >
                  <i
                    class="bi fs-5"
                    :class="recipe.isBookmarked ? 'bi-bookmark-fill' : 'bi-bookmark'"
                  ></i>
                </button>
              </div>

              <div class="mb-3">
                <span class="badge bg-light text-dark me-2">
                  <i class="bi bi-clock"></i> {{ recipe.prepTime }}
                </span>
                <span class="badge bg-light text-dark">
                  <i class="bi bi-people"></i> {{ recipe.servings }} servings
                </span>
                <span v-if="recipe.matchPercentage" class="badge bg-success ms-2">
                  {{ recipe.matchPercentage }}% Match
                </span>
              </div>

              <div class="mb-3">
                <small class="text-muted fw-bold d-block mb-2">Ingredients:</small>
                <small class="text-muted">{{ recipe.ingredients }}</small>
              </div>

              <div v-if="recipe.instructions" class="mb-3">
                <small class="text-muted fw-bold d-block mb-2">Instructions:</small>
                <small class="text-muted" style="white-space: pre-line;">{{ recipe.instructions }}</small>
              </div>

              <button class="btn btn-outline-primary btn-sm w-100">
                View Recipe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AddRecipeModal v-if="showAddModal" @close="showAddModal = false" />
  </div>
</template>
