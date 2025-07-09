import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import {GetSponsoredVendors } from '../../../Services/admin/Admin'
import Datatable from '../../../extracomponents/Datatable';

export default function SponsoredVendors() {

const [sponsoredvendors, setSponsoredvendors] = React.useState([])

const fetchVendors = async()=>
{
    try{
        const response= await GetSponsoredVendors();
        setSponsoredvendors(response.data)
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
            name: "Sr.No.",
            selector: (row) => row.id,
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
    selector: (row) => Array.isArray(row.category_names) 
        ? row.category_names.join(", ") 
        : row.category_names,
    sortable: true,
},

        {
            name: "Profile Name",
            selector: (row) => row.profile_name,
            sortable: true,
        },
        {
            name: "Phone Number",
            selector: (row) => row.phone,
            sortable: true,
        },
        {
            name: "Price Range",
            selector: (row) => row.price_range,
            sortable: true,
        },
        {
            name: "Short Description",
            selector: (row) => row.short_description,
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
            name: "Social Media Link",
            selector: (row) => row.social_media_link,
            sortable: true,
        },
        {
            name: "Pin Code",
            selector: (row) => row.tradingstatus,
            sortable: true,
        },
        {
            name: "Experience Since",
            selector: (row) => row.experience_since,
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
                        <h2 className="add-page-heading">Sponsored Vendors
</h2>
                    </div>
                </div>
                <div className="col-md-6 text-end">
                    <Link to="/addclient" className="add-btn-head">+ Add User</Link>
                </div>
            </div>
<div className='card'>
       

            <div className="row">
                <div className="col-md-12">

                    <Datatable
                        columns={columns}
                        data={sponsoredvendors}
                        pagination
                    />
                </div>
            </div>
                
        </div>
        </div>
    
  )
}
