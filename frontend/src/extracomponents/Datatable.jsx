import React from 'react'
import DataTable from 'react-data-table-component';

const Datatable = ({ columns, data }) => {
  return (
    <div>   
           <div className="table-responsive">
            <DataTable
               columns={columns}
                data={data}
                pagination
                searchable
                fixedHeader
                // paginationPerPage={paginationPerPage}
                // paginationPage={paginationPage}
                // onChangePage={handlePageChange}
                highlightOnHover
                striped
                // customStyles={customStyles}
                responsive={true}
                paginationComponentOptions={{ rowsPerPageText: '', noRowsPerPage: true }}
            />
        </div></div>
  )
}

export default Datatable