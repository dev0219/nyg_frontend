export const getAccessToken = () => {
  const token = sessionStorage.getItem("accessToken")
  if (token) {
    return token
  } else {
    return null
  }
}
export const setAccessTole = role => {
  sessionStorage.setItem("accessRole", role)
}
export const setAccessName = name => {
  sessionStorage.setItem("accessName", name)
}
export const setAccessToken = token => {
  sessionStorage.setItem("accessToken", token)
}

export const removeUserToken = () => {
  sessionStorage.removeItem("accessToken")
  sessionStorage.removeItem("accessRole")
}
