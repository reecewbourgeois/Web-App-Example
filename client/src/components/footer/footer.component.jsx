import React from 'react';

const Footer = () => (
    <footer className="page-footer bg-secondary">
        <div className="container">
            <span className="text-primary">Company </span>
            <span className="text-white"> © {(new Date().getFullYear())}</span>
        </div>
    </footer>
);

export default Footer;