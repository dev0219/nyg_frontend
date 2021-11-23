import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import MetaTags from "react-meta-tags"
import { withRouter } from "react-router-dom"
import { isEmpty, size } from "lodash"
import BootstrapTable from "react-bootstrap-table-next"
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator"
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit"
import { Link } from "react-router-dom"
import * as moment from "moment"

import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  Badge,
  ModalHeader,
  ModalBody,
} from "reactstrap"

import { AvForm, AvField } from "availity-reactstrap-validation"

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb"
// import {
//   getOrders,
//   addNewOrder,
//   updateOrder,
//   deleteOrder
// } from "store/actions"

import { staffURL as userURL } from "helpers/url_helper"
import { getAccessToken } from "helpers/auth_helper"

class User extends Component {
  constructor(props) {
    super(props)
    this.state = {
      viewmodal: false,
      modal: false,
      users: [],
      userData: {},
      userDetails: {},
      UserColumns: [
        {
          dataField: "staff_department",
          text: "STAFF_DEPARTMENT",
          sort: true,
          formatter: (cellContent, row) => (
            <Link to="#" className="text-body fw-bold">
              {row.staff_department}
            </Link>
          ),
        },
        {
          dataField: "staff_id",
          text: "STAFF_ID",
          sort: true,
        },
        {
          dataField: "staff_name",
          text: "STAFF_NAME",
          sort: true,
        },
        {
          dataField: "staff_location",
          text: "STAFF_LOCATION",
          sort: true,
        },
        {
          dataField: "updatedAt",
          text: "Updated At",
          sort: true,
          formatter: (cellContent, row) => this.handleValidDate(row.updatedAt),
        },
        // {
        //   dataField: "view",
        //   text: "View Details",
        //   sort: true,
        //   formatter: (cellContent, order) => (
        //     <Button
        //       type="button"
        //       color="primary"
        //       className="btn-sm btn-rounded"
        //       onClick={() => this.toggleViewModal(order)}
        //     >
        //       View Details
        //     </Button>
        //   ),
        // },
        // {
        //   dataField: "action",
        //   isDummyField: true,
        //   text: "Action",
        //   formatter: (cellContent, order) => (
        //     <>
        //       <div className="d-flex gap-3">
        //         <Link to="#" className="text-success">
        //           <i
        //             className="mdi mdi-pencil font-size-18"
        //             id="edittooltip"
        //             onClick={() => this.handleMachineOrderUpdate(order)}
        //           />
        //         </Link>
        //         <Link to="#" className="text-danger">
        //           <i
        //             className="mdi mdi-delete font-size-18"
        //             id="deletetooltip"
        //             onClick={() => this.handleDeleteMachine(order)}
        //           />
        //         </Link>
        //       </div>
        //     </>
        //   ),
        // },
      ],
    }

    // this.handleMachineOrderUpdate = this.handleMachineOrderUpdate.bind(this)
    this.toggle = this.toggle.bind(this)
    this.handleValidUserSubmit = this.handleValidUserSubmit.bind(this)
    this.handleUserClicks = this.handleUserClicks.bind(this)
    this.toLowerCase1 = this.toLowerCase1.bind(this)
  }

  toLowerCase1(str) {
    return str.toLowerCase()
  }

  async fetchUsers() {
    try {
      const authHeaders = { Authorization: "Bearer " + getAccessToken() }
      var users = await fetch(userURL, { headers: authHeaders })
      users = await users.json()

      this.setState({ users: users.data })
    } catch (error) {
      console.error(error)
    }
  }

  async componentDidMount() {
    await this.fetchUsers()
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { users } = this.props
    if (!isEmpty(users) && size(prevProps.users) !== size(users)) {
      this.setState({ users: {}, isEdit: false })
    }
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }))
  }

  handleUserClicks = () => {
    this.setState({ users: [], isEdit: false })
    this.toggle()
  }

  // eslint-disable-next-line no-unused-vars
  handleTableChange = (type, { page, searchText }) => {
    const { users } = this.props
    this.setState({
      users: users.filter(user =>
        Object.keys(user).some(
          key =>
            typeof user[key] === "string" &&
            user[key].toLowerCase().includes(searchText.toLowerCase())
        )
      ),
    })
  }

  toggleViewModal = async args => {
    await this.props.history.push({
      pathname: "/user-details",
      state: args,
    })
    // await this.setState(prevState => ({
    //   viewmodal: !prevState.viewmodal,
    //   machineDetails: args,
    // }))
  }

  /* Insert,Update Delete data */

  handleDeleteMachine = async machine => {
    const authHeaders = { Authorization: "Bearer " + getAccessToken() }
    await fetch(machineOrderURL + `/${machine._id}`, {
      method: "DELETE",
      headers: authHeaders,
    })

    await this.fetchUsers()
  }

  handleMachineOrderUpdate = arg => {
    const order = arg

    this.setState({
      orderData: {
        oid: order._id,
        order_no: order.order_no,
        mc_group: order.mc_group,
        mc_location: order.mc_location,
        request_by: order.request_by,
        approve_by: order.approve_by,
        order_status: order.order_status,
        order_date: new Date(order.order_date),
      },
      isEdit: true,
    })

    this.toggle()
  }

  /**
   * Handling submit Order on Order form
   */
  handleValidUserSubmit = async (e, values) => {
    const { isEdit } = this.state

    // const staff_department = document.getElementById("staff_department").value
    // const staff_location = document.getElementById("staff_location").value

    // values.staff_department = staff_department
    // values.staff_location = staff_location

    /* if (isEdit) {
      await fetch(machineOrderURL + `/${values.oid}`, {
        method: "PUT",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getAccessToken(),
        },
      })
    } else {
      await fetch(machineOrderURL, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getAccessToken(),
        },
      })
    } */
    await fetch(userURL, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getAccessToken(),
      },
    })
    await this.fetchUsers()
    this.setState({ selectedUser: null })
    this.toggle()
  }

  handleValidDate = date => {
    const date1 = moment(new Date(date)).format("YYYY-MM-DD HH:MM:SS A")
    return date1
  }

  render() {
    const { users } = this.state

    const { SearchBar } = Search

    const { isEdit } = this.state

    //pagination customization
    const pageOptions = {
      sizePerPage: 10,
      totalSize: users.length, // replace later with size(Order),
      custom: true,
    }

    const defaultSorted = [
      {
        dataField: "staff_id",
        order: "desc",
      },
    ]

    const selectRow = {
      mode: "checkbox",
    }

    return (
      <React.Fragment>
        {/* <MachineDetailsModal
          isOpen={this.state.viewmodal}
          toggle={this.toggleViewModal}
          machine={this.state.machineDetails}
        /> */}
        <div className="page-content">
          <MetaTags>
            <title>Users | NYG Users Dashboard</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Dashboard" breadcrumbItem="users" />
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.UserColumns}
                      data={users}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="_id"
                          data={users}
                          columns={this.state.UserColumns}
                          bootstrap4
                          search
                        >
                          {toolkitProps => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4">
                                  <div className="search-box me-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                      <SearchBar
                                        {...toolkitProps.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
                                    </div>
                                  </div>
                                </Col>
                                <Col sm="8">
                                  <div className="text-sm-end">
                                    <Button
                                      type="button"
                                      color="success"
                                      className="btn-rounded mb-2 me-2"
                                      onClick={this.handleUserClicks}
                                    >
                                      <i className="mdi mdi-plus me-1" />
                                      Add New User
                                    </Button>
                                  </div>
                                </Col>
                              </Row>
                              <div className="table-responsive">
                                <BootstrapTable
                                  {...toolkitProps.baseProps}
                                  {...paginationTableProps}
                                  responsive
                                  defaultSorted={defaultSorted}
                                  bordered={false}
                                  striped={false}
                                  classes={
                                    "table align-middle table-nowrap table-check"
                                  }
                                  headerWrapperClasses={"table-light"}
                                />
                                <Modal
                                  isOpen={this.state.modal}
                                  className={this.props.className}
                                >
                                  <ModalHeader toggle={this.toggle} tag="h4">
                                    {!!isEdit ? "Edit User" : "Add User"}
                                  </ModalHeader>
                                  <ModalBody>
                                    <AvForm
                                      onValidSubmit={this.handleValidUserSubmit}
                                    >
                                      <Row form>
                                        <Col className="col-12">
                                          <div className="mb-3">
                                            <AvField
                                              name="staff_department"
                                              label="STAFF_DEPARTMENT"
                                              type="text"
                                              value={
                                                this.state.userData
                                                  .staff_department || ""
                                              }
                                            />
                                          </div>
                                          <div className="mb-3">
                                            <AvField
                                              name="staff_id"
                                              label="STAFF_ID"
                                              type="text"
                                              value={
                                                this.state.userData.staff_id ||
                                                ""
                                              }
                                            />
                                          </div>
                                          <div className="mb-3">
                                            <AvField
                                              name="staff_name"
                                              label="STAFF_NAME"
                                              type="text"
                                              value={
                                                this.state.userData.staff_name ||
                                                ""
                                              }
                                            />
                                          </div>
                                          <div className="mb-3">
                                            <AvField
                                              name="staff_location"
                                              label="STAFF_LOCATION"
                                              type="text"
                                              value={
                                                this.state.userData
                                                  .staff_location || ""
                                              }
                                            />
                                          </div>
                                          {/* <div className="mb-3">
                                            <label>STAFF_DEPARTMENT</label>
                                            <select
                                              name="staff_department"
                                              id="staff_department"
                                              className="form-control"
                                              defaultValue={
                                                this.state.userData
                                                  .staff_department || "0"
                                              }
                                              required
                                            >
                                              <option value="0" disabled>
                                                Select Staff Department
                                              </option>
                                              {staff_department_options.map(
                                                item => {
                                                  return (
                                                    <option
                                                      id={item.id}
                                                      value={item.value}
                                                    >
                                                      {item.value}
                                                    </option>
                                                  )
                                                }
                                              )}
                                            </select>
                                          </div>
                                          <div className="mb-3">
                                            <label>STAFF_LOCATION</label>
                                            <select
                                              name="staff_location"
                                              id="staff_location"
                                              className="form-control"
                                              defaultValue={
                                                this.state.userData
                                                  .staff_location || "0"
                                              }
                                              required
                                            >
                                              <option value="0" disabled>
                                                Select Staff Location
                                              </option>
                                              {staff_location_options.map(
                                                item => {
                                                  return (
                                                    <option
                                                      id={item.id}
                                                      value={item.value}
                                                    >
                                                      {item.value}
                                                    </option>
                                                  )
                                                }
                                              )}
                                            </select>
                                          </div>
                                         */}
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
                                </Modal>
                              </div>
                              <div className="pagination pagination-rounded justify-content-end mb-2">
                                <PaginationListStandalone
                                  {...paginationProps}
                                />
                              </div>
                            </React.Fragment>
                          )}
                        </ToolkitProvider>
                      )}
                    </PaginationProvider>
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

export default withRouter(User)
