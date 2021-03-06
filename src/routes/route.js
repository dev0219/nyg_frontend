import React from "react"
import PropTypes from "prop-types"
import { Route, Redirect } from "react-router-dom"
import { getAccessToken } from "helpers/auth_helper"

const AppRoute = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {
      if (isAuthProtected && !sessionStorage.getItem("accessToken")) {
        return (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }

      return (
        <Layout>
          <Component {...props} />
        </Layout>
      )
    }}
  />
)

AppRoute.propTypes = {
  isAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
}

export default AppRoute
