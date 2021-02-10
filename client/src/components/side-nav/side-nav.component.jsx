import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router-dom';

const sidenav = (props) => (  
        <div>
            <aside id="sidebar" className={props.handleSideNavWidth(props.sideNavWidth)}>
                <ul className="list-unstyled components">
                    <li>
                        <NavLink exact to="/" activeClassName="active"><i className="fas fa-tachometer-alt text-muted mr-3 ml-2"></i>Dashboard</NavLink>
                    </li>
                    <li>
                        <NavLink to="/App/CheckIn" activeClassName="active"><i className="fas fa-tasks text-muted mr-3 ml-2"></i>Check-in</NavLink>
                    </li>
                    <li>
                        <NavLink to="/App/Search" activeClassName="active"><i className="fas fa-search text-muted mr-3 ml-2"></i>Active Search</NavLink>
                    </li>
                    <li>
                        <NavLink to="/App/BulkSearch" activeClassName="active"><i className="fas fa-search-plus text-muted mr-3 ml-2"></i>History Search</NavLink>
                    </li>
                    <li>
                        <NavLink to="/App/BatchChange" activeClassName="active"><i className="fas fa-boxes text-muted mr-3 ml-2"></i>Batch Status Add</NavLink>
                    </li>
                    <li>
                        <NavLink to="/App/ShippingTickets" activeClassName="active"><i className="fas fa-dolly text-muted mr-3 ml-2"></i>Shipping Tickets</NavLink>
                    </li>
                    <li>
                        <NavLink to="/App/Statistics" activeClassName="active"><i className="fas fa-chart-area text-muted mr-3 ml-2"></i>Statistics</NavLink>
                    </li>
                    <li>	
                        <NavLink to="/App/Tickets" activeClassName="active"><i className="fas fa-ticket-alt text-muted mr-3 ml-2"></i>Ticketing System</NavLink>	
                    </li>

                </ul>
            </aside>
        </div>
);

export default sidenav;