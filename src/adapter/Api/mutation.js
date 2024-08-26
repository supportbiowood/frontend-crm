export const createItemMasterData = `
mutation Mutation($input: CreateItemInput!) {
  createItem(input: $input) {
    id
    internalID
    isInventory
    isSales
    isPurchase
    name
    description
    itemType
    imageURLList
    tagList
    itemCategoryID
    remark
    isActive
    listSaleUOMCustom {
      uomID
      width
      height
      length
      weight
      lengthUOM
      widthUOM
      heightUOM
      weightUOM
    }
    uomGroupID
    inventoryUOMID
    purchaseUOMID
    saleUOMID
    saleUnitPrice
    saleMaximumDiscount
    taxType
    purchaseUnitPrice
    preferredVendorID
    purchaseMinOrderQty
    itemValuation
    defaultWarehouseID
    inventoryMinQty
    itemPropertyList {
      id
      name
      internalID
      type
      description
      value
    }
  }
}
`;

export const updateItemMasterData = `
mutation Mutation($input: UpdateItemInput!) {
  updateItem(input: $input) {
    id
    internalID
    isInventory
    isSales
    isPurchase
    name
    description
    itemType
    imageURLList
    tagList
    itemCategoryID
    isActive
    listSaleUOMCustom {
      uomID
      width
      height
      length
      weight
      lengthUOM
      widthUOM
      heightUOM
      weightUOM
    }
    uomGroupID
    inventoryUOMID
    purchaseUOMID
    saleUOMID
    saleUnitPrice
    saleMaximumDiscount
    purchaseUnitPrice
    preferredVendorID
    purchaseMinOrderQty
    itemValuation
    defaultWarehouseID
    inventoryMinQty
    itemPropertyList {
      id
      name
      internalID
      type
      description
      value
    }
  }
}
`;

// GoodReceiptItem

export const createGoodReceipt = `
mutation Mutation($input: CreateGoodsReceiptDocumentInput!) {
  createGoodsReceiptDocument(input: $input) {
    txSeries
    id
    status
    createdByUserID
    listDocumentReference {
      txSeries
      documentID
    }
    createdAt
    updatedAt
    documentDate
    receiptType
    lineItem {
      txSeries
      id
      lineID
      quantityReference
      quantity
      perUnitPrice
      itemID
      uomID
      sortNo
      warehouseID
      binLocationID
      serialBatchList {
        serialBatchID
        quantity
        isScan
        scanByUserID
        scanAt
      }
    }
  }
}
`;

export const updateGoodReceipt = `
mutation Mutation($input: UpdateGoodsReceiptDocumentInput!) {
  updateGoodsReceiptDocument(input: $input) {
    txSeries
    id
    status
    createdByUserID
    listDocumentReference {
      txSeries
      documentID
    }
    createdAt
    updatedAt
    documentDate
    receiptType
    lineItem {
      lineID
      quantityReference
      quantity
      perUnitPrice
      itemID
      uomID
      sortNo
      warehouseID
      binLocationID
      serialBatchList {
        serialBatchID
        quantity
        isScan
        scanByUserID
        scanAt
      }
    }
  }
}
`;

export const updateGoodReceiptCloseStage = `
mutation Mutation($input: UpdateGoodsReceiptDocumentInput!) {
  updateGoodsReceiptDocument(input: $input) {
    txSeries
    id
    status
  }
}
`;

// GoodIssueItem

export const createGoodIssue = `
mutation Mutation($input: CreateGoodsIssueDocumentInput!) {
  createGoodsIssueDocument(input: $input) {
    txSeries
    id
    status
    createdByUserID
    listDocumentReference {
      txSeries
      documentID
    }
    createdAt
    updatedAt
    documentDate
    issueType
    lineItem {
      lineID
      quantityReference
      quantity
      perUnitPrice
      itemID
      uomID
      sortNo
      warehouseID
      binLocationID
      serialBatchList {
        serialBatchID
        quantity
        isScan
        scanByUserID
        scanAt
      }
    }
  }
}
`;

export const updateGoodIssue = `
mutation Mutation($input: UpdateGoodsIssueDocumentInput!) {
  updateGoodsIssueDocument(input: $input) {
    txSeries
    id
    status
    createdByUserID
    listDocumentReference {
      txSeries
      documentID
    }
    createdAt
    updatedAt
    documentDate
    issueType
    lineItem {
      lineID
      quantityReference
      quantity
      perUnitPrice
      itemID
      uomID
      sortNo
      warehouseID
      binLocationID
      serialBatchList {
        serialBatchID
        quantity
        isScan
        scanByUserID
        scanAt
      }
    }
  }
}
`;

export const updateGoodIssueCloseStage = `
mutation Mutation($input: UpdateGoodsIssueDocumentInput!) {
  updateGoodsIssueDocument(input: $input) {
    txSeries
    id
    status
  }
}
`;
//GoodsTransfer

export const createGoodsTransfer = `
mutation Mutation($input: CreateGoodsTransferDocumentInput!) {
  createGoodsTransferDocument(input: $input) {
    txSeries
    id
    status
    remark
    createdByUserID
    documentType
    listDocumentReference {
      txSeries
      documentID
    }
    listDocumentAttachment {
      name
      s3URL
      createdAt
    }
    createdAt
    updatedAt
    documentDate
    fromWarehouseID
    toWarehouseID
    lineItem {
      txSeries
      id
      lineID
      sortNo
      quantityReference
      quantity
      perUnitPrice
      itemID
      warehouseID
      binLocationID
      serialBatchID
      changedQty
      changedPrice
    }
  }
}`;

export const updateGoodsTransfer = `
mutation UpdateGoodsTransferDocument($input: UpdateGoodsTransferDocumentInput!) {
  updateGoodsTransferDocument(input: $input) {
    txSeries
    id
    status
    remark
    createdByUserID
    documentType
    listDocumentReference {
      txSeries
      documentID
    }
    createdAt
    updatedAt
    documentDate
    fromWarehouseID
    toWarehouseID
    lineItem {
      txSeries
      id
      lineID
      sortNo
      quantityReference
      quantity
      perUnitPrice
      totalCountedQty
      changedQty
      binLocationID
      warehouseID
      uomID
      itemID
    }
  }
}`;

//StockItem

export const createInventoryCounting = `
mutation Mutation($input: CreateInventoryCountingDocumentInput!) {
  createInventoryCountingDocument(input: $input) {
    txSeries
    status
    remark
    documentDate
    warehouseID
    inventoryCountingType
    lineItem {
      txSeries
      id
      lineID
      sortNo
      quantityReference
      quantity
      warehouseID
      uomID
    }
  }
}
`;

export const updateInventoryCounting = `
mutation Mutation($input: UpdateInventoryCountingDocumentInput!) {
  updateInventoryCountingDocument(input: $input) {
    id
    txSeries
    status
    remark
    documentDate
    warehouseID
    listDocumentReference {
      documentID
      txSeries
    }
    lineItem {
      lineID
      sortNo
      itemID
      quantityReference
      quantity
      uomID
      warehouseID
      perUnitPrice
      binLocationID
      
      serialBatchList {
        serialBatchID
        quantity
        totalCountedQty
        changedQty
        remark
      }
    }
  }
}
`;

//scanSerial

export const scanSerial = `
mutation Mutation($txSeries: ID!, $documentId: ID!, $serialBatchId: ID!) {
  scanSerialBatch(txSeries: $txSeries, documentID: $documentId, serialBatchID: $serialBatchId)
}
`;

// config

export const createWarehouse = `
mutation Mutation($input: CreateWarehouseInput!) {
  createWarehouse(input: $input) {
    id
    internalID
    name
    listBinLocation {
      items {
        id
        internalID
        name
      }
    }
  }
}`;

export const updateWarehouse = `
mutation Mutation($input: UpdateWarehouseInput!) {
  updateWarehouse(input: $input) {
    id
    internalID
    name
    listBinLocation {
      items {
        id
        internalID
        name
      }
    }
  }
}`;

export const deleteWarehouse = `
mutation Mutation($input: DeleteWarehouseInput!) {
  deleteWarehouse(input: $input) {
    id
    internalID
    name
  }
}`;

export const createBinLocation = `
mutation Mutation($input: CreateBinLocationInput!) {
  createBinLocation(input: $input) {
    id
    internalID
    name
    listBinLocation {
      items {
        id
        internalID
        name
      }
    }
  }
}`;

export const updateBinLocation = `
mutation Mutation($input: UpdateBinLocationInput!) {
  updateBinLocation(input: $input) {
    id
    internalID
    name
    listBinLocation {
      items {
        id
        internalID
        name
      }
    }
  }
}`;

export const deleteBinLocation = `
mutation Mutation($input: DeleteBinLocationInput!) {
  deleteBinLocation(input: $input) {
    id
    internalID
    name
  }
}`;

export const createItemProperty = `
mutation Mutation($input: CreateItemPropertyInput!) {
  createItemProperty(input: $input) {
    id
    name
    internalID
    type
    description
    value
  }
}`;

export const updateItemProperty = `
mutation Mutation($input: UpdateItemPropertyInput!) {
  updateItemProperty(input: $input) {
    id
    name
    internalID
    type
    description
    value
  }
}`;

export const deleteItemProperty = `
mutation Mutation($input: DeleteItemPropertyInput!) {
  deleteItemProperty(input: $input) {
    id
    name
    internalID
    type
    description
    value
  }
}`;

export const createItemCategory = `
mutation CreateItemCategory($input: CreateItemCategoryInput!) {
  createItemCategory(input: $input) {
    id
    internalID
    name
    description
    PK
    SK
    isLeaf
    parentList {
      id
      internalID
      name
      description
      PK
      SK
      isLeaf
    }
  }
}`;

export const updateItemCategory = `
mutation Mutation($input: UpdateItemCategoryInput!) {
  updateItemCategory(input: $input) {
    id
    internalID
    name
    description
    parentList {
      id
      internalID
      name
      description
    }
  }
}`;

export const deleteItemCategory = `
mutation Mutation($input: DeleteItemCategoryInput!) {
  deleteItemCategory(input: $input) {
    id
    internalID
    name
    description
    PK
    SK
    isLeaf
    parentList {
      id
      internalID
      name
      description
      PK
      SK
      isLeaf
    }
  }
}`;

export const createUOM = `
mutation PutUOM($input: PutUOMInput!) {
  putUOM(input: $input) {
    id
    name
    description
  }
}
`;

export const deleteUOM = `
mutation DeleteUOM($input: DeleteUOMInput!) {
  deleteUOM(input: $input) {
    id
    name
  }
}
`;

export const createUOMGroup = `
mutation Mutation($input: CreateUOMGroupInput!) {
  createUOMGroup(input: $input) {
    id
    internalID
    name
    description
    baseUOMID
    baseUOMName
    listUOM {
      uomID
      baseQty
      name
      description
      uom {
        id
        name
      }
    }
  }
}`;

export const updateUOMGroup = `
mutation Mutation($input: UpdateUOMGroupInput!) {
  updateUOMGroup(input: $input) {
    id
    internalID
    name
    description
    baseUOMID
    baseUOMName
    listUOM {
      uomID
      altQty
      baseQty
      name
      description
      uom {
        id
        name
      }
    }
  }
}`;

export const deleteUOMGroup = `
mutation Mutation($input: DeleteUOMGroupInput!) {
  deleteUOMGroup(input: $input) {
    id
    internalID
    name
    description
    baseUOMID
    baseUOMName
    listUOM {
      uomID
      altQty
      baseQty
      name
      description
      uom {
        id
        name
      }
    }
  }
}`;
