import React from "react";

interface IBannerProps {
  className?: string;
  accentColor?: "black" | "blue";
  headindType?: "h1" | "h2";
  title: string;
  children: string;
}

const Banner = ({
  className = "",
  accentColor = "black",
  headindType = "h2",
  title,
  children,
}: IBannerProps): JSX.Element => {
  const HeadingType = headindType;

  return (
    <div
      className={`p-6 rounded-lg shadow-lg ${
        accentColor === "black" && "bg-black-off"
      } ${
        accentColor === "blue" && "bg-blue-financer"
      } text-white space-y-4 ${className}`}
    >
      <HeadingType className="text-3xl font-extrabold sm:text-4xl">
        {title}
      </HeadingType>
      <p
        className={`text-lg ${accentColor === "black" && "text-gray-300"} ${
          accentColor === "blue" && "text-white"
        }`}
      >
        {children}
      </p>
    </div>
  );
};

export default Banner;
