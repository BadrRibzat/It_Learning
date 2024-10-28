import { computed } from 'vue'
import { useStore } from 'vuex'

export function useProgress() {
  const store = useStore()

  const userProgress = computed(() => store.getters['lessons/userProgress'])
  const loading = computed(() => store.getters['lessons/loading'])
  const error = computed(() => store.getters['lessons/error'])

  const fetchUserProgress = async () => {
    try {
      await store.dispatch('lessons/fetchUserProgress')
    } catch (error) {
      console.error('Error fetching user progress:', error)
    }
  }

  const calculateLessonCompletion = (lessonId) => {
    if (!userProgress.value) return 0
    const lessonProgress = userProgress.value.find(p => p.lessonId === lessonId)
    return lessonProgress ? lessonProgress.completionPercentage : 0
  }

  const calculateLevelCompletion = (levelId) => {
    if (!userProgress.value) return 0
    const levelLessons = userProgress.value.filter(p => p.levelId === levelId)
    if (!levelLessons.length) return 0
    
    const totalCompletion = levelLessons.reduce((sum, lesson) => 
      sum + lesson.completionPercentage, 0)
    return totalCompletion / levelLessons.length
  }

  return {
    userProgress,
    loading,
    error,
    fetchUserProgress,
    calculateLessonCompletion,
    calculateLevelCompletion
  }
}
