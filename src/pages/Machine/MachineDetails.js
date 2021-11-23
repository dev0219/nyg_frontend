import { getAccessToken } from "helpers/auth_helper"
import { machineURL } from "helpers/url_helper"
import React, { Component } from "react"
import MetaTags from "react-meta-tags"

import { Container, Card, CardBody, Table, Row, Col } from "reactstrap"

import Breadcrumbs from "components/Common/Breadcrumb"
import moment from "moment"
import { withRouter } from "react-router-dom"

class MachineDetails extends Component {
  constructor(props) {
    super(props)

    let id = this.props.location.state._id
    this.state = {
      oid: id,
      machine: {},
    }
  }

  componentDidMount = async () => {
    try {
      try {
        const authHeaders = { Authorization: "Bearer " + getAccessToken() }
        var machine = await fetch(machineURL + `/${this.state.oid}`, {
          headers: authHeaders,
        })
        machine = await machine.json()

        this.setState({ machine: machine.data })
      } catch (error) {
        console.error(error.message)
      }
    } catch (error) {}
  }

  render() {
    const { machine } = this.state
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>NYG Machine Dashboard</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Machine" breadcrumbItem="Machine Details" />
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>
                    <div className="table-responsive">
                      <Table className="table align-middle">
                        <tbody>
                          <tr>
                            <th>MC_RFID</th>
                            <td>{machine.mc_rfid}</td>
                          </tr>
                          <tr>
                            <th>MC_SYS_ID</th>
                            <td>{machine.mc_sys_id}</td>
                          </tr>
                          <tr>
                            <th>OU_CODE</th>
                            <td>{machine.ou_code}</td>
                          </tr>
                          <tr>
                            <th>MC_DEPT</th>
                            <td>{machine.mc_dept}</td>
                          </tr>
                          <tr>
                            <th>MC_TYPE</th>
                            <td>{machine.mc_type}</td>
                          </tr>
                          <tr>
                            <th>MC_GROUP</th>
                            <td>{machine.mc_group}</td>
                          </tr>
                          <tr>
                            <th>MC_COUNTRY</th>
                            <td>{machine.mc_country}</td>
                          </tr>
                          <tr>
                            <th>MC_LOCATION</th>
                            <td>{machine.mc_location}</td>
                          </tr>
                          <tr>
                            <th>MC_BRAND</th>
                            <td>{machine.mc_brand}</td>
                          </tr>
                          <tr>
                            <th>MC_MODEL</th>
                            <td>{machine.mc_model}</td>
                          </tr>
                          <tr>
                            <th>MC_SERIAL</th>
                            <td>{machine.mc_serial}</td>
                          </tr>
                          <tr>
                            <th>MC_INSTALL_DATE</th>
                            <td>
                              {moment(machine.mc_install_date).format(
                                "YYYY-MM-DD HH:MM A"
                              )}
                            </td>
                          </tr>
                          <tr>
                            <th>MC_PURCHASE_DATE</th>
                            <td>
                              {moment(machine.purchase_date).format(
                                "YYYY-MM-DD HH:MM A"
                              )}
                            </td>
                          </tr>
                          <tr>
                            <th>PURCHASE NO.</th>
                            <td>{machine.purchase_no}</td>
                          </tr>
                          <tr>
                            <th>INVOICE NO.</th>
                            <td>{machine.invoice_no}</td>
                          </tr>
                          <tr>
                            <th>MC_TOTAL_PRICE</th>
                            <td>{machine.mc_total_price}</td>
                          </tr>
                          <tr>
                            <th>MC_ACTIVE</th>
                            <td>{machine.mc_active ? "YES" : "NO"}</td>
                          </tr>
                          <tr>
                            <th>ENTRY_DATE</th>
                            <td>
                              {moment(machine.createdAt).format(
                                "YYYY-MM-DD HH:MM A"
                              )}
                            </td>
                          </tr>
                          <tr>
                            <th>UPDATE_DATE</th>
                            <td>
                              {moment(machine.updatedAt).format(
                                "YYYY-MM-DD HH:MM A"
                              )}
                            </td>
                          </tr>
                          <tr>
                            <th>UPDATE_BY</th>
                            <td>{machine.update_by}</td>
                          </tr>
                          <tr>
                            <th>REQUESTED BY</th>
                            <td>{machine.requested_by}</td>
                          </tr>
                          <tr>
                            <th>APPROVED_BY</th>
                            <td>{machine.approved_by}</td>
                          </tr>
                          <tr>
                            <th>RESPONDED BY</th>
                            <td>{machine.responsed_by}</td>
                          </tr>
                          <tr>
                            <th>MAINTENANCE BY</th>
                            <td>{machine.maintenance_by}</td>
                          </tr>
                          <tr>
                            <th>MC_STATUS</th>
                            <td>{machine.mc_status}</td>
                          </tr>
                          <tr>
                            <th>COMMENT</th>
                            <td>{machine.comment}</td>
                          </tr>
                        </tbody>
                      </Table>
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

export default withRouter(MachineDetails)
