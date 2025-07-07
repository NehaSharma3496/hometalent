import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import {GetVendoreList } from '../../../Services/admin/Admin'
import Datatable from '../../../extracomponents/Datatable';

export default function Allvendors() {

const [vendors, setVendors] = React.useState([])

const fetchVendors = async()=>
{
    try{
        const response= await GetVendoreList();
        setVendors(response.data)
        console.log("Vendor list", response.data)
    }
    catch(error)
    {
  console.log("error")
    }
}
useEffect(() => {
fetchVendors();
}, [])


    const columns = [
        {
            name: "SR.NO.",
            selector: (row) => row.sno,
            sortable: true,
        },
        {
            name: "Owner Name",
            selector: (row) => row.owner_name,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: "Category Names",
            selector: (row) => row.category_names,
            sortable: true,
        },
        {
            name: "Profile Name",
            selector: (row) => row.profile_name,
            sortable: true,
        },
        {
            name: "Phone Number",
            selector: (row) => row.phonenumber,
            sortable: true,
        },
        {
            name: "Broker",
            selector: (row) => row.broker,
            sortable: true,
        },
        {
            name: "Month",
            selector: (row) => row.month,
            sortable: true,
        },
        {
            name: "Status",
            cell: (row) => (
                <span className="switch">
                    <input id={`switch-${row.sno}`} type="checkbox" />
                    <label for={`switch-${row.sno}`}></label>
                </span>
            ),
            sortable: false,
        },
        {
            name: "Go To Dashboard",
            selector: (row) => row.gotodashboard,
            sortable: true,
        },
        {
            name: "Trading Status",
            selector: (row) => row.tradingstatus,
            sortable: true,
        },
        {
            name: "Create Date",
            selector: (row) => row.createdate,
            sortable: true,
        },
        {
            name: "Start Date",
            selector: (row) => row.startdate,
            sortable: true,
        },
        {
            name: "End Date",
            selector: (row) => row.enddate,
            sortable: true,
        },
        {
            name: "Actions",
            selector: (row) => row.action,
            cell: (row) => (
                <div className="action-div">
                    <a title="Edit" href="#">
                        <i className="fa-regular fa-pen-line"></i>
                    </a>
                    <a title="Delete" href="#">
                        <i className="fa-solid fa-trash-can"></i>
                    </a>
                    <a title="Trading Status" href="#" className="trading-status-download">
                        <i className="fa-solid fa-arrow-down-to-bracket"></i>
                    </a>
                    <a title="Broker Response" href="#" className="broker-response-download">
                        <i className="fa-solid fa-arrow-down-to-bracket"></i>
                    </a>
                    <a title="Trading Status" href="#">
                        <i className="fa-regular fa-star"></i>
                    </a>
                </div>
            ),
            sortable: false,
        }
    ];


  
    

  return (
   
        <div className="page-content">

            <div className="row align-items-center mb-3">
                <div className="col-md-6">
                    <div className="add-page-heading-div">
                        <Link to="/"><i className="fa-sharp fa-regular fa-arrow-left"></i></Link>
                        <h2 className="add-page-heading">All Vendor</h2>
                    </div>
                </div>
                <div className="col-md-6 text-end">
                    <Link to="/addclient" className="add-btn-head">+ Add User</Link>
                </div>
            </div>
<div className='card'>
            <div className="row filter-forms ">
                <div className="col-lg-2">
                    <div className="form-row">
                        <input className="form-input" type="text" placeholder="Search Something Here" />
                    </div>
                </div>
                {/* <div className="col-lg-2">
                    <div className="form-row">
                        <select className="form-input">
                            <option>Client Type</option>
                            <option value="null">All</option>
                            <option value="2">Live</option>
                            <option value="1">Demo</option>
                            <option value="0">2 Days Only</option>
                        </select>
                    </div>
                </div>
                <div className="col-lg-2">
                    <div className="form-row">
                        <select className="form-input">
                            <option>Trading Type</option>
                            <option value="2">All</option>
                            <option value="1">On</option>
                            <option value="0">OFf</option>
                        </select>
                    </div>
                </div>
                <div className="col-lg-2">
                    <div className="form-row">
                        <select className="form-input">
                            <option>Broker Type</option>
                            <option value="null">All</option>
                            <option value="2">Alice Blue</option>
                            <option value="5">Zebull</option>
                            <option value="15">Zerodha </option>
                            <option value="14">5 Paisa</option>
                            <option value="1">Market Hub </option>
                            <option value="12">Angel</option>
                            <option value="3">Master Trust</option>
                            <option value="13">Fyers </option>
                            <option value="8">Mandot</option>
                            <option value="4">Motilal Oswal</option>
                            <option value="7">Kotak Neo</option>
                            <option value="19">Upstox</option>
                            <option value="20">Dhan</option>
                            <option value="21">Swastika</option>
                            <option value="25">icicidirect</option>
                            <option value="26">Iifl</option>
                            <option value="27">shoonya</option>
                        </select>
                    </div>
                </div> */}
                {/* <div className="col-lg-2">
                    <div className="form-row">
                    <select className="form-input">
                        <option>Strategies</option>
                        <option value="all">All</option>
                        <option value="653ce47a0e6b4cc95f9c6776">jhgsa</option>
                        <option value="666c2c656d9429e2972bf8a2">Price Action</option>
                        <option value="666c2c796d9429e2972bf8a7">Moving Average</option>
                        <option value="666c2c916d9429e2972bf8ac">RSI Base</option>
                        <option value="666c2ca86d9429e2972bf8cd">Test4</option>
                        <option value="6685429d79916530293aa27c">New</option>
                        <option value="66b1ea8da558b36a2d6b7d83">sss</option>
                        <option value="6718c95813eb9581938bcb85">New Test</option>
                        <option value="6718c96f13eb9581938bccae">New Test 1</option>
                        <option value="67458b16c478425d91e3a946">phoenix</option>
                        <option value="675427bb466c742aa59ca4bf">TEST05</option>
                        <option value="675fcde8c1b5a6ab5f2298da">Tesrt01</option>
                    </select>
                    </div>
                </div> */}
                {/* <div className="col-lg-2">
                    <button type="button" className="filter-reset-btn" title="Export To Excel"><i className="fa fa-download" aria-hidden="true"></i> Export Excel</button>
                </div> */}
            </div>

            <div className="row">
                <div className="col-md-12">

                    <Datatable
                        columns={columns}
                        data={vendors}
                        pagination
                    />
                </div>
            </div>
                
        </div>
        </div>
    
  )
}
