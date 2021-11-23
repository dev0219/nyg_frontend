import { getAccessToken } from "helpers/auth_helper"
import { machineOrderURL,machineURL } from "helpers/url_helper"
import React, { Component } from "react"
import MetaTags from "react-meta-tags"

import { Container, Card, CardBody, Table, Row, Col, Button ,ModalBody} from "reactstrap"

import Breadcrumbs from "components/Common/Breadcrumb"
import moment from "moment"
import { withRouter } from "react-router-dom"

class MachineDetails extends Component {
  constructor(props) {
    super(props)

    let id = this.props.location.state._id
    this.state = {
      machineLst:[],
      oid: id,
      order: { machines: [] },
    }
  }

  printScreen = () => {
    window.print()
  }

  componentDidMount = async () => {
    try {
      try {
        const authHeaders = { Authorization: "Bearer " + getAccessToken() }
        var order = await fetch(machineOrderURL + `/${this.state.oid}`, {
          headers: authHeaders,
        })
        order = await order.json()
        order.data['mc_type'] = order.data.mc_type.map(item => item.type)
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
                  
                    <div
                      className="table-responsive"
                      style={{ overflowX: "hidden" }}
                    >
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
                            <th>MC_TYPE</th>
                            <td>{order.mc_type}</td>
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
                          <tr>
                            <th>QTY</th>
                            <td>
                            {order.qty}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                      <Row>
                        <Col>
                          <Card>
                            <CardBody>
                              <div className="table-responsive">
                                <Table className="table mb-0 table-sm">
                                  <thead>
                                    <tr>
                                      <th>#</th>
                                      <th>MC_Serial</th>
                                      <th>MC_Type</th>
                                      <th>MC_Brand</th>
                                      <th>MC_Model</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {order.machines.map((machine, index) => (
                                      <tr id={machine._id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{machine.mc_serial}</td>
                                        <td>{machine.mc_type}</td>
                                        <td>{machine.mc_brand}</td>
                                        <td>{machine.mc_model}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>                      
                      <Button
                        className="bg-success"
                        style={{ float: "right" }}
                        onClick={this.printScreen}
                      >
                        <i className="fa fa-print"></i>
                      </Button>
                    </div>
                  </CardBody>
                  {/* <Modal
                                  isOpen={this.state.modal}
                                  className={this.props.className}
                                >
                                  <ModalHeader toggle={this.toggle} tag="h4">
                                    {!!isEdit ? "Edit Order" : "Add Order"}
                                  </ModalHeader>
                                  <ModalBody>
                                    <AvForm
                                      onValidSubmit={
                                        this.handleValidMachineOrderSubmit
                                      }
                                    >
                                      <Row form>
                                        <Col className="col-12">                                          
                                          <div className="mb-3">
                                            <label>MC_GROUP</label>
                                            <select
                                              name="mc_group"
                                              id="mc_group"
                                              className="form-control"
                                              defaultValue={
                                                this.state.orderData.mc_group ||
                                                "0"
                                              }
                                              required
                                            >
                                              <option value="0" disabled>
                                                Select MACHINE
                                              </option>
                                              {mc_group_option.map(item => {
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
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col>
                                          <div className="text-end">
                                            <button
                                              type="submit"
                                              className="btn btn-success save-user"
                                            >
                                              Save
                                            </button>
                                          </div>
                                        </Col>
                                      </Row>
                                    </AvForm>
                                  </ModalBody>
                                </Modal> */}
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    )
  }
}

export default withRouter(MachineDetails)
