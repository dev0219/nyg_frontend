import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

// Layout Related Components
import Header from "./Header"
import Sidebar from "./Sidebar"
import Footer from "./Footer"
// import RightSidebar from "../CommonForBoth/RightSidebar"

function changeBodyAttribute(attribute, value) {
  if (document.body) document.body.setAttribute(attribute, value)
  return true
}

function manageBodyClass(cssClass, action = "toggle") {
  switch (action) {
    case "add":
      if (document.body) document.body.classList.add(cssClass)
      break
    case "remove":
      if (document.body) document.body.classList.remove(cssClass)
      break
    default:
      if (document.body) document.body.classList.toggle(cssClass)
      break
  }

  return true
}

class Layout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
      layoutType: "vertical",
      layoutWidth: "fluid",
      leftSideBarTheme: "dark",
      leftSideBarThemeImage: "none",
      leftSideBarType: "default",
      topbarTheme: "light",
      isPreloader: false,
      isMobile: false,
    }
    this.toggleMenuCallback = this.toggleMenuCallback.bind(this)
  }

  capitalizeFirstLetter = string => {
    return string.charAt(1).toUpperCase() + string.slice(2)
  }

  componentDidMount() {
    if (this.state.isPreloader === true) {
      document.getElementById("preloader").style.display = "block"
      document.getElementById("status").style.display = "block"

      setTimeout(function () {
        document.getElementById("preloader").style.display = "none"
        document.getElementById("status").style.display = "none"
      }, 2500)
    } else {
      document.getElementById("preloader").style.display = "none"
      document.getElementById("status").style.display = "none"
    }

    // Scroll Top to 0
    window.scrollTo(0, 0)
    // let currentage = this.capitalizeFirstLetter(this.props.location.pathname)

    // document.title =
    //   currentage + " | Skote - React Admin & Dashboard Template"
    if (this.state.leftSideBarTheme) {
      changeBodyAttribute("data-sidebar", this.state.leftSideBarTheme)
    }

    if (this.state.leftSideBarThemeImage) {
      changeBodyAttribute("data-sidebar-image", this.state.leftSideBarTheme)
    }

    // if (this.state.layoutWidth) {
    //   changeBodyAttribute("", this.state.layoutWidth);
    // }

    // if (this.state.leftSideBarType) {
    //   changeBodyAttribute("", this.state.leftSideBarType);
    // }

    if (this.state.topbarTheme) {
      changeBodyAttribute("data-topbar", this.state.topbarTheme)
    }
  }
  toggleMenuCallback = () => {
    var body = document.body
    body.classList.toggle("vertical-collpsed")
    body.classList.toggle("sidebar-enable")
  }

  render() {
    return (
      <React.Fragment>
        <div id="preloader">
          <div id="status">
            <div className="spinner-chase">
              <div className="chase-dot"></div>
              <div className="chase-dot"></div>
              <div className="chase-dot"></div>
              <div className="chase-dot"></div>
              <div className="chase-dot"></div>
              <div className="chase-dot"></div>
            </div>
          </div>
        </div>

        <div id="layout-wrapper">
          <Header toggleMenuCallback={this.toggleMenuCallback} />
          <Sidebar
            theme={this.state.leftSideBarTheme}
            type={this.state.leftSideBarType}
            isMobile={this.state.isMobile}
          />
          <div className="main-content">{this.props.children}</div>
          <Footer />
        </div>
      </React.Fragment>
    )
  }
}

export default withRouter(Layout)
