import { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import {
    Grid,
    Select,
    TextField,
    FormControl,
    InputLabel,
    MenuItem,
    Typography, TableCell
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
    MatchType
} from 'src/constants/index';
import { useTranslation } from 'react-i18next';
import { TariffService, CommonService} from 'src/api/services';



const SearchButtonContainer = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        textAlign: "left",
    },
    [theme.breakpoints.down('md')]: {
        textAlign: "right",
    },
}));

const TitleStyle = styled(Typography)(({ theme }) => ({
    color: theme.palette.background.contrastText,
    display: "inline"
}));

export default function OutBoundSmsRates() {
    const { t } = useTranslation();
    const TABLE_HEAD = [
        { key: "country", label: t("country") },
        { key: "match_type", label: t("match-type") },
        { key: "prefix", label: t("prefix") },
        { key: "gt_code", label: t("gt-code") },
        { key: "rate", label: t('rate') },
        

    ];
    
    const TABLE_FIELD_MAPPING = {
        country: { key: "country", index: 0 },
        match_type: { key: "match_type", index: 1 },
        prefix: { key: "prefix", index: 2 },
        gt_code: { key: "gt_code", index: 3 },
        rate: { key: "rate", index: 4 },
    };
    
    const [openSnackbar, setSnackbarStatus] = useState(false);
    const [message, setMessage] = useState("");
    const [data, setData] = useState([]);
    const [countries, setCountries] = useState([]);
    const [paginationData, setPaginationData] = useState(DefaultPaginationData);
    const [totalCount, setTotalCount] = useState(0);
    const [loadingData, setLoadingData] = useState(false);
    const [filterCountry, setFilterCountry] = useState("");
    const [filterMatching, setFilterMatching] = useState("");
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

    const fetchOutBoundSmsRates = () => {
        const params = {
            country: filterCountry || (filterPrefix || filterMatching) ? '' : undefined,
            match_type: filterMatching ? filterMatching : undefined,
            prefix: filterPrefix ? filterPrefix : undefined,
            page: paginationData.page + 1,
            size: 10   
        };
        setLoadingData(true);
        TariffService.listOutboundSmsTariffs(params)
            .then((response) => {
                /* response.data=
                {
                "data": {
                "count": 8,
                "items": [
                {
                "country": "Egypt",
                "gt_code": "",
                "match_type": "Prefix Based",
                "prefix": "2012",
                "rate": 0.18
                },
                {
                "country": "Ireland",
                "gt_code": "353856",
                "match_type": "MCC/MNC - GT",
                "prefix": "",
                "rate": 0.02
                },
                {
                "country": "Turkey",
                "gt_code": null,
                "match_type": "MCC/MNC - GT",
                "prefix": "39399",
                "rate": 1
                },
                {
                "country": "Turkey",
                "gt_code": null,
                "match_type": "Prefix Based",
                "prefix": "9055",
                "rate": 2
                },
                {
                "country": "United Kingdom",
                "gt_code": "",
                "match_type": "MCC/MNC - GT",
                "prefix": "44",
                "rate": 1
                },
                {
                "country": "United Kingdom",
                "gt_code": "",
                "match_type": "MCC/MNC - GT",
                "prefix": "4475",
                "rate": 10
                },
                {
                "country": "United States of America",
                "gt_code": "",
                "match_type": "Prefix Based",
                "prefix": "1",
                "rate": 1
                },
                {
                "country": "United States of America",
                "gt_code": "",
                "match_type": "Prefix Based",
                "prefix": "15",
                "rate": 15
                }
                ],
                "page": 1,
                "pages": 1
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
        fetchOutBoundSmsRates();
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
                            <InputLabel id="filter-status-label">{t('matching-type')}</InputLabel>
                            <Select
                                label={'matching-type'}
                                labelId="filter-matching-type"
                                name="matching-type"
                                color="secondary"
                                value={filterMatching }
                                onChange={event => { setFilterMatching(event.target.value) }}
                            >
                                {getSelectOptions(MatchType())}
                                
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                value={filterPrefix}
                                label={t('prefix/gt-code(start-with)')}
                                name="prefix"
                                margin="normal"
                                variant="outlined"
                                color="secondary"
                                onChange={event => { setFilterPrefix(event.target.value) }}
                            />
                        </FormControl>
                    </Grid>
                    <SearchButtonContainer item md={2} xs={12}>
                        <SearchButton onClick={() => { fetchOutBoundSmsRates() }} />
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
