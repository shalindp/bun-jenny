import { ref } from 'vue'

const STORAGE_KEY = 'jenny_tts_settings'

const DEFAULT_SETTINGS = {
  voiceName: null as string | null,
  pitch: 1.0,
  rate: 0.9
}

const isSpeaking = ref(false)
const isSupported = ref(false)
const voices = ref<SpeechSynthesisVoice[]>([])
const currentVoice = ref<SpeechSynthesisVoice | null>(null)
const pitch = ref(1.0)
const rate = ref(0.9)
const settingsLoaded = ref(false)
const initialized = ref(false)
const voicesReady = ref(false)

let utterance: SpeechSynthesisUtterance | null = null
let onEndCallback: (() => void) | null = null

const loadSettings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const settings = JSON.parse(saved)
      pitch.value = settings.pitch ?? DEFAULT_SETTINGS.pitch
      rate.value = settings.rate ?? DEFAULT_SETTINGS.rate
    }
  } catch (e) {
    console.error('Failed to load TTS settings:', e)
  }
  settingsLoaded.value = true
}

const saveSettings = () => {
  try {
    const settings = {
      voiceName: currentVoice.value?.name || null,
      pitch: pitch.value,
      rate: rate.value
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (e) {
    console.error('Failed to save TTS settings:', e)
  }
}

const loadVoices = () => {
  const availableVoices = window.speechSynthesis.getVoices()
  voices.value = availableVoices
  
  if (availableVoices.length > 0) {
    voicesReady.value = true
    selectBestVoice()
  }
}

const selectBestVoice = () => {
  if (voices.value.length === 0) return
  
  const savedSettings = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  
  if (savedSettings.voiceName) {
    const savedVoice = voices.value.find(v => v.name === savedSettings.voiceName)
    if (savedVoice) {
      currentVoice.value = savedVoice
      return
    }
  }
  
  const avaMultilingual = voices.value.find(v => 
    v.name.toLowerCase().includes('microsoft ava') || 
    v.name.toLowerCase().includes('avamultilinguil')
  )
  
  if (avaMultilingual) {
    currentVoice.value = avaMultilingual
    saveSettings()
    return
  }

  const microsoftNatural = voices.value.find(v => 
    (v.name.includes('Microsoft') || v.voiceURI.includes('microsoft')) &&
    (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Aria') || v.name.includes('Jenny'))
  )
  
  if (microsoftNatural) {
    currentVoice.value = microsoftNatural
    saveSettings()
    return
  }

  const microsoft = voices.value.find(v => 
    (v.name.includes('Microsoft') || v.voiceURI.includes('microsoft')) &&
    v.lang.startsWith('en')
  )
  
  if (microsoft) {
    currentVoice.value = microsoft
    saveSettings()
    return
  }

  const femaleEnglish = voices.value.find(v => 
    v.lang.startsWith('en') && 
    (v.name.toLowerCase().includes('female') || 
     v.name.includes('Samantha') || 
     v.name.includes('Victoria') ||
     v.name.includes('Karen') ||
     v.name.includes('Tessa') ||
     v.name.includes('Susan'))
  )
  
  if (femaleEnglish) {
    currentVoice.value = femaleEnglish
    saveSettings()
    return
  }

  const english = voices.value.find(v => v.lang.startsWith('en'))
  currentVoice.value = english || voices.value[0]
  saveSettings()
}

const init = () => {
  if (initialized.value) return
  
  loadSettings()

  if ('speechSynthesis' in window) {
    isSupported.value = true
    
    loadVoices()
    
    if (voices.value.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        loadVoices()
      }
    }
  }
  
  initialized.value = true
}

const waitForVoices = () => {
  return new Promise<void>((resolve) => {
    if (voicesReady.value || voices.value.length > 0) {
      if (!currentVoice.value) {
        selectBestVoice()
      }
      resolve()
      return
    }
    
    const checkVoices = setInterval(() => {
      if (voices.value.length > 0 || voicesReady.value) {
        clearInterval(checkVoices)
        if (!currentVoice.value) {
          selectBestVoice()
        }
        resolve()
      }
    }, 100)
    
    setTimeout(() => {
      clearInterval(checkVoices)
      if (!currentVoice.value) {
        selectBestVoice()
      }
      resolve()
    }, 3000)
  })
}

export function useTTS() {
  init()

  const speak = async (text: string): Promise<void> => {
    if (!isSupported.value) {
      console.warn('Speech synthesis not supported')
      return Promise.resolve()
    }

    await waitForVoices()

    return new Promise((resolve, reject) => {
      window.speechSynthesis.cancel()

      utterance = new SpeechSynthesisUtterance(text)

      if (currentVoice.value) {
        utterance.voice = currentVoice.value
      }

      utterance.rate = rate.value
      utterance.pitch = pitch.value
      utterance.volume = 1.0

      utterance.onstart = () => {
        isSpeaking.value = true
      }

      utterance.onend = () => {
        isSpeaking.value = false
        if (onEndCallback) {
          onEndCallback()
          onEndCallback = null
        }
        resolve()
      }

      utterance.onerror = (event) => {
        isSpeaking.value = false
        if (event.error !== 'interrupted' && event.error !== 'canceled') {
          console.error('Speech error:', event.error)
          reject(event)
        } else {
          resolve()
        }
      }

      window.speechSynthesis.speak(utterance)
    })
  }

  const stop = () => {
    if (isSupported.value && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      isSpeaking.value = false
    }
  }

  const setVoice = (voice: SpeechSynthesisVoice) => {
    currentVoice.value = voice
    saveSettings()
  }

  const setPitch = (newPitch: number) => {
    pitch.value = Math.max(0.5, Math.min(2.0, newPitch))
    saveSettings()
  }

  const setRate = (newRate: number) => {
    rate.value = Math.max(0.5, Math.min(2.0, newRate))
    saveSettings()
  }

  const onEnd = (callback: () => void) => {
    onEndCallback = callback
  }

  return {
    isSpeaking,
    isSupported,
    voices,
    currentVoice,
    pitch,
    rate,
    speak,
    stop,
    setVoice,
    setPitch,
    setRate,
    onEnd
  }
}