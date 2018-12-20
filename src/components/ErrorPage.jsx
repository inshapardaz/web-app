import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {

  return (
    <div className="text-center">
    <div className="w-50 d-inline-block pt-5 pb-5 mt-5 mb-5">
      <h1 className="mb-4">
        <strong>Error 500</strong>
      </h1>
      <p className="mb-4">
        We are embaressed to show this page. Apparently, something hasn&apos;t worked as expected and we apologize for trouble.
        Why not try once again. It might just work or you can send us details so that we can make it better.
      </p>
      <Link to="/" className="btn">
        Go back to the main page
      </Link>
    </div>
  </div>
  );
};

export default ErrorPage;
