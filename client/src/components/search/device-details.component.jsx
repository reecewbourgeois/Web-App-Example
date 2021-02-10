import React from 'react';

const DeviceDetails = (props) => (
    <div className="card bg-secondary mb-3 border-dark text-white mx-4">
                <div className="card-header bg-dark-title border-bottom border-dark">
                  Device Details
                </div>
                <div className="card-body">
                        <div className="row mb-2">
                            <div className="col-md-4">
                                <label>Date</label>
                                <div className="input-group input-group-md">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text bg-dark-title border-dark text-light">
                                            <i className="fas fa-calendar"></i>
                                        </span>
                                    </div>
                                    <p className="form-control bg-form-box border-dark text-form-color">{props.results.dateReceived}</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label>Check In Tech</label>
                                <div className="input-group input-group-md">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text bg-dark-title border-dark text-light">
                                            <i className="fas fa-user"></i>
                                        </span>
                                    </div>
                                    <p className="form-control bg-form-box border-dark text-form-color">{props.tech}</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label>School / Site</label>
                                <div className="input-group input-group-md">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text bg-dark-title border-dark text-light">
                                            <i className="fas fa-school"></i>
                                        </span>
                                    </div>
                                    <p className="form-control bg-form-box border-dark text-form-color">{props.results.school}</p>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md-4">
                                <label>Model</label>
                                <div className="input-group input-group-md">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text bg-dark-title border-dark text-light">
                                            <i className="fas fa-laptop"></i>
                                        </span>
                                    </div>
                                    <p className="form-control bg-form-box border-dark text-form-color">{props.results.model}</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label>Device Tag Color</label>
                                <div className="input-group input-group-md">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text bg-dark-title border-dark text-light">
                                            <i className="fas fa-palette"></i>
                                        </span>
                                    </div>
                                    <p className={props.handleTagColor(props.results.tagColor)}>{props.results.tagColor}</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label>Teacher (Y/N)</label>
                                <div className="input-group input-group-md">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text bg-dark-title border-dark text-light">
                                            <i className="fas fa-chalkboard-teacher"></i>
                                        </span>
                                    </div>
                                    <p className={props.handleTeacherCheck(props.results.teacher)}>{props.results.teacher}</p>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md-4">
                                <label>Asset Tag</label>
                                <div className="input-group input-group-md">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text bg-dark-title border-dark text-light">
                                            <i className="fas fa-tag "></i>
                                        </span>
                                    </div>
                                    <p className="form-control bg-form-box border-dark text-form-color">{props.results.asset}</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label>Service Tag</label>
                                <div className="input-group input-group-md">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text bg-dark-title border-dark text-light">
                                            <i className="fas fa-tags fa-flip-horizontal"></i>
                                        </span>
                                    </div>
                                    <p className="form-control bg-form-box border-dark text-form-color">{props.results.service}</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label>KBox</label>
                                <div className="input-group input-group-md">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text bg-dark-title border-dark text-light">
                                            <i className="fas fa-hashtag"></i>
                                        </span>
                                    </div>
                                    <p className="form-control bg-form-box border-dark text-form-color">{props.results.kbox}</p>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md-8">
                                <label>Check In Notes</label>
                                <div className="input-group input-group-md">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text bg-dark-title border-dark text-light">
                                            <i className="fas fa-list"></i>
                                        </span>
                                    </div>
                                    <textarea className="form-control bg-form-box border-dark text-form-color" rows="3" readOnly value={props.notes}/>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label>Location</label>
                                <div className="input-group input-group-md">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text bg-dark-title border-dark text-light">
                                            <i className="fas fa-compass"></i>
                                        </span>
                                    </div>
                                    <p className="form-control bg-form-box border-dark text-form-color">{props.results.deviceLocation}</p>
                                </div>
                            </div>
                        </div>
        
                        <button disabled={props.isDisabled !== false} type="button" className="btn btn-danger" data-toggle="modal" data-target="#editDetails">Edit Details</button>
                </div>

    </div>
);

export default DeviceDetails;