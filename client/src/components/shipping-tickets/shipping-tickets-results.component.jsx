import React from 'react';
import ShippingTicketsResultsCard from './shipping-tickets-results-card.component';

const ShippingTicketResults = (props) => (
    <div className="card bg-secondary mb-3 border-dark text-white mx-4">

        {/* Bulk Search Results */}
        <div className="card-header bg-dark-title border-bottom border-dark">
            Shipping Tickets Results
        </div>
        <div className="card-body table-responsive">
            <h4>{props.count}</h4>
            <table className="table table-hover table-dark">
                <thead className="text-white font-weight-bold">
                    <tr>
                    <th scope="col">KBox</th>
                    <th scope="col">Work Date</th>
                    <th scope="col">Asset</th>
                    <th scope="col">Service</th>
                    <th scope="col">School</th>
                    <th scope="col">Model</th>
                    <th scope="col">Technician</th>
                    <th scope="col">Device Status</th>
                    <th scope="col">Notes</th>
                    </tr>
                </thead>
                <tbody className="text-white">
                    {props.data.map((data, index) => (
                    <ShippingTicketsResultsCard key={index} data={data}/>
                    ))}
                </tbody>
                </table>
        </div>
    </div>
);

export default ShippingTicketResults;