import React from 'react';

const CommentingTableEntry = (props) => ( 
    <tr>
        <td>{props.comment.author}</td>
        <td>{props.comment.date}</td>
        <td>{props.comment.status}</td>
        <td className="w-50">{props.comment.summary}</td>
    </tr>
);

export default CommentingTableEntry;