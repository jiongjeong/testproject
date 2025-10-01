<script setup lang="ts">
import { ref, nextTick } from 'vue'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

const messages = ref<Message[]>([
  {
    id: '1',
    text: 'Hello! I\'m your FoodSaver AI assistant. How can I help you reduce food waste today?',
    sender: 'ai',
    timestamp: new Date()
  }
])

const messageInput = ref('')
const chatContainer = ref<HTMLElement | null>(null)

const quickQuestions = [
  'How do I store bananas?',
  'Recipe ideas with chicken?',
  'Best way to freeze bread?',
  'How to reduce food waste?',
  'Tips for meal planning'
]

const aiResponses: Record<string, string> = {
  'banana': 'Bananas should be stored at room temperature until ripe. Once ripe, you can refrigerate them to extend their life. The peel may darken, but the fruit inside stays fresh for several more days.',
  'chicken': 'Great! Here are some chicken recipe ideas: Chicken stir-fry, grilled chicken salad, chicken soup, baked chicken with vegetables, or chicken curry. What ingredients do you have available?',
  'bread': 'To freeze bread properly: 1) Slice it first if not pre-sliced, 2) Wrap tightly in plastic wrap or aluminum foil, 3) Place in a freezer bag, 4) Use within 3 months. Thaw at room temperature or toast directly from frozen.',
  'waste': 'To reduce food waste: 1) Plan your meals weekly, 2) Store food properly, 3) Use the FIFO method (First In, First Out), 4) Freeze items before they expire, 5) Get creative with leftovers, 6) Share excess food with neighbors.',
  'meal': 'Meal planning tips: 1) Check your inventory before shopping, 2) Plan meals around items that expire soon, 3) Prep ingredients in advance, 4) Cook in batches, 5) Use a meal planning app or calendar, 6) Keep a running grocery list.'
}

const sendMessage = () => {
  if (!messageInput.value.trim()) return

  const userMessage: Message = {
    id: Date.now().toString(),
    text: messageInput.value,
    sender: 'user',
    timestamp: new Date()
  }

  messages.value.push(userMessage)

  const input = messageInput.value.toLowerCase()
  let response = 'I can help you with questions about food storage, recipe suggestions, and waste reduction tips. What would you like to know?'

  for (const [key, value] of Object.entries(aiResponses)) {
    if (input.includes(key)) {
      response = value
      break
    }
  }

  setTimeout(() => {
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response,
      sender: 'ai',
      timestamp: new Date()
    }
    messages.value.push(aiMessage)
    scrollToBottom()
  }, 500)

  messageInput.value = ''
  scrollToBottom()
}

const handleQuickQuestion = (question: string) => {
  messageInput.value = question
  sendMessage()
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}
</script>

<template>
  <div class="container-fluid p-4 d-flex flex-column" style="height: calc(100vh - 80px);">
    <div class="mb-4">
      <div class="d-flex align-items-center gap-2 mb-2">
        <i class="bi bi-robot fs-3"></i>
        <h1 class="h2 mb-0">FoodSaver AI Assistant</h1>
      </div>
      <p class="text-muted">Ask me anything about food storage, recipes, or waste reduction</p>
    </div>

    <div class="mb-3">
      <div class="d-flex gap-2 flex-wrap">
        <button
          v-for="question in quickQuestions"
          :key="question"
          class="btn btn-sm btn-outline-secondary"
          @click="handleQuickQuestion(question)"
        >
          {{ question }}
        </button>
      </div>
    </div>

    <div
      ref="chatContainer"
      class="glass-card flex-1 p-4 mb-3 overflow-auto"
      style="max-height: calc(100vh - 350px);"
    >
      <div
        v-for="message in messages"
        :key="message.id"
        class="d-flex"
        :class="message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'"
      >
        <div
          class="chat-message"
          :class="message.sender === 'user' ? 'chat-message-user' : 'chat-message-ai'"
        >
          <div v-if="message.sender === 'ai'" class="d-flex align-items-start gap-2">
            <i class="bi bi-robot"></i>
            <div>{{ message.text }}</div>
          </div>
          <div v-else>{{ message.text }}</div>
        </div>
      </div>
    </div>

    <div class="glass-card p-3">
      <form @submit.prevent="sendMessage" class="d-flex gap-2">
        <input
          v-model="messageInput"
          type="text"
          class="form-control"
          placeholder="Type your message..."
        />
        <button type="submit" class="btn btn-primary-gradient">
          <i class="bi bi-send"></i> Send
        </button>
      </form>
    </div>
  </div>
</template>
