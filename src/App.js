import React, { Component } from "react"
import { BrowserRouter as Router, Switch } from "react-router-dom"

// Import Routes
import { authProtectedRoutes, publicRoutes ,publicRegisterRoutes} from "./routes/"
import AppRoute from "./routes/route"

// layouts
import VerticalLayout from "./components/VerticalLayout/"
import NonAuthLayout from "./components/NonAuthLayout"

// Import scss
import "./assets/scss/theme.scss"

// Import fackbackend Configuration file
// import fakeBackend from "./helpers/AuthType/fakeBackend"

// Activating fake backend
// fakeBackend()

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.getLayout = this.getLayout.bind(this)
  }

  /**
   * Returns the layout
   */
  getLayout = () => {
    let layoutCls = VerticalLayout
    return layoutCls
  }

  render() {
    const Layout = this.getLayout()

    return (
      <React.Fragment>
        <Router>
          <Switch>
            {publicRoutes.map((route, idx) => (
              <AppRoute
                path={route.path}
                layout={NonAuthLayout}
                component={route.component}
                key={idx}
                isAuthProtected={false}
              />
            ))}
            {publicRegisterRoutes.map((route, idx) => (
              <AppRoute
                path={route.path}
                layout={NonAuthLayout}
                component={route.component}
                key={idx}
                isAuthProtected={false}
              />
            ))}

            {authProtectedRoutes.map((route, idx) => (
              <AppRoute
                path={route.path}
                layout={Layout}
                component={route.component}
                key={idx}
                isAuthProtected={true}
                exact
              />
            ))}
          </Switch>
        </Router>
      </React.Fragment>
    )
  }
}

// App.propTypes = {
//   layout: PropTypes.object,
// }

export default App
