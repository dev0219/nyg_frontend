import PropTypes from "prop-types"
import React, { Component } from "react"
import { FormGroup } from "reactstrap"

import { connect } from "react-redux"
import {
  hideRightSidebar,
  changeLayout,
  changeLayoutWidth,
  changeSidebarTheme,
  changeSidebarThemeImage,
  changeSidebarType,
  changePreloader,
  changeTopbarTheme,
} from "../../store/actions"

//SimpleBar
import SimpleBar from "simplebar-react"

import { Link } from "react-router-dom"

import "./rightbar.scss"

//Import images
import bgimg1 from "../../assets/images/sidebar/img1.jpg"
import bgimg2 from "../../assets/images/sidebar/img2.jpg"
import bgimg3 from "../../assets/images/sidebar/img3.jpg"
import bgimg4 from "../../assets/images/sidebar/img4.jpg"

import layout4 from "../../assets/images/layouts/layout-1.jpg"
import layout5 from "../../assets/images/layouts/layout-2.jpg"
import layout6 from "../../assets/images/layouts/layout-3.jpg"

class RightSidebar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      layoutType: this.props.layoutType,
      sidebarType: this.props.leftSideBarType,
      layoutWidth: this.props.layoutWidth,
      sidebarTheme: this.props.leftSideBarTheme,
      sidebarThemeImage: this.props.leftSideBarThemeImage,
      topbarTheme: this.props.topbarTheme,
    }
    this.hideRightbar = this.hideRightbar.bind(this)
    this.changeLayout = this.changeLayout.bind(this)
    this.changeLayoutWidth = this.changeLayoutWidth.bind(this)
    this.changeLeftSidebarTheme = this.changeLeftSidebarTheme.bind(this)
    this.changeLeftSidebarThemeImage = this.changeLeftSidebarThemeImage.bind(
      this
    )
    this.changeLeftSidebarType = this.changeLeftSidebarType.bind(this)
    this.changeTopbarTheme = this.changeTopbarTheme.bind(this)
    this.changeThemePreloader = this.changeThemePreloader.bind(this)
    this.onCloseRightBar = this.onCloseRightBar.bind(this)
  }

  /**
   * Hides the right sidebar
   */
  hideRightbar(e) {
    e.preventDefault()
    this.props.hideRightSidebar()
  }
  componentDidMount() {
    this.setState({
      layoutType: this.props.layoutType,
      sidebarType: this.props.leftSideBarType,
      layoutWidth: this.props.layoutWidth,
      sidebarTheme: this.props.leftSideBarTheme,
      sidebarThemeImage: this.props.leftSideBarThemeImage,
      topbarTheme: this.props.topbarTheme,
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({
        layoutType: this.props.layoutType,
        sidebarType: this.props.leftSideBarType,
        layoutWidth: this.props.layoutWidth,
        sidebarTheme: this.props.leftSideBarTheme,
        sidebarThemeImage: this.props.leftSideBarThemeImage,
        topbarTheme: this.props.topbarTheme,
      })
    }
  }

  changeThemePreloader = () => {
    this.props.changePreloader(!this.props.isPreloader)
  }
  /**
   * Change the layout
   * @param {*} e
   */
  changeLayout(e) {
    if (e.target.checked) {
      this.props.changeLayout(e.target.value)
    }
  }

  /**
   * Changes layout width
   * @param {*} e
   */
  changeLayoutWidth(e) {
    if (e.target.checked) {
      this.props.changeLayoutWidth(e.target.value)
    }
  }

  // change left sidebar design
  changeLeftSidebarType(e) {
    if (e.target.checked) {
      this.props.changeSidebarType(e.target.value)
    }
  }

  // change left sidebar theme
  changeLeftSidebarTheme(e) {
    if (e.target.checked) {
      this.props.changeSidebarTheme(e.target.value)
    }
  }

  changeLeftSidebarThemeImage(e) {
    if (e.target.checked) {
      this.props.changeSidebarThemeImage(e.target.value)
    }
  }

  // change topbar theme
  changeTopbarTheme(e) {
    if (e.target.checked) {
      this.props.changeTopbarTheme(e.target.value)
    }
  }
  onCloseRightBar = () => {
    this.props.onClose()
  }

  render() {
    return (
      <React.Fragment>
        <SimpleBar style={{ height: "900px" }}>
          <div data-simplebar className="h-100">
            <div className="rightbar-title px-3 py-4">
              <Link
                to="#"
                onClick={this.onCloseRightBar}
                className="right-bar-toggle float-end"
              >
                <i className="mdi mdi-close noti-icon" />
              </Link>
              <h5 className="m-0">Settings</h5>
            </div>

            <hr className="my-0" />

            <div className="p-4">
              <div className="radio-toolbar">
                <span className="mb-2 d-block">Layouts</span>
                <input
                  type="radio"
                  id="radioVertical"
                  name="radioFruit"
                  value="vertical"
                  checked={this.state.layoutType === "vertical"}
                  onChange={this.changeLayout}
                />
                <label htmlFor="radioVertical">Vertical</label>
                {"   "}
                <input
                  type="radio"
                  id="radioHorizontal"
                  name="radioFruit"
                  value="horizontal"
                  checked={this.state.layoutType === "horizontal"}
                  onChange={this.changeLayout}
                />
                <label htmlFor="radioHorizontal">Horizontal</label>
              </div>

              <hr className="mt-1" />

              <div className="radio-toolbar">
                <span className="mb-2 d-block" id="radio-title">
                  Layout Width
                </span>
                <input
                  type="radio"
                  id="radioFluid"
                  name="radioWidth"
                  value="fluid"
                  checked={this.state.layoutWidth === "fluid"}
                  onChange={this.changeLayoutWidth}
                />
                <label htmlFor="radioFluid">Fluid</label>
                {"   "}
                <input
                  type="radio"
                  id="radioBoxed"
                  name="radioWidth"
                  value="boxed"
                  checked={this.state.layoutWidth === "boxed"}
                  onChange={this.changeLayoutWidth}
                />
                <label htmlFor="radioBoxed" className="me-2">
                  Boxed
                </label>
                <input
                  type="radio"
                  id="radioscrollable"
                  name="radioscrollable"
                  value="scrollable"
                  checked={this.state.layoutWidth === "scrollable"}
                  onChange={this.changeLayoutWidth}
                />
                <label htmlFor="radioscrollable">Scrollable</label>
              </div>

              <hr className="mt-1" />

              <div className="radio-toolbar">
                <span className="mb-2 d-block" id="radio-title">
                  Topbar Theme
                </span>
                <input
                  type="radio"
                  id="radioThemeLight"
                  name="radioTheme"
                  value="light"
                  checked={this.state.topbarTheme === "light"}
                  onChange={this.changeTopbarTheme}
                />

                <label htmlFor="radioThemeLight">Light</label>
                {"   "}
                <input
                  type="radio"
                  id="radioThemeDark"
                  name="radioTheme"
                  value="dark"
                  checked={this.state.topbarTheme === "dark"}
                  onChange={this.changeTopbarTheme}
                />
                <label htmlFor="radioThemeDark">Dark</label>
                {"   "}
                {this.state.layoutType === "vertical" ? null : (
                  <>
                    {" "}
                    <input
                      type="radio"
                      id="radioThemeColored"
                      name="radioTheme"
                      value="colored"
                      checked={this.state.topbarTheme === "colored"}
                      onChange={this.changeTopbarTheme}
                    />
                    <label htmlFor="radioThemeColored">Colored</label>{" "}
                  </>
                )}
              </div>

              {this.state.layoutType === "vertical" ? (
                <React.Fragment>
                  <hr className="mt-1" />
                  <div className="radio-toolbar">
                    <span className="mb-2 d-block" id="radio-title">
                      Left Sidebar Type
                    </span>
                    <input
                      type="radio"
                      id="sidebarDefault"
                      name="sidebarType"
                      value="light"
                      checked={
                        this.state.sidebarType === "default" ||
                        this.state.sidebarType === "light"
                      }
                      onChange={this.changeLeftSidebarType}
                    />

                    <label htmlFor="sidebarDefault">Default</label>
                    {"   "}
                    <input
                      type="radio"
                      id="sidebarCompact"
                      name="sidebarType"
                      value="compact"
                      checked={this.state.sidebarType === "compact"}
                      onChange={this.changeLeftSidebarType}
                    />
                    <label htmlFor="sidebarCompact">Compact</label>
                    {"   "}
                    <input
                      type="radio"
                      id="sidebarIcon"
                      name="sidebarType"
                      value="icon"
                      checked={this.state.sidebarType === "icon"}
                      onChange={this.changeLeftSidebarType}
                    />
                    <label htmlFor="sidebarIcon">Icon</label>
                  </div>

                  <hr className="mt-1" />

                  <div className="radio-toolbar coloropt-radio">
                    <span className="mb-2 d-block" id="radio-title">
                      Left Sidebar Color Options
                    </span>
                    <input
                      type="radio"
                      id="leftsidebarThemelight"
                      name="leftsidebarTheme"
                      value="light"
                      checked={this.state.sidebarTheme === "light"}
                      onChange={this.changeLeftSidebarTheme}
                    />

                    <label
                      htmlFor="leftsidebarThemelight"
                      className="bg-light rounded-circle wh-30"
                    ></label>
                    {"   "}
                    <input
                      type="radio"
                      id="leftsidebarThemedark"
                      name="leftsidebarTheme"
                      value="dark"
                      checked={this.state.sidebarTheme === "dark"}
                      onChange={this.changeLeftSidebarTheme}
                    />
                    <label
                      htmlFor="leftsidebarThemedark"
                      className="bg-dark rounded-circle wh-30"
                    ></label>
                    {"   "}
                    <input
                      type="radio"
                      id="leftsidebarThemewinter"
                      name="leftsidebarTheme"
                      value="winter"
                      checked={this.state.sidebarTheme === "winter"}
                      onChange={this.changeLeftSidebarTheme}
                    />
                    <label
                      htmlFor="leftsidebarThemewinter"
                      className="gradient-winter rounded-circle wh-30"
                    ></label>
                    {"   "}
                    <input
                      type="radio"
                      id="leftsidebarThemeladylip"
                      name="leftsidebarTheme"
                      value="ladylip"
                      checked={this.state.sidebarTheme === "ladylip"}
                      onChange={this.changeLeftSidebarTheme}
                    />
                    <label
                      htmlFor="leftsidebarThemeladylip"
                      className="gradient-lady-lip rounded-circle wh-30"
                    ></label>
                    {"   "}
                    <input
                      type="radio"
                      id="leftsidebarThemeplumplate"
                      name="leftsidebarTheme"
                      value="plumplate"
                      checked={this.state.sidebarTheme === "plumplate"}
                      onChange={this.changeLeftSidebarTheme}
                    />
                    <label
                      htmlFor="leftsidebarThemeplumplate"
                      className="gradient-plum-plate rounded-circle wh-30"
                    ></label>
                    {"   "}
                    <input
                      type="radio"
                      id="leftsidebarThemestrongbliss"
                      name="leftsidebarTheme"
                      value="strongbliss"
                      checked={this.state.sidebarTheme === "strongbliss"}
                      onChange={this.changeLeftSidebarTheme}
                    />
                    <label
                      htmlFor="leftsidebarThemestrongbliss"
                      className="gradient-strong-bliss rounded-circle wh-30"
                    ></label>

                    <input
                      type="radio"
                      id="leftsidebarThemesgreatwhale"
                      name="leftsidebarTheme"
                      value="greatwhale"
                      checked={this.state.sidebarTheme === "greatwhale"}
                      onChange={this.changeLeftSidebarTheme}
                    />
                    <label
                      htmlFor="leftsidebarThemesgreatwhale"
                      className="gradient-strong-great-whale rounded-circle wh-30"
                    ></label>
                  </div>

                  <hr className="mt-1" />

                  <div className="radio-toolbar imgopt-radio">
                    <span className="mb-2 d-block" id="radio-bgimg">
                      Left Sidebar Bg Image
                    </span>
                    <div className="d-flex gap-2 flex-wrap">
                      <input
                        type="radio"
                        id="leftsidebarThemebgimg1"
                        name="leftsidebarThemeImage"
                        value="img1"
                        checked={this.state.sidebarThemeImage === "img1"}
                        onChange={this.changeLeftSidebarThemeImage}
                      />

                      <label htmlFor="leftsidebarThemebgimg1">
                        <img
                          alt="sidebar bg image"
                          width="90"
                          className="themesideimage rounded"
                          src={bgimg1}
                        />
                      </label>
                      {"   "}

                      <input
                        type="radio"
                        id="leftsidebarThemebgimg2"
                        name="leftsidebarThemeImage"
                        value="img2"
                        checked={this.state.sidebarThemeImage === "img2"}
                        onChange={this.changeLeftSidebarThemeImage}
                      />

                      <label htmlFor="leftsidebarThemebgimg2">
                        <img
                          alt="sidebar bg image"
                          width="90"
                          className="themesideimage rounded"
                          src={bgimg2}
                        />
                      </label>
                      {"   "}

                      <input
                        type="radio"
                        id="leftsidebarThemebgimg3"
                        name="leftsidebarThemeImage"
                        value="img3"
                        checked={this.state.sidebarThemeImage === "img3"}
                        onChange={this.changeLeftSidebarThemeImage}
                      />

                      <label htmlFor="leftsidebarThemebgimg3">
                        <img
                          alt="sidebar bg image"
                          width="90"
                          className="themesideimage rounded"
                          src={bgimg3}
                        />
                      </label>
                      {"   "}

                      <input
                        type="radio"
                        id="leftsidebarThemebgimg4"
                        name="leftsidebarThemeImage"
                        value="img4"
                        checked={this.state.sidebarThemeImage === "img4"}
                        onChange={this.changeLeftSidebarThemeImage}
                      />

                      <label htmlFor="leftsidebarThemebgimg4">
                        <img
                          alt="sidebar bg image"
                          width="90"
                          className="themesideimage rounded"
                          src={bgimg4}
                        />
                      </label>
                      {"   "}

                      <input
                        type="radio"
                        id="leftsidebarThemenone"
                        name="leftsidebarThemeImage"
                        value="none"
                        checked={this.state.sidebarThemeImage === "none"}
                        onChange={this.changeLeftSidebarThemeImage}
                      />
                      <label htmlFor="leftsidebarThemenone">
                        <div style={{ width: "40px", height: "80px" }}>
                          <div className="bg-light border px-2 h-100 shadow-none">
                            <div className="verticalcontent">None</div>
                          </div>
                        </div>
                      </label>
                      {"   "}
                    </div>
                  </div>

                  <hr className="mt-1" />
                </React.Fragment>
              ) : null}

              <FormGroup>
                <span className="mb-2 d-block" id="radio-title">
                  Preloader
                </span>

                <div className="form-check form-switch mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input theme-choice"
                    id="checkbox_1"
                    checked={this.props.isPreloader}
                    onChange={this.changeThemePreloader}
                  />
                  <label className="form-check-label" htmlFor="checkbox_1">
                    Preloader
                  </label>
                </div>
              </FormGroup>

              <h6 className="text-center">Choose Layouts</h6>

              <div className="mb-2">
                <Link
                  to="//skote-v-light.react.themesbrand.com"
                  target="_blank"
                >
                  <img
                    src={layout4}
                    className="img-fluid img-thumbnail"
                    alt=""
                  />
                </Link>
              </div>

              <div className="mb-2">
                <Link to="//skote-v-dark.react.themesbrand.com" target="_blank">
                  <img
                    src={layout5}
                    className="img-fluid img-thumbnail"
                    alt=""
                  />
                </Link>
              </div>

              <div className="mb-2">
                <Link to="//skote-v-rtl.react.themesbrand.com" target="_blank">
                  <img
                    src={layout6}
                    className="img-fluid img-thumbnail"
                    alt=""
                  />
                </Link>
              </div>

              <Link
                to="//1.envato.market/skotereact"
                className="btn btn-primary btn-block mt-3"
                target="_blank"
              >
                <i className="mdi mdi-cart me-1" /> Purchase Now
              </Link>
            </div>
          </div>
        </SimpleBar>
        <div className="rightbar-overlay" />
      </React.Fragment>
    )
  }
}

RightSidebar.propTypes = {
  changeLayout: PropTypes.func,
  changeLayoutWidth: PropTypes.func,
  changePreloader: PropTypes.func,
  changeSidebarTheme: PropTypes.func,
  changeSidebarThemeImage: PropTypes.func,
  changeSidebarType: PropTypes.func,
  changeTopbarTheme: PropTypes.func,
  hideRightSidebar: PropTypes.func,
  isPreloader: PropTypes.bool,
  layoutType: PropTypes.any,
  layoutWidth: PropTypes.any,
  leftSideBarTheme: PropTypes.any,
  leftSideBarThemeImage: PropTypes.any,
  leftSideBarType: PropTypes.any,
  topbarTheme: PropTypes.any,
  onClose: PropTypes.func,
}

const mapStatetoProps = state => {
  return { ...state.Layout }
}

export default connect(mapStatetoProps, {
  hideRightSidebar,
  changeLayout,
  changeSidebarTheme,
  changeSidebarThemeImage,
  changeSidebarType,
  changeLayoutWidth,
  changeTopbarTheme,
  changePreloader,
})(RightSidebar)
