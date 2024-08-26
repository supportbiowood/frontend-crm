import React from "react";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 16,
  },
}));

export default function DotStatusComponent({ value }) {
  const netBalance = value.onHandQty - (value.orderedQty + value.committedQty);

  return (
    <div>
      {netBalance > 0 ? (
        <LightTooltip
          title={
            <React.Fragment>
              <div
                style={{ width: "250px", height: "125px", padding: "7.5px" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(143, 203, 177, 1)",
                    }}
                  />
                  <div>มีสินค้า</div>
                </div>
                <hr style={{ margin: "5px 0" }} />
                <div className="account__tabledata__dotstatus">
                  <div>ซื้อ</div>
                  <div>{value.orderedQty || 0}</div>
                </div>
                <div className="account__tabledata__dotstatus">
                  <div>จอง</div>
                  <div>{value.committedQty || 0}</div>
                </div>
                <div className="account__tabledata__dotstatus">
                  <div>คงคลัง</div>
                  <div>{value.onHandQty || 0}</div>
                </div>
                <div className="account__tabledata__dotstatus">
                  <div>คงเหลือสุทธิ</div>
                  <div>{netBalance}</div>
                </div>
              </div>
            </React.Fragment>
          }
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "rgba(143, 203, 177, 1)",
            }}
          />
        </LightTooltip>
      ) : (
        <LightTooltip
          title={
            <React.Fragment>
              <div
                style={{ width: "250px", height: "125px", padding: "7.5px" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(244, 67, 54, 1)",
                    }}
                  />
                  <div>ไม่มีสินค้า</div>
                </div>
                <hr style={{ margin: "5px 0 " }} />
                <div className="account__tabledata__dotstatus">
                  <div>ซื้อ</div>
                  <div>{value.orderedQty || 0}</div>
                </div>
                <div className="account__tabledata__dotstatus">
                  <div>จอง</div>
                  <div>{value.committedQty || 0}</div>
                </div>
                <div className="account__tabledata__dotstatus">
                  <div>คงคลัง</div>
                  <div>{value.onHandQty || 0}</div>
                </div>
                <div className="account__tabledata__dotstatus">
                  <div>คงเหลือสุทธิ</div>
                  <div>{netBalance}</div>
                </div>
              </div>
            </React.Fragment>
          }
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "rgba(244, 67, 54, 1)",
            }}
          />
        </LightTooltip>
      )}
    </div>
  );
}
