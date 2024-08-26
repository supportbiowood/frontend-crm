import { Backdrop, Breadcrumbs, Button, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadcrumbComponent from "../../BreadcrumbComponent";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { getListWareHouse } from "../../../adapter/Api/graphql";
import ModalAddComponent from "../ModalAddComponent";
import ModalConfirmComponent from "../ModalComfirmComponent";
import {
  deleteConfigWarehouse,
  deleteConfigBinLocation,
} from "../../../adapter/Api/graphql";

import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../redux/actions/snackbarActions";

export default function WarehouseComponent() {
  const [allWarehouse, setAllWarehouse] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openCreatebinLocation, setOpenCreatebinLocation] = useState(false);
  const [openUpdatebinLocation, setOpenUpdatebinLocation] = useState(false);
  const [openCreatePallete, setOpenCreatePallete] = useState(false);
  const [openUpdatePallete, setOpenUpdatePallete] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDeletebinLocation, setOpenDeletebinLocation] = useState(false);
  const [openDeletePallete, setOpenDeletePallete] = useState(false);
  const [values, setValues] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState([]);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getListWareHouse().then((data) => {
      if (data.data.data.listWarehouse.items === null) return;
      let myData = data.data.data.listWarehouse.items;
      setAllWarehouse(myData);
      setIsLoading(false);
    });
  }, [isLoading]);

  const handleClose = () => {
    setOpenCreate(false);
    setOpenUpdate(false);
    setOpenCreatebinLocation(false);
    setOpenUpdatebinLocation(false);
    setOpenCreatePallete(false);
    setOpenUpdatePallete(false);
    setOpenDelete(false);
    setOpenDeletebinLocation(false);
    setOpenDeletePallete(false);
  };

  const handleDeleteWarehouse = () => {
    setIsLoading(true);
    const input = {
      id: location[0].id,
      internalID: location[0].internalID,
    };
    deleteConfigWarehouse({ input: input }).then((data) => {
      if (data.data.data !== null) {
        handleClose();
        setIsLoading(false);
      } else {
        setIsLoading(false);
        return dispatch(showSnackbar("error", "เกิดเหตุผิดพลาด"));
      }
    });
  };

  const handleDeletebinLocation = () => {
    setIsLoading(true);
    const input = {
      id: location[1].id,
      warehouseID: location[0].id,
      parentIDList: [],
    };
    deleteConfigBinLocation({ input: input }).then((data) => {
      if (data.data.data !== null) {
        handleClose();
        setIsLoading(false);
      } else {
        setIsLoading(false);
        return dispatch(showSnackbar("error", "เกิดเหตุผิดพลาด"));
      }
    });
  };

  const handleDeletePallete = () => {
    setIsLoading(true);
    const input = {
      id: location[2].id,
      warehouseID: location[0].id,
      parentIDList: [location[1].id],
    };
    deleteConfigBinLocation({ input: input }).then((data) => {
      if (data.data.data !== null) {
        handleClose();
        setIsLoading(false);
      } else {
        setIsLoading(false);
        return dispatch(showSnackbar("error", "เกิดเหตุผิดพลาด"));
      }
    });
  };

  const buttonSx = { padding: "5px 10px", height: "fit-content" };

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
      <ModalAddComponent
        warehouse
        createSubmit
        setIsLoading={setIsLoading}
        open={openCreate}
        handleClose={handleClose}
        textHeader="คลัง"
        label="เพิ่มคลัง"
      />
      <ModalAddComponent
        warehouse
        updateSubmit
        setIsLoading={setIsLoading}
        location={location}
        open={openUpdate}
        handleClose={handleClose}
        textHeader="คลัง"
        textValue={values}
        label="ชื่อคลัง"
      />
      <ModalAddComponent
        binLocation
        createSubmit
        setIsLoading={setIsLoading}
        location={location}
        open={openCreatebinLocation}
        handleClose={handleClose}
        textHeader="คลัง"
        label="เพิ่มแถว"
      />
      <ModalAddComponent
        binLocation
        updateSubmit
        setIsLoading={setIsLoading}
        location={location}
        open={openUpdatebinLocation}
        handleClose={handleClose}
        textHeader="แถว"
        textValue={values}
        label="ชื่อแถว"
      />
      <ModalAddComponent
        pallete
        createSubmit
        location={location}
        setIsLoading={setIsLoading}
        open={openCreatePallete}
        handleClose={handleClose}
        textHeader="แถว"
        label="เพิ่ม Pallete"
      />
      <ModalAddComponent
        pallete
        updateSubmit
        location={location}
        setIsLoading={setIsLoading}
        open={openUpdatePallete}
        handleClose={handleClose}
        textHeader="Pallete"
        textValue={values}
        label="ชื่อ Pallete"
      />
      <ModalConfirmComponent
        open={openDelete}
        handleClose={handleClose}
        handleSubmit={handleDeleteWarehouse}
        setIsLoading={setIsLoading}
        title="ยืนยันการลบกลุ่ม ?"
        description={description}
      />
      <ModalConfirmComponent
        open={openDeletebinLocation}
        handleClose={handleClose}
        handleSubmit={handleDeletebinLocation}
        setIsLoading={setIsLoading}
        title="ยืนยันการลบแถว ?"
        description={description}
      />
      <ModalConfirmComponent
        open={openDeletePallete}
        handleClose={handleClose}
        handleSubmit={handleDeletePallete}
        setIsLoading={setIsLoading}
        title="ยืนยันการลบPallete ?"
        description={description}
      />
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <BreadcrumbComponent name="ตั้งค่า" to="/config" />
        <BreadcrumbComponent name="คลัง" to="#" />
      </Breadcrumbs>
      <div className="header-layout">
        <h2>สถานที่จัดเก็บ</h2>
        <Button
          variant="contained"
          color="success"
          onClick={() => setOpenCreate(true)}
        >
          เพิ่มคลัง
        </Button>
      </div>
      <div className="inventory-container">
        <TreeView
          aria-label="rich object"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpanded={["root"]}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{ flexGrow: 1 }}
        >
          {allWarehouse.map((warehouse) => {
            return (
              <TreeItem
                key={warehouse.id}
                nodeId={warehouse.id}
                label={<>{warehouse.name}</>}
              >
                <ToggleButtonGroup aria-label="text alignment">
                  <ToggleButton
                    sx={buttonSx}
                    value="left"
                    aria-label="left aligned"
                    onClick={async () => {
                      await setLocation([warehouse]);
                      await setOpenCreatebinLocation(true);
                    }}
                  >
                    เพิ่ม
                  </ToggleButton>
                  <ToggleButton
                    sx={buttonSx}
                    value="center"
                    aria-label="centered"
                    onClick={async () => {
                      await setValues(warehouse.name);
                      await setLocation([warehouse]);
                      await setOpenUpdate(true);
                    }}
                  >
                    เปลี่ยนชื่อ
                  </ToggleButton>
                  <ToggleButton
                    sx={buttonSx}
                    value="right"
                    aria-label="right aligned"
                    onClick={async () => {
                      await setDescription(
                        `ยืนยันการลบคลัง ${warehouse.name} ใช่หรือไม่ ?`
                      );
                      await setLocation([warehouse]);
                      await setOpenDelete(true);
                    }}
                  >
                    ลบ
                  </ToggleButton>
                </ToggleButtonGroup>
                {warehouse.listBinLocation &&
                  warehouse.listBinLocation.items.map((binLocation) => (
                    <TreeItem
                      key={binLocation.id}
                      nodeId={binLocation.id}
                      label={<>{binLocation.name} </>}
                    >
                      <ToggleButtonGroup aria-label="text alignment">
                        <ToggleButton
                          sx={buttonSx}
                          value="left"
                          aria-label="left aligned"
                          onClick={async () => {
                            await setLocation([warehouse, binLocation]);
                            await setOpenCreatePallete(true);
                          }}
                        >
                          เพิ่ม
                        </ToggleButton>
                        <ToggleButton
                          value="center"
                          sx={buttonSx}
                          aria-label="centered"
                          onClick={async () => {
                            await setValues(binLocation.name);
                            await setLocation([warehouse, binLocation]);
                            await setOpenUpdatebinLocation(true);
                          }}
                        >
                          เปลี่ยนชื่อ
                        </ToggleButton>
                        <ToggleButton
                          value="right"
                          sx={buttonSx}
                          aria-label="right aligned"
                          onClick={async () => {
                            await setDescription(
                              `ยืนยันการลบแถว ${binLocation.name} ใช่หรือไม่ ?`
                            );
                            await setLocation([warehouse, binLocation]);
                            await setOpenDeletebinLocation(true);
                          }}
                        >
                          ลบ
                        </ToggleButton>
                      </ToggleButtonGroup>
                      {binLocation.listBinLocation &&
                        binLocation.listBinLocation.items.map((pallete) => (
                          <TreeItem
                            key={pallete.id}
                            nodeId={pallete.id}
                            label={<>{pallete.name} </>}
                          >
                            <ToggleButtonGroup aria-label="text alignment">
                              <ToggleButton
                                value="center"
                                sx={buttonSx}
                                aria-label="centered"
                                onClick={async () => {
                                  await setValues(pallete.name);
                                  await setLocation([
                                    warehouse,
                                    binLocation,
                                    pallete,
                                  ]);
                                  await setOpenUpdatePallete(true);
                                }}
                              >
                                เปลี่ยนชื่อ
                              </ToggleButton>
                              <ToggleButton
                                value="right"
                                sx={buttonSx}
                                aria-label="right aligned"
                                onClick={async () => {
                                  await setDescription(
                                    `ยืนยันการลบPallete ${pallete.name} ใช่หรือไม่ ?`
                                  );
                                  await setLocation([
                                    warehouse,
                                    binLocation,
                                    pallete,
                                  ]);
                                  await setOpenDeletePallete(true);
                                }}
                              >
                                ลบ
                              </ToggleButton>
                            </ToggleButtonGroup>
                          </TreeItem>
                        ))}
                    </TreeItem>
                  ))}
              </TreeItem>
            );
          })}
        </TreeView>
      </div>
    </div>
  );
}
