import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { renderPaymentChannelLabel } from "./renderPaymentChannelLabel";

const SelectPaymentMethod = ({
  paymentMethod,
  handlePaymentMethodChange,
  disabled,
  allPaymentChannel,
}) => {
  const formatAllPaymentChannel =
    allPaymentChannel &&
    allPaymentChannel.map((channel) => {
      return {
        payment_channel_id: channel.payment_channel_id,
        label: renderPaymentChannelLabel(
          channel.payment_channel_type,
          channel.payment_channel_info
        ),
        value: channel.payment_channel_id,
      };
    });

  return (
    <FormControl sx={{ my: "1rem" }} fullWidth size="small">
      <InputLabel id="demo-simple-select-label">รับเงินโดย</InputLabel>
      <Select
        disabled={disabled}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={paymentMethod}
        label="รับเงินโดย"
        onChange={handlePaymentMethodChange}
      >
        <MenuItem value="addNewPayment">เพิ่มช่องทางชำระเงิน</MenuItem>
        <MenuItem value="check">เช็ค</MenuItem>
        {formatAllPaymentChannel &&
          formatAllPaymentChannel.map((payment) => (
            <MenuItem key={payment.payment_channel_id} value={payment.value}>
              {payment.label}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default SelectPaymentMethod;
