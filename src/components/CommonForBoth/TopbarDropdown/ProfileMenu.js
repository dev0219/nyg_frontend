import React, { Component } from "react"
import PropTypes from "prop-types"
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap"
import { withRouter, Link } from "react-router-dom"
import {removeUserToken} from "../../../helpers/auth_helper"
//i18n
import { withTranslation } from "react-i18next"

// users
import user1 from "../../../assets/images/users/avatar-1.jpg"

class ProfileMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menu: false,
      name: "Admin",
      username:''
    }
    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState(prevState => ({
      menu: !prevState.menu,
    }))
  }
  logout() {
    removeUserToken()
  }
  componentDidMount() {
    if (localStorage.getItem("authUser")) {
      if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        const obj = JSON.parse(localStorage.getItem("authUser"))
        this.setState({ name: obj.displayName })
      } else if (
        process.env.REACT_APP_DEFAULTAUTH === "fake" ||
        process.env.REACT_APP_DEFAULTAUTH === "jwt"
      ) {
        const obj = JSON.parse(localStorage.getItem("authUser"))
        this.setState({ name: obj.username })
      }
    }

    if(sessionStorage.getItem("accessName")){
      this.setState({username:sessionStorage.getItem("accessName")});
    }
    console.log(sessionStorage.getItem("accessName"))
  }

  render() {
    return (
      <React.Fragment>
        <Dropdown
          isOpen={this.state.menu}
          toggle={this.toggle}
          className="d-inline-block"
        >
          <DropdownToggle
            className="btn header-item"
            id="page-header-user-dropdown"
            tag="button"
          >
            <img
              className="rounded-circle header-profile-user"
              src={user1}
              alt="Header Avatar"
            />{" "}
            <span className="d-none d-xl-inline-block ms-1">{this.state.username}</span>
            {/* <i className="mdi mdi-chevron-down d-none d-xl-inline-block" /> */}
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end">
            {/* <DropdownItem tag="a" href="/profile">
              <i className="bx bx-user font-size-16 align-middle ms-1" />
              {this.props.t("Profile")}
            </DropdownItem>
            <DropdownItem tag="a" href="/crypto-wallet">
              <i className="bx bx-wallet font-size-16 align-middle me-1" />
              {this.props.t("My Wallet")}
            </DropdownItem>
            <DropdownItem tag="a" href="#">
              <span className="badge bg-success float-end">11</span>
              <i className="bx bx-wrench font-size-17 align-middle me-1" />
              {this.props.t("Settings")}
            </DropdownItem>
            <DropdownItem tag="a" href="auth-lock-screen">
              <i className="bx bx-lock-open font-size-16 align-middle me-1" />
              {this.props.t("Lock screen")}
            </DropdownItem>
            <div className="dropdown-divider" /> */}
            <Link to="/login" onClick={this.logout} className="dropdown-item">
              <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
              <span>{this.props.t("Logout")}</span>
            </Link>
          </DropdownMenu>
        </Dropdown>
      </React.Fragment>
    )
  }
}

ProfileMenu.propTypes = {
  t: PropTypes.any,
}

export default withRouter(withTranslation()(ProfileMenu))
