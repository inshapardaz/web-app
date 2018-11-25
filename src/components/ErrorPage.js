import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div>
      <h4>
        500 Error Loading the page
      </h4>
      <Link to="/"> Go back to homepage </Link>
    </div>
  );
};

export default ErrorPage;
