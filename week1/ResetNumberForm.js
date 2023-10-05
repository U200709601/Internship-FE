import { useState } from 'react';
// material
import {
    Stack,
    Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// app
import { NumberService } from 'src/api/services';
import { useTranslation } from 'react-i18next';

export default function ResetNumberForm({ formData, setModalStatus, setSnackbarStatus, setMessage, successCallback }) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    
    const resetNumber = () => {
        setLoading(true);
        console.log(formData.did_id);
        const payload = {
            did_id: formData.did_id,
            translated_did: null
        };

    NumberService.updateNumber(payload)
        .then((response) => {
            if (response.data.meta.code === 200) {
                setMessage(t('has-been-successfully-reseted', {number: formData.number_value}));
                setSnackbarStatus(true);
                setModalStatus(false);
                setLoading(false);
                successCallback();
            } else {
                throw (t("number-could-not-be-reset"));
            }
        })
        .catch((err) => {
            setMessage(t('could-not-be-reset', {number: formData.number_value}));
            setSnackbarStatus(true);
            setModalStatus(false);
            setLoading(false);
        });
    }
 
    return (
        <>
            <Stack spacing={3}>
                <Typography component="h6">
                {t('are-you-sure-reset-this-number')}
                <p>{formData.did}</p>
                </Typography>
                <Typography component="subtitle1" variant="h6">
                    {formData.number_value}
                </Typography>
                <Stack sx={{ display: "block" }} direction="row" spacing={2}>
                    <LoadingButton
                        type="submit"
                        color="primary"
                        variant="contained"
                        disabled={loading}
                        onClick={() => setModalStatus(false)}
                    >
                        {t('cancel')}
                    </LoadingButton>
                    <LoadingButton
                        type="submit"
                        color="secondary"
                        variant="contained"
                        loading={loading}
                        onClick={resetNumber}
                    >
                        {t('reset')}
                    </LoadingButton>
                </Stack>
            </Stack>
        </>
    );
}
