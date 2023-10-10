import React from "react";
import { useState, useEffect } from "react";
import { Stack, TextField, Box, Tooltip, IconButton } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useFormik, Form, FormikProvider } from "formik";
import { useTranslation } from "react-i18next";
import { CustomerService, FeatureService } from "src/api/services";
import { DefaultPaginationData } from "src/constants";
import BaseModal from "src/components/BaseModal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { rowArrayToObject } from "src/utils/Util";
import BaseSnackbar from "src/components/BaseSnackbar";
import { BaseTable, TableFilterContainer } from "src/components/table";
import EditFeatureForm from "./Forms/FeatureForm";
import DeleteFeatureForm from "./Forms/DeleteFeatureForm";
import FeatureForm from "./Forms/FeatureForm";

export default function Features() {
  const { t } = useTranslation();
  const [openSnackbar, setSnackbarStatus] = useState(false);
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [paginationData, setPaginationData] = useState(DefaultPaginationData);
  const [openEditModal, setEditModalStatus] = useState(false);
  const [openDeleteModal, setDeleteModalStatus] = useState(false);
  const [openAddModal, setAddModalStatus] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingData, setLoadingData] = useState(false);

  const TABLE_HEAD = [
    { key: "id", label: t("id") },
    { key: "feature", label: t("feature") },
    { key: "action", label: t("actions"), align: "right" },
  ];

  const TABLE_FIELD_MAPPING = {
    id: { key: "id", cellComponentType: "th", index: 0 },
    feature: { key: "feature", index: 1 },
  };

  const formik = useFormik({
    initialValues: {
      feature: "",
    },
    onSubmit: (values, actions) => {
      const payload = {
        feature: values.feature,
      };

      let failMessage = t("new-feature-could-not-be-added");

      FeatureService.addFeature(payload)
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            if (setMessage) {
              setMessage(t("feature-is-succesfully-added"));
            }
            if (setSnackbarStatus) {
              setSnackbarStatus(true);
            }
            actions.setSubmitting(false);
          } else {
            throw "sms tariff operation failed";
          }
        })
        .catch((err) => {
          if (err.response.data.error) {
            failMessage = `${failMessage}. ${err.response.data.error[0]}`;
          }
          if (setMessage) {
            setMessage(failMessage);
          }
          if (setSnackbarStatus) {
            setSnackbarStatus(true);
          }
          actions.setSubmitting(false);
        });
    },
  });

  const fetchFeatures = () => {
    setLoadingData(true);

    CustomerService.listCustomers() //changeFurkan FeatureService.listFeatures()  (using list customers for being able to see output with response.data
      .then((response) => {
        response.data = {
          "count": 2,
          "next": null,
          "previous": null,
          "results": [
            {
              "id": 17,
              "feature": "1000 message",
            },
            {
              "id": 127,
              "feature": "30000 message",
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
    fetchFeatures();
  }, []);

  const modalHandler = (modalType, index = undefined) => {
    switch (modalType) {
      case "edit":
        setEditModalStatus(!openEditModal);
        break;
      case "delete":
        setDeleteModalStatus(!openDeleteModal);
        break;
      default:
        break;
    }

    if (index) {
      setSelectedRow(rowArrayToObject(data[index]));
    }
  };

  const getActionItems = (index) => (
    <>
      <Tooltip title={t("edit-feature")}>
        <IconButton
          color="secondary"
          size="small"
          aria-label="edit-feature"
          onClick={() => modalHandler("edit", index)}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={t("delete-feature")}>
        <IconButton
          color="secondary"
          size="small"
          aria-label="delete-feature"
          onClick={() => modalHandler("delete", index)}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <>
      <BaseSnackbar
        open={openSnackbar}
        message={message}
        setOpen={setSnackbarStatus}
      />
      <BaseModal
        title={t("edit-feature")}
        open={openEditModal}
        setOpen={setEditModalStatus}
        children={
          <FeatureForm
            successCallback={fetchFeatures}
            formType="edit"
            formData={selectedRow}
            setModalStatus={setEditModalStatus}
            setSnackbarStatus={setSnackbarStatus}
            setMessage={setMessage}
          />
        }
      />
      <BaseModal
        title={t("add-ucass-package")}
        open={openAddModal}
        setOpen={setAddModalStatus}
        children={
          <FeatureForm
            formType="add"
            successCallback={fetchFeatures}
            formData={{}}
            setModalStatus={setAddModalStatus}
            setSnackbarStatus={setSnackbarStatus}
            setMessage={setMessage}
          />
        }
      />
      <BaseModal
        title={t("delete-feature")}
        open={openDeleteModal}
        setOpen={setDeleteModalStatus}
        children={
          <DeleteFeatureForm
            successCallback={fetchFeatures}
            formData={selectedRow}
            setModalStatus={setDeleteModalStatus}
            setSnackbarStatus={setSnackbarStatus}
            setMessage={setMessage}
          />
        }
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <LoadingButton
          sx={{
            width: "20%",
          }}
          size="large"
          type="submit"
          variant="contained"
          onClick={() => setAddModalStatus(true)}
        >
          {t("add-new-feature")}
        </LoadingButton>
      </Box>

      <br />
      <BaseTable
        head={TABLE_HEAD}
        data={data}
        actionItemPrep={getActionItems}
        pagination={{
          paginationData: { ...paginationData, totalCount: totalCount },
          setPaginationData: setPaginationData,
        }}
        loadingData={loadingData}
      />
    </>
  );
}
