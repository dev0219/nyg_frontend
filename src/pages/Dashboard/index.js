import React, { Component } from "react"
import MetaTags from "react-meta-tags"
import { withRouter } from "react-router-dom"
import BootstrapTable from "react-bootstrap-table-next"
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator"
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit"

import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Spinner,
  CardTitle,
} from "reactstrap"

import { AvForm, AvField } from "availity-reactstrap-validation"

import Breadcrumbs from "components/Common/Breadcrumb"

import { dashboardURL } from "helpers/url_helper"
import { getAccessToken } from "helpers/auth_helper"

// Import All Static Options
import {
  mc_group_option,
  mc_location_option,
  mc_status_option,
  mc_brand_option,
  mc_type_option,
} from "../../helpers/static-options/index"

class Machines extends Component {
  constructor(props) {
    super(props)
    this.state = {
      viewmodal: false,
      modal: false,
      orders: [],
      mc_location: "",
      mc_group: "",
      noDataMsg: null,
    }

    this.toLowerCase1 = this.toLowerCase1.bind(this)
  }

  toLowerCase1(str) {
    return str.toLowerCase()
  }

  handleButtonClick = async e => {
    await this.setState({
      ...this.state,
      [e.target.name]: e.target.id,
    })
    this.fetchMachineOrders()
  }

  async fetchMachineOrders() {
    try {
      this.setState({ noDataMsg: null, orders: [] })
      const authHeaders = {
        Authorization: "Bearer " + getAccessToken(),
        "Content-Type": "application/json",
      }

      let request_body = {
        mc_location: this.state.mc_location,
        mc_group: this.state.mc_group,
      }

      request_body = JSON.stringify(request_body)

      var orders = await fetch(dashboardURL + "/allMachineOrders", {
        method: "POST",
        headers: authHeaders,
        body: request_body,
      })
      orders = await orders.json()

      this.setState({
        orders: orders.data.data,
        noDataMsg: orders.data.data.length ? null : orders.message,
      })
    } catch (error) {
      console.error(error.message)
    }
  }

  async componentDidMount() {
    await this.fetchMachineOrders()
  }

  viewOrderDetails = async args => {
    await this.props.history.push({
      pathname: "/machine-order-details",
      state: args,
    })
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content mc-dashboard">
          <MetaTags>
            <title>Dashboard | NYG Dashboard</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Dashboard" breadcrumbItem="dashboard" />
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>
                    <Row
                      className="mb-3"
                      style={{ fontSize: "16px", color: "black" }}
                    >
                      Machine Locations
                    </Row>
                    <Row
                      id="locationBtns"
                      className="mc-location"
                      style={{
                        // height: "75px",
                        overflowY: "auto",
                        overflowX: "hidden",
                      }}
                    >
                      <Col className="mb-2 xs-3">
                        <Button
                        //   style={{
                        //     backgroundColor: "darkcyan",
                        //     color: "white",
                        //     fontWeight: "600",
                        //     borderColor: "darkcyan",
                        //   }}
                          name="mc_location"
                          className="w-100"
                          key={""}
                          id={""}
                          onClick={this.handleButtonClick}
                        >
                          {"All"}
                        </Button>
                      </Col>
                      {mc_location_option.map(location => (
                        <Col className="mb-2 xs-3" key={location.id}>
                          <Button
                            style={{
                              backgroundColor: "transparent",
                              color: "black",
                              borderColor: "darkcyan",
                              fontWeight: "600",
                            }}
                            className="w-100"
                            name="mc_location"
                            color="success"
                            value={location.value}
                            id={location.value}
                            onClick={this.handleButtonClick}
                          >
                            {location.value}
                          </Button>
                        </Col>
                      ))}
                    </Row>
                    <Row
                      className="mb-3"
                      style={{ fontSize: "16px", color: "black" }}
                    >
                      Location Groups
                    </Row>
                    <Row id="groupsDropDown" className="mb-2">
                      <Col xs="12">
                        <select
                          name="mc_group"
                          id="mc_group"
                          className="form-control mb-2 w-100"
                          style={{
                            borderColor: "darkcyan",
                            color: "black",
                            fontWeight: "500",
                          }}
                          onChange={async e => {
                            await this.setState({
                              [e.target.name]: e.target.value,
                            })
                            this.fetchMachineOrders()
                          }}
                        >
                          <option value="">Select MC GROUP</option>
                          {mc_group_option.map(item => {
                            return (
                              <option id={item.id} value={item.value}>
                                {item.value}
                              </option>
                            )
                          })}
                        </select>
                      </Col>
                    </Row>
                    <Row
                      className="mb-3"
                      style={{ fontSize: "16px", color: "black" }}
                    >
                      Machine Orders
                    </Row>
                    <Row
                      id="orderBtns"
                      style={{
                        height: "auto",
                        overflowY: "auto",
                        overflowX: "hidden",
                      }}
                    >
                      {this.state.orders.length
                        ? this.state.orders.map(order => (
                            <Col className="mb-2 xs-3" key={order.order_no}>
                              <Button
                                // style={{
                                //   backgroundColor: "#fff",
                                //   borderColor: "darkcyan",
                                //   fontSize: "16px",
                                //   padding: "3px",
                                //   color: "#000",
                                // }}
                                className="w-100 mc-order-buttons"
                                onClick={() => this.viewOrderDetails(order)}
                              >
                                {order.order_no}
                              </Button>
                            </Col>
                          ))
                        : this.state.noDataMsg}
                    </Row>
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

export default withRouter(Machines)
