import axios from "axios";
import moment from "moment";
import "moment-timezone";
import { getToken, getUser, getExp, removeUserSession } from "../Auth";

import {
  itemInventory,
  itemMasterById,
  InventoryCounting,
  goodReceiptItem,
  goodIssueItem,
  getGoodReceiptItem,
  getGoodIssueItem,
  getInventoryCountingItem,
  listInventoryJournal,
  listItemCurrent,
  generateItemID,
  generateDocumentID,
  listItemCategory,
  listItemProperty,
  listUOMGroup,
  getUOMGroupUUID,
  listWareHouse,
  getItemFromBarcode,
  listBinLocation,
  goodsTranferItem,
  getGoodsTransferItemById,
  getUOM,
} from "./query";
import {
  createGoodReceipt,
  createItemMasterData,
  updateGoodReceipt,
  createGoodIssue,
  updateGoodIssue,
  updateItemMasterData,
  scanSerial,
  createInventoryCounting,
  updateInventoryCounting,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  createBinLocation,
  updateBinLocation,
  deleteBinLocation,
  createItemProperty,
  updateItemProperty,
  deleteItemProperty,
  createItemCategory,
  updateItemCategory,
  deleteItemCategory,
  createUOMGroup,
  updateUOMGroup,
  deleteUOMGroup,
  createGoodsTransfer,
  updateGoodsTransfer,
  createUOM,
  deleteUOM,
} from "./mutation";

export const BASE_URL = `http://localhost:8080/graphql`;

function returnAxiosInstance() {
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    // timeout: 1000 * 20 // default is `0` (no timeout) 20 seconds 1000*20
  });

  // Setting headers for authorization. You can do this in instances or interceptors
  // https://stackoverflow.com/questions/45578844/how-to-set-header-and-options-in-axios
  const accessToken = getToken();
  if (accessToken) {
    // Set for all requests (common) , or should we just do for post?
    axiosInstance.defaults.headers.common["Authorization"] =
      "Bearer " + accessToken;
  }

  return axiosInstance;
}

// check token
function checkToken() {
  const user = getUser();
  const token = getToken();
  const exp = getExp();

  if (user == null || !user) {
    console.log("User not found");
    removeUserSession();
    window.location.href = "/login";
    return false;
  }

  if (token == null || !token) {
    console.log("Token not found");
    removeUserSession();
    window.location.href = "/login";
    return false;
  }

  if (exp == null || !exp) {
    console.log("Token not found");
    removeUserSession();
    window.location.href = "/login";
    return false;
  }

  if (exp && exp <= moment().tz("Asia/Bangkok").unix()) {
    console.log("Expired token");
    removeUserSession();
    window.location.href = "/login";
    return false;
  }

  return true;
}

export function get(url = "/") {
  if (!checkToken()) return;
  const axios = returnAxiosInstance();
  return axios.get(url);
}

export function post(url = "/", requestData) {
  if (!checkToken()) return;
  const axios = returnAxiosInstance();
  return axios.post(url, requestData);
}

//<========== get Data ===========>

export function getItemID(getItemIdInput, query = generateItemID) {
  const variables = {
    ...getItemIdInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function getDocumentID(
  generateDocumentIDInput,
  query = generateDocumentID
) {
  const variables = {
    ...generateDocumentIDInput
  };
  return post("/", {
    query,
    variables
  });
}

export function queryItemInventory(itemInventoryInput, query = itemInventory) {
  const variables = {
    ...itemInventoryInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function getItemMasterById(queryItemByIdInput, query = itemMasterById) {
  const variables = {
    ...queryItemByIdInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function querylistInventoryJournal(
  listInventoryJournalInput,
  query = listInventoryJournal
) {
  const variables = {
    ...listInventoryJournalInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function querylistItemCurrent(
  querylistItemCurrentInput,
  query = listItemCurrent
) {
  const variables = {
    ...querylistItemCurrentInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function queryGoodreceiptItem(
  GoodreceiptItemInput,
  query = goodReceiptItem
) {
  const variables = {
    ...GoodreceiptItemInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function getGoodreceiptItem(
  getGoodReceiptItemIdInput,
  query = getGoodReceiptItem
) {
  const variables = {
    ...getGoodReceiptItemIdInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function queryGoodIssueItem(GoodIssueItemInput, query = goodIssueItem) {
  const variables = {
    ...GoodIssueItemInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function getGoodIssueById(
  getGoodIssueItemInput,
  query = getGoodIssueItem
) {
  const variables = {
    ...getGoodIssueItemInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function queryGoodsTranferItem(
  GoodsTranferItemInput,
  query = goodsTranferItem
) {
  const variables = {
    ...GoodsTranferItemInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function getGoodsTransferById(
  getGoodsTransferItemByIdInput,
  query = getGoodsTransferItemById
) {
  const variables = {
    ...getGoodsTransferItemByIdInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function queryInventoryCountingItem(
  InventoryCountingInput,
  query = InventoryCounting
) {
  const variables = {
    ...InventoryCountingInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function getInventoryCountingById(
  getInventoryCountingItemInput,
  query = getInventoryCountingItem
) {
  const variables = {
    ...getInventoryCountingItemInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function getItemCategoryList(
  getItemCategoryListInput,
  query = listItemCategory
) {
  const variables = {
    ...getItemCategoryListInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function getItemPropertyList(
  getItemPropertyListInput,
  query = listItemProperty
) {
  const variables = {
    ...getItemPropertyListInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function getAllUom(getUOMInput, query = getUOM) {
  const variables = {
    ...getUOMInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function getListUOMGroup(getListUOMGroupInput, query = listUOMGroup) {
  const variables = {
    ...getListUOMGroupInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function getListWareHouse(getListWareHouseInput, query = listWareHouse) {
  const variables = {
    ...getListWareHouseInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function getListBinLocation(
  getListBinLocationInput,
  query = listBinLocation
) {
  const variables = {
    ...getListBinLocationInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function getUOMGroupUUIDByID(
  getUOMGroupUUIDInput,
  query = getUOMGroupUUID
) {
  const variables = {
    ...getUOMGroupUUIDInput,
  };
  return post("/", {
    query,
    variables,
  });
}

//<========== post Data ==========>

export function createItemMaster(
  createItemMasterInput,
  query = createItemMasterData
) {
  const variables = {
    ...createItemMasterInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function createGoodReceiptItem(
  createGoodReceiptItemInput,
  query = createGoodReceipt
) {
  const variables = {
    ...createGoodReceiptItemInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function createGoodIssueItem(
  createGoodIssueItemInput,
  query = createGoodIssue
) {
  const variables = {
    ...createGoodIssueItemInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function createInventoryCountingItem(
  createInventoryCountingInput,
  query = createInventoryCounting
) {
  const variables = {
    ...createInventoryCountingInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function updateInventoryCountingItem(
  updateInventoryCountingInput,
  query = updateInventoryCounting
) {
  const variables = {
    ...updateInventoryCountingInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function createGoodsTransferItem(
  createGoodsTransferItemInput,
  query = createGoodsTransfer
) {
  const variables = {
    ...createGoodsTransferItemInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function updateGoodsTransferItem(
  updateGoodsTransferItemInput,
  query = updateGoodsTransfer
) {
  const variables = {
    ...updateGoodsTransferItemInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function scanSerialBatch(scanSerialBatchInput, query = scanSerial) {
  const variables = {
    ...scanSerialBatchInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function getItemFromSerial(
  getItemFromBarcodeInput,
  query = getItemFromBarcode
) {
  const variables = {
    ...getItemFromBarcodeInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function createConfigWarehouse(
  createWarehouseInput,
  query = createWarehouse
) {
  const variables = {
    ...createWarehouseInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function createConfigBinLocation(
  createBinLocationInput,
  query = createBinLocation
) {
  const variables = {
    ...createBinLocationInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function createConfigItemProperty(
  createItemPropertyInput,
  query = createItemProperty
) {
  const variables = {
    ...createItemPropertyInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function createConfigItemCategory(
  createItemCategoryInput,
  query = createItemCategory
) {
  const variables = {
    ...createItemCategoryInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function createConfigUOM(createUOMInput, query = createUOM) {
  const variables = {
    ...createUOMInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function createConfigUOMGroup(
  createUOMGroupInput,
  query = createUOMGroup
) {
  const variables = {
    ...createUOMGroupInput,
  };
  return post("/", {
    query,
    variables,
  });
}

// update Data

export function updateMasterDataItem(
  updateItemMasterDataItemInput,
  query = updateItemMasterData
) {
  const variables = {
    ...updateItemMasterDataItemInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function updateGoodReceiptItem(
  updateGoodReceiptItemInput,
  query = updateGoodReceipt
) {
  const variables = {
    ...updateGoodReceiptItemInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function updateGoodIssueItem(
  updateGoodIssueItemInput,
  query = updateGoodIssue
) {
  const variables = {
    ...updateGoodIssueItemInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function updateConfigWarehouse(
  updateWarehouseInput,
  query = updateWarehouse
) {
  const variables = {
    ...updateWarehouseInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function deleteConfigWarehouse(
  deleteWarehouseInput,
  query = deleteWarehouse
) {
  const variables = {
    ...deleteWarehouseInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function updateConfigCategory(
  updateItemCategoryInput,
  query = updateItemCategory
) {
  const variables = {
    ...updateItemCategoryInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function deleteConfigCategory(
  deleteItemCategoryInput,
  query = deleteItemCategory
) {
  const variables = {
    ...deleteItemCategoryInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function updateConfigBinLocation(
  updateBinLocationInput,
  query = updateBinLocation
) {
  const variables = {
    ...updateBinLocationInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function deleteConfigBinLocation(
  deleteBinLocationInput,
  query = deleteBinLocation
) {
  const variables = {
    ...deleteBinLocationInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function deleteConfigUom(deleteConfigUomInput, query = deleteUOM) {
  const variables = {
    ...deleteConfigUomInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function updateConfigItemProperty(
  updateItemPropertyInput,
  query = updateItemProperty
) {
  const variables = {
    ...updateItemPropertyInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function deleteConfigItemProperty(
  deleteItemPropertyInput,
  query = deleteItemProperty
) {
  const variables = {
    ...deleteItemPropertyInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function updateConfigUOMGroup(
  updateUOMGroupInput,
  query = updateUOMGroup
) {
  const variables = {
    ...updateUOMGroupInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function deleteConfigUOMGroup(
  deleteUOMGroupInput,
  query = deleteUOMGroup
) {
  const variables = {
    ...deleteUOMGroupInput,
  };
  return post("/", {
    query,
    variables,
  });
}

export function deleteConfigUOM(deleteUOMInput, query = deleteUOM) {
  const variables = {
    ...deleteUOMInput,
  };
  return post("/", {
    query,
    variables,
  });
}
