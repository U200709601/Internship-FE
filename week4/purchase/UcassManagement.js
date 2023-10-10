import { useState, useEffect } from "react";
import { Stack, IconButton, Tooltip } from "@mui/material";
import EyeIcon from "@mui/icons-material/Visibility";
import AddBoxIcon from "@mui/icons-material/AddBox";
import LinkIcon from "@mui/icons-material/Link";
import { BaseTable } from "src/components/table";
import BaseModal from "src/components/BaseModal";
import { rowArrayToObject } from "src/utils/Util";
import { DefaultPaginationData } from "src/constants/index";
import { PackagesService, TariffService } from "src/api/services";
import BaseSnackbar from "src/components/BaseSnackbar";
import { useTranslation } from "react-i18next";
import UcassManagementForm from "./Forms/UcassManagementForm";
import { Link } from "react-router-dom";

export default function UcassManagement() {
  const { t } = useTranslation();
  const [openSnackbar, setSnackbarStatus] = useState(false);
  const [message, setMessage] = useState("");

  const [openSubscribeModal, setSubscribeModalStatus] = useState(false);
  const [openViewModal, setViewModalStatus] = useState(false);
  const [openAddTariffModal, setAddTariffModalStatus] = useState(false);
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [paginationData, setPaginationData] = useState(DefaultPaginationData);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingData, setLoadingData] = useState(false);
  const [subscribedPackages, setSubscribedPackages] = useState([]);

  const TABLE_HEAD = [
    { key: "name", label: t("package-name") },
    { key: "seat_count", label: t("seat-count") },
    { key: "pricing", label: t("pricing") },
    { key: "action", label: t("actions") },
  ];

  const TABLE_FIELD_MAPPING = {
    id: { key: "id", cellComponentType: "th", index: 0, noRender: true },
    name: { key: "name", index: 1 },
    max_seat_count: { key: "seat_count", index: 2 },
    pricing: { key: "pricing", index: 3 },
  };

  const fetchSubscribedPackages = () => {
    //changeFurkan ask how to get subscribed package. For now return an id(package id)
    setSubscribedPackages([27, 28]);
  };

  const fetchPackages = () => {
    const params = {
      page: paginationData.page + 1,
      page_size: paginationData.rowsPerPage,
    };

    setLoadingData(true);
    //changeFurkan list ucassTariff here it may be different listing call from admin side,
    PackagesService.listServicePackages(params) //changeFurkan  change listServicePackages ->  listUcassPackages after api completed (!)
      .then((response) => {
        response.data = {
          count: 3,
          next: null,
          previous: null,
          results: [
            {
              id: 26,
              name: "Standard Ucass Package",
              tariff_package_name: "Ucass Tariff Package",
              max_seat_count: 20,
              min_seat_count: 20,
              pricing: 20,
            },
            {
              id: 27,
              name: "Gold Ucass Package",
              tariff_package_name: "Ucass Tariff Package",
              max_seat_count: 40,
              min_seat_count: 40,
              pricing: 40,
            },
            {
              id: 28,
              name: "Premium Ucass Package",
              tariff_package_name: "Ucass Tariff Package",
              max_seat_count: 60,
              min_seat_count: 60,
              pricing: 50,
            },
          ],
        };
        let items = [];
        setTotalCount(response.data.count);
        for (const idx in response.data.results) {
          let item = new Array(TABLE_HEAD.length - 1).fill({});
          Object.entries(response.data.results[idx]).forEach(([key, value]) => {
            if (key in TABLE_FIELD_MAPPING) {
              item[TABLE_FIELD_MAPPING[key].index] = {
                ...TABLE_FIELD_MAPPING[key],
                value: value,
              };
            }
          });
          items.push(item);
        }
        setData(items);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoadingData(false);
      });
  };

  useEffect(() => {
    fetchPackages();
    return () => {
      setData([]);
    };
  }, [paginationData]);

  useEffect(() => {
    fetchSubscribedPackages();
  }, []);

  const formatRowData = (rowData) => {
    //changeFurkan  -ask for any necessary format
    let formatted = [];
    rowData.map((d, idx) => {
      if (d.key === "") {
      } else {
        formatted.push(d);
      }
    });
    return formatted;
  };

  const modalHandler = (modalType, index = undefined) => {
    if (modalType === "add") {
      setAddTariffModalStatus(!openAddTariffModal);
    } else if (modalType === "subscribe") {
      setSubscribeModalStatus(!openSubscribeModal);
    } else if (modalType === "view") {
      setViewModalStatus(!openViewModal);
    }

    if (index) {
      setSelectedRow(rowArrayToObject(data[index]));
    }
  };

  const subsPackagesContain = (value) => {
    for (let i = 0; i < subscribedPackages.length; i++) {
      if (subscribedPackages[i] === value) return true;
    }
    return false;
  };

  const getActionItems = (index) => {
    let icon;

    if (subsPackagesContain(parseInt(data[index][0].value))) {
      console.log(data[index][0].value);
      icon = (
        <Tooltip title={t("link-config")}>
          <IconButton color="warning" size="small">
            <Link to="/config">
              <LinkIcon />
            </Link>
          </IconButton>
        </Tooltip>
      );
    } else {
      icon = (
        <Tooltip title={t("subscribe-package")}>
          <IconButton
            color="secondary"
            size="small"
            onClick={() => modalHandler("subscribe", index)}
          >
            <AddBoxIcon />
          </IconButton>
        </Tooltip>
      );
    }

    return (
      <Stack direction="row" spacing={2}>
        <Tooltip title={t("view-package")}>
          <IconButton
            color="secondary"
            size="small"
            aria-label="view-package"
            onClick={() => modalHandler("view", index)}
          >
            <EyeIcon />
          </IconButton>
        </Tooltip>
        {icon}
      </Stack>
    );
  };

  const onClickName = (index) => {
    modalHandler("view", index);
  };

  return (
    <>
      <BaseModal
        title={"#" + selectedRow.name}
        open={openViewModal}
        setOpen={setViewModalStatus}
        children={
          <UcassManagementForm
            formType="view"
            successCallback={fetchPackages}
            formData={selectedRow}
            setModalStatus={setViewModalStatus}
            setSnackbarStatus={setSnackbarStatus}
            setMessage={setMessage}
          />
        }
      />

      <BaseSnackbar
        open={openSnackbar}
        message={message}
        setOpen={setSnackbarStatus}
      />

      <BaseModal
        title={t("subscribe")}
        open={openSubscribeModal}
        setOpen={setSubscribeModalStatus}
        children={
          <UcassManagementForm
            formType="subscribe"
            successCallback={fetchPackages}
            formData={selectedRow}
            setModalStatus={setSubscribeModalStatus}
            setSnackbarStatus={setSnackbarStatus}
            setMessage={setMessage}
          />
        }
      />

      <br />
      <BaseTable
        head={TABLE_HEAD}
        data={[...data].map((d, idx) => {
          return formatRowData(d);
        })}
        onClickName={onClickName}
        actionItemPrep={getActionItems}
        pagination={{
          paginationData: { ...paginationData, totalCount: totalCount },
          setPaginationData: setPaginationData,
        }}
        loadingData={loadingData}
        subscribedPackageIds={subscribedPackages}
      />
    </>
  );
}
