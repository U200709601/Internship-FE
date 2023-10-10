import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
// material
import {
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
// app
import { FeatureService, PackagesService } from "src/api/services";
import { useTranslation } from "react-i18next";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes"; //changeFurkan  downloaded package: npm i -S rect-multiselect-checkboxes

// ----------------------------------------------------------------------

export default function UcassPackageForm({
  formType,
  formData,
  setModalStatus,
  setSnackbarStatus,
  setMessage,
  successCallback,
}) {
  const { t } = useTranslation();
  const [tariffPackages, setTariffPackages] = useState([]);
  const [features, setFeatures] = useState([]);
  const [data, setData] = useState({});
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [isDataLoaded, setDataLoaded] = useState(false);

  const PackageSchema = Yup.object().shape({
    name: Yup.string().required(t("name-is-required")),
    description: Yup.string().required(t("description-is-required")),
    tariffPackage: Yup.number().required(t("tariff-package-is-required")),
  });

  useEffect(() => {
    PackagesService.listTariffPackages({ page_size: 100 })
      .then((response) => {
        if (response.status === 200) {
          setTariffPackages(response.data.results);
        } else {
          throw "list tariff packages failed";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    PackagesService.listTariffPackages({ page_size: 100 }) //changeFurkan listFeatures when its ready, using another api call for able to see example result with response.data
      .then((response) => {
        response.data = {
          count: 3,
          next: null,
          previous: null,
          results: [
            {
              id: 1,
              name: "SMS Enabled",
            },
            {
              id: 2,
              name: "Voice Enabled",
            },
            {
              id: 3,
              name: "1000 min talk",
            },
          ],
        };
        if (response.status === 200) {
          setFeatures(response.data.results);
        } else {
          throw "list features failed";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    //changeFurkan => change with PackagesService.getUcassPackage(formData.id) after api ready

    if (formData.id) {
      PackagesService.listTariffPackages({ page_size: 100 })
        .then((response) => {
          response.data = {
            status: "success",
            data: {
              "id": 26,
              "name": "Premium Ucass Package",
              "tariff_package_id": 10,
              "tariff_package_name": "Ucass Tariff Package",
              "max_seat_count": 20,
              "min_seat_count": 20,
              "pricing": 30,
              "description": "Message,Video, Phone",
              "features": [
                {
                  "id": 1,
                  "name": "SMS Enabled",
                },
                {
                  "id": 3,
                  "name": "1000 min talk",
                },
              ],
              "account_service_mappings": [
                {
                  "id": "number_masking",
                  "label": "Number Masking",
                  "account": null,
                  "enabled": true,
                  "channelType": 2,
                },
              ],
            },
          };

          if (response.status === 200) {
            setData(response.data.data);
            setDataLoaded(true);
          } else {
            throw "get detailed ucass package failed";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  useEffect(() => {
    if (data.features && data.features.length > 0) {
      const initialSelectedFeatures = data.features.map((feature) => {
        return {
          value: feature.id,
        };
      });
      setSelectedFeatures(initialSelectedFeatures);
    }
  }, [data.features]);

  const formatFeaturesForSelect = () => {
    return features.map((feature) => ({
      value: feature.id,
      label: feature.name,
    }));
  };

  const formik = useFormik({
    initialValues: {
      name: formData.name || "",
      description: data.description || "",
      tariffPackage: data.tariff_package_id || "",
    },
    validationSchema: PackageSchema,
    enableReinitialize: true,
    onSubmit: (values, actions) => {
      const payload = {
        name: values.name,
        description: values.description,
        tariff_package_id: values.tariffPackage,
        features: selectedFeatures.map((feature) => feature.value),
      };
      let successMessage =
        formType === "add"
          ? t("ucass-package-add-success")
          : t("ucass-package-edit-success");
      let failMessage =
        formType === "add"
          ? t("ucass-package-add-fail")
          : t("ucass-package-edit-fail");
      const apiService =
        formType === "add"
          ? PackagesService.addUcassPackage(payload)
          : PackagesService.updateUcassPackage(formData.id, payload);

      apiService
        .then((response) => {
          if (response.status === 201 || response.status === 200) {
            if (setMessage) {
              setMessage(successMessage);
            }
            if (setSnackbarStatus) {
              setSnackbarStatus(true);
            }
            if (setModalStatus) {
              setModalStatus(false);
            }
            if (successCallback) {
              successCallback();
            }
            actions.setSubmitting(false);
          } else {
            throw "package operation failed";
          }
        })
        .catch((err) => {
          if (err.response.data) {
            failMessage = `${failMessage}. ${err.response.data[0]}`;
          }
          if (setMessage) {
            setMessage(failMessage);
          }
          if (setSnackbarStatus) {
            setSnackbarStatus(true);
          }
          if (setModalStatus) {
            setModalStatus(false);
          }
        });
    },
  });

  if (!isDataLoaded && formType === "edit") {
    return <div>Loading...</div>;
  }

  function onChange(value) {
    setSelectedFeatures(value);
  }

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  const getFieldByName = (fieldName) => {
    if (fieldName === "name") {
      return (
        <TextField
          fullWidth
          label={t("name")}
          {...getFieldProps("name")}
          error={Boolean(touched.name && errors.name)}
          helperText={touched.name && errors.name}
        />
      );
    }
    if (fieldName === "description") {
      return (
        <TextField
          fullWidth
          label={t("description")}
          {...getFieldProps("description")}
        />
      );
    }
    if (fieldName === "tariffPackage") {
      return (
        <FormControl fullWidth>
          <InputLabel id="tariff-package-label">
            {t("tariff-package")}
          </InputLabel>
          <Select
            label={t("tariff-package")}
            labelId="tariff-package-label"
            color="secondary"
            {...getFieldProps("tariffPackage")}
            error={Boolean(touched.tariffPackage && errors.tariffPackage)}
            helperText={touched.tariffPackage && errors.tariffPackage}
          >
            {tariffPackages.map((tariffPackage, idx) => {
              return (
                <MenuItem key={tariffPackage.id} value={tariffPackage.id}>
                  {tariffPackage.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      );
    }
    const options = formatFeaturesForSelect();

    if (fieldName === "features") {
      return (
        <FormControl>
          <InputLabel id="features">{t("features")}</InputLabel>
          <ReactMultiSelectCheckboxes
            options={options}
            value={selectedFeatures}
            onChange={onChange}
            setState={setSelectedFeatures}
          />
        </FormControl>
      );
    }
    if (fieldName === "submitButton") {
      return (
        <LoadingButton
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          startIcon={<SaveIcon />}
        >
          {t("common.__i18n_ally_root__.save")}
        </LoadingButton>
      );
    }
  };

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={1}>
            {getFieldByName("name")}
            {getFieldByName("tariffPackage")}
            {getFieldByName("description")}
            {getFieldByName("features")}
          </Stack>
          <br />
          {getFieldByName("submitButton")}
        </Form>
      </FormikProvider>
    </>
  );
}
