import { useState, useEffect } from 'react';
import { connect } from 'react-redux'

import {
    LineChart,
    ResponsiveContainer,
    Legend, Tooltip,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    PieChart,
    Pie,
    BarChart,
    Bar
} from 'recharts';

function MyAnalysis(props) {
    useEffect(() => {
    }, [])


    const pdata = [
        {
            "item_qty": 1,
            "created_at": "2021-09-16 06:31:33",
            "total_cost": "2850.0000"
        },
        {
            "item_qty": 1,
            "created_at": "2021-09-16 08:33:20",
            "total_cost": "2850.0000"
        },
        {
            "item_qty": 1,
            "created_at": "2021-09-16 08:35:30",
            "total_cost": "2850.0000"
        },
        {
            "item_qty": 1,
            "created_at": "2021-09-16 08:44:43",
            "total_cost": "2850.0000"
        },
        {
            "item_qty": 1,
            "created_at": "2021-09-16 08:45:51",
            "total_cost": "2850.0000"
        },
        {
            "item_qty": 4,
            "created_at": "2021-10-01 07:21:53",
            "total_cost": "11400.0000"
        },
        {
            "item_qty": 1,
            "created_at": "2021-10-04 13:16:59",
            "total_cost": "2850.0000"
        },
        {
            "item_qty": 1,
            "created_at": "2021-10-04 14:25:19",
            "total_cost": "2850.0000"
        },
        {
            "item_qty": 1,
            "created_at": "2021-10-04 14:30:45",
            "total_cost": "2850.0000"
        },
        {
            "item_qty": 5,
            "created_at": "2021-10-05 04:56:29",
            "total_cost": "13350.0000"
        },
        {
            "item_qty": 20,
            "created_at": "2021-10-05 06:04:21",
            "total_cost": "2850.0000"
        },
        {
            "item_qty": 1,
            "created_at": "2021-10-19 10:58:53",
            "total_cost": "2850.0000"
        },
        {
            "item_qty": 1,
            "created_at": "2021-10-19 11:55:03",
            "total_cost": "2850.0000"
        },
        {
            "item_qty": 2,
            "created_at": "2021-10-21 04:45:03",
            "total_cost": "5700.0000"
        },
        {
            "item_qty": 1,
            "created_at": "2021-10-21 04:51:40",
            "total_cost": "2850.0000"
        },
        {
            "item_qty": 1,
            "created_at": "2021-10-29 17:18:23",
            "total_cost": "2850.0000"
        },
        {
            "item_qty": 1,
            "created_at": "2021-12-15 12:15:04",
            "total_cost": "2850.0000"
        },
        {
            "item_qty": 2,
            "created_at": "2021-12-15 14:06:53",
            "total_cost": "1661.2000"
        },
        {
            "item_qty": 1,
            "created_at": "2021-12-15 20:03:50",
            "total_cost": "791.0500"
        },
        {
            "item_qty": 1,
            "created_at": "2021-12-15 20:05:51",
            "total_cost": "189.8600"
        },
        {
            "item_qty": 1,
            "created_at": "2021-12-23 04:43:10",
            "total_cost": "158.2100"
        },
        {
            "item_qty": 2,
            "created_at": "2021-12-23 04:46:34",
            "total_cost": "348.0700"
        },
        {
            "item_qty": 1,
            "created_at": "2021-12-23 11:40:13",
            "total_cost": "0.0000"
        },
        {
            "item_qty": 2,
            "created_at": "2021-12-24 07:16:43",
            "total_cost": "70.0000"
        },
        {
            "item_qty": 1,
            "created_at": "2021-12-28 11:33:15",
            "total_cost": "791.0500"
        },
        {
            "item_qty": 2,
            "created_at": "2021-12-28 12:32:11",
            "total_cost": "1740.3000"
        },
        {
            "item_qty": 2,
            "created_at": "2021-12-29 13:01:07",
            "total_cost": "1740.3000"
        },
        {
            "item_qty": 1,
            "created_at": "2021-12-29 13:26:45",
            "total_cost": "870.1500"
        },
        {
            "item_qty": 1,
            "created_at": "2021-12-30 05:30:25",
            "total_cost": "870.1500"
        },
        {
            "item_qty": 1,
            "created_at": "2021-12-30 07:28:16",
            "total_cost": "870.1500"
        },
        {
            "item_qty": "13.0000",
            "created_at": "2022-01-04 09:15:18",
            "total_cost": "11311.9500"
        },
        {
            "item_qty": 1,
            "created_at": "2022-01-04 14:13:38",
            "total_cost": "870.1500"
        },
        {
            "item_qty": 3,
            "created_at": "2022-01-05 07:44:22",
            "total_cost": "1930.1600"
        },
        {
            "item_qty": 1,
            "created_at": "2022-01-05 10:26:07",
            "total_cost": "189.8600"
        },
        {
            "item_qty": 1,
            "created_at": "2022-01-05 12:10:34",
            "total_cost": "870.1500"
        },
        {
            "item_qty": 1,
            "created_at": "2022-01-05 12:18:23",
            "total_cost": "870.1500"
        },
        {
            "item_qty": 1,
            "created_at": "2022-01-05 12:36:37",
            "total_cost": "870.1500"
        },
        {
            "item_qty": 2,
            "created_at": "2022-01-05 13:01:06",
            "total_cost": "1060.0100"
        },
        {
            "item_qty": 1,
            "created_at": "2022-01-05 13:03:28",
            "total_cost": "870.1500"
        },
        {
            "item_qty": 1,
            "created_at": "2022-01-05 13:06:40",
            "total_cost": "791.0500"
        },
        {
            "item_qty": 3,
            "created_at": "2022-01-05 13:38:21",
            "total_cost": "2610.4500"
        },
        {
            "item_qty": "5.0000",
            "created_at": "2022-01-07 05:49:43",
            "total_cost": "3903.9000"
        },
        {
            "item_qty": 2,
            "created_at": "2022-01-07 07:14:10",
            "total_cost": "1740.3000"
        },
        {
            "item_qty": 1,
            "created_at": "2022-01-07 07:29:05",
            "total_cost": "870.1500"
        },
        {
            "item_qty": 1,
            "created_at": "2022-01-10 08:28:47",
            "total_cost": "870.1500"
        },
        {
            "item_qty": 1,
            "created_at": "2022-01-10 10:13:24",
            "total_cost": "870.1500"
        },
        {
            "item_qty": 1,
            "created_at": "2022-01-11 09:45:32",
            "total_cost": "870.1500"
        }
    ]



    const data = [
        { name: 'Geeksforgeeks', students: 400 },
        { name: 'Technical scripter', students: 700 }
    ];

    const bardata = [
        { name: 'Geeksforgeeks', students: 400 },
        { name: 'Technical scripter', students: 700 },
        { name: 'Geek-i-knack', students: 200 },
        { name: 'Geek-o-mania', students: 1000 }
    ];


    return (
        <div className="col-sm-9">
            
            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
						<h3>My Analysis</h3>
                            <ResponsiveContainer width="100%" aspect={3}>
                                <LineChart data={pdata} margin={{ right: 300 }}>
                                    <CartesianGrid />
                                    <XAxis dataKey="created_at"
                                        interval={'preserveStartEnd'} />
                                    <YAxis  ></YAxis>
                                    <Legend />
                                    <Tooltip />
                                    <Line dataKey="total_cost"
                                        stroke="black" activeDot={{ r: 8 }} />
                                    <Line dataKey="item_qty"
                                        stroke="red" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </section>

            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <PieChart width={700} height={700}>
                                <Pie data={data} dataKey="students" outerRadius={250} fill="green" />
                            </PieChart>
                        </div>
                    </div>
                </div>
            </section>

            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <BarChart width={600} height={600} data={pdata}>
                                <Bar dataKey="created_at" fill="green" />
                                <CartesianGrid stroke="#ccc" />
                                <XAxis dataKey="total_cost" />
                                <YAxis />
                            </BarChart>
                        </div>
                    </div>
                </div>
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
)(MyAnalysis);