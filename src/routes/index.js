import React from "react"
import { Redirect } from "react-router-dom"

// Authentication related pages
import Login from "../pages/Authentication/Login"
import Register from "../pages/Authentication/register"

// Dashboard
import Dashboard from "../pages/Dashboard/index"

import Machine from "../pages/Machine/index"
import MachineDetails from "pages/Machine/MachineDetails"
import NewOrder from "pages/Machine/NewOrder"

import MachineOrder from "../pages/MachineOrder/index"
import MachineOrderDetails from "../pages/MachineOrder/MachineOrderDetails"

import MachineType from "../pages/MachineStaticValues/MachineType"
import MachineStatus from "../pages/MachineStaticValues/MachineStatus"
import MachineBrand from "../pages/MachineStaticValues/MachineBrand"

import User from "../pages/User"

const authProtectedRoutes = [
  { path: "/dashboard", component: Dashboard },

  { path: "/machine", component: Machine },
  // { path: "/machine-details/:id", component: MachineDetails },
  { path: "/machine-details", component: MachineDetails },
  { path: "/new-order", component: NewOrder },

  { path: "/machine-order", component: MachineOrder },
  { path: "/machine-order-details", component: MachineOrderDetails },

  { path: "/machineType", component: MachineType },
  { path: "/machineStatus", component: MachineStatus },
  { path: "/machineBrand", component: MachineBrand },

  { path: "/user", component: User },

  // this route should be at the end of all other routes
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
]

const publicRoutes = [{ path: "/login", component: Login }]
const publicRegisterRoutes = [{ path: "/register", component: Register }]

export { authProtectedRoutes, publicRoutes ,publicRegisterRoutes}
