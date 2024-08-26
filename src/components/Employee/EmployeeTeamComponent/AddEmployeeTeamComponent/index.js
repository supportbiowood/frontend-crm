import { Button } from "@mui/material";
import React from "react";
import AddEmployeeTable from "./AddEmployeeTable";

const AddEmployeeTeamComponent = () => {
  return (
    <>
      <div className="employee__header-container">
        <h2>สมาชิกทีม</h2>
        <Button variant="contained">เพิ่มสมาชิกทีม</Button>
      </div>
      <AddEmployeeTable />
    </>
  );
};

export default AddEmployeeTeamComponent;
