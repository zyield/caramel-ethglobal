export const save = (key, value) => localStorage.setItem(key, value)

export const retrieve = key => localStorage.getItem(key)

export default { save, retrieve }
