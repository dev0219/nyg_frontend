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

import { machineBrandURL } from "helpers/url_helper"
import { getAccessToken } from "helpers/auth_helper"

class MachineBrand extends Component {
  constructor(props) {
    super(props)
    this.state = {
      viewmodal: false,
      modal: false,
      machineBrands: [],
      machineBrandData: {},
      MachineBrandColumns: [
        {
          dataField: "mc_brand",
          text: "MC_BRAND",
          sort: true,
          formatter: (cellContent, row) => (
            <Link to="#" className="text-body fw-bold">
              {row.mc_brand}
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
                    onClick={() => this.handleMachineBrandUpdate(row)}
                  />
                </Link>
                <Link to="#" className="text-danger">
                  <i
                    className="mdi mdi-delete font-size-18"
                    id="deletetooltip"
                    onClick={() => this.handleDeleteMachineBrand(row)}
                  />
                </Link>
              </div>
            </>
          ),
        },
      ],
      noDataMsg: null,
    }

    this.handleMachineBrandUpdate = this.handleMachineBrandUpdate.bind(this)
    this.toggle = this.toggle.bind(this)
    this.handleOrderClicks = this.handleOrderClicks.bind(this)
    this.handleValidMachineTypeSubmit =
      this.handleValidMachineTypeSubmit.bind(this)
    this.toLowerCase1 = this.toLowerCase1.bind(this)
  }

  toLowerCase1(str) {
    return str.toLowerCase()
  }

  async fetchMachineBrands() {
    try {
      this.setState({ noDataMsg: null, machineBrands: [] })
      const authHeaders = {
        Authorization: "Bearer " + getAccessToken(),
      }

      var machineBrands = await fetch(machineBrandURL, {
        method: "GET",
        headers: authHeaders,
      })
      machineBrands = await machineBrands.json()

      this.setState({
        machineBrands: machineBrands.data,
        noDataMsg: machineBrands.data.length ? null : machineBrands.message,
      })
    } catch (error) {
      console.error(error.message)
    }
  }

  async componentDidMount() {
    await this.fetchMachineBrands()
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    // const { machineBrands } = this.props
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
    this.setState({ machineBrands: [], isEdit: false })
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

  handleDeleteMachineBrand = async machineBrand => {
    const authHeaders = { Authorization: "Bearer " + getAccessToken() }
    await fetch(machineBrandURL + `/${machineBrand._id}`, {
      method: "DELETE",
      headers: authHeaders,
    })

    await this.fetchMachineBrands()
  }

  handleMachineBrandUpdate = arg => {
    const machineBrand = arg

    this.setState({
      machineBrandData: {
        oid: machineBrand._id,
        mc_brand: machineBrand.mc_brand,
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
      await fetch(machineBrandURL + `/${values.oid}`, {
        method: "PUT",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getAccessToken(),
        },
      })
    } else {
      await fetch(machineBrandURL, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getAccessToken(),
        },
      })
    }
    await this.fetchMachineBrands()
    // this.setState({ selectedOrder: null })
    this.toggle()
  }

  handleValidDate = date =>
    moment(new Date(date)).format("YYYY-MM-DD HH:mm:ss A")

  render() {
    const { machineBrands } = this.state

    const { SearchBar } = Search

    const { isEdit } = this.state

    //pagination customization
    const pageOptions = {
      sizePerPage: 10,
      totalSize: machineBrands.length,
      custom: true,
    }

    const defaultSorted = [
      {
        dataField: "mc_brand",
        order: "desc",
      },
    ]

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Machine Brands | NYG Machine Brand Dashboard</title>
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
                      columns={this.state.MachineBrandColumns}
                      data={machineBrands}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="_id"
                          data={machineBrands}
                          columns={this.state.MachineBrandColumns}
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
                                      Add Machine Brand
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
                                                this.state.machineBrandData
                                                  .oid || ""
                                              }
                                            />
                                            <AvField
                                              name="mc_brand"
                                              label="MC_BRAND"
                                              type="text"
                                              errorMessage="Invalid MC_BRAND"
                                              validate={{
                                                required: { value: true },
                                              }}
                                              value={
                                                this.state.machineBrandData
                                                  .mc_brand || ""
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

export default withRouter(MachineBrand)
