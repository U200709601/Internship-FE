import React, { useEffect } from 'react';
import { 
  List, 
  ListItemText,
  Divider,
  ListItem,
  Box
} 
  from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PortingService } from 'src/api/services';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import BaseSnackbar from 'src/components/BaseSnackbar';


export default function ShowPortOuts() {

  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const { id } = useParams();
  const [openSnackbar, setSnackbarStatus] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchPortOutDetails = () => { 
    PortingService.listPortOutDetails(id)
    .then((response) => {
      /* response = {
        "data": {
          "authorization_code": "XCP736647",
          "country": "United Kingdom",
          "did_type": "Mobile",
          "id": 80,
          "numbers": [
            "447340006386"
          ],
          "porting_status": "Completed",
          "porting_type": "Port-Out",
          "requested_at": "2023-01-24 14:54:20.290923+03:00",
          "scheduled_at": "2023-01-11 15:22:00+03:00"
        },
        "meta": {
          "code": 200,
          "currency": "€",
          "current_balance": 104364.08,
          "msg": "Ok",
          "unread_notification_count": 23
        },
        "status": true
      }; */
      if (!response.data.id) {
        navigate(`./pages/Page404`);
      }
      setData(response.data);
      
    })
    .catch((err) =>{
      setMessage(err);
      setSnackbarStatus(true);
    })
  }



  useEffect(() => {
    fetchPortOutDetails();
    return () => {
        setData([]);
    }
}, [id]);



  return(
    <>
      <BaseSnackbar open={openSnackbar} message={message} setOpen={setSnackbarStatus}/>
      <Box sx= {{
      backgroundColor : "white",
      border:'2em solid white',
      borderRadius: 2,
      boxShadow: 12,
      margin: "auto",
      maxWidth: 800,

    }}>
      <List component="nav" aria-label="mailbox folders" >
              <h1>Porting#{id}</h1>
              <ListItem selected className='ListItem' >
                <ListItemText primary= {t("id")} />
                {data.id}
              </ListItem>
              <Divider />
              <ListItem >
                <ListItemText primary={t("porting-type")} />
                {data.porting_type}
              </ListItem>
              <Divider />
              <ListItem selected >
                <ListItemText primary={t("country")} />
                {data.country}
              </ListItem>
              <Divider/>
              <ListItem >
                <ListItemText primary={t("did-type")} />
                {data.did_type}
              </ListItem>
              <Divider/>
              <ListItem selected>
                <ListItemText primary={t("numbers")} />
                {data.numbers}
              </ListItem>
              <Divider/>
              <ListItem>
                <ListItemText primary={t("requested-at")} />
                {data.requested_at ? dayjs(data.requested_at).format('DD/MM/YYYY') : null}
              </ListItem>
              <Divider/>
              <ListItem selected>
                <ListItemText primary={t("scheduled-at")} />
                {data.requested_at ? dayjs(data.requested_at).format('DD/MM/YYYY') : null}
              </ListItem>
              <Divider/>
              <ListItem>
                <ListItemText primary={t("authorization-code")} />
                {data.authorization_code}
              </ListItem>
              <Divider/>
              <ListItem selected>
                <ListItemText primary={t("status")} />
                {data.porting_status}
              </ListItem>
      </List>
    </Box>
    
    
    </>
    
  )
}
