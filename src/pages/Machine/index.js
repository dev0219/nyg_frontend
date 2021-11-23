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

import { machineURL ,machineOrderURL} from "helpers/url_helper"
import { getAccessToken } from "helpers/auth_helper"

import BarcodeScannerComponent from "react-qr-barcode-scanner"

// Import All Static Options
const job_status_option = [
  { id: 1, value: "repair" },
  { id: 2, value: "complete" },
  { id: 3, value: "tranfering" },
  { id: 4, value: "return" },
  { id: 5, value: "store" },
  { id: 6, value: "pending" }
]
import {
  mc_group_option,
  mc_location_option,
  mc_status_option,
  mc_brand_option,
  mc_type_option,
  mc_dept_option
} from "../../helpers/static-options/index"

class Machines extends Component {
  constructor(props) {
    super(props)
    this.state = {
      viewmodal: false,
      modal: false,
      searchtext:'',
      machines: [],
      result:'',
      stopStream:false,
      machineData: {},
      machineDetails: {},
      MachineColumns: [
        {
          dataField: "mc_rfid",
          text: "MC_RFID",
          sort: true,
          formatter: (cellContent, row) => (
            <Link to="#" className="text-body fw-bold">
              {row.mc_rfid}
            </Link>
          ),
        },
        {
          dataField: "mc_sys_id",
          text: "MC_SYS_ID",
          sort: true,
        },
        {
          dataField: "ou_code",
          text: "OU_CODE",
          sort: true,
        },
        
        {
          dataField: "mc_location",
          text: "MC_LOCATION",
          sort: true,
        },
        {
          dataField: "mc_dept",
          text: "MC_DEPT",
          sort: true,
        },
        
        {
          dataField: "mc_group",
          text: "MC_GROUP",
          sort: true,
        },
        {
          dataField: "mc_type",
          text: "MC_TYPE",
          sort: true,
        },
        {
          dataField: "mc_brand",
          text: "MC_BRAND",
          sort: true,
        },
        {
          dataField: "mc_model",
          text: "MC_MODEL",
          sort: true,
        },
        {
          dataField: "mc_serial",
          text: "MC_SERIAL",
          sort: true,
        },
        
        {
          dataField: "mc_install_date",
          text: "MC_INSTALL_DATE",
          sort: true,
          formatter: (cellContent, row) =>
            this.handleValidDate(row.mc_install_date),
        },
        {
          dataField: "job_status",
          text: "JOB_STATUS",
          sort: false,
        },
        {
          dataField: "updatedAt",
          text: "Updated At",
          sort: true,
          formatter: (cellContent, row) => this.handleValidDate(row.updatedAt),
        },
        {
          dataField: "view",
          text: "View Details",
          sort: true,
          formatter: (cellContent, machine) => (
            <Button
              type="button"
              color="primary"
              className="btn-sm btn-rounded"
              onClick={() => this.toggleViewModal(machine)}
            >
              View Details
            </Button>
          ),
        },
        {
          dataField: "action",
          isDummyField: true,
          text: "Action",
          formatter: (cellContent, machine) => (
            <>
              <div className="d-flex gap-3">
                <Link to="#" className="text-success">
                  <i
                    className="mdi mdi-pencil font-size-18"
                    id="edittooltip"
                    onClick={() => this.handleMachineUpdate(machine)}
                  />
                </Link>
                <Link to="#" className="text-danger">
                  <i
                    className="mdi mdi-delete font-size-18"
                    id="deletetooltip"
                    onClick={() => this.handleDeleteMachine(machine)}
                  />
                </Link>
              </div>
            </>
          ),
        },
      ],
      mc_location: "",
      mc_status: "",
      job_status:"",
      selectedMachines: [],
      noDataMsg: null,
    }

    this.handleMachineUpdate = this.handleMachineUpdate.bind(this)
    this.toggle = this.toggle.bind(this)
    this.handleValidMachineSubmit = this.handleValidMachineSubmit.bind(this)
    this.handleOrderClicks = this.handleOrderClicks.bind(this)
    this.toLowerCase1 = this.toLowerCase1.bind(this)
  }

  toLowerCase1(str) {
    return str.toLowerCase()
  }

  async fetchMachines() {
    try {
      this.setState({ noDataMsg: null, machines: [] })
      const authHeaders = {
        Authorization: "Bearer " + getAccessToken(),
        "Content-Type": "application/json",
      }
      let request_body = {
        mc_location:
          this.state.mc_location == "0" ? null : this.state.mc_location,
        mc_status: this.state.mc_status == "0" ? null : this.state.mc_status,
      }
      request_body = JSON.stringify(request_body)
      var machines = await fetch(machineURL, {
        method: "POST",
        headers: authHeaders,
        body: request_body,
      })
      var orders = await fetch(machineOrderURL, { headers: authHeaders })
      orders = await orders.json()

      machines = await machines.json()
      
      for(var i=0;i<orders.data.length;i++) {
        for(var j=0;j<machines.data.length;j++) {
          if(orders.data[i].machines.includes(machines.data[j]['_id'])) {
            machines.data[j]['job_status'] = orders.data[i]['job_status'];
          }
        }
      }
      this.setState({
        machines: machines.data,
        noDataMsg: machines.data.length ? null : machines.message,
      })
    } catch (error) {
      console.error(error.message)
    }
  }

  async componentDidMount() {
    await this.fetchMachines()
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { orders } = this.props
    if (!isEmpty(orders) && size(prevProps.orders) !== size(orders)) {
      this.setState({ orders: {}, isEdit: false })
    }
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }))
  }

  handleOrderClicks = () => {
    this.setState({ orders: "", isEdit: false })
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

  toggleViewModal = async args => {
    await this.props.history.push({
      pathname: "/machine-details",
      state: args,
    })
  }

  newOrderMachines = async machines => {
    await this.props.history.push({
      pathname: "/new-order",
      state: machines,
    })
  }

  /* Insert,Update Delete data */

  handleDeleteMachine = async machine => {
    const authHeaders = { Authorization: "Bearer " + getAccessToken() }
    await fetch(machineURL + `/${machine._id}`, {
      method: "DELETE",
      headers: authHeaders,
    })

    await this.fetchMachines()
  }

  handleMachineUpdate = arg => {
    const machine = arg

    this.setState({
      machineData: {
        oid: machine._id,
        mc_rfid: machine.mc_rfid,
        mc_sys_id: machine.mc_sys_id,
        ou_code: machine.ou_code,
        mc_type: machine.mc_type,
        mc_location: machine.mc_location,
        mc_brand: machine.mc_brand,
        mc_model: machine.mc_model,
        mc_serial: machine.mc_serial,
        mc_install_date: new Date(machine.mc_install_date),
        mc_status: machine.mc_status,
        mc_group: machine.mc_group,
      },
      isEdit: true,
    })

    this.toggle()
  }

  /**
   * Handling submit Order on Order form
   */
  handleValidMachineSubmit = async (e, values) => {
    const { isEdit } = this.state

    const mc_brand = document.getElementById("mc_brand").value
    const mc_location = document.getElementById("mc_location").value
    const mc_dept = document.getElementById("mc_dept").value
    const mc_type = document.getElementById("mc_type").value
    const mc_status = document.getElementById("mc_status").value

    values.mc_brand = mc_brand
    values.mc_location = mc_location
    values.mc_dept = mc_dept
    values.mc_type = mc_type
    values.mc_status = mc_status

    if (isEdit) {
      await fetch(machineURL + `/${values.oid}`, {
        method: "PUT",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getAccessToken(),
        },
      })
    } else {
      await fetch(machineURL, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getAccessToken(),
        },
      })
    }
    await this.fetchMachines()
    this.setState({ selectedOrder: null })
    this.toggle()
  }

  handleValidDate = date => {
    const date1 = moment(new Date(date)).format("YYYY-MM-DD HH:MM:SS A")
    return date1
  }
  searchtab = search => {
     this.setState({searchtext:search})
//     var el = document.getElementById('search-bar-0');
// el.value=search
// el.dispatchEvent(new Event('change'));
    //  const e = new Event("change");
    //   const element = document.querySelector('#search-bar-0')
    //   element.dispatchEvent(e);
  // let aSelectElement = document.getElementById("search-bar-0");
  //  var  aBool = aSelectElement.autofocus; // Get the value of autofocus
  //   aSelectElement.autofocus = aBool; // Set the value of autofocus
  //   aSelectElement.click()
    // console.log("fdsdfsdfsf",)
  }
  unsearch = () => {
    this.setState({searchtext:''})
    // document.getElementById('search-bar-0').click()
 }
 
  handleRowSelection = ({ rowKey, checked }) => {
    if (checked) {
      if (this.state.selectedMachines.includes(rowKey)) return
      let machines = this.state.selectedMachines
      machines.push(rowKey)
      this.setState({
        ...this.state,
        selectedMachines: machines,
      })
    } else {
      let machines = this.state.selectedMachines
      if (machines.length >= 0) {
        let index = machines.indexOf(rowKey)
        if (index > -1) {
          machines = machines.filter(machine => machine != rowKey)
          this.setState({
            ...this.state,
            selectedMachines: machines,
          })
        }
      }
    }
  }

  render() {
    const { machines } = this.state

    const { SearchBar } = Search

    const { isEdit } = this.state

    //pagination customization
    const pageOptions = {
      sizePerPage: 10,
      totalSize: machines.length, // replace later with size(Order),
      custom: true,
    }

    const defaultSorted = [
      {
        dataField: "orderId",
        order: "desc",
      },
    ]

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Machines | NYG Machine Dashboard</title>
          </MetaTags>
          <Container fluid>
            <div>
              <BarcodeScannerComponent
                width={500}
                height={500}
                onUpdate={(err, result) => {
                  console.log(err)
                  console.log(result)
                  if (result) {this.searchtab(result.text)}
                  else{this.setState({ result: err.message });this.setState({searchtext:''})} 
                }}
                onError={err => {
                  console.log("this is result ",err)
                  this.setState({ result: err.message })
                }}
              />
              <p>{this.state.result}</p>
           
            </div>
            <Breadcrumbs title="Dashboard" breadcrumbItem="machine" />
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.MachineColumns}
                      data={machines}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="_id"
                          data={machines}
                          columns={this.state.MachineColumns}
                          bootstrap4
                          search
                        >
                          {toolkitProps => (
                            <React.Fragment>
                              <Row className="mb-0">
                                <Col sm="7">
                                  <Row>
                                    <Col sm="4">
                                      <div className="search-box d-inline-block">
                                        <div className="position-relative">
                                          <SearchBar
                                            className="form-control"
                                            style={{ borderRadius: "0" }}
                                            {...toolkitProps.searchProps}
                                            searchText={this.state.searchtext}   
                                            // onChange={console.log("lklklklk")}               
                                          />
                                          <i className="bx bx-search-alt search-icon" />
                                        </div>
                                      </div>
                                    </Col>
                                    <Col sm="4">
                                      <select
                                        name="filter_mc_location"
                                        id="filter_mc_location"
                                        className="form-control mb-2"
                                        onChange={async e => {
                                          await this.setState({
                                            ...this.state,
                                            mc_location: e.target.value,
                                          })
                                          this.fetchMachines()
                                        }}
                                      >
                                        <option value="0">
                                          Select MC LOCATION
                                        </option>
                                        {mc_location_option.map(item => {
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
                                    </Col>
                                    <Col sm="4">
                                      <select
                                        name="filter_mc_status"
                                        id="filter_mc_status"
                                        className="form-control mb-2"
                                        onChange={async e => {
                                          await this.setState({
                                            ...this.state,
                                            job_status: e.target.value,
                                          })
                                          this.fetchMachines()
                                        }}
                                      >
                                        <option value="0">
                                          Select JOB STATUS
                                        </option>
                                        {job_status_option.map(item => {
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
                                    </Col>
                                  </Row>
                                </Col>
                                <Col sm="5">
                                  <Row>
                                    <Col sm="6">
                                      <Button
                                        type="button"
                                        color="success"
                                        className="btn-rounded mb-2 me-2 form-control"
                                        onClick={() =>
                                          this.newOrderMachines(
                                            this.state.selectedMachines
                                          )
                                        }
                                      >
                                        <i className="mdi mdi-plus me-1" />
                                        Add Machine Order
                                      </Button>
                                    </Col>
                                    <Col sm="6">
                                      <Button
                                        type="button"
                                        color="success"
                                        className="btn-rounded mb-2 me-2 form-control"
                                        onClick={this.handleOrderClicks}
                                      >
                                        <i className="mdi mdi-plus me-1" />
                                        Add New Machine
                                      </Button>
                                    </Col>
                                  </Row>
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
                                  selectRow={{
                                    mode: "checkbox",
                                    clickToSelect: true,
                                    classes: "selection-row",
                                    bgColor: "#34c38f",
                                    selectionRenderer: row =>
                                      this.handleRowSelection(row),
                                  }}
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
                                    {!!isEdit ? "Edit Machine" : "Add Machine"}
                                  </ModalHeader>
                                  <ModalBody>
                                    <AvForm
                                      onValidSubmit={
                                        this.handleValidMachineSubmit
                                      }
                                    >
                                      <Row form>
                                        <Col className="col-12">
                                          <div className="mb-3">
                                            <AvField
                                              name="oid"
                                              type="hidden"
                                              value={
                                                this.state.machineData.oid || ""
                                              }
                                            />
                                            <AvField
                                              name="mc_rfid"
                                              label="MC_RFID"
                                              type="text"
                                              value={
                                                this.state.machineData
                                                  .mc_rfid || ""
                                              }
                                            />
                                          </div>
                                          <div className="mb-3">
                                            <AvField
                                              name="mc_sys_id"
                                              label="MC_SYS_ID"
                                              type="text"
                                              errorMessage="Invalid MC_SYS_ID"
                                              validate={{
                                                required: { value: true },
                                              }}
                                              value={
                                                this.state.machineData
                                                  .mc_sys_id || ""
                                              }
                                            />
                                          </div>
                                          <div className="mb-3">
                                            <AvField
                                              name="ou_code"
                                              label="OU_CODE"
                                              type="text"
                                              errorMessage="Invalid OU_CODE"
                                              validate={{
                                                required: { value: true },
                                              }}
                                              value={
                                                this.state.machineData
                                                  .ou_code || ""
                                              }
                                            />
                                          </div>
                                          <div className="mb-3">
                                            <label>MC_TYPE</label>
                                            <select
                                              name="mc_type"
                                              id="mc_type"
                                              className="form-control"
                                              defaultValue={
                                                this.state.machineData
                                                  .mc_type || "0"
                                              }
                                              required
                                            >
                                              <option value="0" disabled>
                                                Select MC TYPE
                                              </option>
                                              {mc_type_option.map(item => {
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
                                            <label>MC_DEPT</label>
                                            <select
                                              name="mc_dept"
                                              id="mc_dept"
                                              className="form-control"
                                              defaultValue={
                                                this.state.machineData
                                                  .mc_dept || "0"
                                              }
                                              required
                                            >
                                              <option value="0" disabled>
                                                Select MC DEPT
                                              </option>
                                              {mc_dept_option.map(item => {
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
                                            <label>MC_LOCATION</label>
                                            <select
                                              name="mc_location"
                                              id="mc_location"
                                              className="form-control"
                                              defaultValue={
                                                this.state.machineData
                                                  .mc_location || "0"
                                              }
                              
                                              required
                                            >
                                              <option value="0" disabled>
                                                Select MC Location
                                              </option>
                                              {mc_location_option.map(item => {
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
                                            <label>MC_BRAND</label>
                                            <select
                                              name="mc_brand"
                                              id="mc_brand"
                                              className="form-control"
                                              defaultValue={
                                                this.state.machineData
                                                  .mc_brand || "0"
                                              }
                                              required
                                            >
                                              <option value="0" disabled>
                                                Select MC BRAND
                                              </option>
                                              {mc_brand_option.map(item => {
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
                                            <label>MC_GROUP</label>
                                            <select
                                              name="mc_group"
                                              className="form-control"
                                              defaultValue={
                                                this.state.machineData
                                                  .mc_group || "0"
                                              }
                                              required
                                            >
                                              <option value="0" disabled>
                                                Select MC GROUP
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
                                          
                                          <div className="mb-3">
                                            <AvField
                                              name="mc_model"
                                              label="MC_MODEL"
                                              type="text"
                                              errorMessage="Invalid MC_MODEL"
                                              validate={{
                                                required: { value: true },
                                              }}
                                              value={
                                                this.state.machineData
                                                  .mc_model || ""
                                              }
                                            />
                                          </div>
                                          <div className="mb-3">
                                            <AvField
                                              name="mc_serial"
                                              label="MC_SERIAL"
                                              type="text"
                                              errorMessage="Invalid MC_SERIAL"
                                              validate={{
                                                required: { value: true },
                                              }}
                                              value={
                                                this.state.machineData
                                                  .mc_serial || ""
                                              }
                                            />
                                          </div>
                                          <div className="mb-3">
                                            <label>Action</label>
                                            <select
                                              name="mc_status"
                                              id="mc_status"
                                              className="form-control"
                                              defaultValue={
                                                this.state.machineData
                                                  .mc_status || "0"
                                              }
                                              required
                                            >
                                              <option value="0" disabled>
                                                Select MC GROUP
                                              </option>
                                              <option id="1" value="received">
                                                RECEIVED
                                              </option>
                                              <option id="2" value="sent">
                                                SENT
                                              </option>
                                              <option id="3" value="cancel">
                                                CANCEL
                                              </option>
                                            </select>
                                          </div>
                                          <div className="mb-3">
                                            <AvField
                                              name="mc_install_date"
                                              label="MC_INSTALL_DATE"
                                              type="datetime-local"
                                              errorMessage="Invalid MC_INSTALL_DATE"
                                              validate={{
                                                required: { value: true },
                                              }}
                                              value={
                                                this.state.machineData
                                                  .mc_install_date || ""
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

export default withRouter(Machines)
