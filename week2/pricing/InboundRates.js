import { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import {
    Grid,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    Typography
} from '@mui/material';
import { BaseTable, TableFilterContainer } from 'src/components/table';
import SearchButton from 'src/components/buttons/SearchButton';
import BaseSnackbar from 'src/components/BaseSnackbar';

import {
    DefaultPaginationData,
    NumberStatus,
    SetType,
    getSelectOptions,
    getLabelByValue,
    Capability,DidType
} from 'src/constants/index';
import { useTranslation } from 'react-i18next';
import { TariffService, CommonService } from 'src/api/services';



const SearchButtonContainer = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        textAlign: "left",
    },
    [theme.breakpoints.down('md')]: {
        textAlign: "right",
    },
}));

const DIALOG_PROPERTIES = {
    fullWidth: true,
    maxWidth: "lg",
    scroll: "body",
    // fullScreen: true,
}

const TitleStyle = styled(Typography)(({ theme }) => ({
    color: theme.palette.background.contrastText,
    display: "inline"
}));

export default function InboundRates() {
    const { t } = useTranslation();
    const TABLE_HEAD = [
        { key: "product", label: t("product")},
        { key: "country", label: t("country") },
        { key: "did_type", label: t("type") },
        { key: "capability", label: t("capability") },
        { key: "rounding", label: t("rounding") },
        { key: "nrc", label: t('Nrc') },
        { key: "mrc", label: t('Mrc') },
        { key: "minute_peak_rate", label: t('minute-peak-rate') },
        { key: "minute_offpeak_rate", label: t('minute-off-peak-rate') },
        { key: "minute_weekend_rate", label: t('minute-weekend-rate') },
        { key: "connect_fee", label: t('connect-fee') },
        { key: "portin_fee", label: t('portin-fee') },
        { key: "portout_fee", label: t('portout_fee') },
    ];
    
    const TABLE_FIELD_MAPPING = {
        product: { key: "product", index: 0 },
        country: { key: "country", index: 1 },
        did_type: { key: "did_type", index: 2 },
        capability: { key: "capability", index: 3 },
        rounding: { key: "rounding", index: 4 },
        nrc: { key: "nrc", index: 5},
        mrc: { key: "mrc", index: 6 },
        minute_peak_rate: { key: "minute_peak_rate", index: 7},
        minute_offpeak_rate: { key: "minute_offpeak_rate", index: 8 },
        minute_weekend_rate: { key: "minute_weekend_rate", index: 9},
        connect_fee: { key: "connect_fee", index: 10},
        portin_fee: { key: "portin_fee", index: 11 },
        portout_fee: { key: "portout_fee", index: 12}
    };
    
    const [openSnackbar, setSnackbarStatus] = useState(false);
    const [message, setMessage] = useState("");
    const [data, setData] = useState([]);
    const [countries, setCountries] = useState([]);
    const [paginationData, setPaginationData] = useState(DefaultPaginationData);
    const [totalCount, setTotalCount] = useState(0);
    const [loadingData, setLoadingData] = useState(false);
    const [filterCapability, setCapability] = useState("");
    const [filterCountry, setFilterCountry] = useState("");
    const [filterNumberTypes, setFilterNumberTypes] = useState("");


    const fetchCountries = () => {
        CommonService.getCountries({})
            .then((response) => {
                let items = [];
                Object.entries(response.data.data).forEach((item) => {
                    items.push({ code: item[1]["code"], name: item[1]["name"], iso_code_2digit: item[1]["iso_code_2digit"] });
                })
                setCountries(items);
            })
            .catch((err) => {
                console.log(err);
            })
    };

    const fetchInboundRates = () => {
        const params = {
          country: filterCountry ? filterCountry : "",
          did_type: filterNumberTypes ? filterNumberTypes : "",
          capability: filterCapability ? filterCapability : "",
          page: paginationData.page + 1,
          size:10 
        }; 
        if(params.capability === "0"){
            params.capability = "";
        }
        
        setLoadingData(true);
        TariffService.listIboundsTariffs(params)
            .then((response) => {
                if (!response.data || !response.data.data) {
                    throw(t("session-expired"));
                }
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
                if(response.data.data.count === 0) throw(t("there-is-no-rate-for-selected-destination"));
              
            })
            .catch((err) => {
                setMessage(err);
                setSnackbarStatus(true);
                
            })
            .finally(() => {
                setLoadingData(false);
            })
    }
    

    useEffect(() => {
        fetchInboundRates();
        fetchCountries();
        return () => {
            setData([]);
        }
    }, [paginationData]);



    const formatRowData = (rowData) => {
        let formatted = [];
        rowData.map((d, idx) => {
            if (d.key === "status") {
                formatted.push({
                    ...d,
                    value: getLabelByValue(NumberStatus(), d.value.toString()), chipColor: d.value === 3 ? "success" : "error",
                });
            }  else if (d.key === "type") {
                formatted.push({
                    ...d,
                    value: getLabelByValue(SetType(), d.value.toString()),
                });
            }else {
                formatted.push(d);
            }
        })
        return formatted;
    }

    return (
        <>
            <BaseSnackbar open={openSnackbar} message={message} setOpen={setSnackbarStatus}/>
    
            <TableFilterContainer>
                <Grid sx={{ alignItems: "center" }} container spacing={4}>
                    <Grid item md={3} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="filter-status-label">{t('country')}</InputLabel>
                            <Select
                                label={'country'}
                                labelId="filter-country-label"
                                name="country"
                                color="secondary"
                                value={filterCountry }
                                onChange={event => { setFilterCountry(event.target.value) }}
                            >
                                {countries.map((country, index) => {
                                    return <MenuItem key={country.code} value={country.iso_code_2digit}>{country.name}</MenuItem>;
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="filter-type-label">{t('type')}</InputLabel>
                            <Select
                                label={'type'}
                                labelId="filter-type-label"
                                name="type"
                                color="secondary"
                                value={filterNumberTypes}
                                onChange={event => { setFilterNumberTypes(event.target.value) }}
                            >
                                {getSelectOptions(DidType())}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="filter-status-label">{t('capability')}</InputLabel>
                            <Select
                                label={'capability'}
                                labelId="filter-capability-label"
                                name="capability"
                                color="secondary"
                                value={filterCapability}
                                onChange={event => {setCapability(event.target.value) }}
                            >
                                {getSelectOptions(Capability())}
                            </Select>
                        </FormControl>
                    </Grid>

                    <SearchButtonContainer item md={2} xs={12}>
                        <SearchButton onClick={() => { fetchInboundRates() }} />
                    </SearchButtonContainer>
                </Grid>
                <br />
                <SearchButtonContainer item md={12} xs={12}>
                        <strong>Results:</strong>   <TitleStyle>Total <strong>{totalCount}</strong> records found.
                    </TitleStyle>
                    <br />

                </SearchButtonContainer>
            </TableFilterContainer>
            <br />

            <BaseTable
                head={TABLE_HEAD}
                data={[...data].map((d, idx) => { return formatRowData(d); })}
                pagination={{ paginationData: { ...paginationData, totalCount: totalCount }, setPaginationData: setPaginationData }}
                loadingData={loadingData}
            />
        </>
    );
}
