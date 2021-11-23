import React from "react"
import PropTypes from "prop-types"
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
} from "reactstrap"

import { withRouter } from "react-router-dom"
import moment from "moment"

function viewMoreDetails(props) {
  try {
    // alert("funcitonal component", props)
  } catch (error) {
    console.error(error.message)
  }
}

const MachineDetailsModal = props => {
  const { isOpen, toggle, order } = props

  console.log(props)

  return (
    <Modal
      isOpen={isOpen}
      role="dialog"
      autoFocus={true}
      centered={true}
      className="exampleModal"
      tabIndex="-1"
      toggle={toggle}
    >
      <div className="modal-content">
        <ModalHeader toggle={toggle}>Machine Order Details</ModalHeader>
        <ModalBody>
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
                  <td>{order.order_date}</td>
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
                  <td>{order.request_by.staff_name}</td>
                </tr>
                <tr>
                  <th>APPROVE_BY</th>
                  <td>{order.approve_by.staff_name}</td>
                </tr>
                <tr>
                  <th>UPDATED AT</th>
                  <td>
                    {moment(machine.updatedAt).format("YYYY-MM-DD HH:SS A")}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button type="button" color="secondary" onClick={toggle}>
            Close
          </Button>
          <Button
            type="button"
            color="primary"
            onClick={viewMoreDetails(machine._id)}
          >
            View More
          </Button>
          <a
            className="btn btn-primary"
            onClick={(toggle, viewMoreDetails(machine._id))}
          >
            View More
          </a>
        </ModalFooter>
      </div>
    </Modal>
  )
}

MachineDetailsModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  viewMoreDetails: PropTypes.func,
}

export default withRouter(MachineDetailsModal)
