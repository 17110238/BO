import DataTableCustom from "components/common/Datatable/DatatableCusTom";
import dayjs from "dayjs";
import { StoreMerchant } from "models";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Collapse, Dropdown } from "react-bootstrap";
import { TableColumn } from "react-data-table-component";


interface DataTableMerchantProps {
  t: (a: string) => string;
  data?: any;
  collapse?: boolean;
  rest?: any;
}

function DataTableMerchantStore({
  t,
  collapse,
  data,
  ...rest
}: DataTableMerchantProps) {
  const router = useRouter();
  const lang = localStorage.getItem("NEXT_LOCALE");

  const columns: TableColumn<StoreMerchant>[] = useMemo(
    () => [
      {
        name: t("STT"),
        minWidth: "100px",
        maxWidth: "120px",

        cell: (row: any, index: number) => (
          <div className="position-relative w-100">{index}</div>
        ),
      },

      {
        name: t("ID Cửa hàng"),
        minWidth: "150px",
        cell: (row) => {
          return <div>{row?.storeId}</div>;
        },
      },
      {
        name: t("Tên cửa hàng"),
        minWidth: "180px",
        cell: (row) => {
          return <div>{row?.storeName ?? ""}</div>;
        },
      },
      {
        name: t("Tên đăng nhập"),
        minWidth: "250px",
        cell: (row) => {
          return <div>{""}</div>;
        },
      },

      {
        name: t("Địa chỉ cửa hàng"),
        minWidth: "180px",
        maxWidth: "200px",

        cell: (row) => {
          return <div>{row?.address}</div>;
        },
      },
      {
        name: t("Thời gian tạo"),
        minWidth: "180px",
        maxWidth: "200px",

        cell: (row) => {
          return <div>{dayjs(row?.createdAt).format("HH:mm DD/MM/YYYY")}</div>;
        },
      },
      {
        name: t("Tình trạng"),
        minWidth: "100px",
        maxWidth: "100px",
        cell: (row) => {
          return (
            <label className="switch">
              <input
                type="checkbox"
                checked={row?.isActive}
                onChange={(e) => {}}
              />
              <span className="slider around" />
            </label>
          );
        },
      },
      {
        name: t("Thao tác"),
        minWidth: "130px",
        maxWidth: "130px",
        cell: (row) => {
          return (
            <>
              <Dropdown>
                <Dropdown.Toggle
                  className={"p-0"}
                  style={{
                    backgroundColor: "rgba(0,0,0,0)",
                    borderColor: "rgba(0,0,0,0)",
                  }}
                  id="dropdown-button-drop-up"
                >
                  <div className="btn btn-dropdown  pr-0">
                    <label>{t("Thao tác")}</label>
                    <div className=" ml-2">
                      <i className="fas fa-caret-down"></i>
                    </div>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ borderRadius: "12px" }}>
                  <Dropdown.Item
                    onClick={() =>
                      router.push("/insight/manager-merchant/detail-merchant")
                    }
                  >
                    {t("Chi tiết")}
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() =>
                      router.push("/insight/manager-merchant/detail-merchant")
                    }
                  >
                    {t("Thay đổi mật khẩu")}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          );
        },
      },
    ],
    [lang]
  );

  return (
    <Collapse in={collapse || false} className="data-merchant-employee">
      <DataTableCustom
        className="data-table-custom"
        columns={columns}
        dataList={data}
        t={t}
        nameDataTable="colMerchantEmployee"
        {...rest}
      />
    </Collapse>
  );
}

export default DataTableMerchantStore;
