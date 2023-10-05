import { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import {
    Grid,
    Select,
    TextField,
    FormControl,
    InputLabel,
    MenuItem,
    Typography
} from '@mui/material';
import { BaseTable, TableFilterContainer } from 'src/components/table';
import SearchButton from 'src/components/buttons/SearchButton';
import {
    DefaultPaginationData,
    NumberStatus,
    SetType,
    getLabelByValue,
} from 'src/constants/index';
import { useTranslation } from 'react-i18next';
import { TariffService, CommonService} from 'src/api/services';
import BaseSnackbar from 'src/components/BaseSnackbar';


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

export default function OutBoundVoiceRates() {
    const { t } = useTranslation();
    const TABLE_HEAD = [
        { key: "country", label: t("country") },
        { key: "prefix", label: t("prefix") },
        { key: "rounding", label: t("call-rounding") },
        { key: "minute_international_rate", label: t('minute-international-rate') },
        { key: "minute_origin_based_rate", label: t('minute-origin-based-rate') },
        { key: "minute_local_rate", label: t('minute-local-rate') },
        { key: "connect_fee", label: t('connect-fee') },
        

    ];
    
    const TABLE_FIELD_MAPPING = {
        //id: { key: "id", cellComponentType: "th", index: 0 },
        country: { key: "country", index: 0 },
        prefix: { key: "prefix", index: 1 },
        rounding: { key: "rounding", index: 2 },
        minute_international_rate: { key: "minute_international_rate", index: 3 },
        minute_origin_based_rate: { key: "minute_origin_based_rate", index: 4 },
        minute_local_rate: { key: "minute_local_rate", index: 5},
        connect_fee: { key: "connect_fee", index: 6 },
        
    };
    
    const [openSnackbar, setSnackbarStatus] = useState(false);
    const [message, setMessage] = useState("");
   
    const [data, setData] = useState([]);
    const [countries, setCountries] = useState([]);
    const [selectedRow, setSelectedRow] = useState({});
    const [paginationData, setPaginationData] = useState(DefaultPaginationData);
    const [totalCount, setTotalCount] = useState(0);
    const [loadingData, setLoadingData] = useState(false)


    const [filterCountry, setFilterCountry] = useState("");
    const [filterPrefix, setFilterPrefix] = useState("");


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

    
    const fetchOutBoundVoiceRates = () => {
        const params = {
          country: filterCountry ? filterCountry: "",
          prefix: filterPrefix ? filterPrefix : "",
          page: paginationData.page + 1,
          size:10   
        };
        setLoadingData(true);
        TariffService.listOutboundVoiceTariffs(params)
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
        fetchOutBoundVoiceRates();
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
            <BaseSnackbar open={openSnackbar} message={message} setOpen={setSnackbarStatus} />
            <TableFilterContainer>
                <Grid sx={{ alignItems: "center" }} container spacing={4}>
                    <Grid item md={4} xs={12}>
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
                    <Grid item md={4} xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                value={filterPrefix}
                                label={t('prefix(start-with)')}
                                name="prefix"
                                margin="normal"
                                variant="outlined"
                                color="secondary"
                                onChange={event => { setFilterPrefix(event.target.value) }}
                            />
                        </FormControl>
                    </Grid>
                    <SearchButtonContainer item md={2} xs={12}>
                        <SearchButton onClick={() => { fetchOutBoundVoiceRates() }} />
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
