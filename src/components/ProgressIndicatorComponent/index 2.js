import React from "react";

export default function ProgressIndicatorComponent(props) {
  return (
    <li
      className={
        props.isActive
          ? "active"
          : props.isFinish
          ? "finish"
          : props.isCancell
          ? "cancell"
          : ""
      }
    >
      {props.title}
    </li>
  );
}
