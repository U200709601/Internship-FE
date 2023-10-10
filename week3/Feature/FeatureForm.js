import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
// app
import { FeatureService, PackagesService } from 'src/api/services';
import { useTranslation } from 'react-i18next';
// ----------------------------------------------------------------------


export default function FeatureForm({ formType, formData, setModalStatus, setSnackbarStatus, setMessage, successCallback }) {
    const { t } = useTranslation();
    const PackageSchema = Yup.object().shape({
        feature: Yup.string().required(t('feature-is-required')),
    });

    const formik = useFormik({
        initialValues: {
            feature: formData.feature || '',
        },
        validationSchema: PackageSchema,
        onSubmit: (values, actions) => {
            const payload = {
                feature: values.feature,
            };

            
            
            let successMessage = formType === "add" ? t('new-feature-added-succesfully') : t('feature-has-been-succesfully-updated"');
            let failMessage = formType === "add" ? t('new-feature-could-not-be-added') : t('feature-could-not-be-updated');
            const apiService = formType === "add" ? FeatureService.addFeature(payload) : FeatureService.updateFeature(formData.id, payload);
            
            apiService
                .then((response) => {
                    if (response.status === 201 || response.status === 200) {
                        if (setMessage) { setMessage(successMessage); };
                        if (setSnackbarStatus) { setSnackbarStatus(true); };
                        if (setModalStatus) { setModalStatus(false); };
                        if (successCallback) { successCallback() };
                        actions.setSubmitting(false);
                    } else { throw failMessage}
                })
                .catch((err) => {
                    if (err.response.data.error) { failMessage = `${failMessage}. ${err.response.data.error[0]}`; }
                    if (setMessage) { setMessage(failMessage); };
                    if (setSnackbarStatus) { setSnackbarStatus(true); };
                    if (setModalStatus) { setModalStatus(false); };
                })
        }
    });

    const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

    const getFieldByName = (fieldName) => {
        if (fieldName === "feature") {
            return (
                <TextField
                    fullWidth
                    label={t('feature')}
                    {...getFieldProps('feature')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
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
                    {t('common.__i18n_ally_root__.save')}
                </LoadingButton>
            )
        }
    }

    return (
        <>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        {getFieldByName("feature")}
                    </Stack>
                    <br />
                    {getFieldByName("submitButton")}
                </Form>
            </FormikProvider >
        </>
    );
}
