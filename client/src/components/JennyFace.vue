<template>
  <div 
    class="relative inline-flex items-center justify-center cursor-pointer jenny-face-container"
    :style="{ width: size + 'px', height: size + 'px' }"
  >
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
      class="jenny-face transition-transform duration-300"
      :class="{ 'scale-105': isAnimating }"
    >
      <!-- Body -->
      <rect
        x="10"
        y="20"
        :width="size - 20"
        :height="size - 30"
        rx="40"
        fill="#FF69B4"
        class="jenny-body transition-all duration-300"
      />
      
      <!-- Highlight on body -->
      <ellipse
        :cx="size * 0.3"
        :cy="size * 0.35"
        :rx="size * 0.12"
        :ry="size * 0.08"
        fill="#FF85C1"
        opacity="0.6"
      />
      
      <!-- Eyes -->
      <g class="eyes" :transform="`translate(${eyeOffset.x}, ${eyeOffset.y})`">
        <!-- Left Eye White -->
        <ellipse
          :cx="size * 0.35"
          :cy="size * 0.4"
          :rx="size * 0.12"
          :ry="size * (state === 'listening' ? 0.16 : 0.14)"
          fill="white"
          class="eye-left transition-all duration-200"
        />
        
        <!-- Right Eye White -->
        <ellipse
          :cx="size * 0.65"
          :cy="size * 0.4"
          :rx="size * 0.12"
          :ry="size * (state === 'listening' ? 0.16 : 0.14)"
          fill="white"
          class="eye-right transition-all duration-200"
        />
        
        <!-- Left Pupil -->
        <circle
          :cx="size * 0.35 + pupilOffset.left.x"
          :cy="size * 0.42 + pupilOffset.left.y"
          :r="size * 0.06"
          fill="#1A1A1A"
          class="pupil transition-all duration-100"
          :class="{ 'scale-110': state === 'happy' }"
        />
        
        <!-- Right Pupil -->
        <circle
          :cx="size * 0.65 + pupilOffset.right.x"
          :cy="size * 0.42 + pupilOffset.right.y"
          :r="size * 0.06"
          fill="#1A1A1A"
          class="pupil transition-all duration-100"
          :class="{ 'scale-110': state === 'happy' }"
        />
        
        <!-- Eye shines -->
        <circle
          :cx="size * 0.33 + pupilOffset.left.x * 0.3"
          :cy="size * 0.38 + pupilOffset.left.y * 0.3"
          :r="size * 0.02"
          fill="white"
        />
        <circle
          :cx="size * 0.63 + pupilOffset.right.x * 0.3"
          :cy="size * 0.38 + pupilOffset.right.y * 0.3"
          :r="size * 0.02"
          fill="white"
        />
      </g>
      
      <!-- Blush cheeks -->
      <ellipse
        :cx="size * 0.22"
        :cy="size * 0.58"
        :rx="size * 0.08"
        :ry="size * 0.05"
        fill="#FFB6C1"
        opacity="0.7"
      />
      <ellipse
        :cx="size * 0.78"
        :cy="size * 0.58"
        :rx="size * 0.08"
        :ry="size * 0.05"
        fill="#FFB6C1"
        opacity="0.7"
      />
      
      <!-- Mouth -->
      <path
        :d="mouthPath"
        fill="none"
        stroke="#1A1A1A"
        :stroke-width="size * 0.03"
        stroke-linecap="round"
        class="mouth transition-all duration-200"
      />
      
      <!-- Left Ear -->
      <circle
        :cx="size * 0.12"
        :cy="size * 0.45"
        :r="size * 0.06"
        fill="#FF69B4"
        class="ear-left transition-transform duration-300"
        :class="{ '-translate-y-1': state === 'listening' }"
      />
      
      <!-- Right Ear -->
      <circle
        :cx="size * 0.88"
        :cy="size * 0.45"
        :r="size * 0.06"
        fill="#FF69B4"
        class="ear-right transition-transform duration-300"
        :class="{ '-translate-y-1': state === 'listening' }"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  state: 'idle' | 'listening' | 'speaking' | 'happy' | 'sad' | 'thinking'
  size: number
}>()

const faceSize = computed(() => props.size || 120)

const eyeOffset = reactive({ x: 0, y: 0 })
const pupilOffset = reactive({
  left: { x: 0, y: 0 },
  right: { x: 0, y: 0 }
})

const maxPupilOffset = 4

const handleMouseMove = (event: MouseEvent) => {
  const faceEl = document.querySelector('.jenny-face-container')
  if (!faceEl) return
  
  const rect = faceEl.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  
  const mouseX = event.clientX - centerX
  const mouseY = event.clientY - centerY
  
  const maxOffset = faceSize.value || 120
  
  const offsetX = (mouseX / (window.innerWidth / 2)) * maxOffset * 0.08
  const offsetY = (mouseY / (window.innerHeight / 2)) * maxOffset * 0.08
  
  const clampedX = Math.max(-maxOffset * 0.08, Math.min(maxOffset * 0.08, offsetX))
  const clampedY = Math.max(-maxOffset * 0.08, Math.min(maxOffset * 0.08, offsetY))
  
  eyeOffset.x = clampedX * 0.2
  eyeOffset.y = clampedY * 0.2
  
  const pupilX = (mouseX / (window.innerWidth / 2)) * maxPupilOffset
  const pupilY = (mouseY / (window.innerHeight / 2)) * maxPupilOffset
  
  pupilOffset.left.x = Math.max(-maxPupilOffset, Math.min(maxPupilOffset, pupilX))
  pupilOffset.left.y = Math.max(-maxPupilOffset, Math.min(maxPupilOffset, pupilY))
  pupilOffset.right.x = Math.max(-maxPupilOffset, Math.min(maxPupilOffset, pupilX))
  pupilOffset.right.y = Math.max(-maxPupilOffset, Math.min(maxPupilOffset, pupilY))
}

const resetEyePosition = () => {
  eyeOffset.x = 0
  eyeOffset.y = 0
  pupilOffset.left.x = 0
  pupilOffset.left.y = 0
  pupilOffset.right.x = 0
  pupilOffset.right.y = 0
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  resetEyePosition()
})

const isAnimating = computed(() => 
  ['speaking', 'happy'].includes(props.state)
)

const mouthPath = computed(() => {
  const cx = (faceSize.value || 120) / 2
  const cy = (faceSize.value || 120) * 0.7
  
  switch (props.state) {
    case 'happy':
      return `M ${cx - 20} ${cy} Q ${cx} ${cy + 15} ${cx + 20} ${cy}`
    case 'sad':
      return `M ${cx - 20} ${cy + 5} Q ${cx} ${cy - 10} ${cx + 20} ${cy + 5}`
    case 'speaking':
      return `M ${cx - 15} ${cy} A 15 10 0 0 0 ${cx + 15} ${cy} A 15 10 0 0 0 ${cx - 15} ${cy}`
    case 'listening':
      return `M ${cx - 8} ${cy} A 8 8 0 0 0 ${cx + 8} ${cy} A 8 8 0 0 0 ${cx - 8} ${cy}`
    case 'thinking':
      return `M ${cx - 12} ${cy} Q ${cx} ${cy + 3} ${cx + 12} ${cy}`
    case 'idle':
    default:
      return `M ${cx - 18} ${cy} Q ${cx} ${cy + 8} ${cx + 18} ${cy}`
  }
})
</script>

<style scoped>
.jenny-face {
  filter: drop-shadow(0 4px 12px rgba(255, 105, 180, 0.4));
}

.jenny-body {
  transform-origin: center;
}

.state-idle .jenny-body,
.idle .jenny-body {
  animation: breathe 4s ease-in-out infinite;
}

.state-idle .pupil,
.idle .pupil {
  animation: blink 4s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

@keyframes blink {
  0%, 45%, 55%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.1); }
}

.state-speaking .mouth,
.speaking .mouth {
  animation: speak 0.3s ease-in-out infinite;
}

@keyframes speak {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.4); }
}

.state-listening .eyes,
.listening .eyes {
  animation: lookAround 2s ease-in-out infinite;
}

@keyframes lookAround {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

.state-happy .jenny-body,
.happy .jenny-body {
  animation: bounce 0.5s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-4px) scale(1.03); }
}

.state-sad .ear-left,
.sad .ear-left {
  transform: translateY(2px) rotate(-15deg);
}

.state-sad .ear-right,
.sad .ear-right {
  transform: translateY(2px) rotate(15deg);
}

.state-sad .jenny-body,
.sad .jenny-body {
  transform: scale(0.98);
}
</style>