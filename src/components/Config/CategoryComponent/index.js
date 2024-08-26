import { Backdrop, Breadcrumbs, Button, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadcrumbComponent from "../../BreadcrumbComponent";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import {
  deleteConfigCategory,
  getItemCategoryList,
} from "../../../adapter/Api/graphql";
import ModalAddComponent from "../ModalAddComponent";
import ModalConfirmComponent from "../ModalComfirmComponent";

import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../redux/actions/snackbarActions";

export default function CategoryComponent() {
  const [allCategory, setAllCategory] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  // const [openDeleteChild1, setOpenDeleteChild1] = useState(false);
  // const [openDeleteChild2, setOpenDeleteChild2] = useState(false);
  const [values, setValues] = useState("");
  const [category, setCategory] = useState([]);
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getItemCategoryList({ parentIdList: [] }).then((data) => {
      if (data.data.data.listItemCategory.items === null) return;
      let myData = data.data.data.listItemCategory.items;
      setAllCategory(myData);
      setIsLoading(false);
    });
  }, [isLoading]);

  const handleClose = () => {
    setOpenCreate(false);
    setOpenUpdate(false);
    setOpenDelete(false);
    setValues("");
  };

  const handleDelete = () => {
    setIsLoading(true);
    let input = {};
    if (category.length === 1) {
      input = {
        id: category[0].id,
        internalID: category[0].internalID,
        parentIDList: [],
      };
    }
    if (category.length === 2) {
      input = {
        id: category[1].id,
        internalID: category[1].internalID,
        parentIDList: [category[0].id],
      };
    }
    if (category.length === 3) {
      input = {
        id: category[2].id,
        internalID: category[2].internalID,
        parentIDList: [category[0].id, category[1].id],
      };
    }
    if (category.length === 4) {
      input = {
        id: category[3].id,
        internalID: category[3].internalID,
        parentIDList: [category[0].id, category[1].id, category[2].id],
      };
    }
    deleteConfigCategory({ input: input }).then((data) => {
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
        Category
        createSubmit
        category={category}
        setIsLoading={setIsLoading}
        open={openCreate}
        handleClose={handleClose}
        textHeader="หมวดหมู่"
        label="เพิ่มหมวดหมู่"
      />
      <ModalAddComponent
        Category
        updateSubmit
        category={category}
        setIsLoading={setIsLoading}
        open={openUpdate}
        handleClose={handleClose}
        textHeader="หมวดหมู่"
        textValue={values}
        label="ชื่อหมวดหมู่"
      />
      <ModalConfirmComponent
        open={openDelete}
        handleClose={handleClose}
        handleSubmit={handleDelete}
        setIsLoading={setIsLoading}
        title="ยืนยันการลบหมวดหมู่ ?"
        description={description}
      />
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <BreadcrumbComponent name="ตั้งค่า" to="/config" />
        <BreadcrumbComponent name="หมวดหมู่" to="#" />
      </Breadcrumbs>
      <div className="header-layout">
        <h2>หมวดหมู่</h2>
        <Button
          variant="contained"
          color="success"
          onClick={() => setOpenCreate(true)}
        >
          เพิ่มหมวดหมู่
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
          {allCategory.map((category) => {
            return (
              <TreeItem
                key={category.id}
                nodeId={category.id}
                label={<>{category.name} </>}
              >
                <ToggleButtonGroup aria-label="text alignment">
                  <ToggleButton
                    sx={buttonSx}
                    value="left"
                    aria-label="left aligned"
                    onClick={async () => {
                      await setCategory([category]);
                      await setOpenCreate(true);
                    }}
                  >
                    เพิ่ม
                  </ToggleButton>
                  <ToggleButton
                    sx={buttonSx}
                    value="center"
                    aria-label="centered"
                    onClick={async () => {
                      await setValues(category.name);
                      await setCategory([category]);
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
                        `ยืนยันการลบหมวดหมู่ ${category.name} ใช่หรือไม่ ?`
                      );
                      await setCategory([category]);
                      await setOpenDelete(true);
                    }}
                  >
                    ลบ
                  </ToggleButton>
                </ToggleButtonGroup>
                {category.listChild &&
                  category.listChild.items.map((category2) => (
                    <TreeItem
                      key={category2.id}
                      nodeId={category2.id}
                      label={<>{category2.name} </>}
                    >
                      <ToggleButtonGroup aria-label="text alignment">
                        <ToggleButton
                          sx={buttonSx}
                          value="left"
                          aria-label="left aligned"
                          onClick={async () => {
                            await setCategory([category, category2]);
                            await setOpenCreate(true);
                          }}
                        >
                          เพิ่ม
                        </ToggleButton>
                        <ToggleButton
                          sx={buttonSx}
                          value="center"
                          aria-label="centered"
                          onClick={async () => {
                            await setValues(category2.name);
                            await setCategory([category, category2]);
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
                              `ยืนยันการลบหมวดหมู่ ${category2.name} ใช่หรือไม่ ?`
                            );
                            await setCategory([category, category2]);
                            await setOpenDelete(true);
                            // await setOpenDeleteChild1(true);
                          }}
                        >
                          ลบ
                        </ToggleButton>
                      </ToggleButtonGroup>
                      {category2.listChild &&
                        category2.listChild.items.map((category3) => (
                          <TreeItem
                            key={category3.id}
                            nodeId={category3.id}
                            label={<>{category3.name} </>}
                          >
                            <ToggleButtonGroup aria-label="text alignment">
                              <ToggleButton
                                sx={buttonSx}
                                value="left"
                                aria-label="left aligned"
                                onClick={async () => {
                                  await setCategory([
                                    category,
                                    category2,
                                    category3,
                                  ]);
                                  await setOpenCreate(true);
                                }}
                              >
                                เพิ่ม
                              </ToggleButton>
                              <ToggleButton
                                sx={buttonSx}
                                value="center"
                                aria-label="centered"
                                onClick={async () => {
                                  await setValues(category3.name);
                                  await setCategory([
                                    category,
                                    category2,
                                    category3,
                                  ]);
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
                                    `ยืนยันการลบหมวดหมู่ ${category3.name} ใช่หรือไม่ ?`
                                  );
                                  await setCategory([
                                    category,
                                    category2,
                                    category3,
                                  ]);
                                  await setOpenDelete(true);
                                  // await setOpenDeleteChild2(true)
                                }}
                              >
                                ลบ
                              </ToggleButton>
                            </ToggleButtonGroup>
                            {category3.listChild &&
                              category3.listChild.items.map((category4) => (
                                <TreeItem
                                  key={category4.id}
                                  nodeId={category4.id}
                                  label={<>{category4.name} </>}
                                >
                                  <ToggleButtonGroup aria-label="text alignment">
                                    <ToggleButton
                                      sx={buttonSx}
                                      value="center"
                                      aria-label="centered"
                                      onClick={async () => {
                                        await setValues(category4.name);
                                        await setCategory([
                                          category,
                                          category2,
                                          category3,
                                          category4,
                                        ]);
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
                                          `ยืนยันการลบหมวดหมู่ ${category4.name} ใช่หรือไม่ ?`
                                        );
                                        await setCategory([
                                          category,
                                          category2,
                                          category3,
                                          category4,
                                        ]);
                                        await setOpenDelete(true);
                                        // await setOpenDeleteChild2(true)
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
                  ))}
              </TreeItem>
            );
          })}
        </TreeView>
      </div>
    </div>
  );
}
