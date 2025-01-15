export const toFormData = (obj) => {
  const formData = new FormData()
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined && obj[key] !== null) {
      if (obj[key] instanceof File) {
        formData.append(key, obj[key])
      } else if (Array.isArray(obj[key])) {
        obj[key].forEach((item, index) => {
          formData.append(`${key}[${index}]`, item)
        })
      } else if (typeof obj[key] === 'object') {
        formData.append(key, JSON.stringify(obj[key]))
      } else {
        formData.append(key, obj[key].toString())
      }
    }
  })
  return formData
}
