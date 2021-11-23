import React, { Component } from "react"
import MetaTags from "react-meta-tags"
import { withRouter } from "react-router-dom"
import { MultiSelect } from "react-multi-select-component"
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
} from "reactstrap"

import { AvForm, AvField } from "availity-reactstrap-validation"

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb"
import { machineOrderURL, staffURL ,machineURL} from "helpers/url_helper"
import { getAccessToken } from "helpers/auth_helper"

// Import All Static Options
import {
  mc_group_option,
  mc_location_option,
  mc_status_option as order_status_option,
  mc_type_option,
  job_type_option,
  job_status1_option,
  job_status2_option,
  job_status3_option,
  job_status4_option,
} from "../../helpers/static-options/index"

class MachineOrders extends Component {
  constructor(props) {
    super(props)
    this.state = {
      viewmodal: false,
      isrole:'',
      modal: false,
      orders: [],
      machineoptions:[],
      seletedMachine:[],
      orderData: {},
      job_status_option:[],
      orderDetails: {},
      OrderColumns: [
        {
          dataField: "order_no",
          text: "ORDER_NO",
          sort: true,
          formatter: (cellContent, row) => (
            <Link to="#" className="text-body fw-bold">
              {row.order_no}
            </Link>
          ),
        },
        {
          dataField: "mc_group",
          text: "MC_GROUP",
          sort: true,
        },
        {
          dataField: "mct",
          text: "MC_TYPE",
          sort: true,
        },
        {
          dataField: "mc_location",
          text: "MC_LOCATION",
          sort: true,
        },
        {
          dataField: "request_by",
          text: "REQUEST_BY",
          sort: true,
          formatter: (cellContent, row) => row.request_by.staff_name,
        },
        {
          dataField: "approve_by",
          text: "APPROVE_BY",
          sort: true,
          formatter: (cellContent, row) => row.approve_by.staff_name,
        },
        {
          dataField: "qty",
          text: "QTY",
          sort: true,
        },
        {
          dataField: "job_type",
          text: "Job_Type",
          sort: true,
        },
        {
          dataField: "job_status",
          text: "JOB_STATUS",
          sort: true,
        },
        {
          dataField: "order_date",
          text: "ORDER_DATE",
          sort: true,
          formatter: (cellContent, row) => this.handleValidDate(row.order_date),
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
          formatter: (cellContent, order) => (
            <Button
              type="button"
              color="primary"
              className="btn-sm btn-rounded"
              onClick={() => this.toggleViewModal(order)}
            >
              View Details
            </Button>
          ),
        },
        {
          dataField: "action",
          isDummyField: true,
          text: "Action",
          formatter: (cellContent, order) => (
            <>
              <div className="d-flex gap-3">
                <Link to="#" className="text-success">
                  <i
                    className="mdi mdi-pencil font-size-18"
                    id="edittooltip"
                    onClick={() => this.handleMachineOrderUpdate(order)}
                  />
                </Link>
                <Link to="#" className="text-danger">
                  <i
                    className="mdi mdi-delete font-size-18"
                    id="deletetooltip"
                    onClick={() => this.handleDeleteMachine(order)}
                  />
                </Link>
              </div>
            </>
          ),
        },
      ],
      staff_option: [],
    }

    this.handleMachineOrderUpdate = this.handleMachineOrderUpdate.bind(this)
    this.toggle = this.toggle.bind(this)
    this.handleValidMachineOrderSubmit =
      this.handleValidMachineOrderSubmit.bind(this)
    this.handleOrderClicks = this.handleOrderClicks.bind(this)
    this.toLowerCase1 = this.toLowerCase1.bind(this)
  }

  toLowerCase1(str) {
    return str.toLowerCase()
  }

  async fetchMachineOrders() {
    try {
      const authHeaders = { Authorization: "Bearer " + getAccessToken() }
      var orders = await fetch(machineOrderURL, { headers: authHeaders })
      orders = await orders.json()
      
    
      if(orders.data.length){
        for(var i=0;i<orders.data.length;i++) {        
          orders.data[i]['mct'] = orders.data[i].mc_type.map(item => item.type)
        }
      }
      
      this.setState({ orders: orders.data })
    } catch (error) {
      console.error(error)
    }
  }

  async fetchStaffList() {
    try {
      const authHeaders = { Authorization: "Bearer " + getAccessToken() }

      let data = await fetch(staffURL, { headers: authHeaders })
      data = await data.json()

      let staff_option = await data.data.map(staff => ({
        id: staff._id,
        value: staff.staff_name,
      }))

      this.setState({
        staff_option: staff_option,
      })
    } catch (err) {
      console.error(err)
    }
  }

  async componentDidMount() {
    await this.fetchMachineOrders()
    await this.fetchStaffList()
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
    this.setState({ orders: [], isEdit: false })
    this.toggle()
  }
  setSelected = (values) => {
    let orderData = {...this.state.orderData};
    let mc_type = [...this.state.orderData.mc_type];
    mc_type = values;
    orderData.mc_type = mc_type;
    this.setState({orderData: orderData});    
  }
  setMachineSelected = (values) => {
    let orderData = {...this.state.orderData};
    let machineitem = [...this.state.orderData.machines];
    machineitem = values;
    orderData.machines = machineitem;
    this.setState({orderData: orderData});    
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
      pathname: "/machine-order-details",
      state: args,
    })
  }

  /* Insert,Update Delete data */

  handleDeleteMachine = async machine => {
    const authHeaders = { Authorization: "Bearer " + getAccessToken() }
    await fetch(machineOrderURL + `/${machine._id}`, {
      method: "DELETE",
      headers: authHeaders,
    })

    await this.fetchMachineOrders()
  }

  handleMachineOrderUpdate = async arg => {
    const order = arg
    const authHeaders = {
      Authorization: "Bearer " + getAccessToken(),
      "Content-Type": "application/json",
    }
    let request_body = {
      mc_location:
             order.mc_location == "0" ? null : order.mc_location,
      mc_status: null,
    }
    request_body = JSON.stringify(request_body)
    var machines = await fetch(machineURL, {
      method: "POST",
      headers: authHeaders,
      body: request_body,
    })
    machines = await machines.json()
    this.setState({isrole:sessionStorage.getItem("accessRole")});
   var optionmachine = [];
   var mcarr = machines.data;
   var machinesel = [];
   var ordermcarr = order.mc_type;
   if(order.job_type == 'repair'){
    this.setState({job_status_option:job_status1_option}) 
  }else if(order.job_type == 'stockmove'){
    this.setState({job_status_option:job_status2_option}) 
  }else if(order.job_type == 'mc_order'){
    this.setState({job_status_option:job_status3_option}) 
  }else{
    this.setState({job_status_option:job_status4_option}) 
  }
   if(ordermcarr.length > 0 && mcarr.length > 0){
     for(var i=0;i<ordermcarr.length;i++){
       for(var j=0;j<mcarr.length;j++){
         if(ordermcarr[i].type == mcarr[j]['mc_type']){
           optionmachine.push({label:mcarr[j]['mc_sys_id'],value:mcarr[j]['mc_sys_id']})
           machinesel.push(mcarr[j])
         }
       }
     }
   }   
    this.setState({seletedMachine:machinesel})
    this.setState({machineoptions:optionmachine})
    const mc_type_arr = [];
    console.log("mc type ordermcarr", ordermcarr)
    if(ordermcarr.length > 0) {
      for(var i=0;i<ordermcarr.length;i++) {
        mc_type_arr.push({label:ordermcarr[i].type,value:ordermcarr[i].type,qty:ordermcarr[i].qty})
      }
    }

    const machineitem = [];

    if(machinesel.length>0) {
      for(var m=0;m<machinesel.length;m++) {
        if(order.machines.includes(machinesel[m]['_id'])){
          machineitem.push({label:machinesel[m]['mc_sys_id'],value:machinesel[m]['mc_sys_id']})
        }
      }
    }
    console.log("mc type array", mc_type_arr)
    this.setState({
      orderData: {
        oid: order._id,
        machines:machineitem,
        order_no: order.order_no,
        mc_group: order.mc_group,
        mc_location: order.mc_location,
        request_by: order.request_by,
        approve_by: order.approve_by,
        order_status: order.order_status,
        mc_type: mc_type_arr,
        qty: order.qty,
        order_date: new Date(order.order_date),
      },
      isEdit: true,
    })
    this.toggle()
  }

  /**
   * Handling submit Order on Order form
   */
  handleValidMachineOrderSubmit = async (e, values) => {
    const { isEdit } = this.state
    const mcarray = this.state.orderData.machines;
    var SelMachineall = this.state.seletedMachine;
    const newSelmachine = [];
    if(this.state.isrole != "User"){
      
      var multiMCvaluesmc = this.state.orderData.machines

      if(multiMCvaluesmc.length > 0 && SelMachineall.length > 0) {
            for(var i=0;i<SelMachineall.length;i++) {
              for(var n=0;n<multiMCvaluesmc.length;n++) {
                if(multiMCvaluesmc[n]['value'] == SelMachineall[i]['mc_sys_id']){
                  newSelmachine.push(SelMachineall[i]['_id'])
                }
              }             
            }
      }
    }

    const mc_group = document.getElementById("mc_group").value
    
    var multiMCvalues = this.state.orderData.mc_type;
    const mc_type = [];
    var qty = 0;
    if(multiMCvalues.length>0){
      for (var j=0;j<multiMCvalues.length;j++) {
        mc_type.push({type:multiMCvalues[j]['value'],qty:multiMCvalues[j]['qty']})
        qty = qty + parseInt(multiMCvalues[j]['qty'])
      }
    }
    const mc_location = document.getElementById("mc_location").value
    const request_by = document.getElementById("request_by").value
    const approve_by = document.getElementById("approve_by").value
    var job_status = this.state.orderData.job_status;
    if(this.state.isrole != 'Technicians'){
     job_status = document.getElementById("job_status").value
    }
    

    values.mc_group = mc_group
    values.machines = newSelmachine
    values.mc_type = mc_type
    values.qty = qty
    values.mc_location = mc_location
    values.request_by = request_by
    values.approve_by = approve_by
    values.job_status = job_status
    if (isEdit) {
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
    }
    await this.fetchMachineOrders()
    this.setState({ selectedOrder: null })
    this.toggle()
  }
  
  handleValidDate = date => {
    const date1 = moment(new Date(date)).format("YYYY-MM-DD HH:MM:SS A")
    return date1
  }
  handleChange (e,index) {
    e.preventDefault();
    var selectoptarr = this.state.orderData.mc_type;
    var item = selectoptarr[index];
    if (item) {
      try{
        let value = item;
        value.qty = e.target.value;
        selectoptarr[index] = value;

        let orderdata = this.state.orderData;
        orderdata.mc_type = selectoptarr
        this.setState({orderData:orderdata});
      } catch(err) {
        console.log(err);
      }
    }

  }
  render() {
    const { orders } = this.state

    const { SearchBar } = Search

    const { isEdit } = this.state

    //pagination customization
    const pageOptions = {
      sizePerPage: 10,
      totalSize: orders.length, // replace later with size(Order),
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
            <title>Machine Orders | NYG Machine Orders Dashboard</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Dashboard" breadcrumbItem="machine-orders" />
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.OrderColumns}
                      data={orders}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="_id"
                          data={orders}
                          columns={this.state.OrderColumns}
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
                                    <Link to="/machine">
                                      <Button
                                        type="button"
                                        color="success"
                                        className="btn-rounded mb-2 me-2"
                                        // onClick={this.handleOrderClicks}
                                      >
                                        <i className="mdi mdi-plus me-1" />
                                        Add New Order
                                      </Button>
                                    </Link>
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
                                            <AvField
                                              name="oid"
                                              type="hidden"
                                              value={
                                                this.state.orderData.oid || ""
                                              }
                                            />
                                            {!!isEdit ? (
                                              <AvField
                                                name="order_no"
                                                type="hidden"
                                                value={
                                                  this.state.orderData
                                                    .order_no || ""
                                                }
                                              />
                                            ) : (
                                              ""
                                            )}
                                          </div>
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
                                                Select MC Group
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
                                            <label>MC_TYPE</label>
                                            <MultiSelect
                                              options={mc_type_option}
                                              value={this.state.orderData.mc_type}
                                              onChange={this.setSelected}
                                              hasSelectAll={false}
                                              ItemRenderer={({
                                                checked,
                                                option,
                                                onClick,
                                                disabled,
                                              }) => {
                                                let qty = option.qty;
                                                let mc_type = this.state.orderData.mc_type;
                                                if (checked) {
                                                  for (let i = 0; i < mc_type.length; i++) {
                                                    const element = mc_type[i];
                                                    if (element.label === option.label) {
                                                      qty = element.qty;
                                                    }
                                                  }
                                                }
                                                return (
                                                  <div className={`item-renderer ${disabled && "disabled"}`}>
                                                    <input
                                                      type="checkbox"
                                                      onChange={onClick}
                                                      checked={checked}
                                                      tabIndex={-1}
                                                      disabled={disabled}
                                                    />
                                                    <span>{option.label}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>,&nbsp;&nbsp;QTY&nbsp;:</span>&nbsp;<input  type="number" min="0" onChange={(e) => {this.handleChange(e,this.state.orderData.mc_type.findIndex(x => x.label === option.label))}}  value={qty}/>
                                                  </div>
                                                )
                                              }}
                                              labelledBy="Select"
                                            />
                                          </div>
                                          <div className="mb-3">
                                            <label>MC_LOCATION</label>
                                            <select
                                              name="mc_location"
                                              id="mc_location"
                                              className="form-control"
                                              defaultValue={
                                                this.state.orderData
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
                                            <label>REQUEST_BY</label>
                                            <select
                                              name="request_by"
                                              id="request_by"
                                              className="form-control"
                                              defaultValue={
                                                this.state.orderData
                                                  .request_by || "0"
                                              }
                                              required
                                            >
                                              <option value="0" disabled>
                                                Select Request By
                                              </option>
                                              {this.state.staff_option.map(
                                                item => {
                                                  return (
                                                    <option
                                                      id={item.id}
                                                      value={item.id}
                                                    >
                                                      {item.value}
                                                    </option>
                                                  )
                                                }
                                              )}
                                            </select>
                                          </div>
                                          <div className="mb-3">
                                            <label>APPROVE_BY</label>
                                            <select
                                              name="approve_by"
                                              id="approve_by"
                                              className="form-control"
                                              defaultValue={
                                                this.state.orderData
                                                  .approve_by || "0"
                                              }
                                              required
                                            >
                                              <option value="0" disabled>
                                                Select Approve By
                                              </option>
                                              {this.state.staff_option.map(
                                                item => {
                                                  return (
                                                    <option
                                                      id={item.id}
                                                      value={item.id}
                                                    >
                                                      {item.value}
                                                    </option>
                                                  )
                                                }
                                              )}
                                            </select>
                                          </div>
                                          {this.state.isrole != 'Technicians'?(
                                            <div className="mb-3">
                                            <label>JOB_STATUS</label>
                                            <select
                                              name="job_status"
                                              id="job_status"
                                              className="form-control"
                                              defaultValue={
                                                this.state.orderData
                                                  .job_status
                                              }
                                              required
                                            >
                                              <option value="0" disabled>
                                                Select Job Status
                                              </option>
                                              {this.state.job_status_option.map(item => {
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
                                          ):(<div></div>)}
                                          
                                          <div className="mb-3">
                                            <AvField
                                              name="order_date"
                                              label="ORDER_DATE"
                                              type="datetime-local"
                                              errorMessage="Invalid ORDER_DATE"
                                              validate={{
                                                required: { value: true },
                                              }}
                                              value={
                                                this.state.orderData
                                                  .order_date || ""
                                              }
                                            />
                                          </div>
                                          <div className="mb-3">
                                            <AvField
                                              name="qty"
                                              label="QTY"
                                              type="text"
                                              disabled={true}
                                              errorMessage="Invalid QTY"
                                              validate={{
                                                required: { value: true },
                                              }}
                                              value={
                                                this.state.orderData
                                                  .qty || ""
                                              }
                                            />
                                          </div>
                                        {this.state.isrole == 'Technicians'?(
                                          <div className="mb-3">
                                          <label>Multi Machine</label>
                                          <MultiSelect
                                              options={this.state.machineoptions}
                                              value={this.state.orderData.machines}
                                              onChange={this.setMachineSelected}
                                              labelledBy="Select"
                                          />
                                          {/* <select
                                            name="machine"
                                            id="machine"
                                            className="form-control"
                                            required
                                            multiple
                                          >
                                            {this.state.machineoptions.map(
                                              item => {
                                                return (
                                                  <option
                                                    id={item.id}
                                                    value={item.id}
                                                  >
                                                    {item.value}
                                                  </option>
                                                )
                                              }
                                            )}
                                          </select> */}
                                        </div>
                                        ):(<div></div>)}
                                          
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

export default withRouter(MachineOrders)
