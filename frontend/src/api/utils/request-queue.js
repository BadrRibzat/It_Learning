class RequestQueue {
  constructor() {
    this.queue = []
    this.processing = false
  }

  add(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        request,
        resolve,
        reject
      })
      this.process()
    })
  }

  async process() {
    if (this.processing) return
    this.processing = true

    while (this.queue.length > 0) {
      const { request, resolve, reject } = this.queue.shift()
      try {
        const response = await request()
        resolve(response)
      } catch (error) {
        reject(error)
      }
    }

    this.processing = false
  }
}

export const requestQueue = new RequestQueue()

