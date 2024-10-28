import { ref } from 'vue'

export function useNotification() {
  const notifications = ref([])

  const show = (message, type = 'info', timeout = 3000) => {
    const id = Date.now()
    notifications.value.push({ id, message, type })

    if (timeout) {
      setTimeout(() => {
        remove(id)
      }, timeout)
    }
  }

  const remove = (id) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  const clear = () => {
    notifications.value = []
  }

  return {
    notifications,
    show,
    remove,
    clear
  }
}
