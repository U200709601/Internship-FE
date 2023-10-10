import { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { Grid, Select, TextField, MenuItem, FormControl, InputLabel, Stack, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { BaseTable, TableFilterContainer } from 'src/components/table';
import SearchButton from 'src/components/buttons/SearchButton';
import AddNewButton from 'src/components/buttons/AddNewButton';
import BaseModal from 'src/components/BaseModal';
import { rowArrayToObject } from 'src/utils/Util';
import { DefaultPaginationData } from 'src/constants/index';
import { UcassTariffForm, DeleteTariffForm } from './Forms';
import { TariffService, CommonService } from 'src/api/services';
import BaseSnackbar from 'src/components/BaseSnackbar';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const SearchButtonContainer = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        textAlign: "left",
    },
    [theme.breakpoints.down('md')]: {
        textAlign: "right",
    },
}));


export default function UcassTariff() {
    const { t } = useTranslation();
    const [openSnackbar, setSnackbarStatus] = useState(false);
    const [message, setMessage] = useState("");
    const [countries, setCountries] = useState([]);
    const [filterCountry, setCountry] = useState("0");
    const [openEditModal, setEditModalStatus] = useState(false);
    const [openDeleteModal, setDeleteModalStatus] = useState(false);
    const [openAddTariffModal, setAddTariffModalStatus] = useState(false);
    const [data, setData] = useState([]);
    const [selectedRow, setSelectedRow] = useState({});
    const [paginationData, setPaginationData] = useState(DefaultPaginationData);
    const [totalCount, setTotalCount] = useState(0);
    const [loadingData, setLoadingData] = useState(false);

    const TABLE_HEAD = [
        { key: "id", label: "ID" },
        { key: "tariffPackageName", label: t("tariff-package") },
        { key:"name", label:t("name")},
        { key: "country_name", label: t('country') },
        { key: "seat_count", label: t("seat-count")},
        { key: "pricing", label: t("pricing")},
        { key: "action", label: t('actions') }
    ];
    
    const TABLE_FIELD_MAPPING = {
        id: { key: "id", cellComponentType: "th", index: 0 },
        tariff_package_name: { key: "tariffPackageName", index: 1 },
        name: {key: "name",index: 2},
        country_name: { key: "country_name", index: 3 },
        seat_count : { key: "seat_count", index: 4 },
        pricing: { key: "pricing", index: 5 },
        country: { key: "country", index: 6, noRender: true },
        tariff_package: { key: "tairffPackage", index: 7, noRender: true },
    };    

    const fetchTariffs = () => {
        const params = {
            country: filterCountry !== "0" ? filterCountry : undefined,
            page: paginationData.page + 1,
            page_size: paginationData.rowsPerPage,
        };
        setLoadingData(true);
        /* TariffService.listUcassTariff  *///changeFurkan remove comment after api ready
        axios.get('https://8c581696-69b5-49cc-9fa3-00c6f6410d32.mock.pstmn.io/ucass_tariffs/admin/', { params: params })     
            .then((response) => {
                let items = [];
                setTotalCount(response.data.count);
                for (const idx in response.data.results) {
                    let item = new Array(TABLE_HEAD.length - 1).fill({});
                    Object.entries(response.data.results[idx]).forEach(([key, value]) => {
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
        fetchTariffs();
        return () => {
            setData([]);
        }
    }, [paginationData]);

    useEffect(() => {
        CommonService.getCountries({})
            .then((response) => {
                let items = [];
                Object.entries(response.data).forEach(([key, value]) => {
                    Object.entries(value).forEach(([code, name]) => {
                        if (code === "null") {
                            items.push({code: "0", name: name});
                        } else {
                            items.push({code: code, name: name});
                        }
                    })
                })
                setCountries(items);
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);

    const formatRowData = (rowData) => {   //changeFurkan  -ask for any necessary format
        let formatted = [];
        rowData.map((d, idx) => {
            if (d.key === "") {
                
            }else {
                formatted.push(d);
            }
        })
        return formatted;
    }

    const modalHandler = (modalType, index = undefined) => {
        if (modalType === "add") {
            setAddTariffModalStatus(!openAddTariffModal);
        } else if (modalType === "edit") {
            setEditModalStatus(!openEditModal);
        } else if (modalType === "delete") {
            setDeleteModalStatus(!openDeleteModal);
        }

        if (index) { setSelectedRow(rowArrayToObject(data[index])) };
    }

    const getActionItems = (index) => {
        return (
            <Stack direction="row" spacing={2}>
                <Tooltip title={t('edit-tariff-0')}>
                    <IconButton color="secondary" size="small" aria-label="edit-sms-tariff" onClick={() => modalHandler("edit", index)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('delete-tariff-0')}>
                    <IconButton color="secondary" size="small" aria-label="delete-sms-tariff" onClick={() => modalHandler("delete", index)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Stack>
        )
    }

    return (
        <>
            <BaseSnackbar open={openSnackbar} message={message} setOpen={setSnackbarStatus} />
            <BaseModal title={t('add-new-tariff-0')} open={openAddTariffModal} setOpen={setAddTariffModalStatus} children={<UcassTariffForm successCallback={fetchTariffs} formData={{}} formType="add" setModalStatus={setAddTariffModalStatus} setSnackbarStatus={setSnackbarStatus} setMessage={setMessage} countries={countries} />} />
            <BaseModal title={t('edit-tariff-0')} open={openEditModal} setOpen={setEditModalStatus} children={<UcassTariffForm formType="edit" successCallback={fetchTariffs} formData={selectedRow} setModalStatus={setEditModalStatus} setSnackbarStatus={setSnackbarStatus} setMessage={setMessage} countries={countries} />} />
            <BaseModal title={t('delete-tariff-0')} open={openDeleteModal} setOpen={setDeleteModalStatus} children={<DeleteTariffForm tariffType="number" successCallback={fetchTariffs} formData={selectedRow} setModalStatus={setDeleteModalStatus} setSnackbarStatus={setSnackbarStatus} setMessage={setMessage} />} />
            <TableFilterContainer>
                <Grid sx={{ alignItems: "center" }} container spacing={4}>
                    <Grid item md={3} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="country-label">{t('country')}</InputLabel>
                            <Select
                                label={t('country')}
                                labelId="country-label"
                                color="secondary"
                                value={filterCountry}
                                onChange={event => { setCountry(event.target.value) }}
                            >
                                {countries.map((country, idx) => {
                                    return <MenuItem key={country.code} value={country.code}>{country.name}</MenuItem>;
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <SearchButtonContainer item md={2} xs={12}>
                        <SearchButton onClick={() => { fetchTariffs() }} />
                    </SearchButtonContainer>
                </Grid>
            </TableFilterContainer>
            <AddNewButton label={t('add-new-tariff-0')} onClick={() => modalHandler("add")} />
            <br />
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
 