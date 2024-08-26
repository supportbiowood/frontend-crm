import React from "react";
import Chip from "@mui/material/Chip";

export default function TagComponent(props) {
  const handleDelete = () => {
    const Filter = props.values.filter((_, index) => {
      return `${props.ID}` !== `${index}`;
    });
    props.setFieldValue("tag_list", Filter);
    props.setFieldValue("tagList", Filter);
    props.setFieldValue("employee_tag_list", Filter);
  };

  return (
    <div className="chip">
      <Chip label={props.label} onDelete={handleDelete} />
    </div>
  );
}
