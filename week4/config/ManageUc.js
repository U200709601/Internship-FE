import { useState, useEffect } from "react";
import { Stack, IconButton, Tooltip } from "@mui/material";
import EyeIcon from "@mui/icons-material/Visibility";
import PreviewIcon from "@mui/icons-material/Preview";
import UnsubscribeIcon from "@mui/icons-material/Unsubscribe";
import PhonelinkSetupIcon from "@mui/icons-material/PhonelinkSetup";
import { BaseTable } from "src/components/table";
import BaseModal from "src/components/BaseModal";
import { rowArrayToObject } from "src/utils/Util";
import { DefaultPaginationData } from "src/constants/index";
import { PackagesService, TariffService } from "src/api/services";
import BaseSnackbar from "src/components/BaseSnackbar";
import { useTranslation } from "react-i18next";
import ManageUcForm from "./form/ManageUcForm";
import { Link } from "react-router-dom";

export default function ManageUc() {
  const { t } = useTranslation();
  const [openSnackbar, setSnackbarStatus] = useState(false);
  const [message, setMessage] = useState("");
  const [openUnsubscribeModal, setUnsubscribeModalStatus] = useState(false);
  const [openViewModal, setViewModalStatus] = useState(false);
  const [openViewUsageModal, setViewUsageModalStatus] = useState(false);
  const [openAddTariffModal, setAddTariffModalStatus] = useState(false);
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [paginationData, setPaginationData] = useState(DefaultPaginationData);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingData, setLoadingData] = useState(false);
  const [subscribedPackages, setSubscribedPackages] = useState([]);
  const [subscribedPackagesLoaded, setSubscribedPackagesLoaded] =
    useState(false);

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
    setSubscribedPackagesLoaded(true);
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
          const ucPackage = response.data.results[idx];

          // Check if the package's id is in the subscribedPackages array
          if (subscribedPackages.includes(ucPackage.id)) {
            let item = new Array(TABLE_HEAD.length - 1).fill({});

            Object.entries(ucPackage).forEach(([key, value]) => {
              if (key in TABLE_FIELD_MAPPING) {
                item[TABLE_FIELD_MAPPING[key].index] = {
                  ...TABLE_FIELD_MAPPING[key],
                  value: value,
                };
              }
            });

            items.push(item);
          }
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
    fetchSubscribedPackages();
  }, []);

  useEffect(() => {
    fetchPackages();
    return () => {
      setData([]);
    };
  }, [paginationData, subscribedPackagesLoaded]);

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
    if (modalType === "view") {
      setViewModalStatus(!openViewModal);
    } else if (modalType === "unsubscribe") {
      setUnsubscribeModalStatus(!openUnsubscribeModal);
    } else if (modalType === "viewUsage") {
      setViewUsageModalStatus(!openViewUsageModal);
    }

    if (index) {
      setSelectedRow(rowArrayToObject(data[index]));
    }
  };

  const getActionItems = (index) => {
    return (
      <Stack direction="row" spacing={2}>
        <Tooltip title={t("view-package")}>
          <IconButton
            color="secondary"
            size="small"
            aria-label="view-package"
            onClick={() => modalHandler("viewUsage", index)}
          >
            <PreviewIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={t("unsubscribe-package")}>
          <IconButton
            color="secondary"
            size="small"
            aria-label="unsubscribe-package"
            onClick={() => modalHandler("unsubscribe", index)}
          >
            <UnsubscribeIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={t("link-mapp")}>
          <Link to={`/number-mapping/${rowArrayToObject(data[index]).id}`} style={{ textDecoration: "none" }}>
            <IconButton color="warning" size="small">
              <PhonelinkSetupIcon />
            </IconButton>
          </Link>
        </Tooltip>
      </Stack>
    );
  };

  const onClickName = (index) => {
    modalHandler("view", index);
  };

  return (
    <>
      <BaseSnackbar
        open={openSnackbar}
        message={message}
        setOpen={setSnackbarStatus}
      />
      <BaseModal
        title={"#" + selectedRow.name}
        open={openViewModal}
        setOpen={setViewModalStatus}
        children={
          <ManageUcForm
            formType="view"
            successCallback={fetchPackages}
            formData={selectedRow}
            setModalStatus={setViewModalStatus}
            setSnackbarStatus={setSnackbarStatus}
            setMessage={setMessage}
          />
        }
      />
      <BaseModal
        title={"#" + selectedRow.name}
        open={openViewUsageModal}
        setOpen={setViewUsageModalStatus}
        sx={{ width: "50%" }}
        children={
          <ManageUcForm
            formType="viewUsage"
            successCallback={fetchPackages}
            formData={selectedRow}
            setModalStatus={setViewUsageModalStatus}
            setSnackbarStatus={setSnackbarStatus}
            setMessage={setMessage}
          />
        }
      />
      <BaseModal
        title={"#" + selectedRow.name}
        open={openUnsubscribeModal}
        setOpen={setUnsubscribeModalStatus}
        children={
          <ManageUcForm
            formType="unsubscribe"
            successCallback={fetchPackages}
            formData={selectedRow}
            setModalStatus={setUnsubscribeModalStatus}
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
