const items = [
  {
    item_id: "A",
    transactionsList: [
      {
        transaction_id: "A-01",
        serial: "SERIAL_A_01",
        actual_unit: 0,
      },
    ],
  },
  {
    item_id: "B",
    transactionsList: [
      {
        transaction_id: "B-01",
        serial: "SERIAL_B_01",
        actual_unit: 0,
      },
      {
        transaction_id: "B-02",
        serial: "SERIAL_B_02",
        actual_unit: 0,
      },
    ],
  },
];

// console.log(items)
let item_index = 0;
let transaction_index = 0;

// Add transaction
items[item_index].transactionsList.push(
    {
        transaction_id: "A-02",
        serial: "SERIAL_A_02" ,
        actual_unit: 0
    }
)

// Edit transaction
// let item_index = 0;
// let transaction_index = 0;

// console.log(items[item_index].transactionsList[transaction_index]);

// Send payload
items.map((item)=> {
    item.transactionsList.map((transaction)=> {
        console.log(item.item_id, transaction);
    });
})

// Scan
// 1. Input length 13
let input_value = "ABCDEFG123456"
console.log(input_value.length)

// 2. if(input_value.length = 13) find_index serial == input_value
// -1 > Show error
// >=0 Change serial status = "สแกนแล้ว" 

// 3. clear input_value