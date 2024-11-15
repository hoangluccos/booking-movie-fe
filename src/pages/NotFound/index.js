import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <section className="py-3 md:py-5 min-h-screen flex justify-center items-center">
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="text-center">
            <h2 className="flex justify-center items-center gap-2 mb-4">
              <span className="text-6xl font-extrabold">4</span>
              <i className="fas fa-mask"></i>
              <span className="text-6xl font-extrabold transform rotate-180">
                4
              </span>
            </h2>
            <h3 className="text-2xl mb-2">Oops! You're lost.</h3>
            <p className="mb-5">The page you are looking for was not found.</p>
            <Link
              className="btn bg-gray-800 text-white rounded-full px-5 py-2.5 text-lg transition duration-300 hover:bg-gray-700"
              to="/"
              role="button"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default NotFound;
