import React from "react";
import Container from "../container/container";

interface IProps {
  accent?: string;
  accentColor?: "pink" | "red" | "green" | "blue";
  label: string;
  children: React.ReactNode;
}

const Hero = ({
  accent,
  accentColor = "pink",
  label,
  children,
}: IProps): JSX.Element => {
  return (
    <div className="pt-6 sm:pt-12">
      <Container>
        <div className="max-w-xl">
          <h1 className="text-4xl tracking-tight leading-10 font-extrabold text-gray-900 sm:leading-none sm:text-5xl">
            {accent && (
              <>
                <span
                  className={`text-2xl text-${accentColor}-500 leading-none`}
                >
                  {accent}
                </span>
                <br />
              </>
            )}
            {label}
          </h1>
          <p className="mt-5 text-xl leading-7 text-gray-500">{children}</p>
        </div>
      </Container>
    </div>
  );
};

export default Hero;
