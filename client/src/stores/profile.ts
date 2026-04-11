import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Profile {
  name: string
  ieltsBand: number
}

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<Profile>({
    name: 'Kavya',
    ieltsBand: 4
  })

  const updateProfile = (newProfile: Partial<Profile>) => {
    profile.value = { ...profile.value, ...newProfile }
  }

  return {
    profile,
    updateProfile
  }
})