import { Button } from "@mui/material";
import React from "react";
import { useHistory } from "react-router-dom";
import EmployeeTeamTable from "./EmployeeTeamTable";

export default function EmployeeTeamComponent() {
  const history = useHistory();
  const createNewTeamHandler = () => {
    history.push(`/employee/team/add`);
  };
  return (
    <>
      <div className="employee__header-container">
        <h2>จัดการทีม</h2>
        <Button variant="contained" onClick={createNewTeamHandler}>
          เพิ่มทีม
        </Button>
      </div>
      <EmployeeTeamTable />
    </>
  );
}
