import React from "react";
import { Link } from "react-router-dom";
import Container from "../container/container";

const Navigation = (): JSX.Element => {
  return (
    <Container>
      <div className="block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <Link
              to="/"
              className="whitespace-no-wrap py-4 px-1 border-b-2 border-pink-500 font-medium text-sm leading-5 text-pink-600 focus:outline-none focus:text-pink-800 focus:border-pink-700"
            >
              Dashboard
            </Link>
            <Link
              to="/accounts"
              className="whitespace-no-wrap ml-8 py-4 px-1 border-b-2 border-pink-500 font-medium text-sm leading-5 text-pink-600 focus:outline-none focus:text-pink-800 focus:border-pink-700"
            >
              Accounts
            </Link>
            <a
              href="/api/auth/logout"
              className="whitespace-no-wrap ml-8 py-4 px-1 border-b-2 border-pink-500 font-medium text-sm leading-5 text-pink-600 focus:outline-none focus:text-pink-800 focus:border-pink-700"
            >
              Logout
            </a>
          </nav>
        </div>
      </div>
    </Container>
  );
};

export default Navigation;
