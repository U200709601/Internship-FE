
import React from 'react';
import { useState, useEffect} from 'react';
import BaseSnackbar from 'src/components/BaseSnackbar';
import { PortingService } from 'src/api/services';
import { useTranslation } from 'react-i18next';
import BaseModal from 'src/components/BaseModal';
import { BaseTable } from 'src/components/table';
import BaseButton from 'src/components/buttons/BaseButton';
import { rowArrayToObject } from 'src/utils/Util';
import {
  DefaultPaginationData,
  getLabelByValue,
  SetType,
  OrderStatus,
  PortOrderStatus
} from 'src/constants/index';
import dayjs from 'dayjs';
import ShowPortOuts from './forms/ShowPortOuts';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box,Button, IconButton,Link
 } from '@mui/material';
import { useNavigate } from 'react-router-dom';





export default function PortOut() {
  const { t } = useTranslation();
  const [openSnackbar, setSnackbarStatus] = useState(false);
  const [message, setMessage] = useState("");
  const [paginationData, setPaginationData] = useState(DefaultPaginationData);
  const [loadingData, setLoadingData] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [data, setData] = useState([]);
  const [openShowModal, setShowModalStatus] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const navigate = useNavigate();
  

const TABLE_HEAD = [

  { key: "id", label: t('id')},
  { key: "country", label: t('country')},
  { key: "type", label: t('type')},
  { key: "number", label: t('number')},
  { key: "authorization", label: t('authorization-code')},
  { key: "schedule", label: t("scheduled-at") },
  { key: "status", label: t('status') },
  { key: "action", label: t('actions')}

];


const TABLE_FIELD_MAPPING = {

  id : { key: "id", index: 0 },
  country: { key: "country", index: 1 },
  type: {key: "type", index: 2 },
  numbers: { key: "number", index: 3 },
  pac: { key: "authorization", index: 4},
  scheduled_at : { key: "schedule", index: 5},
  status: {key: "status", index: 6},
  action: {key: "actions", index:7}
};

const fetchPortings = () => {
    const params = {
        size: paginationData.rowsPerPage,
        porting_type: 2,
    };
    setLoadingData(true);
    PortingService.listPortings(params)
        .then((response) => {
          response.data = {
            "data": {
              "count": 13,
              "items": [
                {
                  "country": "United Kingdom(+44)",
                  "id": 80,
                  "numbers": [
                    "447340006386"
                  ],
                  "pac": "XCP736647",
                  "scheduled_at": "2023-01-11 00:00:00+03:00",
                  "status": 4,
                  "type": 1
                },
                {
                  "country": "United Kingdom(+44)",
                  "id": 79,
                  "numbers": [
                    "447407254796"
                  ],
                  "pac": "XCP024020",
                  "scheduled_at": "2023-01-24 00:00:00+03:00",
                  "status": 4,
                  "type": 1
                },
                {
                  "country": "United Kingdom(+44)",
                  "id": 78,
                  "numbers": [
                    "447436604136"
                  ],
                  "pac": "XCP684374",
                  "scheduled_at": "2023-01-24 00:00:00+03:00",
                  "status": 4,
                  "type": 1
                },
                {
                  "country": "United Kingdom(+44)",
                  "id": 77,
                  "numbers": [
                    "447436604115"
                  ],
                  "pac": "",
                  "scheduled_at": "",
                  "status": 7,
                  "type": 1
                },
                {
                  "country": "United Kingdom(+44)",
                  "id": 76,
                  "numbers": [
                    "447340006380"
                  ],
                  "pac": "",
                  "scheduled_at": "",
                  "status": 4,
                  "type": 1
                },
                {
                  "country": "United Kingdom(+44)",
                  "id": 75,
                  "numbers": [
                    "447341116373"
                  ],
                  "pac": "XCP439520",
                  "scheduled_at": "2023-01-24 00:00:00+03:00",
                  "status": 4,
                  "type": 1
                },
                {
                  "country": "United Kingdom(+44)",
                  "id": 74,
                  "numbers": [
                    "447407444805"
                  ],
                  "pac": "",
                  "scheduled_at": "",
                  "status": 4,
                  "type": 1
                },
                {
                  "country": "United Kingdom(+44)",
                  "id": 73,
                  "numbers": [
                    "447407444808"
                  ],
                  "pac": "XCP925466",
                  "scheduled_at": "2023-01-24 00:00:00+03:00",
                  "status": 4,
                  "type": 1
                },
                {
                  "country": "United Kingdom(+44)",
                  "id": 65,
                  "numbers": [
                    "447407444807"
                  ],
                  "pac": "",
                  "scheduled_at": "",
                  "status": 7,
                  "type": 1
                },
                {
                  "country": "United Kingdom(+44)",
                  "id": 64,
                  "numbers": [
                    "447407444806"
                  ],
                  "pac": "",
                  "scheduled_at": "",
                  "status": 7,
                  "type": 1
                }
              ],
              "page": 1,
              "pages": 2
            }
          };
            let items = [];
            setTotalCount(response.data.data.count);
            for (const idx in response.data.data.items) {
                let item = new Array(TABLE_HEAD.length - 1).fill({});
                Object.entries(response.data.data.items[idx]).forEach(([key, value]) => {
                    if (key in TABLE_FIELD_MAPPING) {
                        item[TABLE_FIELD_MAPPING[key].index] = {
                            ...TABLE_FIELD_MAPPING[key],
                            value: value,
                        };
                    }
                });
                items.push(item);
            }
            setData(items);
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            setLoadingData(false);
        })     
}


useEffect(() => {
    fetchPortings();
    return () => {
        setData([]);
    }
}, [paginationData]);

const formatRowData = (rowData) => {
  let formatted = [];
  rowData.map((d, idx) => {
      if (d.key === "type") {
        formatted.push({
            ...d,
            value: getLabelByValue(SetType(), d.value.toString()),
        });
      } else if (d.key === "status") {
        formatted.push({
            ...d,
            value: getLabelByValue(PortOrderStatus(), d.value.toString()), chipColor: d.value === 4 ? "success" : "error", // ask status
        });
      }else if(d.key === "schedule"){
        formatted.push({
          ...d,
          value: d.value ? dayjs(d.value).format('DD/MM/YYYY') : "",
        });
      }
      else {
          formatted.push(d);
      }
  })
  return formatted;
};

const modalHandler = (modalType, index = undefined) => {
  
  const detailsID = data[index][0].value;

  if (modalType === "show") {
    navigate(`/port-out/details/${detailsID}`);
  }

  if (index) { setSelectedRow(rowArrayToObject(data[index])) };
  
  
}

const getActionItems = (index) => {
 
  return(
      <IconButton sx = {{display: "flex", justifyContent: "flex-start"}}>
        <VisibilityIcon 
         sx = {{
          width:30,
          height:30,
          borderRadius:0.5,
          color: "white",
          backgroundColor: "#31f565"}}
          onClick={() => modalHandler("show", index)}/>
     </IconButton>

  );
};

return (
    <>
      <BaseSnackbar open={openSnackbar} message={message} setOpen={setSnackbarStatus}/>
      <BaseModal title={t("Porting")+"#"+selectedRow.id} open={openShowModal} setOpen={setShowModalStatus} children={<ShowPortOuts formData={selectedRow}/>} />
      <BaseTable
        head={TABLE_HEAD}
        data={[...data].map((d, idx) => { return formatRowData(d); })}
        actionItemPrep={getActionItems}
        pagination={{ paginationData: { ...paginationData, totalCount: totalCount }, setPaginationData: setPaginationData }}
        loadingData={loadingData}
      />
    </>

  );
}

