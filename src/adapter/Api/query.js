// get All item

export const itemInventory = `
query Query {
  listItem {
    nextToken
    items {
      id
      createdAt
      internalID
      name
      itemType
      description
      isSales
      isInventory
      isPurchase
      getItemCategory {
        internalID
        name
        parentList {
          internalID
          name
        }
      }
      listItemCurrent {
        items {
          onHandQty
          orderedQty
          committedQty
        }
        nextToken
      }
      getSaleBaseUOMDimensions {
        uomID
        lengthUOM
        widthUOM
        heightUOM
        weightUOM
        length
        width
        height
        weight
      }
      getUOMGroup {
        id
        internalID
        name
        listUOM {
          uomID
          name
        }
      }
      itemPropertyList {
        id
        name
        internalID
        type
        description
        value
      }
      inventoryUOMID
      saleUOMID
      isActive
      purchaseUnitPrice
      purchaseMinOrderQty
      saleUnitPrice
      baseUOMID
      defaultWarehouseID
      isInventory
    }
  }
}
`;

export const goodReceiptItem = `
query Query {
  listGoodsReceiptDocument {
    items {
      id
      createdAt
      receiptType
      txSeries
      documentDate
      listDocumentReference {
        documentID
      }
      status
    }
    nextToken
  }
}
`;

export const goodIssueItem = `
query Query {
  listGoodsIssueDocument {
    items {
      id
      status
      createdAt
      issueType
      listDocumentReference {
        documentID
      }
    }
    nextToken
  }
}
`;

export const goodsTranferItem = `
query Query {
  listGoodsTransferDocument {
    items {
      txSeries
      id
      status
      remark
      createdByUserID
      documentType
      createdAt
      updatedAt
      documentDate
      fromWarehouseID
      toWarehouseID
      listDocumentReference {
        txSeries
        documentID
      }
      listDocumentAttachment {
        name
        s3URL
        createdAt
      }
    }
  }
}`;

export const InventoryCounting = `
query Query {
  listInventoryCountingDocument {
    nextToken
    items {
      id
      status
      txSeries
      remark
      documentDate
      createdAt
      updatedAt
      warehouseID
      lineItem {
        id
        txSeries
        lineID
        sortNo
        warehouseID
        uomID
        binLocationID
      }
    }
  }
}
`;

// get Item By Id

export const itemMasterById = `
query Query($getItemUuidId: ID!, $uomId: ID!)  {
  getItemUUID(id: $getItemUuidId) {
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
    isActive
    getUOMGroup {
      id
      internalID
      listUOM {
        uomID
        name
      }
    }
    getInventoryUOM {
      id
      name
    }
    getPurchaseUOM {
      id
      name
    }
    getSaleUOM {
      id
      name
    }
    saleUnitPrice
    saleMaximumDiscount
    taxType
    purchaseUnitPrice
    preferredVendorID
    purchaseMinOrderQty
    itemValuation
    defaultWarehouseID
    inventoryMinQty
    remark
    itemPropertyList {
      id
      name
      internalID
      type
      description
      value
    }
    getSaleBaseUOMDimensions {
      length
      width
      height
      weight
      lengthUOM
      widthUOM
      heightUOM
      weightUOM
      uomID
    }
    getItemCategory {
      id
      internalID
      name
      parentList {
        id
        internalID
        name
        parentList {
          id
          internalID
          name
          parentList {
            id
            internalID
            name
          }
        }
      }
    }
    listItemCurrentOnUOM(uomID: $uomId) {
      items {
        itemID
        warehouseID
        onHandQty
        committedQty
        orderedQty
      }
    }
    listItemCurrent {
      items {
        itemID
        warehouseID
        onHandQty
        serialBatchCurrentList {
          items {
            itemID
            serialBatchID
            warehouseID
            onHandQty
            binLocationCurrentList {
              items {
                itemID
                warehouseID
                serialBatchID
                binLocationID
              }
            }
          }
        }
        binLocationCurrentList {
          items {
            itemID
            warehouseID
            serialBatchID
          }
        }
      }
    }
    listTransaction {
      items {
        documentID
        documentType
        lineID
        txSeries
        runningID
        warehouseID
        createdAt
        changeType
        changeOrdered
        changeOnHand
        getItem {
          name
          id
          getUOMGroup {
            id
            name
            baseUOMName
          }
        }
        getDocument {
          listDocumentReference {
            documentID
            txSeries
          }
          status
          documentType
          ... on GoodsReceiptDocument {
            receiptType
          }
          ... on GoodsIssueDocument {
            issueType
          }
        }
      }
    }
  }
}
`;

export const getGoodReceiptItem = `
query Query($txSeries: ID!, $getGoodsReceiptDocumentId: ID!) {
  getGoodsReceiptDocument(txSeries: $txSeries, id: $getGoodsReceiptDocumentId) {
    txSeries
    id
    status
    documentDate
    receiptType
    remark
    listDocumentReference {
      txSeries
      documentID
    }
    lineItem {
      id
      lineID
      sortNo
      quantityReference
      quantity
      perUnitPrice
      itemID
      uomID
      warehouseID
      serialBatchList {
        quantity
        serialBatchID
        binLocationID
      }
      item {
        name
      }
    }
    createdAt
  }
}
`;

export const getGoodIssueItem = `
query Query($txSeries: ID!, $getGoodsIssueDocumentId: ID!) {
  getGoodsIssueDocument(txSeries: $txSeries, id: $getGoodsIssueDocumentId) {
    txSeries
    id
    issueType
    createdAt
    updatedAt
    status
    remark
    createdByUserID
    documentDate
    listDocumentReference {
      documentID
      txSeries
    }
    lineItem {
      txSeries
      id
      lineID
      quantityReference
      quantity
      sortNo
      perUnitPrice
      itemID
      uomID
      warehouseID
      binLocationID
      serialBatchList {
        serialBatchID
        quantity
        scanByUserID
        isScan
        scanAt
      }
      totalCountedQty
      changedPrice
      item {
        name
      }
    }
  }
}
`;

export const getGoodsTransferItemById = `
query Query($txSeries: ID!, $getGoodsTransferDocumentId: ID!) {
  getGoodsTransferDocument(txSeries: $txSeries, id: $getGoodsTransferDocumentId) {
    txSeries
    id
    status
    remark
    createdByUserID
    documentType
    createdAt
    updatedAt
    documentDate
    fromWarehouseID
    toWarehouseID
    listDocumentReference {
      txSeries
      documentID
    }
    listDocumentAttachment {
      name
      s3URL
      createdAt
    }
    lineItem {
      txSeries
      id
      lineID
      quantityReference
      quantity
      sortNo
      itemID
      uomID
      warehouseID
      binLocationID
      perUnitPrice
      serialBatchList {
        serialBatchID
        quantity
        scanByUserID
        isScan
        scanAt
      }
      totalCountedQty
      changedPrice
      item {
        name
      }
       warehouse {
        id
        internalID
        name
        listBinLocation {
          items {
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
        }
      }
    }
  }
}`;

export const getInventoryCountingItem = `
query Query($txSeries: ID!, $getInventoryCountingDocumentId: ID!) {
  getInventoryCountingDocument(txSeries: $txSeries, id: $getInventoryCountingDocumentId) {
    txSeries
    id
    status
    remark
    createdByUserID
    warehouseID
    createdAt
    documentDate
    listDocumentReference {
      documentID
      txSeries
    }
    lineItem {
      txSeries
      lineID
      sortNo
      quantityReference
      quantity
      perUnitPrice
      itemID
      uomID
      warehouseID
      binLocationID
      totalCountedQty
      changedPrice
      serialBatchList {
        serialBatchID
        quantity
        scanByUserID
        scanAt
        totalCountedQty
        remark
        isScan
      }
      item {
        name
      }
    }
  }
}
`;

export const listInventoryJournal = `
query Query {
  listInventoryJournal {
    items {
      itemID
      documentID
      documentType
      createdAt
      changeOnHand
      changeType
      getItem {
        id
        name
        internalID
      }
      getDocument {
        id
        txSeries
        documentType
        status
        listDocumentReference {
          documentID
          txSeries
        }
      }
    }
    nextToken
  }
}
`;

export const listItemCurrent = `
query Query {
  listItem {
    items {
      listItemCurrent {
        items {
          itemID
          warehouseID
          onHandQty
          committedQty
          orderedQty
        }
      }
    }
  }
}
`;

export const listItemCategory = `
query Query($parentIdList: [ID!]!) {
  listItemCategory(parentIDList: $parentIdList) {
    items {
      id
      internalID
      name
      description
      isLeaf
      listChild {
        items {
          id
          internalID
          name
          description
          isLeaf
          listChild {
            items {
              id
              internalID
              name
              description
              isLeaf
              listChild {
                items {
                  id
                  internalID
                  name
                  description
                  isLeaf
                }
              }
            }
          }
        }
      }
    }
    nextToken
  }
}
`;

export const listItemProperty = `
query Query {
  listItemProperty {
    items {
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

export const listUOM = `
query Query {
  listUOM {
    items {
      id
      name
    }
  }
}`;

export const listUOMGroup = `
query Query {
  listUOMGroup {
    nextToken
    items {
      id
      internalID
      name
      baseUOMID
      baseUOMName
      description
      listUOM {
        uomID
        altQty
        baseQty
        name
      }
    }
  }
}
`;

export const listWareHouse = `
query Query {
  listWarehouse {
    items {
      id
      internalID
      name
      listBinLocation {
        items {
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
      }
    }
  }
}
`;

export const listBinLocation = `
query Query($warehouseId: ID!, $parentIdList: [ID!]!) {
  listBinLocation(warehouseID: $warehouseId, parentIDList: $parentIdList) {
    items {
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
  }
}
`;

export const getUOM = `
query Query {
  listUOM {
    items {
      id
      name
      description
    }
  }
}
`;

export const getUOMGroupUUID = `
query GetUOMGroupUUID($getUomGroupUuidId: ID!) {
  getUOMGroupUUID(id: $getUomGroupUuidId) {
    id
    internalID
    name
    baseUOMID
    baseUOMName
    description
    listUOM {
      uomID
      altQty
      baseQty
      name
    }
  }
}
`;

export const generateItemID = `
query Query($itemType: EItemType!) {
  getItemCounter(itemType: $itemType) {
    output
  }
}
`;

export const generateDocumentID = `
query Query($txSeries: ID!, $documentType: DOCUMENT_TYPE!) {
  getDocumentCounter(txSeries: $txSeries, documentType: $documentType) {
    output
  }
}
`;

export const getItemFromBarcode = `
query Query($barcode: String!) {
  getItemUOMFromBarcode(barcode: $barcode)
}
`;
