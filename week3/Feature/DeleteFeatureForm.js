import { useState } from "react";
// material
import { Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// app
import { FeatureService } from "src/api/services";
import { useTranslation } from "react-i18next";
// ----------------------------------------------------------------------

export default function DeleteFeatureForm({
  formData,
  setModalStatus,
  setSnackbarStatus,
  setMessage,
  successCallback,

}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const deletePackage = () => {
    setLoading(true);

    FeatureService.deleteFeature(formData.id)
      .then((response) => {
        if (response.status === 204 || response.status === 200) {
          setMessage(t("feature-delete-success"));
          setSnackbarStatus(true);
          setModalStatus(false);
          setLoading(false);
          successCallback();
        } else {
          throw "feature delete failed";
        }
      })
      .catch((err) => {


        /* let errMessage = "";
        Object.entries(err.response.data).forEach(([key, errors]) => {
          errors.forEach((error) => {
            errMessage += error;
            errMessage += " ";
          });
        });
        setMessage(errMessage !== "" ? errMessage : t("feature-delete-fail"));
        setSnackbarStatus(true);
        setModalStatus(false);
        setLoading(false);
 */
        setLoading(true);
        setTimeout(function(){
            setMessage(t("feature-delete-fail"));
            setSnackbarStatus(true);
            setModalStatus(false);
            setLoading(false);
        }, 1000);

      });
  };

  return (
    <>
      <Stack spacing={3}>
        <Typography component="h6">
          {t("are-you-sure-delete-this-feature")}
        </Typography>
        <Typography component="subtitle1" variant="h6">
          {formData.feature}
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
            onClick={deletePackage}
          >
            {t("delete")}
          </LoadingButton>
        </Stack>
      </Stack>
    </>
  );
}
