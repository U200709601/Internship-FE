import { useState } from 'react';
// material
import {
    Stack,
    Typography,
    TextField,
    FormControl
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// app
import { NumberService } from 'src/api/services';
import { useTranslation } from 'react-i18next';


export default function TranslateNumberForm({formData, setModalStatus, setSnackbarStatus, setMessage, successCallback }) {

    const { t } = useTranslation();
    const[translatedNumber, setTranslatedNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const translateNumber = () => {
        setLoading(true);
        const payload = {
            did_id: formData.did_id,
            translated_did: translatedNumber
        };
       
        
    
    NumberService.updateNumber(payload)
        .then((response) => {
            if (response.data.meta.code === 200) {
                setMessage(t('has-been-successfully-translated', {number: formData.number_value}));
                setSnackbarStatus(true);
                setModalStatus(false);
                setLoading(false);
                successCallback();
            } else {
                throw (t("number-could-not-be-translated"));
            }
        })
        .catch((err) => {
            setMessage(t('could-not-be-translated', {number: formData.number_value}));
            setSnackbarStatus(true);
            setModalStatus(false);
            setLoading(false);
        });
    }


    return (
        <Stack  sx = {{display : "flex"}}spacing={3}>
              
            <FormControl>
                <Typography sx = {{marginBottom : 0}}>
                    {t("selected-number")}: {formData.did}
                </Typography>
                <TextField
                  value={translatedNumber}
                  label={t('number-0')}
                  name="number"
                  margin="normal"
                  variant="outlined"
                  color="secondary"
                  onChange={event => { setTranslatedNumber(event.target.value) }}
                />
                <Stack sx={{ display: "block", alignItems: "right"  }} direction="row" spacing={2}>
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
                    onClick={() => translateNumber()}
                    >
                    {t('Save')}
                </LoadingButton>

                </Stack>
            </FormControl>        
    
        </Stack>
      );
}
