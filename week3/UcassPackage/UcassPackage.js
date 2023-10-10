import { useEffect, useState } from 'react';
import { DefaultPaginationData } from 'src/constants/index';
import { PackagesService } from 'src/api/services';
import { BaseTable, TableFilterContainer } from "src/components/table";
import BaseSnackbar from "src/components/BaseSnackbar";
import BaseModal from 'src/components/BaseModal';
import SearchButton from "src/components/buttons/SearchButton";
import AddNewButton from 'src/components/buttons/AddNewButton';
import { rowArrayToObject } from 'src/utils/Util';
import { FormControl, Grid, TextField, Stack, IconButton, Tooltip } from "@mui/material";
import { styled } from "@mui/system";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import { useTranslation } from 'react-i18next';
import { UcassPackageForm, DeletePackageForm } from './Forms';
import ServiceEngineMatrix from './ServiceEngineMatrix';

const SearchButtonContainer = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        textAlign: "left",
    },
    [theme.breakpoints.down('md')]: {
        textAlign: "right",
    },
}));


export default function UcassPackage() {
    const { t } = useTranslation();

    const TABLE_HEAD = [
        { key: "name", label: t('name') },
        { key: "min_seat_count", label: t('min-seat-count') },
        { key: "max_seat_count", label: t('max-seat-count') },
        { key: "tariffPackage", label: t('tariff-package') },
        { key: "action", label: t('actions') },
    ];

    const TABLE_FIELD_MAPPING = {
        id: { key: "id", cellComponentType: "th", index: 0 , noRender: true},
        name: { key: "name", index: 1 },
        min_seat_count: {key: "min_seat_count", index: 2},
        max_seat_count: {key: "max_seat_count", index: 3},
        tariff_package_name: { key: "tariffPackage", index: 4 },
    };

    const [data, setData] = useState([]);
    const [paginationData, setPaginationData] = useState(DefaultPaginationData);
    const [totalCount, setTotalCount] = useState(0);
    const [loadingData, setLoadingData] = useState(false);
    const [message, setMessage] = useState("");
    const [openSnackbar, setSnackbarStatus] = useState(false);
    const [filterPackage, setPackage] = useState("");
    const [openAddModal, setAddModalStatus] = useState(false);
    const [openDeleteModal, setDeleteModalStatus] = useState(false);
    const [openEditModal, setEditModalStatus] = useState(false);
    const [openConfigModal, setConfigModalStatus] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
   

    const fetchPackages = () => {
        setLoadingData(true);
        const params = {
            page: paginationData.page + 1,
            page_size: paginationData.rowsPerPage,
            name: filterPackage ? filterPackage : undefined,
        }
        PackagesService.listTariffPackages(params)  //changeFurkan   listUcassPackages after being ready
            .then((response) => {
                response.data = {
                    "count": 3,
                    "next": null,
                    "previous": null,
                    "results": [
                      {
                        "id": 26,
                        "name": "Standard Ucass Package",
                        "tariff_package_name": "Ucass Tariff Package",
                        "max_seat_count": 20,
                        "min_seat_count": 20,
                        "pricing": 20
          
                      },
                      {
                        "id": 27,
                        "name": "Gold Ucass Package",
                        "tariff_package_name": "Ucass Tariff Package",
                        "max_seat_count": 40,
                        "min_seat_count": 40,
                        "pricing": 40
          
                      },
                      {
                        "id": 28,
                        "name": "Premium Ucass Package",
                        "tariff_package_name": "Ucass Tariff Package",
                        "max_seat_count": 60,
                        "min_seat_count": 60,
                        "pricing": 50
          
                      },
                    ]
                };
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
        fetchPackages();
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
        if (modalType === "add") {
            setAddModalStatus(!openAddModal);
        } else if (modalType === "edit") {
            setEditModalStatus(!openEditModal);
        } else if (modalType === "delete") {
            setDeleteModalStatus(!openDeleteModal);
        } else if (modalType === "config") {
            setConfigModalStatus(!openConfigModal);
        }

        if (index) { setSelectedRow(rowArrayToObject(data[index])) };
    }

    const getActionItems = (index) => {
        return (
            <Stack direction="row" spacing={2}>
                <Tooltip title={t('edit-ucass-package')}>
                    <IconButton color="secondary" size="small" aria-label="edit-package" onClick={() => modalHandler("edit", index)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('delete-ucass-package')}>
                    <IconButton color="secondary" size="small" aria-label="delete-package" onClick={() => modalHandler("delete", index)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('config-ucass-package')}>
                    <IconButton color="secondary" size="small" aria-label="configure-package" onClick={() => modalHandler("config", index)}>
                        <DisplaySettingsIcon />
                    </IconButton>
                </Tooltip>
            </Stack>
        )
    }

    return (
        <>
            <BaseSnackbar open={openSnackbar} message={message} setOpen={setSnackbarStatus} />
            <BaseModal title={t('add-ucass-package')} open={openAddModal} setOpen={setAddModalStatus} children={<UcassPackageForm formType="add" successCallback={fetchPackages} formData={{}} setModalStatus={setAddModalStatus} setSnackbarStatus={setSnackbarStatus} setMessage={setMessage} />} />
            <BaseModal title={t('edit-ucass-package')} open={openEditModal} setOpen={setEditModalStatus} children={<UcassPackageForm formType="edit" successCallback={fetchPackages} formData={selectedRow} setModalStatus={setEditModalStatus} setSnackbarStatus={setSnackbarStatus} setMessage={setMessage} />} />
            <BaseModal title={t('delete-ucass-package')} open={openDeleteModal} setOpen={setDeleteModalStatus} children={<DeletePackageForm packageType="ucass" successCallback={fetchPackages} formData={selectedRow} setModalStatus={setDeleteModalStatus} setSnackbarStatus={setSnackbarStatus} setMessage={setMessage} />} />
            <BaseModal sx={{ minWidth: 500, width: "90%" }} title={t('config-service-package')} open={openConfigModal} setOpen={setConfigModalStatus} children={<ServiceEngineMatrix configType = "ucass" successCallback={fetchPackages} formData={selectedRow} setModalStatus={setConfigModalStatus} setOuterSnackbarStatus={setSnackbarStatus} setOuterMessage={setMessage} />} />
            <TableFilterContainer>
                <Grid sx={{ alignItems: "center" }} container spacing={4}>
                    <Grid item md={3} xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                value={filterPackage}
                                label={t('name')}
                                name="name"
                                margin="normal"
                                variant="outlined"
                                color="secondary"
                                onChange={event => { setPackage(event.target.value) }}
                            />
                        </FormControl>
                    </Grid>
                    <SearchButtonContainer item md={2} xs={12}>
                        <SearchButton onClick={() => { fetchPackages() }} />
                    </SearchButtonContainer>
                </Grid>
            </TableFilterContainer>
            <AddNewButton label={t("add-ucass-package")} onClick={() => modalHandler("add")} />
            <br />
            <BaseTable
                head={TABLE_HEAD}
                data={[...data].map((d, idx) => {
                    return formatRowData(d);
                })}
                actionItemPrep={getActionItems}
                pagination={{
                    paginationData: { ...paginationData, totalCount: totalCount },
                    setPaginationData: setPaginationData
                }}
                loadingData={loadingData}
            />
        </>
    )
}
