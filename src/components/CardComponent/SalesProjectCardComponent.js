import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import "moment-timezone";

export default function SalesProjectCardComponent(props) {
  const handleIsOpen = (index) => {
    const cloneIsOpen = [...props.datalist.isOpen];
    cloneIsOpen[index] = !props.datalist.isOpen[index];
    props.setFieldValue("isOpen", cloneIsOpen, false);
  };
  return (
    <div className="badge">
      {props.datalist.statusList.map((status, indexStatus) => {
        const filterDataFormStatus =
          (props.data &&
            props.data.filter((ele) => ele.project_status === status.key)) ||
          [];
        const totalPrice = filterDataFormStatus.reduce(
          (previousValue, currentValue) => {
            return (
              parseInt(previousValue) +
              parseInt(currentValue.project_deal_value)
            );
          },
          0
        );
        return (
          <div className="badge__column" key={indexStatus}>
            <div>
              <div className={status.color}>
                <div
                  style={
                    props.datalist.isOpen[indexStatus]
                      ? {}
                      : { display: "none" }
                  }
                >
                  <p className="badge__card-header">{status.name}</p>
                  <p className="badge__card-description">
                    {totalPrice.toLocaleString()} บาท
                  </p>
                </div>
                <div className="badge__pointer">
                  <p className={status.colorCircle}>
                    {filterDataFormStatus.length}
                  </p>
                  <img
                    alt="threepoints"
                    className="badge__cursor"
                    src="/icons/threepoints-icon.svg"
                    onClick={() => handleIsOpen(indexStatus)}
                  />
                </div>
              </div>
            </div>
            {console.log("filterDataFormStatus", filterDataFormStatus)}
            {filterDataFormStatus.map((card, indexCard) => {
              const classColor = "badge__subcard-info-normal";
              const employee_owner =
                card.hasOwnProperty("project_employee_list") &&
                card.project_employee_list.find(
                  (ele) => ele.role === "ผู้รับผิดชอบหลัก"
                );
              const customer_owner =
                card.hasOwnProperty("project_contact_list") &&
                card.project_contact_list[0];
              let customer_name = "";
              if (
                customer_owner &&
                customer_owner.contact_business_category === "individual"
              ) {
                customer_name =
                  // customer_owner.contact_individual_prefix_name +
                  customer_owner.contact_individual_first_name +
                  " " +
                  customer_owner.contact_individual_last_name;
              } else if (
                customer_owner &&
                customer_owner.contact_business_category === "commercial"
              ) {
                customer_name =
                  customer_owner.contact_commercial_type +
                  " " +
                  customer_owner.contact_commercial_name;
              } else if (
                customer_owner &&
                customer_owner.contact_business_category === "merchant"
              ) {
                customer_name = customer_owner.contact_merchant_name;
              }
              return (
                <Link
                  to={`/sales/project/${card.project_id}`}
                  key={indexCard}
                  className={classColor}
                  style={
                    props.datalist.isOpen[indexStatus]
                      ? {}
                      : { display: "none" }
                  }
                >
                  <p className="badge__card-header">{card.project_name}</p>
                  <p>ผู้ติดต่อ: {customer_name ? customer_name : "-"}</p>
                  <p>
                    มูลค่า: {card.project_deal_value.toLocaleString("en-US")}{" "}
                    บาท
                  </p>
                  <p>ลักษณะงาน: {card.project_category}</p>
                  <p>
                    ผู้รับผิดชอบหลัก:{" "}
                    {employee_owner && employee_owner.employee_firstname}{" "}
                    {employee_owner && employee_owner.employee_lastname}
                  </p>
                  <p className="badge__subcard-info-lastupdate">
                    อัพเดทล่าสุด{" "}
                    {card._project_lastupdate
                      ? moment(card._project_lastupdate, "X")
                          .tz("Asia/Bangkok")
                          .format("MM/DD/YYYY, HH:mm")
                      : moment(card._project_created, "X")
                          .tz("Asia/Bangkok")
                          .format("MM/DD/YYYY, HH:mm")}
                  </p>
                </Link>
              );
            })}
            {/* {filterDataFormStatus &&
              filterDataFormStatus.map((card, indexCard) => {
                const classColor = "badge__subcard-info-normal";

                const employee_owner = card.project_employee_list.filter(
                  (ele) => ele.role === "ผู้รับผิดชอบหลัก"
                )[0];
                const customer_owner = card.project_contact_list[0];
                let customer_name = "";
                if (
                  customer_owner &&
                  customer_owner.contact_business_category === "individual"
                ) {
                  customer_name =
                    // customer_owner.contact_individual_prefix_name +
                    customer_owner.contact_individual_first_name +
                    " " +
                    customer_owner.contact_individual_last_name;
                } else if (
                  customer_owner &&
                  customer_owner.contact_business_category === "commercial"
                ) {
                  customer_name =
                    customer_owner.contact_commercial_type +
                    " " +
                    customer_owner.contact_commercial_name;
                } else if (
                  customer_owner &&
                  customer_owner.contact_business_category === "merchant"
                ) {
                  customer_name = customer_owner.contact_merchant_name;
                }
                return (
                  <Link
                    to={`/sales/project/${card.project_id}`}
                    key={indexCard}
                    className={classColor}
                    style={
                      props.datalist.isOpen[indexStatus]
                        ? {}
                        : { display: "none" }
                    }
                  >
                    <p className="badge__card-header">{card.project_name}</p>
                    <p>ผู้ติดต่อ: {customer_name ? customer_name : "-"}</p>
                    <p>
                      มูลค่า: {card.project_deal_value.toLocaleString("en-US")}{" "}
                      บาท
                    </p>
                    <p>ลักษณะงาน: {card.project_category}</p>
                    <p>
                      ผู้รับผิดชอบหลัก:{" "}
                      {employee_owner && employee_owner.employee_firstname}{" "}
                      {employee_owner && employee_owner.employee_lastname}
                    </p>
                    <p className="badge__subcard-info-lastupdate">
                      อัพเดทล่าสุด{" "}
                      {card._project_lastupdate
                        ? moment(card._project_lastupdate, "X")
                            .tz("Asia/Bangkok")
                            .format("MM/DD/YYYY, HH:mm")
                        : moment(card._project_created, "X")
                            .tz("Asia/Bangkok")
                            .format("MM/DD/YYYY, HH:mm")}
                    </p>
                  </Link>
                );
              })} */}
          </div>
        );
      })}
    </div>
  );
}

// export default function SalesProjectCardComponent(props) {
//   const handleIsOpen = (index) => {
//     const cloneIsOpen = [...props.datalist.isOpen];
//     cloneIsOpen[index] = !props.datalist.isOpen[index];
//     props.setFieldValue("isOpen", cloneIsOpen, false);
//   };

//   return (
//     <div className="badge">
//       {props.datalist.statusList.map((status, indexStatus) => {
//         const filterDataFormStatus =
//           (props.data &&
//             props.data.filter((ele) => ele.project_status === status.key)) ||
//           [];
//         const totalPrice = filterDataFormStatus.reduce(
//           (previousValue, currentValue) => {
//             return (
//               parseInt(previousValue) +
//               parseInt(currentValue.project_deal_value)
//             );
//           },
//           0
//         );
//         return (
//           <div className="badge__column" key={indexStatus}>
//             <div>
//               <div className={status.color}>
//                 <div
//                   style={
//                     props.datalist.isOpen[indexStatus]
//                       ? {}
//                       : { display: "none" }
//                   }
//                 >
//                   <p className="badge__card-header">{status.name}</p>
//                   <p className="badge__card-description">
//                     {totalPrice.toLocaleString()} บาท
//                   </p>
//                 </div>
//                 <div className="badge__pointer">
//                   <p className={status.colorCircle}>
//                     {filterDataFormStatus.length}
//                   </p>
//                   <img
//                     alt="threepoints"
//                     className="badge__cursor"
//                     src="/icons/threepoints-icon.svg"
//                     onClick={() => handleIsOpen(indexStatus)}
//                   />
//                 </div>
//               </div>
//             </div>
//             {filterDataFormStatus.map((card, indexCard) => {
//               const classColor = "badge__subcard-info-normal";
//               // if (card.dueDate === 'LATE') {
//               //   classColor = 'badge__subcard-info-other'
//               // }
//               // if (card.dueDate === 'WORK') {
//               //   classColor = 'badge__subcard-info-work'
//               // }

//               const employee_owner = card.project_employee_list.filter(
//                 (ele) => ele.role === "ผู้รับผิดชอบหลัก"
//               )[0];
//               const customer_owner = card.project_contact_list[0];
//               let customer_name = "";
//               if (
//                 customer_owner &&
//                 customer_owner.contact_business_category === "individual"
//               ) {
//                 customer_name =
//                   // customer_owner.contact_individual_prefix_name +
//                   customer_owner.contact_individual_first_name +
//                   " " +
//                   customer_owner.contact_individual_last_name;
//               } else if (
//                 customer_owner &&
//                 customer_owner.contact_business_category === "commercial"
//               ) {
//                 customer_name =
//                   customer_owner.contact_commercial_type +
//                   " " +
//                   customer_owner.contact_commercial_name;
//               } else if (
//                 customer_owner &&
//                 customer_owner.contact_business_category === "merchant"
//               ) {
//                 customer_name = customer_owner.contact_merchant_name;
//               }
//               return (
//                 <Link
//                   to={`/sales/project/${card.project_id}`}
//                   key={indexCard}
//                   className={classColor}
//                   style={
//                     props.datalist.isOpen[indexStatus]
//                       ? {}
//                       : { display: "none" }
//                   }
//                 >
//                   <p className="badge__card-header">{card.project_name}</p>
//                   <p>ผู้ติดต่อ: {customer_name ? customer_name : "-"}</p>
//                   <p>
//                     มูลค่า: {card.project_deal_value.toLocaleString("en-US")}{" "}
//                     บาท
//                   </p>
//                   <p>ลักษณะงาน: {card.project_category}</p>
//                   <p>
//                     ผู้รับผิดชอบหลัก:{" "}
//                     {employee_owner && employee_owner.employee_firstname}{" "}
//                     {employee_owner && employee_owner.employee_lastname}
//                   </p>
//                   <p className="badge__subcard-info-lastupdate">
//                     อัพเดทล่าสุด{" "}
//                     {card._project_lastupdate
//                       ? moment(card._project_lastupdate, "X")
//                           .tz("Asia/Bangkok")
//                           .format("MM/DD/YYYY, HH:mm")
//                       : moment(card._project_created, "X")
//                           .tz("Asia/Bangkok")
//                           .format("MM/DD/YYYY, HH:mm")}
//                   </p>
//                 </Link>
//               );
//             })}
//           </div>
//         );
//       })}
//     </div>
//   );
// }
