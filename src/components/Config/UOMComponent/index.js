import React, { useEffect, useState } from "react";
import BreadcrumbComponent from "../../BreadcrumbComponent";
import {
  Breadcrumbs,
  Button,
  TablePagination,
  IconButton,
} from "@mui/material";
import {
  createConfigUOM,
  deleteConfigUOM,
  getAllUom,
} from "../../../adapter/Api/graphql";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../redux/actions/snackbarActions";

import CloseIcon from "@mui/icons-material/Close";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ModalComponent from "./ModalComponent";

const columnList = ["รหัส", "ชื่อ", "คำอธิบาย", ""];

export default function UOMComponent() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [uomList, setUomList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState("เพิ่มหน่วย");
  const [selecedUom, setSelecedUom] = useState();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const fetchData = () => {
    getAllUom().then((data) => {
      if (data.data.data === null) return setIsLoading(false);
      let myData = data.data.data.listUOM?.items;
      setUomList(myData);
      setIsLoading(false);
    });
  };

  const handleOpenModel = ({ uom, type }) => {
    if (type === "add") setTitle("เพิ่มหน่วย");
    if (type === "update") setTitle("แก้ไขหน่วย");
    if (type === "delete") setTitle("ยืนยันการลบหน่วย " + uom.id + "?");
    if (uom) setSelecedUom(uom);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setTimeout(() => {
      setTitle("เพิ่มหน่วย");
      setSelecedUom();
    }, 350);
  };

  //<================= page table control ==================>
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  //<================= page table control ==================>

  const createData = async (createItem) => {
    setIsLoading(true);
    await createConfigUOM({ input: createItem })
      .then((data) => {
        if (data) {
          setIsLoading(false);
          dispatch(showSnackbar("success", "สร้างสำเร็จ"));
          setOpenModal(false);
        }
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "สร้างไม่สำเร็จ"));
        setOpenModal(false);
        console.log(err);
      });
  };

  const updateData = async (createItem) => {
    setIsLoading(true);
    await createConfigUOM({ input: createItem })
      .then((data) => {
        if (data) {
          setIsLoading(false);
          dispatch(showSnackbar("success", "อัพเดทสำเร็จ"));
          setOpenModal(false);
        }
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "อัพเดทไม่สำเร็จ"));
        setOpenModal(false);
      });
  };

  const deleteData = async (deleteItem) => {
    setIsLoading(true);
    await deleteConfigUOM({ input: { id: deleteItem.id } })
      .then((data) => {
        if (data) {
          dispatch(showSnackbar("success", "ลบสำเร็จ"));
          setOpenModal(false);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "ลบไม่สำเร็จ"));
        setOpenModal(false);
        console.log(err);
      });
  };

  const submitCondition = (values) => {
    if (!selecedUom) {
      createData(values);
    } else if (selecedUom && title === "แก้ไขหน่วย") {
      updateData(values);
    } else if (selecedUom && title !== "แก้ไขหน่วย") {
      const newValue = { id: selecedUom.id };
      deleteData(newValue);
    }
  };

  return (
    <div className="config">
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <BreadcrumbComponent name="ตั้งค่า" to="/config" />
        <BreadcrumbComponent name="หน่วย" to="#" />
      </Breadcrumbs>
      <ModalComponent
        title={title}
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        onSubmit={submitCondition}
        selecedUom={selecedUom}
      />
      <div className="header-layout">
        <h2>หน่วย</h2>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            handleOpenModel({ type: "add" });
          }}
        >
          เพิ่มหน่วย
        </Button>
      </div>
      <div className="inventory-container">
        <>
          <div className="table-container">
            <table id="inventory" rules="none">
              <thead>
                {columnList.map((item, i) => {
                  return <td key={i}>{item}</td>;
                })}
              </thead>
              <tbody id="table-body">
                {uomList &&
                  uomList.map((item, i) => {
                    return [
                      <tr key={i}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.description}</td>
                        <td>
                          <IconButton
                            onClick={() => {
                              handleOpenModel({
                                uom: item,
                                type: "update",
                              });
                            }}
                          >
                            <EditOutlinedIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              handleOpenModel({
                                uom: item,
                                type: "delete",
                              });
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </td>
                      </tr>,
                    ];
                  })}
              </tbody>
            </table>
          </div>
          <TablePagination
            component="div"
            count={100}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      </div>
    </div>
  );
}
