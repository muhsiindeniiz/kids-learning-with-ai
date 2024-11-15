import { deleteCookie, getCookie, hasCookie, setCookie } from 'cookies-next'

export const $cookie = {
  get: name => {
    return getCookie(name)
  },

  has: name => {
    return hasCookie(name)
  },

  set: (name, value, options) => {
    return setCookie(name, value, options)
  },

  remove: (name, options) => {
    return deleteCookie(name, options)
  },
}
