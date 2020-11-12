import React from "react";
import { Link } from "react-router-dom";

interface IProps {
  submitLabel: string;
  accentColor?: "pink" | "red" | "green" | "blue";
}

const FormFooter = ({
  submitLabel,
  accentColor = "pink",
}: IProps): JSX.Element => {
  return (
    <div className="mt-8 border-t border-gray-200 pt-5">
      <div className="flex justify-end">
        <span className="inline-flex rounded-md shadow-sm">
          <Link
            to="./"
            className="py-2 px-4 border border-gray-300 rounded-md text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-1none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out"
          >
            Cancel
          </Link>
        </span>
        <span className="ml-3 inline-flex rounded-md shadow-sm">
          <button
            type="submit"
            className={`inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-${accentColor}-600 hover:bg-${accentColor}-500 focus:outline-none focus:border-${accentColor}-700 focus:shadow-outline-${accentColor} active:bg-${accentColor}-700 transition duration-150 ease-in-out`}
          >
            {submitLabel}
          </button>
        </span>
      </div>
    </div>
  );
};

export default FormFooter;
