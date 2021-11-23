import { getAccessToken } from "helpers/auth_helper"
import { machineOrderURL, machineURL, staffURL } from "helpers/url_helper"
import React, { Component } from "react"
import MetaTags from "react-meta-tags"
import { MultiSelect } from "react-multi-select-component";
import Breadcrumbs from "components/Common/Breadcrumb"
import { withRouter } from "react-router-dom"

// Import All Static Options
import {
  mc_group_option,
  mc_location_option,
  mc_status_option,
  mc_type_option,
  job_type_option,
  job_status1_option,
  job_statu2_option,
  job_status3_option,
  job_status4_option
} from "../../helpers/static-options/index"

import { Card, CardBody, Col, Container, Row, Table } from "reactstrap"

import { AvForm, AvField } from "availity-reactstrap-validation"
import { forIn, indexOf } from "lodash";

class MachineDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      staff_option: [],
      machines: [],
      mctype:[],
      formData: {
        machines: this.props.location.state,
      },
    }
    this.handleValidMachineOrderSubmit =
      this.handleValidMachineOrderSubmit.bind(this)

    this.handleFormDataChange = this.handleFormDataChange.bind(this)
  }

  handleValidMachineOrderSubmit = async (e, values) => {
    let { formData } = this.state
    
    
    var multiMCvalues = this.state.mctype;
    var newmctype = [];
    var qty = 0;
    if(multiMCvalues.length>0){
      for(var i=0;i<multiMCvalues.length;i++) {
        newmctype.push({type:multiMCvalues[i]['value'],qty:multiMCvalues[i]['qty']})
        qty = qty + parseInt(multiMCvalues[i]['qty'])
      }     
    }
    var jobstatus = ''
    if(formData.job_type == 'repair'){
      jobstatus = 'repair'
    }else if(formData.job_type == 'stockmove'){
      jobstatus = 'tranfering'
    }else if(formData.job_type == 'mc_order'){
      jobstatus = 'Available'
    }else{
      jobstatus = 'pending'
    }
    formData.job_status = jobstatus
    formData.mc_type = newmctype
    formData.order_date = values.order_date
    formData.qty = qty

    console.log("new create order", formData)
    let data = await fetch(machineOrderURL, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getAccessToken(),
      },
    })

    data = await data.json()

    if (!data.status) {
      console.log(data.message)
      alert(data.message)
    } else {
      console.log(data.message)
      await this.props.history.push("/machine")
    }
  }
  setSelected = (values) => {
    this.setState({mctype: values});  
    console.log("mc type setstatus value", this.state.mctype)
  }
  handleFormDataChange = async e => {
    this.setState({
      formData: {
        ...this.state.formData,
        [e.target.name]: e.target.value == "0" ? null : e.target.value,
      },
    })
  }
  handleChange (e,index) {
    console.log('handle change called', e.target.value,index)
    var selectoptarr = this.state.mctype;
    console.log('handle change called', selectoptarr);
    var item = selectoptarr[index];
    if (item) {
      try{
        let value = item;
        value.qty = e.target.value;
        selectoptarr[index] = value;
        this.setState({mctype:selectoptarr});
      } catch(err) {
        console.log(err);
      }
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

  async fetchMachineList() {
    try {
      const authHeaders = {
        Authorization: "Bearer " + getAccessToken(),
        "Content-Type": "application/json",
      }

      let data = await fetch(machineURL + "/machines", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ machines: this.props.location.state }),
      })
      data = await data.json()

      this.setState({
        machines: data.data,
      })
    } catch (err) {
      console.error(err)
    }
  }

  componentDidMount = async () => {
    await this.fetchStaffList()
    await this.fetchMachineList()
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>NYG Machine Order</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Machine" breadcrumbItem="Machine Order" />
            <Row>
              <Col sm={12}>
                <Card>
                  <AvForm onValidSubmit={this.handleValidMachineOrderSubmit}>
                    <Table className="table-responsive table align-middle">
                      <Row form>
                        <Col className="col-12">
                          <div className="mb-0">
                            <label>MC_GROUP</label>
                            <select
                              name="mc_group"
                              id="mc_group"
                              className="form-control"
                              onChange={this.handleFormDataChange}
                              required
                            >
                              <option value="0" selected>
                                Select MC Group
                              </option>
                              {mc_group_option.map(item => {
                                return (
                                  <option id={item.id} value={item.value}>
                                    {item.value}
                                  </option>
                                )
                              })}
                            </select>
                          </div>
                          <div className="mb-0">
                            <label>MC_TYPE</label>
                            <MultiSelect
                              options={mc_type_option}
                              value={this.state.mctype}
                              onChange={this.setSelected}
                              hasSelectAll={false}
                              ItemRenderer={({
                                checked,
                                option,
                                onClick,
                                disabled,
                              }) => (
                                <div className={`item-renderer ${disabled && "disabled"}`}>
                                  <input
                                    type="checkbox"
                                    onChange={onClick}
                                    checked={checked}
                                    tabIndex={-1}
                                    disabled={disabled}
                                  />
                                  <span>{option.label}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>,&nbsp;&nbsp;QTY &nbsp;:</span>&nbsp;<input  type="number" min="0" onChange={(e) => {this.handleChange(e,this.state.mctype.findIndex(x => x.label ===option.label))}} value={option.qty}/>
                                </div>
                              )}
                              labelledBy="Select"
                            />                            
                          </div>
                          <div className="mb-0">
                            <label>MC_LOCATION</label>
                            <select
                              name="mc_location"
                              id="mc_location"
                              className="form-control"
                              onChange={this.handleFormDataChange}
                              required
                            >
                              <option value="0" selected>
                                Select MC Location
                              </option>
                              {mc_location_option.map(item => {
                                return (
                                  <option id={item.id} value={item.value}>
                                    {item.value}
                                  </option>
                                )
                              })}
                            </select>
                          </div>
                          <div className="mb-0">
                            <label>REQUEST_BY</label>
                            <select
                              name="request_by"
                              id="request_by"
                              className="form-control"
                              onChange={this.handleFormDataChange}
                              required
                            >
                              <option value="0" selected>
                                Select Request By
                              </option>
                              {this.state.staff_option.map(item => {
                                return (
                                  <option id={item.id} value={item.id}>
                                    {item.value}
                                  </option>
                                )
                              })}
                            </select>
                          </div>
                          <div className="mb-0">
                            <label>APPROVE_BY</label>
                            <select
                              name="approve_by"
                              id="approve_by"
                              className="form-control"
                              onChange={this.handleFormDataChange}
                              required
                            >
                              <option value="0" selected>
                                Select Approve By
                              </option>
                              {this.state.staff_option.map(item => {
                                return (
                                  <option
                                    id={item.id}
                                    value={item.id}
                                    selected={item.sele}
                                  >
                                    {item.value}
                                  </option>
                                )
                              })}
                            </select>
                          </div>
                          <div className="mb-0">
                            <label>JOB_TYPE</label>
                            <select
                              name="job_type"
                              id="job_type"
                              className="form-control"
                              onChange={this.handleFormDataChange}
                              required
                            >
                              <option value="0" selected>
                                Select JOB Type
                              </option>
                              {job_type_option.map(item => {
                                return (
                                  <option id={item.id} value={item.value}>
                                    {item.value}
                                  </option>
                                )
                              })}
                            </select>
                          </div>
                          <div className="mb-0">
                            <AvField
                              name="order_date"
                              label="ORDER_DATE"
                              type="datetime-local"
                              errorMessage="Invalid ORDER_DATE"
                              validate={{
                                required: { value: true },
                              }}
                            />
                          </div>
                          {/* <div className="mb-0">
                            <AvField
                              name="qty"
                              label="QTY"
                              type="text"
                              errorMessage="Invalid ORDER_DATE"
                              validate={{
                                required: { value: true },
                              }}
                            />
                          </div> */}
                        </Col>
                      </Row>
                    </Table>
                    <Row>
                      <Col className="mb-0">
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
                                  {this.state.machines.map((machine, index) => (
                                    <tr>
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
                            <Row>
                              <Col className="mt-3">
                                <div className="text-end">
                                  <button
                                    type="submit"
                                    className="btn btn-danger"
                                    onClick={() =>
                                      this.props.history.push("/machine")
                                    }
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </Col>
                              <Col className="mt-3">
                                <div className="text-start">
                                  <button
                                    type="submit"
                                    className="btn btn-success"
                                  >
                                    Save
                                  </button>
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </AvForm>
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
