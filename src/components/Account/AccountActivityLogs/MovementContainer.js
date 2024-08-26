import { Box } from "@mui/material";
import moment from "moment";
import { unixToDate } from "../../../adapter/Utils";
import MovementCard from "./MovementCard";

const MovementContainer = ({ activityData }) => {
  return (
    <Box
      sx={{
        boxShadow:
          "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
        borderRadius: "4px",
        padding: "1.5rem",
      }}
    >
      {activityData &&
        activityData.map((activity) => (
          <MovementCard
            key={activity.activity_id}
            date={moment(unixToDate(activity._activity_created)).format(
              "DD/MM/YYYY HH:mm"
            )}
            staff={`${activity._activity_createdby_employee.employee_firstname} ${activity._activity_createdby_employee.employee_lastname}`}
            action="สร้าง"
            description={activity.activity_data.description}
          />
        ))}
    </Box>
  );
};

export default MovementContainer;
