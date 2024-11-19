import React from "react";
import { Link } from "react-router-dom";

export default function BreadcrumbComponent(props) {
  return (
    <Link className="breadcrumb" key={props.breadcrumbKey} to={props.to}>
      {props.name}
    </Link>
  );
}
