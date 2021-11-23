import React, { useEffect } from "react"
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
  } catch (error) {
    console.error(error.message)
  }
}

const MachineDetailsModal = props => {
  const { isOpen, toggle, machine } = props

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
        <ModalHeader toggle={toggle}>Machine Details</ModalHeader>
        <ModalBody>
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
                  <th>MC_GROUP</th>
                  <td>{machine.mc_group}</td>
                </tr>
                <tr>
                  <th>MC_TYPE</th>
                  <td>{machine.mc_type}</td>
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
                      "YYYY-MM-DD HH:SS A"
                    )}
                  </td>
                </tr>
                <tr>
                  <th>UPDATED BY</th>
                  <td>{machine.update_by}</td>
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
            // href={`/machine-details/${machine._id}`}
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
