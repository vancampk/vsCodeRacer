export const VUE_BLOCKS = [
  `<template>

  <div class="user-profile">
    <img :src="user.avatar" :alt="user.name" />
    <h2>{{ user.name }}</h2>
    <p>{{ user.email }}</p>
    <button @click="toggleFollow" :disabled="loading">
      {{ user.isFollowing ? 'Unfollow' : 'Follow' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  userId: String
})

const user = ref(null)
const loading = ref(false)

async function loadUser(id) {
  loading.value = true
  try {
    const response = await fetch(\`/api/users/\${id}\`)
    user.value = await response.json()
  } finally {
    loading.value = false
  }
}
</script>`,

  `<template>

  <form @submit.prevent="handleSubmit" class="contact-form">
    <div class="form-group">
      <label for="name">Name:</label>
      <input
        id="name"
        v-model="form.name"
        type="text"
        :class="{ 'error': errors.name }"
        @blur="validateField('name')"
      />
      <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
    </div>

    <div class="form-group">
      <label for="email">Email:</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        :class="{ 'error': errors.email }"
        @blur="validateField('email')"
      />
      <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
    </div>

    <button type="submit" :disabled="!isFormValid || submitting">
      {{ submitting ? 'Sending...' : 'Send Message' }}
    </button>
  </form>
</template>`,

  `<script setup>

import { ref, reactive, computed, watch } from 'vue'

const form = reactive({
  name: '',
  email: '',
  message: ''
})

const errors = reactive({
  name: null,
  email: null,
  message: null
})

const submitting = ref(false)

const isFormValid = computed(() => {
  return form.name && form.email && form.message && 
         !errors.name && !errors.email && !errors.message
})

const validateField = (field) => {
  switch (field) {
    case 'name':
      errors.name = form.name.length < 2 ? 'Name must be at least 2 characters' : null
      break
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      errors.email = !emailRegex.test(form.email) ? 'Please enter a valid email' : null
      break
    case 'message':
      errors.message = form.message.length < 10 ? 'Message must be at least 10 characters' : null
      break
  }
}

const handleSubmit = async () => {
  Object.keys(form).forEach(validateField)
  
  if (!isFormValid.value) return
  
  submitting.value = true
  try {
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    
    Object.keys(form).forEach(key => form[key] = '')
    alert('Message sent successfully!')
  } catch (error) {
    alert('Failed to send message. Please try again.')
  } finally {
    submitting.value = false
  }
}
</script>`,

  `<template>

  <div class="todo-app">
    <h1>Todo List</h1>
    
    <div class="add-todo">
      <input
        v-model="newTodo"
        @keyup.enter="addTodo"
        placeholder="Add a new todo..."
        class="todo-input"
      />
      <button @click="addTodo" :disabled="!newTodo.trim()">Add</button>
    </div>

    <div class="filters">
      <button
        v-for="filter in filters"
        :key="filter.value"
        @click="currentFilter = filter.value"
        :class="{ active: currentFilter === filter.value }"
      >
        {{ filter.label }}
      </button>
    </div>

    <ul class="todo-list">
      <li
        v-for="todo in filteredTodos"
        :key="todo.id"
        :class="{ completed: todo.completed }"
        class="todo-item"
      >
        <input
          type="checkbox"
          v-model="todo.completed"
          @change="saveTodos"
        />
        <span
          v-if="!todo.editing"
          @dblclick="startEdit(todo)"
          class="todo-text"
        >
          {{ todo.text }}
        </span>
        <input
          v-else
          v-model="todo.text"
          @keyup.enter="finishEdit(todo)"
          @blur="finishEdit(todo)"
          class="edit-input"
          ref="editInput"
        />
        <button @click="removeTodo(todo.id)" class="delete-btn">×</button>
      </li>
    </ul>

    <div class="todo-stats">
      <span>{{ remainingCount }} items left</span>
      <button v-if="completedCount > 0" @click="clearCompleted">
        Clear completed
      </button>
    </div>
  </div>
</template>`,

  `<script setup>

import { ref, computed, onMounted, nextTick } from 'vue'

const todos = ref([])
const newTodo = ref('')
const currentFilter = ref('all')
const editInput = ref(null)

const filters = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' }
]

const filteredTodos = computed(() => {
  switch (currentFilter.value) {
    case 'active':
      return todos.value.filter(todo => !todo.completed)
    case 'completed':
      return todos.value.filter(todo => todo.completed)
    default:
      return todos.value
  }
})

const remainingCount = computed(() => {
  return todos.value.filter(todo => !todo.completed).length
})

const completedCount = computed(() => {
  return todos.value.filter(todo => todo.completed).length
})

const addTodo = () => {
  if (!newTodo.value.trim()) return
  
  todos.value.push({
    id: Date.now(),
    text: newTodo.value.trim(),
    completed: false,
    editing: false
  })
  
  newTodo.value = ''
  saveTodos()
}

const removeTodo = (id) => {
  const index = todos.value.findIndex(todo => todo.id === id)
  if (index > -1) {
    todos.value.splice(index, 1)
    saveTodos()
  }
}

const startEdit = (todo) => {
  todo.editing = true
  nextTick(() => {
    editInput.value?.focus()
  })
}

const finishEdit = (todo) => {
  if (!todo.text.trim()) {
    removeTodo(todo.id)
  } else {
    todo.editing = false
    saveTodos()
  }
}

const clearCompleted = () => {
  todos.value = todos.value.filter(todo => !todo.completed)
  saveTodos()
}

const saveTodos = () => {
  localStorage.setItem('vue-todos', JSON.stringify(todos.value))
}

const loadTodos = () => {
  const saved = localStorage.getItem('vue-todos')
  if (saved) {
    todos.value = JSON.parse(saved)
  }
}

onMounted(() => {
  loadTodos()
})
</script>`,

  `<template>

  <div class="data-table">
    <div class="table-controls">
      <input
        v-model="searchQuery"
        placeholder="Search..."
        class="search-input"
      />
      <select v-model="sortBy" class="sort-select">
        <option value="">Sort by...</option>
        <option v-for="column in columns" :key="column.key" :value="column.key">
          {{ column.label }}
        </option>
      </select>
      <button @click="sortDirection = sortDirection === 'asc' ? 'desc' : 'asc'">
        {{ sortDirection === 'asc' ? '↑' : '↓' }}
      </button>
    </div>

    <table>
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            @click="setSortColumn(column.key)"
            :class="{ sortable: column.sortable !== false, active: sortBy === column.key }"
          >
            {{ column.label }}
            <span v-if="sortBy === column.key" class="sort-indicator">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedData" :key="item.id || item.index">
          <td v-for="column in columns" :key="column.key">
            <component
              v-if="column.component"
              :is="column.component"
              :value="item[column.key]"
              :row="item"
            />
            <span v-else>{{ item[column.key] }}</span>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button
        @click="currentPage--"
        :disabled="currentPage === 1"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        @click="currentPage++"
        :disabled="currentPage === totalPages"
      >
        Next
      </button>
    </div>
  </div>
</template>`,

  `<script setup>

import { ref, computed, watch } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    required: true
  },
  pageSize: {
    type: Number,
    default: 10
  }
})

const searchQuery = ref('')
const sortBy = ref('')
const sortDirection = ref('asc')
const currentPage = ref(1)

const filteredData = computed(() => {
  let filtered = props.data

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(query)
      )
    )
  }

  if (sortBy.value) {
    filtered = [...filtered].sort((a, b) => {
      const aVal = a[sortBy.value]
      const bVal = b[sortBy.value]
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection.value === 'asc' ? aVal - bVal : bVal - aVal
      }
      
      const aStr = String(aVal).toLowerCase()
      const bStr = String(bVal).toLowerCase()
      
      if (sortDirection.value === 'asc') {
        return aStr.localeCompare(bStr)
      } else {
        return bStr.localeCompare(aStr)
      }
    })
  }

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / props.pageSize)
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  const end = start + props.pageSize
  return filteredData.value.slice(start, end)
})

const setSortColumn = (column) => {
  if (sortBy.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortDirection.value = 'asc'
  }
}

watch([searchQuery, sortBy, sortDirection], () => {
  currentPage.value = 1
})
</script>`,

  `<template>

  <div class="image-gallery">
    <div class="gallery-controls">
      <button
        v-for="category in categories"
        :key="category"
        @click="selectedCategory = category"
        :class="{ active: selectedCategory === category }"
        class="category-btn"
      >
        {{ category }}
      </button>
    </div>

    <div class="image-grid" v-if="!selectedImage">
      <div
        v-for="(image, index) in filteredImages"
        :key="image.id"
        @click="openImage(image)"
        class="image-card"
        :style="{ '--delay': index * 0.1 + 's' }"
      >
        <img
          :src="image.thumbnail"
          :alt="image.title"
          @load="onImageLoad"
          class="gallery-image"
        />
        <div class="image-overlay">
          <h3>{{ image.title }}</h3>
          <p>{{ image.category }}</p>
        </div>
      </div>
    </div>

    <div v-if="selectedImage" class="lightbox" @click="closeImage">
      <div class="lightbox-content" @click.stop>
        <button @click="closeImage" class="close-btn">×</button>
        <img
          :src="selectedImage.fullSize"
          :alt="selectedImage.title"
          class="lightbox-image"
        />
        <div class="lightbox-info">
          <h2>{{ selectedImage.title }}</h2>
          <p>{{ selectedImage.description }}</p>
          <span class="category-tag">{{ selectedImage.category }}</span>
        </div>
        <div class="lightbox-navigation">
          <button @click="previousImage" :disabled="!canGoPrevious">‹</button>
          <button @click="nextImage" :disabled="!canGoNext">›</button>
        </div>
      </div>
    </div>
  </div>
</template>`,

  `<script setup>

import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    required: true
  }
})

const selectedCategory = ref('All')
const selectedImage = ref(null)
const loadedImages = ref(new Set())

const categories = computed(() => {
  const cats = ['All']
  props.images.forEach(image => {
    if (!cats.includes(image.category)) {
      cats.push(image.category)
    }
  })
  return cats
})

const filteredImages = computed(() => {
  if (selectedCategory.value === 'All') {
    return props.images
  }
  return props.images.filter(image => image.category === selectedCategory.value)
})

const currentImageIndex = computed(() => {
  if (!selectedImage.value) return -1
  return filteredImages.value.findIndex(img => img.id === selectedImage.value.id)
})

const canGoPrevious = computed(() => {
  return currentImageIndex.value > 0
})

const canGoNext = computed(() => {
  return currentImageIndex.value < filteredImages.value.length - 1
})

const openImage = (image) => {
  selectedImage.value = image
  document.body.style.overflow = 'hidden'
}

const closeImage = () => {
  selectedImage.value = null
  document.body.style.overflow = 'auto'
}

const previousImage = () => {
  if (canGoPrevious.value) {
    selectedImage.value = filteredImages.value[currentImageIndex.value - 1]
  }
}

const nextImage = () => {
  if (canGoNext.value) {
    selectedImage.value = filteredImages.value[currentImageIndex.value + 1]
  }
}

const onImageLoad = (event) => {
  loadedImages.value.add(event.target.src)
}

const handleKeydown = (event) => {
  if (!selectedImage.value) return
  
  switch (event.key) {
    case 'Escape':
      closeImage()
      break
    case 'ArrowLeft':
      previousImage()
      break
    case 'ArrowRight':
      nextImage()
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'auto'
})
</script>`,

  `<template>

  <div class="shopping-cart">
    <div class="cart-header">
      <h2>Shopping Cart ({{ totalItems }} items)</h2>
      <button v-if="items.length" @click="clearCart" class="clear-btn">
        Clear Cart
      </button>
    </div>

    <div v-if="items.length === 0" class="empty-cart">
      <p>Your cart is empty</p>
      <button @click="$emit('continueShopping')" class="continue-btn">
        Continue Shopping
      </button>
    </div>

    <div v-else class="cart-content">
      <div class="cart-items">
        <div
          v-for="item in items"
          :key="item.id"
          class="cart-item"
        >
          <img :src="item.image" :alt="item.name" class="item-image" />
          
          <div class="item-details">
            <h3>{{ item.name }}</h3>
            <p class="item-price">\${{ item.price.toFixed(2) }}</p>
            <p v-if="item.variant" class="item-variant">{{ item.variant }}</p>
          </div>

          <div class="quantity-controls">
            <button
              @click="updateQuantity(item.id, item.quantity - 1)"
              :disabled="item.quantity <= 1"
              class="qty-btn"
            >
              -
            </button>
            <span class="quantity">{{ item.quantity }}</span>
            <button
              @click="updateQuantity(item.id, item.quantity + 1)"
              :disabled="item.quantity >= item.maxQuantity"
              class="qty-btn"
            >
              +
            </button>
          </div>

          <div class="item-total">
            \${{ (item.price * item.quantity).toFixed(2) }}
          </div>

          <button @click="removeItem(item.id)" class="remove-btn">
            Remove
          </button>
        </div>
      </div>

      <div class="cart-summary">
        <div class="summary-line">
          <span>Subtotal:</span>
          <span>\${{ subtotal.toFixed(2) }}</span>
        </div>
        <div class="summary-line">
          <span>Tax ({{ taxRate * 100 }}%):</span>
          <span>\${{ tax.toFixed(2) }}</span>
        </div>
        <div class="summary-line">
          <span>Shipping:</span>
          <span>{{ shipping === 0 ? 'Free' : '$' + shipping.toFixed(2) }}</span>
        </div>
        <div class="summary-line total">
          <span>Total:</span>
          <span>\${{ total.toFixed(2) }}</span>
        </div>

        <button @click="checkout" :disabled="isCheckingOut" class="checkout-btn">
          {{ isCheckingOut ? 'Processing...' : 'Proceed to Checkout' }}
        </button>
      </div>
    </div>
  </div>
</template>`,

  `<script setup>

import { ref, computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  taxRate: {
    type: Number,
    default: 0.08
  },
  freeShippingThreshold: {
    type: Number,
    default: 50
  }
})

const emit = defineEmits(['updateItem', 'removeItem', 'clearCart', 'checkout', 'continueShopping'])

const isCheckingOut = ref(false)

const totalItems = computed(() => {
  return props.items.reduce((sum, item) => sum + item.quantity, 0)
})

const subtotal = computed(() => {
  return props.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const shipping = computed(() => {
  return subtotal.value >= props.freeShippingThreshold ? 0 : 9.99
})

const tax = computed(() => {
  return subtotal.value * props.taxRate
})

const total = computed(() => {
  return subtotal.value + tax.value + shipping.value
})

const updateQuantity = (itemId, newQuantity) => {
  if (newQuantity < 1) return
  
  const item = props.items.find(item => item.id === itemId)
  if (item && newQuantity <= item.maxQuantity) {
    emit('updateItem', {
      id: itemId,
      quantity: newQuantity
    })
  }
}

const removeItem = (itemId) => {
  emit('removeItem', itemId)
}

const clearCart = () => {
  if (confirm('Are you sure you want to clear your cart?')) {
    emit('clearCart')
  }
}

const checkout = async () => {
  isCheckingOut.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    emit('checkout', {
      items: props.items,
      total: total.value,
      summary: {
        subtotal: subtotal.value,
        tax: tax.value,
        shipping: shipping.value,
        total: total.value
      }
    })
  } catch (error) {
    console.error('Checkout failed:', error)
    alert('Checkout failed. Please try again.')
  } finally {
    isCheckingOut.value = false
  }
}
</script>`,

  `<template>

  <div class="notification-system">
    <transition-group name="notification" tag="div" class="notifications">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['notification', notification.type]"
        @click="removeNotification(notification.id)"
      >
        <div class="notification-icon">
          <span v-if="notification.type === 'success'">✓</span>
          <span v-else-if="notification.type === 'error'">✕</span>
          <span v-else-if="notification.type === 'warning'">⚠</span>
          <span v-else>ℹ</span>
        </div>
        
        <div class="notification-content">
          <h4 v-if="notification.title">{{ notification.title }}</h4>
          <p>{{ notification.message }}</p>
        </div>

        <div class="notification-actions">
          <button
            v-for="action in notification.actions"
            :key="action.label"
            @click.stop="handleAction(action, notification)"
            class="action-btn"
          >
            {{ action.label }}
          </button>
        </div>

        <button
          @click.stop="removeNotification(notification.id)"
          class="close-btn"
        >
          ×
        </button>

        <div
          v-if="notification.autoClose"
          class="progress-bar"
          :style="{ animationDuration: notification.duration + 'ms' }"
        ></div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const notifications = ref([])
const notificationId = ref(0)

const addNotification = (notification) => {
  const id = ++notificationId.value
  
  const newNotification = {
    id,
    type: notification.type || 'info',
    title: notification.title,
    message: notification.message,
    actions: notification.actions || [],
    autoClose: notification.autoClose !== false,
    duration: notification.duration || 5000
  }
  
  notifications.value.push(newNotification)
  
  if (newNotification.autoClose) {
    setTimeout(() => {
      removeNotification(id)
    }, newNotification.duration)
  }
  
  return id
}

const removeNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

const handleAction = (action, notification) => {
  if (typeof action.handler === 'function') {
    action.handler(notification)
  }
  
  if (action.closeOnClick !== false) {
    removeNotification(notification.id)
  }
}

const clearAll = () => {
  notifications.value = []
}

const showSuccess = (message, title) => {
  return addNotification({ type: 'success', message, title })
}

const showError = (message, title) => {
  return addNotification({ 
    type: 'error', 
    message, 
    title,
    autoClose: false 
  })
}

const showWarning = (message, title) => {
  return addNotification({ type: 'warning', message, title })
}

const showInfo = (message, title) => {
  return addNotification({ type: 'info', message, title })
}

onMounted(() => {
  window.notify = {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
    remove: removeNotification,
    clear: clearAll
  }
})

onUnmounted(() => {
  if (window.notify) {
    delete window.notify
  }
})

defineExpose({
  addNotification,
  removeNotification,
  clearAll,
  showSuccess,
  showError,
  showWarning,
  showInfo
})
</script>`
];
