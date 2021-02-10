import React from 'react';
import { Link } from 'react-router-dom';

const BulkSearchResultsCard = (props) => (
        <tr>
            <th scope="row">
                {props.data.kbox}
            </th>
            <td>
                <Link target={"_blank"} onClick={()=>{
                localStorage.setItem('bulkSearchAssetTag', props.data.asset);
                localStorage.setItem('bulkSearchDateReceived', props.data.dateReceived);
                }} to={{
                        pathname: `/App/Search/`
                    }}>{props.data.dateReceived}</Link>
            </td>
            <td>{props.data.asset}</td>
            <td>{props.data.service}</td>
            <td>{props.data.school}</td>
            <td>{props.data.model}</td>
            <td>{props.data.workHistory[props.data.workHistory.length - 1].technician}</td>
            <td>{props.data.workHistory[props.data.workHistory.length - 1].deviceStatus}</td>
            <td>{props.data.workHistory[props.data.workHistory.length - 1].checkInNotes}</td>
        </tr>
);

export default BulkSearchResultsCard;