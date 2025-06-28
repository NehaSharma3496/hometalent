import React from 'react'

export default function Modals() {
  return (
    <>

        {/* <main id="main-content">
            <div className="page-content">
                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#confirm-deletion">Confirm Deletion</button>
                <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleted-success">Delete Successfully</button>
                <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#proposal-saved">Proposal Saved</button>
            </div>
        </main> */}


        <div className="modal fade message-modal" id="confirm-deletion" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                    <div className="modal-body">
                        <h4 className="modal-msg-heading">Are You Sure?</h4>
                        <p className="modal-msg">This action cannot be undone.</p>
                        <div className="modal-btns">
                            <a className="modal-red-btn" href="#">Delete Quote</a>
                            <button className="modal-white-btn" data-bs-dismiss="modal" aria-label="Close">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="modal fade message-modal" id="deleted-success" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                    <div className="modal-body">
                        <h4 className="modal-msg-heading">deleted SUCCESSFULLY!</h4>
                        <p className="modal-msg">The selected quote has been deleted. You will be redirected to the Quotes screen.</p>
                        <div className="modal-btns">
                            <a className="modal-blue-btn" href="#">Go to Quotes</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="modal fade message-modal" id="proposal-saved" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                    <div className="modal-body">
                        <h4 className="modal-msg-heading">Proposal Saved</h4>
                        <p className="modal-msg">You may add more packages through “Quick Quotes” or finalize the order through the confirmation page</p>
                        <div className="modal-btns">
                            <a className="modal-blue-btn" href="#">Quick Quotes</a>
                            <a className="modal-white-btn" href="#">Quote Summary</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="modal fade message-modal" id="clients-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                    <div className="modal-body">
                        <h4 className="modal-msg-heading">Services</h4>
                        <div className="table-responsive mt-3">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>SR. No.</th>
                                        <th>User Name</th>
                                        <th>Full Name</th>
                                        <th>Email</th>
                                        <th>License Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>Lok@123</td>
                                        <td>Lokendra</td>
                                        <td>lokendra12@gmail.com</td>
                                        <td>Live</td>
                                    </tr>
                                    <tr>
                                        <td>1</td>
                                        <td>Lok@123</td>
                                        <td>Lokendra</td>
                                        <td>lokendra12@gmail.com</td>
                                        <td>Live</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}
