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
            name: 'MongoDb',
            student: 11,
            fees: 120
        },
        {
            name: 'Javascript',
            student: 15,
            fees: 12
        },
        {
            name: 'PHP',
            student: 5,
            fees: 10
        },
        {
            name: 'Java',
            student: 10,
            fees: 5
        },
        {
            name: 'C#',
            student: 9,
            fees: 4
        },
        {
            name: 'C++',
            student: 10,
            fees: 8
        },
    ];

    const data = [
        { name: 'Geeksforgeeks', students: 400 },
        { name: 'Technical scripter', students: 700 },
        { name: 'Geek-i-knack', students: 200 },
        { name: 'Geek-o-mania', students: 1000 }
    ];

    const bardata = [
        { name: 'Geeksforgeeks', students: 400 },
        { name: 'Technical scripter', students: 700 },
        { name: 'Geek-i-knack', students: 200 },
        { name: 'Geek-o-mania', students: 1000 }
    ];


    return (
        <div className="col-sm-9">
            <h3>My Analysis</h3>
            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <ResponsiveContainer width="100%" aspect={3}>
                                <LineChart data={pdata} margin={{ right: 300 }}>
                                    <CartesianGrid />
                                    <XAxis dataKey="name"
                                        interval={'preserveStartEnd'} />
                                    <YAxis></YAxis>
                                    <Legend />
                                    <Tooltip />
                                    <Line dataKey="student"
                                        stroke="black" activeDot={{ r: 8 }} />
                                    <Line dataKey="fees"
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
                            <BarChart width={600} height={600} data={bardata}>
                                <Bar dataKey="students" fill="green" />
                                <CartesianGrid stroke="#ccc" />
                                <XAxis dataKey="name" />
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