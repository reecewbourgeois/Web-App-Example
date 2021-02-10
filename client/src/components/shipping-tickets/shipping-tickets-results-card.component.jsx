import React from 'react';

const ShippingTicketsResultsCard = (props) => (
    <tr>
        <th scope="row">
            {props.data.kbox}
        </th>
            <td>{props.data.dateReceived}</td>
            <td>{props.data.asset}</td>
            <td>{props.data.service}</td>
            <td>{props.data.school}</td>
            <td>{props.data.model}</td>
            <td>{props.data.workHistory[props.data.workHistory.length - 1].technician}</td>
            <td>{props.data.workHistory[props.data.workHistory.length - 1].deviceStatus}</td>
            <td>{props.data.workHistory[props.data.workHistory.length - 1].checkInNotes}</td>
    </tr>
    
);

export default ShippingTicketsResultsCard;