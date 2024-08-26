export const renderPaymentChannelLabel = (
  payment_channel_type,
  payment_channel_info
) => {
  if (payment_channel_info && payment_channel_type) {
    switch (payment_channel_type) {
      case "cash":
        return `เงินสด - ${payment_channel_info.cash_name}`;
      case "bank":
        return `${payment_channel_info.bank_name} - ${payment_channel_info.account_name}`;
      case "e_wallet":
        return `e-Wallet - ${payment_channel_info.account_no}`;
      case "receiver":
        return `สำรองรับ-จ่าย - ${payment_channel_info.receiver_name}`;
      default:
        return "";
    }
  }
};
