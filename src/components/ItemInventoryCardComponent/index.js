import React from "react";

export default function ItemInventoryCardComponent(props) {
  return (
    <div className="badge-item_master">
      <h4>{props.header}</h4>
      <h1>{props.value}</h1>
      <h6>อัพเดทล่าสุด {props.update}</h6>
    </div>
  );
}
