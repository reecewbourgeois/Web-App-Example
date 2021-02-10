import React from 'react';

//This controls the display and removal of the asset tags entered
export default function AssetList(props) {
  const listItems = props.item.map(assetListing);

  function assetListing(item) {
    return (
      <li className="list-group-item flex-fill bg-primary m-1" key={item.key}>
        <button
          className="btn btn-danger close"
          type="button"
          onClick={() => props.handleDelete(item.key, item.asset)}
        >
          <span className="text-white">
            <i className="fas fa-times"></i>
          </span>
        </button>
        {item.asset}
      </li>
    );
  }

  return (
    <ul className="list-group list-group-horizontal centred-ul">{listItems}</ul>
  );
}
