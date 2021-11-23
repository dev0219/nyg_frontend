import React, { Component } from "react"
import PropTypes from "prop-types"
import MetaTags from "react-meta-tags"

import { Link, withRouter } from "react-router-dom"

import { Row, Col, CardBody, Card, Alert, Container } from "reactstrap"

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation"
// import images
import nygbg from "assets/images/logo/nyg_bg.jpeg"
import logo from "assets/images/logo/nyg_logo.png"
import { register } from "helpers/url_helper"
import { setAccessToken,setAccessTole ,setAccessName} from "helpers/auth_helper"
import {
  userrole_option,
} from "../../helpers/static-options/index"
class Login extends Component {
  constructor(props) {
    super(props)

    // handleValidSubmit
    this.handleValidSubmit = this.handleValidSubmit.bind(this)
  }

  // handleValidSubmit
  handleValidSubmit = async (event, values) => {
    // document.getElementById("preloader").style.display = "block"
    // document.getElementById("status").style.display = "block"
    this.setState({
      isLoader: true,    
    })
    var e = document.getElementById("userrole");
    var strUser = e.value;
    values['role'] = strUser;
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }
      const submit_response = await fetch(register, requestOptions)

      // console.log(await submit_response.json())

      const response = await submit_response.json()

      if (response.message == 'Register Successful') {
        console.log(response.data)
        setAccessToken(response.data._token)
        setAccessTole(response.data.role)
        setAccessName(response.data.name)
        this.props.history.push("/machine")
      } else {
        alert(response.message)
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  render() {
    return (
      <React.Fragment>
        <MetaTags>
          <title>Login | Skote - React Admin & Dashboard Template</title>
        </MetaTags>
        <div className="home-btn d-none d-sm-block">
          <Link to="/" className="text-dark">
            <i className="fas fa-home h2" />
          </Link>
        </div>
        <div className="account-pages my-5 pt-sm-5">
          <Container>
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="overflow-hidden">
                  <div className="bg-primary bg-soft">
                    <Row>
                      {/* <img src={logo} alt="" /> */}
                      <Col xs={7}>
                        {/* <div className="text-primary p-4">
                          <h5 className="text-primary">Welcome Back !</h5>
                        </div> */}
                        <img
                          src={nygbg}
                          alt=""
                          style={{
                            height: "155px",
                            width: "181%",
                            objectFit: "cover",
                          }}
                        />
                      </Col>
                      {/* <Col className="col-5 align-self-end">
                        <img src={profile} alt="" className="img-fluid" />
                      </Col> */}
                    </Row>
                  </div>
                  <CardBody className="pt-0">
                    <div>
                      <Link to="/" className="auth-logo-light">
                        <div className="avatar-md profile-user-wid mb-4">
                          <span className="avatar-title rounded-circle bg-light">
                            <img src={logo} alt="" style={{ zIndex: "1" }} />
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="p-2">
                      <AvForm
                        className="form-horizontal"
                        onValidSubmit={this.handleValidSubmit}
                      >
                        <div className="mb-3">
                          <h6>User role</h6>
                            <select
                              name="userrole"
                              id="userrole"
                              className="form-control"
                              required
                            >
                              {userrole_option.map(item => {
                                return (
                                  <option
                                    id={item.id}
                                    value={item.value}
                                  >
                                    {item.value}
                                  </option>
                                )
                              })}
                            </select>
                        </div> 
                        <div className="mb-3">
                          <AvField
                            name="username"
                            label="Username"
                            className="form-control"
                            placeholder="Enter username"
                            type="text"
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <AvField
                            name="password"
                            label="Password"
                            type="password"
                            required
                            placeholder="Enter Password"
                          />
                        </div>
                                           

                        <div className="mt-3 d-grid">
                          <button
                            className="btn btn-primary btn-block pr-btn-login"
                            type="submit"
                          >
                            Sign up
                          </button>
                        </div>
                      </AvForm>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    )
  }
}

export default withRouter(Login)
