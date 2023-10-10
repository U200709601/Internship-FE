
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import {
  FormControl,
  MenuItem,
    Stack,
    TextField,
    Select,
    InputLabel
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';
import { ContactService } from 'src/api/services';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

export default function NumberMappingForm({ formData, setModalStatus, setSnackbarStatus, setMessage, formType = "add", successCallback, isProgrammable = false }) {

  console.log('formData: ', formData)
    const { t } = useTranslation();
    const ContactSchema = Yup.object().shape({
        formType: Yup.string(),
        name: Yup.string().required('Name is required'),
        surname: Yup.string().required('Surname is required'),
        email: Yup.string().email('Invalid email format'),
        phone_number: Yup.string().required("Required!").matches(/^[a-zA-Z0-9]*$/, "To number must be alphanumeric"),
    });

    const formik = useFormik({
        initialValues: {
            formType: formType,
            name: formData.first_name || '',
            surname: formData.last_name || '',
            email: formData.email || '',
            phone_number: formData.phone_number || '',
        },
        validationSchema: ContactSchema,
        onSubmit: (values, actions) => {
            let payload = {
                first_name: values.name,
                last_name: values.surname,
                email: values.email,
                phone_number: values.phone_number,
            };
            console.log("payload", payload);
            let apiService, successMessage, failMessage;
            //changeFurkan  Change api calls after mapp and update mapp api calls ready!!
            if (formType === "add") {
                apiService = ContactService.addContact(payload);
                successMessage = t("number-has-been-successfully-mapped");
                failMessage = t("could-not-be-mapped");
            } else {
                apiService = ContactService.updateContact(formData.id, payload);
                successMessage = t("mapped-number-has-been-successfully-editted");
                failMessage = t("mapped-number-could-not-be-editted");
            }

            apiService
                .then((response) => {
                    if (response.status === 200 || response.status === 201) {
                        setMessage(t('ok', { name: formData.email }));
                        if (setMessage) { setMessage(successMessage); };
                        if (setSnackbarStatus) { setSnackbarStatus(true); };
                        if (setModalStatus) { setModalStatus(false); };
                        if (successCallback) { successCallback(response); };
                        actions.setSubmitting(false);
                    } else { throw "contact operation failed"; }
                })
                .catch((err) => {
                    if (setMessage) { setMessage(failMessage); };
                    if (setSnackbarStatus) { setSnackbarStatus(true); };
                    if (setModalStatus) { setModalStatus(false); };
                })
        },
        validateOnMount: true,
    });

    const { values, errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;

    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const loading = open && options.length === 0;
    const [phoneNumber, setPhoneNumber] =useState('');


    useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    const getFieldByName = (fieldName) => {
        if (fieldName === "name") {
            return <TextField
                fullWidth
                disabled={formType === "view" ? true : false}
                label={t('first-name')}
                {...getFieldProps('name')}
                error={Boolean(touched.name && errors.name)}
                helperText={touched.name && errors.name}
            />
        }
        if (fieldName === "surname") {
            return <TextField
                fullWidth
                disabled={formType === "view" ? true : false}
                label={t('last-name')}
                {...getFieldProps('surname')}
                error={Boolean(touched.surname && errors.surname)}
                helperText={touched.surname && errors.surname}
            />
        }
        if (fieldName === "email") {
            return <TextField
                fullWidth
                disabled={formType === "view" ? true : false}
                label={t('email')}
                {...getFieldProps('email')}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
            />
        }
        if (fieldName === "phone_number") {
            return  <FormControl fullWidth>
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
              and shown as select options will be handled later!!!  (edit part may need different adjustment) */}
              <MenuItem value="0">054213321</MenuItem>
              <MenuItem value="1">12132132113</MenuItem>
            </Select>
          </FormControl>
        }
        if (fieldName === "submitButton" && formType !== "view") {
            return (
                <LoadingButton
                    size="large"
                    type="submit"
                    variant="contained"
                    disabled={formType === "view" ? true : false}
                    loading={isSubmitting}
                    endIcon={formType === "test" ? <SendIcon /> : null}
                    startIcon={formType !== "test" ? <SaveIcon /> : null}
                >
                    {t('save')}
                </LoadingButton>
            )
        }
    }

    return (
        <>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        {getFieldByName("name")}
                        {getFieldByName("surname")}
                        {getFieldByName("email")}
                        {getFieldByName("phone_number")}
                    </Stack>
                    <br />
                    {getFieldByName("submitButton")}
                    <br />
                </Form>
            </FormikProvider>
        </>
    );
}
