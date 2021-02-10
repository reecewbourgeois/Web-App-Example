import React from 'react';
import WHTableEntry from './whTableEntry.component';

const WorkHistory = (props) => (
  <div>
    {/* Device Work History Table */}
    <div className="card bg-secondary mb-3 border-dark text-white mx-4">
      <div className="card-header bg-dark-title border-bottom border-dark">
        Device Work History
      </div>
      <div className="card-body table-responsive">
        <table className="table table-hover table-dark">
            <thead className="text-white font-weight-bold">
              <tr>
                <th scope="col">Work Date</th>
                <th scope="col">Device Status</th>
                <th scope="col">Technician</th>
                <th scope="col">Tracking #</th>
                <th scope="col">Work Order #</th>
                <th scope="col">Notes</th>
              </tr>
            </thead>
            <tbody className="text-white">
                {props.data.map((data, index) => (
                    <WHTableEntry key={index} data={data} index={index}/>
                ))}
            </tbody>
          </table>
        <button disabled={props.isDisabled !== false} type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
            Add Work History
        </button>
      </div>
    </div>
  </div>
);

export default WorkHistory;