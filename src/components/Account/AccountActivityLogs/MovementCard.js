import { Box, Chip } from "@mui/material";

const MovementCard = ({ date, staff, action, description, remark, files }) => {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "space-between", mb: "1.5rem" }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            mb: ".5rem",
          }}
        >
          <b>วันที่ {date}</b>
          <Chip label={action} color="primary" variant="outlined" />
        </Box>
        <p>{description}</p>
        {remark && <p>{remark}</p>}
      </Box>
      <b>โดย {staff}</b>
    </Box>
  );
};

export default MovementCard;
