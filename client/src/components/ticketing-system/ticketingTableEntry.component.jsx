import React from 'react';

const TicketingTableEntry = (props) => ( 
    <tr onClick={() => props.handleTableClick(props.ticket)}>
        <td>{props.ticket.ticketNumber}</td>
        <td><i className={ props.handlePriorityLevel(props.ticket.priority) }></i>{props.ticket.priority}</td>
        <td className="w-20">{props.ticket.title}</td>
        <td className={ props.handleStatusLevel(props.ticket.comments[props.ticket.comments.length -1].status) }>{props.ticket.comments[props.ticket.comments.length -1].status}</td>
        <td>{props.ticket.dueDate}</td>
        <td className="w-20">{props.ticket.creator}</td>
        <td className="w-20">{props.ticket.assignees[0]}</td>
    </tr>
);

export default TicketingTableEntry;