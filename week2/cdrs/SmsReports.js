import { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { Box, Grid, FormControl, Typography} from '@mui/material';
import { BaseTable, TableFilterContainer } from 'src/components/table';
import { DefaultPaginationData, getLabelByValue, SmsHistoryStatuses } from 'src/constants';
import SearchButton from 'src/components/buttons/SearchButton';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from "dayjs";
import BaseSnackbar from 'src/components/BaseSnackbar';

import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { LogViewerService } from 'src/api/services';
import { fCurrency } from '../../../utils/formatNumber';

const SearchButtonContainer = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        textAlign: "left",
    },
    [theme.breakpoints.down('md')]: {
        textAlign: "right",
    },
}));

export default function SmsReports({ }) {
    const { t } = useTranslation();
   
    const tableHead = [
        { key: "timestamp", label: t("timestamp") },
        { key: "recipient", label: t("recipient") },
        { key: "sender", label: t("sender") },
        { key: "rate", label: t("rate") },
           
    ];
    
    const tableFieldMapping = {
        timestamp: { key: "timestamp", index: 0 },
        recipient: { key: "recipient", index: 1 },
        sender: { key: "sender", index: 2 },
        rate: { key: "rate", index: 3 },
            
    };
    
    const [data, setData] = useState([]);
    const [paginationData, setPaginationData] = useState(DefaultPaginationData);
    const [totalCount, setTotalCount] = useState(0);
    const [loadingData, setLoadingData] = useState(false);
    const [filterStart, setFilterStart] = useState(dayjs(new Date()).startOf('day'));
    const [filterEnd, setFilterEnd] = useState(dayjs(new Date()).endOf('day'));
    const [openSnackbar, setSnackbarStatus] = useState(false);
    const [message, setMessage] = useState("");
    const TitleStyle = styled(Typography)(({ theme }) => ({
        color: theme.palette.background.contrastText,
        display: "inline"
    }));

    const fetchCdr = () => {
        const params = {
            start_datetime:filterStart.format('YYYY-MM-DDTHH:mm:ss'),
            end_datetime:filterEnd.format('YYYY-MM-DDTHH:mm:ss'),
            size:10,
            page: paginationData.page + 1
        };
        setLoadingData(true);
        LogViewerService.listLogsSms(params)
            .then((response) => {
                if (!response.data || !response.data.data) {
                    throw(t("session-expired"));
                }
                let items = [];
                setTotalCount(response.data.data.count);
                
                for (const idx in response.data.data.items) {
                    let item = new Array(tableHead.length - 1).fill({});
                    Object.entries(response.data.data.items[idx]).forEach(([key, value]) => {
                        if (key in tableFieldMapping) {
                            item[tableFieldMapping[key].index] = {
                                ...tableFieldMapping[key],
                                value: value,
                            };
                        }
                    });
                    items.push(item);
                }
                setData(items);
                if(totalCount === 0) throw(t("not-found-logs"));
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
        fetchCdr();
        return () => {
            setData([]);
        }
    }, [paginationData]);

    const formatRowData = (rowData) => {
        let formatted = [];
        rowData.map((d, idx) => {
            if(d.key==="timestamp"){
                formatted.push({
                    ...d,
                    value: d.value ? dayjs(d.value).format('DD/MM/YYYY HH:mm') : "",
                });
            }
            else {
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
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker onChange={(date)=> setFilterStart(date)} value={filterStart} label="Start Date-Time" />
                            </LocalizationProvider>
                        </FormControl>
                    </Grid>

                    <Grid item md={3} xs={12}>
                        <FormControl fullWidth>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker onChange={(date)=> setFilterEnd(date)} value={filterEnd} label="End Date-Time" />
                            </LocalizationProvider>
                        </FormControl>
                    </Grid>
                    <SearchButtonContainer item md={2} xs={12}>
                        <SearchButton onClick={() => { fetchCdr() }} />
                    </SearchButtonContainer>
                </Grid>
                <br/>
                <SearchButtonContainer item md={12} xs={12}>
                    <Box display="flex"  justifyContent="space-between" alignItems="center" alignContent="center" sx={{textAlign: "right"}}>
                        <Box><strong>Results:</strong> <TitleStyle>Total <strong>{totalCount}</strong> records found.
                        </TitleStyle>
                        </Box>

                    </Box>
                </SearchButtonContainer>
            </TableFilterContainer>
            <br />
            <BaseTable
                head={tableHead}
                data={[...data].map((d, idx) => { return formatRowData(d); })}
                pagination={{ paginationData: { ...paginationData, totalCount: totalCount }, setPaginationData: setPaginationData }}
                loadingData={loadingData}
            />
            
        </>
    );

}

