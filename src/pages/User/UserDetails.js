import { getAccessToken } from "helpers/auth_helper"
import { staffURL as userURL } from "helpers/url_helper"
import React, { Component } from "react"
import MetaTags from "react-meta-tags"

import { Container, Card, CardBody, Table, Row, Col, Button } from "reactstrap"

import Breadcrumbs from "components/Common/Breadcrumb"
import moment from "moment"
import { withRouter } from "react-router-dom"

class UserDetails extends Component {
  constructor(props) {
    super(props)

    let id = this.props.location.state._id
    this.state = {
      uer: {},
    }
  }

  printScreen = () => {
    window.print()
  }

  componentDidMount = async () => {
    try {
      try {
        const authHeaders = { Authorization: "Bearer " + getAccessToken() }
        var order = await fetch(userURL + `/${this.state.oid}`, {
          headers: authHeaders,
        })
        order = await order.json()
        this.setState({ order: order.data })
      } catch (error) {
        console.error(error.message)
      }
    } catch (error) {}
  }

  render() {
    const { order } = this.state
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>NYG Machine Order Dashboard</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs
              title="Machine Order"
              breadcrumbItem="Machine Order Details"
            />
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>
                    <div className="table-responsive">
                      <Table className="table align-middle">
                        <tbody>
                          <tr>
                            <th>ORDER_NO</th>
                            <td>{order.order_no}</td>
                          </tr>
                          <tr>
                            <th>MC_GROUP</th>
                            <td>{order.mc_group}</td>
                          </tr>
                          <tr>
                            <th>MC_LOCATION</th>
                            <td>{order.mc_location}</td>
                          </tr>
                          <tr>
                            <th>ORDER_DATE</th>
                            <td>
                              {moment(order.order_date).format(
                                "YYYY-MM-DD HH:SS A"
                              )}
                            </td>
                          </tr>
                          <tr>
                            <th>REQUEST_BY</th>
                            <td>
                              {order.request_by
                                ? order.request_by.staff_name
                                : ""}
                            </td>
                          </tr>
                          <tr>
                            <th>APPROVE_BY</th>
                            <td>
                              {order.approve_by
                                ? order.approve_by.staff_name
                                : ""}
                            </td>
                          </tr>
                          <tr>
                            <th>UPDATED AT</th>
                            <td>
                              {moment(order.updatedAt).format(
                                "YYYY-MM-DD HH:SS A"
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                      <Button
                        className="bg-success"
                        style={{ float: "right" }}
                        onClick={this.printScreen}
                      >
                        <i className="fa fa-print"></i>
                      </Button>
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

export default withRouter(UserDetails)
