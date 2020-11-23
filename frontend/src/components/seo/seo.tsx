import React from "react";
import { Helmet } from "react-helmet";

interface IProps {
  title: string;
}

const SEO = ({ title }: IProps): JSX.Element => {
  return (
    <Helmet>
      <title>{title} | Financer</title>
    </Helmet>
  );
};

export default SEO;
