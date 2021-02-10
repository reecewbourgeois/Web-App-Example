import React from 'react';

const WHTableEntry = (props) => (
    <tr>
            <td>{props.data.workDate}</td>
            <td>{props.data.deviceStatus}</td>
            <td>{props.data.technician}</td>
            <td>{props.data.trackingNumber}</td>
            <td>{props.data.workOrderNumber}</td>
            <td>{props.data.checkInNotes}</td>
    </tr>
);

export default WHTableEntry;