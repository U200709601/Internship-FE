import React from "react";
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
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { PackagesService } from "src/api/services";
import { useState, useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import CheckIcon from "@mui/icons-material/Check";

export default function UcassManagementForm({
  formData,
  formType,
  setModalStatus,
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [features, setfeatures] = useState([]);

  const unSubscribePackage = () => {
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

  const subscribePackage = () => {
    /* setLoading(true);
    ContactService.addPackageToUser(formData.id)
        .then((response) => {
            if (response.status === 200) {
                setMessage(t('has-been-successfully-deleted', { name: `${formData.first_name} ${formData.last_name}` }))
                setSnackbarStatus(true);
                setModalStatus(false);
                setLoading(false);
                successCallback();
            } else {
                throw "contact could not be deleted";
            }
        })
        .catch((err) => {
            setMessage(t('could-not-be-deleted', { name: `${formData.first_name} ${formData.last_name}` }))
            setSnackbarStatus(true);
            setModalStatus(false);
            setLoading(false);
        }); */
  };

  useEffect(() => {
    //changeFurkan => change with PackagesService.getUcassPackage(formData.id) after api ready

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
              {
                id: 1,
                name: "SMS Enabled",
              },
              {
                id: 3,
                name: "1000 min talk",
              },
              {
                id: 1,
                name: "SMS Enabled",
              },
              {
                id: 3,
                name: "1000 min talk",
              },
              {
                id: 1,
                name: "SMS Enabled",
              },
              {
                id: 3,
                name: "1000 min talk",
              },
              {
                id: 1,
                name: "SMS Enabled",
              },
              {
                id: 3,
                name: "1000 min talk",
              },
              {
                id: 1,
                name: "SMS Enabled",
              },
              {
                id: 3,
                name: "1000 min talk",
              },
              {
                id: 1,
                name: "SMS Enabled",
              },
              {
                id: 3,
                name: "1000 min talk",
              },
              {
                id: 1,
                name: "SMS Enabled",
              },
              {
                id: 3,
                name: "1000 min talk",
              },
              {
                id: 1,
                name: "SMS Enabled",
              },
              {
                id: 3,
                name: "1000 min talk",
              },
              {
                id: 1,
                name: "SMS Enabled",
              },
              {
                id: 3,
                name: "1000 min talk",
              },
              {
                id: 1,
                name: "SMS Enabled",
              },
              {
                id: 3,
                name: "1000 min talk",
              },
              {
                id: 1,
                name: "SMS Enabled",
              },
              {
                id: 3,
                name: "1000 min talk",
              },
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

  let content;
  switch (formType) {
    case "view":
      content = (
        <Card>
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

    case "subscribe":
      content = (
        <Stack spacing={3}>
          <Typography component="h6">
            {t("are-you-sure-subscribe-to-this-package")}
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
              onClick={subscribePackage}
            >
              {t("subscribe")}
            </LoadingButton>
          </Stack>
        </Stack>
      );

      break;
  }

  return <>{content}</>;
}
