// const baseURL = process.env.BASE_URL || `http://34.92.75.78/api_v1`
// const baseURL = "http://34.87.62.180/api_v1"
// const baseURL = "http://localhost:8000/api_v1"
const baseURL = "https://nyg.krpthailand.com/api_v1"

// get accesstoken
export const loginToken = `${baseURL}/login`

// get register 
export const register = `${baseURL}/register`

//Machines
export const machineURL = `${baseURL}/machine`

// Machine Order
export const machineOrderURL = `${baseURL}/machine-order`

// Staff / User
export const staffURL = `${baseURL}/user`

// Dashboard
export const dashboardURL = `${baseURL}/dashboard`

// Machine-Type
export const machineTypeURL = `${baseURL}/machineType`

// Machine-Status
export const machineStatusURL = `${baseURL}/machineStatus`

// Machine-Brand
export const machineBrandURL = `${baseURL}/machineBrand`
