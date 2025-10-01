<script setup lang="ts">
import { ref } from 'vue'
import { useFoodItems, type FoodItem } from '../../composables/useFoodItems'
import { useUser } from '../../composables/useUser'
import { useActivities } from '../../composables/useActivities'

const props = defineProps<{
  foodItem: FoodItem
}>()

const emit = defineEmits<{
  close: []
}>()

const { updateFoodItem, deleteFoodItem } = useFoodItems()
const { addPoints } = useUser()
const { addActivity } = useActivities()

const useType = ref<'all' | 'partial'>('all')
const partialQuantity = ref(props.foodItem.quantity)

const handleUse = () => {
  if (useType.value === 'all') {
    const points = Math.round(props.foodItem.price)
    addPoints(points)

    addActivity({
      actionType: 'used',
      value: props.foodItem.price,
      description: `Used ${props.foodItem.name} before expiration`
    })

    deleteFoodItem(props.foodItem.id)
  } else {
    if (partialQuantity.value >= props.foodItem.quantity) {
      alert('Partial quantity must be less than total quantity')
      return
    }

    const remainingQuantity = props.foodItem.quantity - partialQuantity.value
    const usedValue = (partialQuantity.value / props.foodItem.quantity) * props.foodItem.price
    const points = Math.round(usedValue)

    addPoints(points)

    addActivity({
      actionType: 'used',
      value: usedValue,
      description: `Used ${partialQuantity.value} ${props.foodItem.unit} of ${props.foodItem.name}`
    })

    updateFoodItem(props.foodItem.id, {
      quantity: remainingQuantity,
      price: props.foodItem.price - usedValue
    })
  }

  emit('close')
}
</script>

<template>
  <div class="modal fade show d-block" tabindex="-1" @click.self="emit('close')">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Use Food Item</h5>
          <button type="button" class="btn-close" @click="emit('close')"></button>
        </div>
        <div class="modal-body">
          <div class="mb-4">
            <h6>{{ foodItem.name }}</h6>
            <p class="text-muted mb-0">
              Total: {{ foodItem.quantity }} {{ foodItem.unit }}
            </p>
          </div>

          <div class="mb-3">
            <div class="form-check mb-2">
              <input
                v-model="useType"
                class="form-check-input"
                type="radio"
                value="all"
                id="useAll"
              />
              <label class="form-check-label" for="useAll">
                Use All
              </label>
            </div>
            <div class="form-check">
              <input
                v-model="useType"
                class="form-check-input"
                type="radio"
                value="partial"
                id="usePartial"
              />
              <label class="form-check-label" for="usePartial">
                Use Partial
              </label>
            </div>
          </div>

          <div v-if="useType === 'partial'" class="mb-3">
            <label class="form-label">Quantity to Use</label>
            <div class="input-group">
              <input
                v-model.number="partialQuantity"
                type="number"
                class="form-control"
                :max="foodItem.quantity"
                min="0.01"
                step="0.01"
              />
              <span class="input-group-text">{{ foodItem.unit }}</span>
            </div>
          </div>

          <button
            type="button"
            class="btn btn-primary-gradient w-100"
            @click="handleUse"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show"></div>
</template>
