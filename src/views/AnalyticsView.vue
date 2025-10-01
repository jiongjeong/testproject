<script setup lang="ts">
import { ref, computed } from 'vue'
import { Bar, Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  LineElement,
  PointElement
} from 'chart.js'
import { useUser } from '../composables/useUser'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  LineElement,
  PointElement
)

const { user } = useUser()

const timePeriod = ref('Last 30 Days')

const wasteByCategory = {
  labels: ['Fruits & Vegetables', 'Dairy', 'Meat', 'Bakery', 'Other'],
  datasets: [
    {
      data: [35, 25, 15, 20, 5],
      backgroundColor: [
        '#10b981',
        '#3b82f6',
        '#ef4444',
        '#f59e0b',
        '#6b7280'
      ]
    }
  ]
}

const savingsOverTime = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Savings ($)',
      data: [32, 45, 38, 42],
      backgroundColor: '#10b981'
    }
  ]
}

const usageVsWaste = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Items Used',
      data: [18, 22, 19, 24],
      backgroundColor: '#10b981'
    },
    {
      label: 'Items Wasted',
      data: [3, 2, 4, 1],
      backgroundColor: '#ef4444'
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: true
    }
  }
}

const totalSaved = computed(() => user.value.totalSaved.toFixed(2))
const wastePrevented = computed(() => user.value.wasteReductionPercentage)
</script>

<template>
  <div class="container-fluid p-4">
    <div class="mb-4">
      <h1 class="h2 mb-2">Food Waste Analytics</h1>
      <p class="text-muted">Track your waste reduction progress</p>
    </div>

    <div class="mb-4">
      <select v-model="timePeriod" class="form-select" style="max-width: 200px;">
        <option>Last 7 Days</option>
        <option>Last 30 Days</option>
        <option>Last 3 Months</option>
        <option>Last Year</option>
      </select>
    </div>

    <div class="row g-3 mb-4">
      <div class="col-6 col-lg-3">
        <div class="glass-card stat-card p-3">
          <small class="text-muted">Total Saved</small>
          <h3 class="h4 text-success mb-0">${{ totalSaved }}</h3>
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <div class="glass-card stat-card p-3">
          <small class="text-muted">Waste Prevented</small>
          <h3 class="h4 mb-0">
            {{ wastePrevented }}%
            <i class="bi bi-arrow-up text-success"></i>
          </h3>
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <div class="glass-card stat-card p-3">
          <small class="text-muted">Items Used</small>
          <h3 class="h4 mb-0">23</h3>
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <div class="glass-card stat-card p-3">
          <small class="text-muted">CO₂ Saved</small>
          <h3 class="h4 mb-0">45 kg</h3>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-4 d-none d-lg-block">
        <div class="glass-card p-4">
          <h3 class="h5 mb-4">Waste by Category</h3>
          <Pie :data="wasteByCategory" :options="chartOptions" />
        </div>
      </div>

      <div class="col-lg-8 col-12">
        <div class="glass-card p-4 mb-4">
          <h3 class="h5 mb-4">Savings Over Time</h3>
          <Bar :data="savingsOverTime" :options="chartOptions" />
        </div>
      </div>

      <div class="col-12">
        <div class="glass-card p-4">
          <h3 class="h5 mb-4">Usage vs Waste</h3>
          <Bar :data="usageVsWaste" :options="{ ...chartOptions, indexAxis: 'x' as const }" />
        </div>
      </div>
    </div>
  </div>
</template>
