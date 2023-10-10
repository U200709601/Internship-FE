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
import { styled } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
// app
import { TariffService, PackagesService } from "src/api/services";
import { useTranslation } from "react-i18next";
// ----------------------------------------------------------------------

const RoundingTextField = styled(TextField)(({ theme }) => ({
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
  },
}));

export default function UcassTariffForm({
  formData,
  setModalStatus,
  setSnackbarStatus,
  setMessage,
  formType = "add",
  successCallback,
  countries,
}) {
  const { t } = useTranslation();
  const [tariffPackages, setTariffPackages] = useState([]);

  const NumberTariffSchema = Yup.object().shape({
    formType: Yup.string(),
    tariffPackage: Yup.number().required(t("tariff-package-is-required")),
    country: Yup.string().required(t("country-must-be-selected")),
    name: Yup.string()
      .min(4, t("too-short"))
      .max(48, t("too-long"))
      .required(t("name-is-required")),
    /*  rounding: Yup.number().min(1, t('rounding-must-be-greater-than-0')).integer(t('rounding-must-be-an-integer')).required(t('rounding-is-required')), */ 
    //changeFurkan If there is gonna be rounding remove comment 
    pricing: Yup.number()
      .min(0.1, t("pricing-is-must-be-greater-than-0"))
      .required(t("pricing-is-required")),
    seatCount: Yup.number()
      .min(1, t("seat-count-must-be-greater-than-0"))
      .integer(t("seat-count-must-be-an-integer"))
      .required(t("seat-count-is-required")),
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

  const formik = useFormik({
    initialValues: {
      formType: formType,
      tariffPackage: formData.tariff_package || "",
      country: formData.country || "AF",
      name: formData.name || "",
      seatCount: formData.seat_count || 0,
      pricing: formData.pricing || 0,
    },

    validationSchema: NumberTariffSchema,
    onSubmit: (values, actions) => {
      const payload = {
        country: values.country,
        tariff_package: values.tariffPackage,
        name: values.name,
        seat_count: values.seatCount,
        pricing: values.pricing,
      };

      let apiService, successMessage, failMessage;
      if (formType === "add") {
        apiService = TariffService.addUcassTariff(payload);
        successMessage = t("new-tariff-has-been-successfully-added");
        failMessage = t("new-tariff-could-not-be-added");
      } else {
        apiService = TariffService.updateUcassTariff(formData.id, payload);
        successMessage = t("tariff-has-been-successfully-updated");
        failMessage = t("tariff-could-not-be-updated");
      }

      apiService
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
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
            throw "tariff operation failed";
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
          if (setModalStatus) {
            setModalStatus(false);
          }
        });
    },
  });

  const {
    errors,
    touched,
    isSubmitting,
    handleSubmit,
    getFieldProps,
    setFieldValue,
  } = formik;

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
    if (fieldName === "country") {
      return (
        <FormControl fullWidth>
          <InputLabel id="country-label">{t("country-2")}</InputLabel>
          <Select
            label={t("country-2")}
            labelId="country-label"
            color="secondary"
            disabled={formType === "edit"}
            {...getFieldProps("country")}
            error={Boolean(touched.country && errors.country)}
            helperText={touched.country && errors.country}
          >
            {countries.map((country, idx) => {
              if (country.code !== "0") {
                return (
                  <MenuItem key={country.code} value={country.code}>
                    {country.name}
                  </MenuItem>
                );
              }
            })}
          </Select>
        </FormControl>
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
    if (fieldName === "seatCount") {
      return (
        <TextField
          fullWidth
          type="number"
          label={t("seat-count")}
          {...getFieldProps("seatCount")}
          error={Boolean(touched.seatCount && errors.seatCount)}
          helperText={touched.seatCount && errors.seatCount}
        />
      );
    }
    if (fieldName === "pricing") {
      return (
        <TextField
          fullWidth
          type="number"
          label={t("pricing")}
          {...getFieldProps("pricing")}
          error={Boolean(touched.pricing && errors.pricing)}
          helperText={touched.pricing && errors.pricing}
        />
      );
    }
    if (fieldName === "rounding") {
      return (
        <RoundingTextField
          fullWidth
          type="number"
          label={t("rounding")}
          {...getFieldProps("rounding")}
          error={Boolean(touched.rounding && errors.rounding)}
          helperText={touched.rounding && errors.rounding}
        />
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
          <Stack spacing={3}>
            {getFieldByName("country")}
            {getFieldByName("tariffPackage")}
            {getFieldByName("name")}
            {getFieldByName("seatCount")}
            {getFieldByName("pricing")}
            {/* {getFieldByName("rounding")} */}
          </Stack>
          <br />
          {getFieldByName("submitButton")}
        </Form>
      </FormikProvider>
    </>
  );
}
