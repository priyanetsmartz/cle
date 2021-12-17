import { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import DataTable from 'react-data-table-component';

function MySalesOrders(props) {
    useEffect(() => {
    }, [])

    const columns = [
        {
            name: 'Order number',
            selector: row => row.ordernumber,
            sortable: true,
        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.status,
        },
        {
            name: 'Total',
            selector: row => row.total,
        },
    ];
    const data = [
        {
            id: 1,
            ordernumber: 1001,
            date: '05 july 2021',
            status: 1,
            total: 20000
        },
        {
            id: 2,
            ordernumber: 1002,
            date: '06 july 2021',
            status: 1,
            total: 20000
        },
        {
            id: 3,
            ordernumber: 1003,
            date: '07 july 2021',
            status: 1,
            total: 20000
        }
    ]

    const handleChange = ({ selectedRows }) => {
        console.log('Selected Rows: ', selectedRows);
    };

    return (
        <div className="col-sm-9">
            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1>My Sales and Order</h1>
                            <p>You can manage your customer's orders here. Execute and ship orders.<br/>Below is the list of sold products.</p>
                        </div>
                    </div>
                </div>
          
                <DataTable
                    columns={columns}
                    data={data}
                    selectableRows
                    onSelectedRowsChange={handleChange}
                />
            </section>
        </div>

    )
}
const mapStateToProps = (state) => {
    return {
        items: state.Cart.items
    }
}

export default connect(
    mapStateToProps
)(MySalesOrders);