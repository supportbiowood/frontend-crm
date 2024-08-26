import { Backdrop, CircularProgress } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { getDocumentActivityLog } from "../../../adapter/Api";
import { getUser } from "../../../adapter/Auth";
import { uploadFileToS3 } from "../../UploadImageToS3WithNativeSdk/UploadImageToS3WithNativeSdk";
import MovementContainer from "./MovementContainer";
import MovementHeader from "./MovementHeader";

const AccountActivityLogs = ({ documentId }) => {
  const user = getUser();
  const [isLoading, setIsLoading] = useState(false);
  const [activityData, setActivityData] = useState();
  const [movementDescription, setMovementDescription] = useState("");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (documentId) {
      setIsLoading(true);
      getDocumentActivityLog(documentId)
        .then((data) => {
          const myData = data.data.data;
          setActivityData(myData);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [documentId]);

  const uploadFileHandler = (event) => {
    if (event.target.files.length !== 0) {
      setIsLoading(true);
      const file = event.target.files[0];
      uploadFileToS3(file, "ActivityAttachment", user.employee_id)
        .then((data) => {
          console.log(data);
          setFiles((prev) =>
            prev.concat({
              attachment_file_name: file.name,
              attachment_file_type: file.type,
              attachment_url: data.Location,
              _attachment_created: moment().unix(),
              _attachment_createdby_employee: {
                ...user,
              },
            })
          );
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }
  };

  const deleteFileHandler = (deletedIndex) => {
    const deletedFile = files.filter((_, index) => index !== deletedIndex);
    setFiles(deletedFile);
  };

  const saveMovementHandler = () => {
    console.log("POST something to activity logs");
  };

  const movementDescriptionChangeHandler = (event) => {
    setMovementDescription(event.target.value);
  };

  const sortMethodChangeHandler = (method) => {
    if (method === "asc") {
      const sorted = [...activityData].sort((a, b) => {
        return a._activity_created - b._activity_created;
      });
      setActivityData(sorted);
    } else {
      const sorted = [...activityData].sort((a, b) => {
        return b._activity_created - a._activity_created;
      });
      setActivityData(sorted);
    }
  };

  return (
    <>
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <h2 style={{ marginBottom: "1rem", marginTop: "1.5rem" }}>
        การเคลื่อนไหว
      </h2>
      <MovementHeader
        movementDescription={movementDescription}
        movementDescriptionChangeHandler={movementDescriptionChangeHandler}
        files={files}
        uploadFileHandler={uploadFileHandler}
        saveMovementHandler={saveMovementHandler}
        deleteFileHandler={deleteFileHandler}
        sortMethodChangeHandler={sortMethodChangeHandler}
        user={user}
      />
      <MovementContainer activityData={activityData} />
    </>
  );
};

export default AccountActivityLogs;
