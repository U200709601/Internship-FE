
import React from 'react';
import { useState, useEffect } from 'react';
import BaseSnackbar from 'src/components/BaseSnackbar';
import { NumberService } from 'src/api/services';
import { useTranslation } from 'react-i18next';
import BaseModal from 'src/components/BaseModal';
import { CommonService } from 'src/api/services';
import { BaseTable } from 'src/components/table';
import BaseButton from 'src/components/buttons/BaseButton';
import { rowArrayToObject } from 'src/utils/Util';
import {
    Stack,
    Typography
} from '@mui/material';
import { DefaultPaginationData} from 'src/constants/index';
import TranslateNumberForm from './forms/TranslateNumberForm';
import ResetNumberForm from './forms/ResetNumberForm';




export default function Translation() {

const { t } = useTranslation();
const [openSnackbar, setSnackbarStatus] = useState(false);
const [message, setMessage] = useState("");
const [numberTypes, setNumberTypes] = useState([]);
const [countries, setCountries] = useState([]);
const [paginationData, setPaginationData] = useState(DefaultPaginationData);
const [loadingData, setLoadingData] = useState(false);
const [totalCount, setTotalCount] = useState(0);
const [data, setData] = useState([]);
const [openTranslateModal, setTranslateModalStatus] = useState(false);
const [openResetModal, setResetModalStatus] = useState(false);
const [selectedRow, setSelectedRow] = useState({});

const TABLE_HEAD = [
    { key: "country", label: t("country") },
    { key: "did", label: t('number') },
    { key: "translated_did", label: t('translated-number')},
    { key: "action", label: t('actions')}

];


const TABLE_FIELD_MAPPING = {
    country: { key: "country", index: 0 },
    did: { key: "did", index: 1 },
    translated_did: {key: "translated_did", index: 2},
    did_id: { noRender: true ,key: "did_id", index:3}
};

const fetchNumbers = () => {
    const params = {
        size: paginationData.rowsPerPage,
    };
    setLoadingData(true);
    NumberService.listNumbers(params)
        .then((response) => {
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

    fetchNumbers();
    return () => {
        setData([]);
    }
}, [paginationData]);

const formatRowData = (rowData) => {
    let formatted = [];
    rowData.map((d, idx) => {
        formatted.push(d);
    })
    return formatted;
}

const modalHandler = (modalType, index = undefined) => {
    if (modalType === "translate") {
        setTranslateModalStatus(!openTranslateModal);
    }
    if (modalType === "reset"){
        setResetModalStatus(!openResetModal);
    }
    if (index) { setSelectedRow(rowArrayToObject(data[index])) };
}

const getActionItems = (index) => {
  
    const translateButton = (
      <BaseButton
        label= {t("translate")} 
        onClick={() => modalHandler("translate", index)}
        color={"primary"}
        sx={{ backgroundColor: "#109cf1" }}
      />
    );
  
    if (data[index][2].value !== null) {
      return (
        
        <Stack direction="row" spacing={2}>
          {translateButton}
          <BaseButton
            label= {t("reset")} 
            onClick={() => modalHandler("reset", index)}
            color={"primary"}
          />
        </Stack>
      );
    } else {
      return (
        <Stack direction="row" spacing={2}>
          {translateButton}
        </Stack>
      );
    }
  };


return (
    <>
        <BaseSnackbar open={openSnackbar} message={message} setOpen={setSnackbarStatus}/>
        <BaseModal title={t("Translate Number")} open={openTranslateModal} setOpen={setTranslateModalStatus} children={<TranslateNumberForm successCallback={fetchNumbers} formData={selectedRow} setModalStatus={setTranslateModalStatus} setSnackbarStatus={setSnackbarStatus} setMessage={setMessage} />} />
        <BaseModal title={t("Reset Number")} open={openResetModal} setOpen={setResetModalStatus} children={<ResetNumberForm successCallback={fetchNumbers} formData={selectedRow} setModalStatus={setResetModalStatus} setSnackbarStatus={setSnackbarStatus} setMessage={setMessage} />} />
        
        <Typography sx= {{
            marginBottom: 4,
            fontSize: 24,
            fontWeight: "bold",
            color: "#29437C"
        }}>
            Translations
            </Typography> 
        
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

