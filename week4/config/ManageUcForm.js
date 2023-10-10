import React from "react";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import {
  TextField,
  Stack,
  Typography,
  Card,
  CardContent,
  Divider,
  ListItemText,
  ListItem,
  List,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { ContactService, PackagesService } from "src/api/services";
import { useState, useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import CheckIcon from "@mui/icons-material/Check";
import { TableFilterContainer } from "src/components/table";

export default function UcassManagementForm({
  formData,
  formType,
  setModalStatus,
  setSnackbarStatus,
  setMessage,
  successCallback,
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [usageData, setUsageData] = useState([]);
  const [features, setfeatures] = useState([]);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const ContactSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    lastName: Yup.string().required("Surname is required"),
    email: Yup.string().email("Invalid email format"),
    phone_number: Yup.string().required("Required!"),
  });

  const formik = useFormik({
    initialValues: {
      name: name || "",
      lastName: lastName || "",
      email: email || "",
      phone_number: phoneNumber || "",
    },
    validationSchema: ContactSchema,
    onSubmit: (values, actions) => {
      let payload = {
        first_name: values.name,
        last_name: values.lastName,
        email: values.email,
        phone_number: values.phone_number,
      };
      console.log("payload", payload);

      let successMessage = t("number-has-been-successfully-mapped");
      let failMessage = t("could-not-be-mapped");

      ContactService.addContact(payload)           // changeFurkan change here after required mapping API
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            setMessage(t("ok"));
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
              successCallback(response);
            }
            actions.setSubmitting(false);
          } else {
            throw "contact operation failed";
          }
        })
        .catch((err) => {
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
    validateOnMount: true,
  });

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleSubmit,
    getFieldProps,
    setFieldValue,
  } = formik;
  const unSubscribePackage = () => {        //changeFurkan change here with required API after unSubs ready
    /* setLoading(true);
    PackagesService.unSubscribeUcassPackage(formData.id)
        .then((response) => {
            if (response.status === 200) {
                setMessage(t('has-been-successfully-deleted', { name: `${formData.name}` }))
                setSnackbarStatus(true);
                setModalStatus(false);
                setLoading(false);
                successCallback();
            } else {
                throw "contact could not be deleted";
            }
        })
        .catch((err) => {
            setMessage(t('could-not-be-deleted', { name: `${formData.name}` }))
            setSnackbarStatus(true);
            setModalStatus(false);
            setLoading(false);
        }); */
    setModalStatus(false);
  };
  const fetchContacts = () => {};

  const fetchUsages = () => {
    setLoading(true);

    PackagesService.listTariffPackages({
      page_size: 100,
    }) /* changeFurkan after api ready -> .getUcassPackageMappings(id) (?) */
      .then((response) => {
        response.data = {
          "count": 12,
          "next": null,
          "previous": null,
          "results": [
            {
              "id": 1,
              "first_name": "Ali",
              "last_name": "Smith",
              "email": "ali@mail.com",
              "phone_number": "20310301"
            },
            {
              "id": 2,
              "first_name": "Veli",
              "last_name": "Johnson",
              "email": "veli@mail.com",
              "phone_number": "09012312"
            },
            {
              "id": 3,
              "first_name": "Can",
              "last_name": "Williams",
              "email": "can@mail.com",
              "phone_number": "12310301"
            },
            {
              "id": 4,
              "first_name": "Efe",
              "last_name": "Jones",
              "email": "efe@mail.com",
              "phone_number": "888810301"
            },
            {
              "id": 5,
              "first_name": "Mehmet",
              "last_name": "Brown",
              "email": "mehmet@mail.com",
              "phone_number": "5551234567"
            },
            {
              "id": 6,
              "first_name": "Ayşe",
              "last_name": "Davis",
              "email": "ayse@mail.com",
              "phone_number": "5559876543"
            },
            {
              "id": 7,
              "first_name": "Fatih",
              "last_name": "Miller",
              "email": "fatih@mail.com",
              "phone_number": "5552345678"
            },
            {
              "id": 8,
              "first_name": "Selin",
              "last_name": "Wilson",
              "email": "selin@mail.com",
              "phone_number": "5558765432"
            },
            {
              "id": 9,
              "first_name": "Emre",
              "last_name": "Moore",
              "email": "emre@mail.com",
              "phone_number": "5553456789"
            },
            {
              "id": 10,
              "first_name": "Gizem",
              "last_name": "Taylor",
              "email": "gizem@mail.com",
              "phone_number": "5557654321"
            },
            {
              "id": 11,
              "first_name": "Burak",
              "last_name": "Smith",
              "email": "burak@mail.com",
              "phone_number": "5551234567"
            },
            {
              "id": 12,
              "first_name": "Zeynep",
              "last_name": "Johnson",
              "email": "zeynep@mail.com",
              "phone_number": "5559876543"
            }
          ]
        }
        ;
        setUsageData(response.data.results);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    //changeFurkan => change with PackagesService.getUcassPackage(formData.id) after api ready. (Data structure is same as getServicePackage(id) )

    PackagesService.listTariffPackages({ page_size: 100 })
      .then((response) => {
        response.data = {
          status: "success",
          data: {
            id: 26,
            name: "Premium Ucass Package",
            tariff_package_id: 10,
            tariff_package_name: "Ucass Tariff Package",
            max_seat_count: 20,
            min_seat_count: 20,
            pricing: 30,
            description: "Message,Video, Phone",
            features: [
              {
                id: 1,
                name: "SMS Enabled",
              },
              {
                id: 3,
                name: "1000 min talk",
              },
            ],
            account_service_mappings: [
              {
                id: "number_masking",
                label: "Number Masking",
                account: null,
                enabled: true,
                channelType: 2,
              },
            ],
          },
        };
        setData(response.data.data);
        setfeatures(response.data.data.features);
      })
      .catch((error) => {
        console.error("Error fetching detailed ucass package data:", error);
      });
  }, []);
  useEffect(() => {
    fetchUsages();
  }, []);

  console.log(formData);
  let content;
  switch (formType) {
    case "view":
      content = (
        <Card
          sx={{
            overflowY: "auto",

            "@media (max-height: 600px)": {
              maxHeight: "200px",
            },
          }}
        >
          <CardContent>
            <Typography variant="subtitle1" color="textSecondary">
              {data.description}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h5">${data.pricing} / month</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Seat Count:
            </Typography>
            <Typography variant="subtitle1">{data.max_seat_count}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" color="textSecondary">
              Features:
            </Typography>
            <List
              sx={{
                alignItems: "center",
                maxHeight: "300px",
                overflowY: "scroll",
              }}
            >
              {features.map((feature) => (
                <ListItem key={feature.id} sx={{ textAlign: "center" }}>
                  <CheckIcon />
                  <ListItemText primary={feature.name} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      );
      break;

    case "viewUsage":
      content = (
        <Card
          sx={{
            overflowY: "auto",
            "@media (max-width: 600px)": {
              maxHeight: "400px",
            },
            "@media (max-height: 600px)": {
              maxHeight: "400px",
            },
          }}
        >
          <CardContent>
            <TableFilterContainer style={{ marginBottom: 15 }}>
              <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                  <Grid sx={{ alignItems: "center" }} container spacing={3}>
                    <Grid item md={5} xs={12}>
                      <FormControl fullWidth>
                        <TextField
                          value={name}
                          label={t("first-name")}
                          margin="normal"
                          variant="outlined"
                          color="secondary"
                          {...getFieldProps("name")}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={5} xs={12}>
                      <FormControl fullWidth>
                        <TextField
                          value={lastName}
                          label={t("last-name")}
                          margin="normal"
                          variant="outlined"
                          color="secondary"
                          onChange={(event) => {
                            setLastName(event.target.value);
                          }}
                          {...getFieldProps("lastName")}
                          error={Boolean(touched.lastName && errors.lastName)}
                          helperText={touched.lastName && errors.lastName}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={5} xs={12}>
                      <FormControl fullWidth>
                        <TextField
                          value={email}
                          label={t("email")}
                          margin="normal"
                          variant="outlined"
                          color="secondary"
                          onChange={(event) => {
                            setEmail(event.target.value);
                          }}
                          {...getFieldProps("email")}
                          error={Boolean(touched.email && errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={5} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id="select-number">
                          {t("phone-number")}
                        </InputLabel>
                        <Select
                          fullWidth
                          label={t("phone-number")}
                          labelId="select-number"
                          name="phoneNumber"
                          color="secondary"
                          value={phoneNumber}
                          onChange={(event) => {
                            setPhoneNumber(event.target.value);
                          }}
                          {...getFieldProps("phone_number")}
                          error={Boolean(
                            touched.phone_number && errors.phone_number
                          )}
                          helperText={
                            touched.phone_number && errors.phone_number
                          }
                        >
                          {/* gonna be dynamic selection probably numbers will going to fetch from db
                          and shown as select options will be handled later!!! */}
                          <MenuItem value="0">054213321</MenuItem>
                          <MenuItem value="1">12132132113</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item md={2} xs={12}>
                      <LoadingButton
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                        startIcon={<SaveIcon />}
                      >
                        {t("save")}
                      </LoadingButton>
                    </Grid>
                  </Grid>
                </Form>
              </FormikProvider>
            </TableFilterContainer>
            <Typography variant="h6">
              Initial Seat: {data.max_seat_count}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Remaining Seat: {data.max_seat_count - usageData.length}
            </Typography>
            <Typography variant="h4" color="textSecondary">
              Usage of {usageData.length} Seats:
            </Typography>
            <TableContainer sx={{ maxHeight: 400, overflowY: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("id")}</TableCell>
                    <TableCell>{t("first-name")}</TableCell>
                    <TableCell>{t("last-name")}</TableCell>
                    <TableCell>{t("email")}</TableCell>
                    <TableCell>{t("phone-number")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usageData.map((usage) => (
                    <TableRow key={usage.id}>
                      <TableCell>{usage.id}</TableCell>
                      <TableCell>{usage.first_name}</TableCell>
                      <TableCell>{usage.last_name}</TableCell>
                      <TableCell>{usage.email}</TableCell>
                      <TableCell>{usage.phone_number}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      );
      break;
    case "unsubscribe":
      content = (
        <Stack spacing={3}>
          <Typography component="h6">
            {t("are-you-sure-unsubscribe-to-this-package")}
          </Typography>
          <Typography component="subtitle1" variant="h6">
            {formData.name}
          </Typography>
          <Stack sx={{ display: "block" }} direction="row" spacing={2}>
            <LoadingButton
              type="submit"
              color="primary"
              variant="contained"
              disabled={loading}
              onClick={() => setModalStatus(false)}
            >
              {t("cancel")}
            </LoadingButton>
            <LoadingButton
              type="submit"
              color="secondary"
              variant="contained"
              loading={loading}
              onClick={unSubscribePackage}
            >
              {t("unsubscribe")}
            </LoadingButton>
          </Stack>
        </Stack>
      );
      break;
  }

  return <>{content}</>;
}
