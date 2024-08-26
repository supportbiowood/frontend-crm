import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Divider, IconButton, InputAdornment } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const AccountDiscountComponent = ({
  formik,
  name,
  discountList,
  totalPrice,
  itemIndex,
}) => {
  const [open, setOpen] = useState(false);
  const [discount, setDiscount] = useState(discountList);

  useEffect(() => {
    discount.forEach((discountLine, discountIndex) => {
      if (discountIndex === 0)
        return (discountLine.amount =
          (discountLine.percent * totalPrice) / 100);
      else
        return (discountLine.amount =
          (discountLine.percent *
            (totalPrice - discount[discountIndex - 1].amount)) /
          100);
    });
    formik.setFieldValue(
      `${name}.total_discount`,
      discount.reduce(
        (sum, a) => {
          return parseFloat(sum + a.amount);
        },
        [0]
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPrice]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    formik.setFieldValue(`${name}.discount_list`, discount);
    formik.setFieldValue(
      `${name}.total_discount`,
      discount.reduce(
        (sum, a) => {
          return parseFloat(sum + a.amount);
        },
        [0]
      )
    );
    setOpen(false);
  };

  const addDiscountHandler = () => {
    setDiscount([...discount, { percent: 0, amount: 0 }]);
  };

  const removeDiscountHandler = (index) => {
    const values = [...discount];
    values.splice(index, 1);
    const newAmount = [...values];
    if (index === 0) {
      newAmount[0].amount = (totalPrice * newAmount[0].percent) / 100;
    } else if (index === discount.length - 1) {
      setDiscount(newAmount);
    } else {
      newAmount[index].amount =
        (newAmount[index - 1].amount * newAmount[index].percent) / 100;
    }
    setDiscount(newAmount);
  };

  const discountChangeHandler = (index, event) => {
    const values = [...discount];
    values[index].percent = event.target.value;
    values[index].amount =
      ((totalPrice -
        values.reduce(
          (sum, a, i) => {
            if (i === index) return sum;
            return parseInt(sum + a.amount);
          },
          [0]
        )) *
        values[index].percent) /
      100;
    setDiscount(values);
  };

  //function to display number to Locale
  function toLocale(number) {
    //number = number with toFixed
    return parseFloat(number).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return (
    <Box>
      {toLocale(
        discount
          .reduce(
            (sum, a) => {
              return parseFloat(sum + a.amount);
            },
            [0]
          )
          .toFixed(2)
      )}
      {`(${discount
        .map((discount) => {
          return discount.percent;
        })
        .join("/")}%)`}
      <IconButton variant="outlined" onClick={handleClickOpen}>
        <EditOutlinedIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>ส่วนลด</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              gap: "1rem",
            }}
          >
            <DialogContentText sx={{ minWidth: 280, alignSelf: "center" }}>
              ยอดก่อนส่วนลด
            </DialogContentText>
            <TextField
              disabled
              value={toLocale(totalPrice)}
              sx={{
                width: 100,
              }}
              size="small"
              margin="dense"
            />
            <DialogContentText sx={{ alignSelf: "center" }}>
              บาท
            </DialogContentText>
          </Box>
          <Divider />
          {discount &&
            discount.map((ele, index) => (
              <Box key={index}>
                <Box
                  sx={{
                    display: "flex",
                    gap: "1rem",
                  }}
                >
                  <DialogContentText
                    sx={{ minWidth: 120, alignSelf: "center" }}
                  >
                    ส่วนลดครั้งที่ {index + 1}
                  </DialogContentText>
                  <TextField
                    name="percent"
                    onChange={(event) => discountChangeHandler(index, event)}
                    value={ele.percent}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                    sx={{
                      width: 100,
                    }}
                    autoComplete="off"
                    size="small"
                    margin="dense"
                  />
                  <DialogContentText sx={{ alignSelf: "center" }}>
                    หรือ
                  </DialogContentText>
                  <TextField
                    name="amount"
                    disabled
                    value={toLocale(ele.amount)}
                    sx={{
                      width: 100,
                    }}
                    autoComplete="off"
                    size="small"
                    margin="dense"
                  />
                  <DialogContentText sx={{ alignSelf: "center" }}>
                    บาท
                  </DialogContentText>
                  {discount?.length !== 1 && (
                    <IconButton
                      sx={{
                        height: "fit-content",
                        alignSelf: "center",
                      }}
                      size="small"
                      aria-label="cancel"
                      onClick={() => removeDiscountHandler(index)}
                    >
                      <ClearIcon />
                    </IconButton>
                  )}
                </Box>
                <Divider />
              </Box>
            ))}
          <Box
            sx={{
              display: "flex",
              gap: "1rem",
              my: ".5rem",
            }}
          >
            <DialogContentText sx={{ minWidth: 120, alignSelf: "center" }}>
              รวมส่วนลด
            </DialogContentText>
            <TextField
              name="percent"
              disabled
              value={(
                (discount.reduce(
                  (sum, a) => {
                    return parseFloat(sum + a.amount);
                  },
                  [0]
                ) *
                  100) /
                  totalPrice || 0
              ).toFixed(2)}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              sx={{
                width: 100,
              }}
              autoComplete="off"
              size="small"
              margin="dense"
            />
            <DialogContentText sx={{ alignSelf: "center" }}>
              หรือ
            </DialogContentText>
            <TextField
              disabled
              name="amount"
              value={toLocale(
                discount
                  .reduce(
                    (sum, a) => {
                      return parseFloat(sum + a.amount);
                    },
                    [0]
                  )
                  .toFixed(2)
              )}
              sx={{
                width: 100,
              }}
              autoComplete="off"
              size="small"
              margin="dense"
            />
            <DialogContentText sx={{ alignSelf: "center" }}>
              บาท
            </DialogContentText>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: "1rem",
            }}
          >
            <DialogContentText sx={{ minWidth: 120, alignSelf: "center" }}>
              ยอดก่อนภาษี
            </DialogContentText>
            <TextField
              disabled
              name="percent"
              value={
                100 -
                (
                  (discount.reduce(
                    (sum, a) => {
                      return parseFloat(sum + a.amount);
                    },
                    [0]
                  ) *
                    100) /
                    totalPrice || 0
                ).toFixed(2)
              }
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              sx={{
                width: 100,
              }}
              autoComplete="off"
              size="small"
              margin="dense"
            />
            <DialogContentText sx={{ alignSelf: "center" }}>
              หรือ
            </DialogContentText>
            <TextField
              name="amount"
              disabled
              value={toLocale(
                (
                  totalPrice -
                  discount.reduce(
                    (sum, a) => {
                      return parseFloat(sum + a.amount);
                    },
                    [0]
                  )
                ).toFixed(2)
              )}
              sx={{
                width: 100,
              }}
              autoComplete="off"
              size="small"
              margin="dense"
            />
            <DialogContentText sx={{ alignSelf: "center" }}>
              บาท
            </DialogContentText>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            disabled={discount?.length >= 5}
            onClick={addDiscountHandler}
          >
            เพิ่มส่วนลด
          </Button>
          <Button onClick={handleSubmit}>บันทึก</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default AccountDiscountComponent;
