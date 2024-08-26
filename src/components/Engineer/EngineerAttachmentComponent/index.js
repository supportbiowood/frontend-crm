import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

const EngineerAttachmentComponent = ({
  filename,
  url,
  name,
  datetime,
  disabled,
  index,
  deleteAttachmentHandler,
}) => {
  const onFilenameClickHandler = () => {
    window.open(url);
  };

  return (
    <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
      <Card
        sx={{
          height: "100%",
          weight: "100%",
          border: "solid #bebebe 1px",
          borderRadius: "20px",
        }}
      >
        <CardContent
          sx={{
            pb: 0,
            display: "flex",
            gap: ".5rem",
          }}
        >
          <Box>
            <DescriptionOutlinedIcon sx={{ height: 40, width: 40 }} />
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: ".5rem",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                minWidth: "fit-content",
                backgroundColor: "#D4EEE2",
                borderRadius: "5px",
                py: ".3rem",
                cursor: "pointer",
              }}
              onClick={onFilenameClickHandler}
            >
              <Typography sx={{ fontWeight: 900 }}>{filename}</Typography>
            </div>
            <Box>
              <Typography>โดย {name}</Typography>
              <Typography>วันที่ {datetime}</Typography>
            </Box>
          </Box>
        </CardContent>
        {!disabled && (
          <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="text"
              onClick={() => deleteAttachmentHandler(index)}
            >
              ลบ
            </Button>
          </CardActions>
        )}
      </Card>
    </Grid>
  );
};

export default EngineerAttachmentComponent;
