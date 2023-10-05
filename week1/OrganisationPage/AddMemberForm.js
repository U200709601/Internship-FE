import React from 'react';
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
import { UserService } from 'src/api/services';


export default function AddMemberForm({ setModalStatus, setSnackbarStatus, setMessage, successCallback }) {

    const { t } = useTranslation();
    const[eMail, seteMail] = useState("");
    const[firstName, setFirstName] = useState("");
    const[lastName, setLastName] = useState("");
    const[telephone, setTelephone] = useState("");
    const [loading, setLoading] = useState(false);

    const addMember =() => {
        const payload = {
            email: eMail,
            name: firstName,
            surname: lastName,
            telephone: telephone
        };
        UserService.addOrganizationUser(payload)
        .then((response) => {
            if (response.data.meta.code === 200) {
                setMessage(t('has-been-successfully-added', {name: firstName}));
                setSnackbarStatus(true);
                setModalStatus(false);
                setLoading(false);
                successCallback();
            } else {
                throw (t("could-not-be-added"));
            }
        })
        .catch((err) => {
            setMessage(t('could-not-be-added', {name: firstName}));
            setSnackbarStatus(true);
            setModalStatus(false);
            setLoading(false);
        });


    }

  return (
    <Stack sx = {{display : "flex"}}spacing={3}>    
              

        <FormControl>
            
            <TextField
                value={eMail}
                label={t('email')}
                name="email"
                margin="normal"
                variant="outlined"
                color="secondary"
                onChange={event => { seteMail(event.target.value) }}
            />
            
            <TextField
                value={firstName}
                label={t('first-name')}
                name="firstName"
                margin="normal"
                variant="outlined"
                color="secondary"
                onChange={event => { setFirstName(event.target.value) }}
            />
            
            <TextField
                value={lastName}
                label={t('last-name')}
                name="lastName"
                margin="normal"
                variant="outlined"
                color="secondary"
                onChange={event => { setLastName(event.target.value) }}
            />
            
            <TextField
                value={telephone}
                label={t("telephone")}
                name="telephone"
                margin="normal"
                variant="outlined"
                color="secondary"
                onChange={event => { setTelephone(event.target.value) }}
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
                    onClick={() => addMember()}
                    >
                    {t('Save')}
                </LoadingButton>
            </Stack>

            
        </FormControl>        
    
    </Stack>
  );
}
