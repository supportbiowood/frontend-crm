import { createTheme } from "@mui/material/styles";

export const getMuiTheme = () =>
  createTheme({
    overrides: {
      MUIDataTable: {
        root: {
          // backgroundColor: '#FF000',
        },
        paper: {
          boxShadow: "none",
        },
      },
      MUIDataTableToolbar: {
        root: {
          backgroundColor: "#8FCBB1",
          borderRadius: "6px 6px 0 0",
        },
      },
      MUIDataTableHeadRow: {
        root: {
          // backgroundColor: '#8FCBB1 !important',
        },
      },
      MUIDataTableHeadCell: {
        root: {
          backgroundColor: "#8FCBB1 !important",
        },
      },
      MUIDataTableFilterList: {
        root: {
          backgroundColor: "#8FCBB1 !important",
          margin: 0,
          padding: "0 16px",
        },
      },
      MUIDataTableHead: {
        main: {
          // backgroundColor: '#8FCBB1 !important',
        },
      },
      MUIDataTableSelectCell: {
        headerCell: {
          backgroundColor: "#8FCBB1 !important",
        },
      },
      MUIDataTableBodyCell: {
        root: {
          // backgroundColor: 'green !important',
        },
      },
      MUIDataTableBodyRow: {
        root: {
          // backgroundColor: '#FF0000',
        },
      },
    },
  });
