import React, { Component } from "react"
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
  ModalHeader,
  ModalBody,
  Spinner,
} from "reactstrap"

import { AvForm, AvField } from "availity-reactstrap-validation"

import Breadcrumbs from "components/Common/Breadcrumb"

import { machineTypeURL } from "helpers/url_helper"
import { getAccessToken } from "helpers/auth_helper"

class MachineType extends Component {
  constructor(props) {
    super(props)
    this.state = {
      viewmodal: false,
      modal: false,
      machineTypes: [],
      machineTypeData: {},
      MachineTypeColumns: [
        {
          dataField: "mc_type",
          text: "MC_TYPE",
          sort: true,
          formatter: (cellContent, row) => (
            <Link to="#" className="text-body fw-bold">
              {row.mc_type}
            </Link>
          ),
        },
        {
          dataField: "updatedAt",
          text: "Updated At",
          sort: true,
          formatter: (cellContent, row) => this.handleValidDate(row.updatedAt),
        },
        {
          dataField: "action",
          isDummyField: true,
          text: "Action",
          formatter: (cellContent, row) => (
            <>
              <div className="d-flex gap-3">
                <Link to="#" className="text-success">
                  <i
                    className="mdi mdi-pencil font-size-18"
                    id="edittooltip"
                    onClick={() => this.handleMachineTypeUpdate(row)}
                  />
                </Link>
                <Link to="#" className="text-danger">
                  <i
                    className="mdi mdi-delete font-size-18"
                    id="deletetooltip"
                    onClick={() => this.handleDeleteMachineType(row)}
                  />
                </Link>
              </div>
            </>
          ),
        },
      ],
      noDataMsg: null,
    }

    this.handleMachineTypeUpdate = this.handleMachineTypeUpdate.bind(this)
    this.toggle = this.toggle.bind(this)
    this.handleOrderClicks = this.handleOrderClicks.bind(this)
    this.handleValidMachineTypeSubmit =
      this.handleValidMachineTypeSubmit.bind(this)
    this.toLowerCase1 = this.toLowerCase1.bind(this)
  }

  toLowerCase1(str) {
    return str.toLowerCase()
  }

  async fetchMachineTypes() {
    try {
      this.setState({ noDataMsg: null, machineTypes: [] })
      const authHeaders = {
        Authorization: "Bearer " + getAccessToken(),
      }

      var machineTypes = await fetch(machineTypeURL, {
        method: "GET",
        headers: authHeaders,
      })
      machineTypes = await machineTypes.json()

      this.setState({
        machineTypes: machineTypes.data,
        noDataMsg: machineTypes.data.length ? null : machineTypes.message,
      })
    } catch (error) {
      console.error(error.message)
    }
  }

  async componentDidMount() {
    await this.fetchMachineTypes()
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    // const { machineTypes } = this.props
    // if (!isEmpty(orders) && size(prevProps.orders) !== size(orders)) {
    //   this.setState({ orders: {}, isEdit: false })
    // }
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }))
  }

  handleOrderClicks = () => {
    this.setState({ machineTypes: [], isEdit: false })
    this.toggle()
  }

  // eslint-disable-next-line no-unused-vars
  handleTableChange = (type, { page, searchText }) => {
    const { orders } = this.props
    this.setState({
      orders: orders.filter(order =>
        Object.keys(order).some(
          key =>
            typeof order[key] === "string" &&
            order[key].toLowerCase().includes(searchText.toLowerCase())
        )
      ),
    })
  }

  /* Insert,Update Delete data */

  handleDeleteMachineType = async machineType => {
    const authHeaders = { Authorization: "Bearer " + getAccessToken() }
    await fetch(machineTypeURL + `/${machineType._id}`, {
      method: "DELETE",
      headers: authHeaders,
    })

    await this.fetchMachineTypes()
  }

  handleMachineTypeUpdate = arg => {
    const machineType = arg

    this.setState({
      machineTypeData: {
        oid: machineType._id,
        mc_type: machineType.mc_type,
      },
      isEdit: true,
    })

    this.toggle()
  }

  /**
   * Handling submit Order on Order form
   */
  handleValidMachineTypeSubmit = async (e, values) => {
    const { isEdit } = this.state

    if (isEdit) {
      await fetch(machineTypeURL + `/${values.oid}`, {
        method: "PUT",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getAccessToken(),
        },
      })
    } else {
      await fetch(machineTypeURL, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getAccessToken(),
        },
      })
    }
    await this.fetchMachineTypes()
    // this.setState({ selectedOrder: null })
    this.toggle()
  }

  handleValidDate = date =>
    moment(new Date(date)).format("YYYY-MM-DD HH:mm:ss A")

  render() {
    const { machineTypes } = this.state

    const { SearchBar } = Search

    const { isEdit } = this.state

    //pagination customization
    const pageOptions = {
      sizePerPage: 10,
      totalSize: machineTypes.length,
      custom: true,
    }

    const defaultSorted = [
      {
        dataField: "mc_type",
        order: "desc",
      },
    ]

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Machine Types | NYG Machine Type Dashboard</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Machine Type" breadcrumbItem="machine-type" />
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="_id"
                      columns={this.state.MachineTypeColumns}
                      data={machineTypes}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="_id"
                          data={machineTypes}
                          columns={this.state.MachineTypeColumns}
                          bootstrap4
                          search
                        >
                          {toolkitProps => (
                            <React.Fragment>
                              <Row className="mb-0">
                                <Col sm="4">
                                  <div className="search-box d-inline-block">
                                    <div className="position-relative">
                                      <SearchBar
                                        className="form-control"
                                        style={{ borderRadius: "0" }}
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
                                      onClick={this.handleOrderClicks}
                                    >
                                      <i className="mdi mdi-plus me-1" />
                                      Add Machine Type
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
                                  noDataIndication={() =>
                                    this.state.noDataMsg ? (
                                      this.state.noDataMsg
                                    ) : (
                                      <Spinner
                                        color="primary"
                                        className="text-center"
                                      />
                                    )
                                  }
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
                                    {!!isEdit
                                      ? "Edit Machine Type"
                                      : "Add Machine Type"}
                                  </ModalHeader>
                                  <ModalBody>
                                    <AvForm
                                      onValidSubmit={
                                        this.handleValidMachineTypeSubmit
                                      }
                                    >
                                      <Row form>
                                        <Col className="col-12">
                                          <div className="mb-3">
                                            <AvField
                                              name="oid"
                                              type="hidden"
                                              value={
                                                this.state.machineTypeData
                                                  .oid || ""
                                              }
                                            />
                                            <AvField
                                              name="mc_type"
                                              label="MC_TYPE"
                                              type="text"
                                              errorMessage="Invalid MC_TYPE"
                                              validate={{
                                                required: { value: true },
                                              }}
                                              value={
                                                this.state.machineTypeData
                                                  .mc_type || ""
                                              }
                                            />
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

export default withRouter(MachineType)
