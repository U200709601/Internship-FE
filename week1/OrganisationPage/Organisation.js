import React from 'react';
import { useState, useEffect } from 'react';
import { Box, Stack} from '@mui/material';

import { DefaultPaginationData,
    getLabelByValue,
    MembersStatus} from 'src/constants/index';
import { useTranslation } from 'react-i18next';
import { TableFilterContainer, BaseTable } from 'src/components/table';
import BaseButton from 'src/components/buttons/BaseButton';
import AddMemberForm from './forms/AddMemberForm';
import BaseSnackbar from 'src/components/BaseSnackbar';
import BaseModal from 'src/components/BaseModal';
import { UserService } from 'src/api/services';

// ----------------------------------------------------------------------


export default function Organisation() {
    const {t} = useTranslation();
    const [openAddMemberModal, setAddMemberModalStatus] = useState(false);
    const [message, setMessage] = useState("");
    const [openSnackbar, setSnackbarStatus] = useState(false);
    const [paginationData, setPaginationData] = useState(DefaultPaginationData);
    const [loadingData, setLoadingData] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const TABLE_HEAD = [
        { key: "email", label: t("email") },
        { key: "firstName", label: t('first-name') },
        { key: "lastName", label: t('last-name')},
        { key: "status", label: t("Status")},
        { key: "action", label: t('actions')}
    
    ];

    const TABLE_FIELD_MAPPING = {
        email: { key: "email", index: 0 },
        name: { key: "firstName", index: 1 },
        status: {key: "status", index: 3},
        surname: {key: "lastName", index:2}
    }; 

    const fetchMembers = () => {
        const params = {
            size: paginationData.rowsPerPage,
        };
        setLoadingData(true);
        UserService.listOrganizationUsers(params)
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
            })
            .catch((err) => {
                setMessage(err);
                setSnackbarStatus(true);
            })
            .finally(() => {
                setLoadingData(false);
            })
            
    };
    
    useEffect(() => {
        fetchMembers();
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
                    value: getLabelByValue(MembersStatus(), d.value.toString()), chipColor: d.value === 1 ? "success" : "primary",
                    
                });
            }else {
                formatted.push(d);
            }
        })
        return formatted;
    };

    const resetPassword = (index) => {
        
        setLoading(true);
        const payload = {
            email: data[index][0].value
        };

    UserService.ResetTeamMemberPassword(payload)
        .then((response) => {
            if (response.data.meta.code === 200) {
                setMessage(t('an-email-sent-to-member-to-reset-password'));
                setSnackbarStatus(true);
                setLoading(false);
            } else {
                throw (t("cannot-sent-reset-email"));
            }
        })
        .catch((err) => {
            setMessage(t('cannot-sent-reset-email'));
            setSnackbarStatus(true);
            setLoading(false);
        });
    }
    const modalHandler = (modalType) => {
        if (modalType === "addMember") {
            setAddMemberModalStatus(!openAddMemberModal);
        }
    };

    const getActionItems = (index) => {

        if (data[index][3].value === 1) {
            return (

                <Stack  direction="row" spacing={2}>
                    <BaseButton
                        label= {t("resetPassword")} 
                        onClick={() => resetPassword(index)}
                        color={"primary"}
                        sx={{ backgroundColor: '#109cf1' }}
                    />

                </Stack>
                
            );
        }     

      };
    return (
        <>
            <Box marginBottom={10}>
                <BaseSnackbar open={openSnackbar} message={message} setOpen={setSnackbarStatus}/>
                <h2>{t("Team Members")}</h2>
                <TableFilterContainer >
                    <Box alignItems={"center"} sx={{
                        height: 80,
                        display: 'flex'
                    
                        }}>
                        <BaseButton
                            label= {t("+ Add New Member")} 
                            onClick={() => modalHandler("addMember")}
                            color={"primary"}
                            sx={{ backgroundColor: "#109cf1" , height: 50 }}           
                        />
                    </Box>
                </TableFilterContainer>
                <BaseModal title={t("Add New Member")} open={openAddMemberModal} setOpen={setAddMemberModalStatus} children={<AddMemberForm successCallback={fetchMembers} setModalStatus={setAddMemberModalStatus} setSnackbarStatus={setSnackbarStatus} setMessage={setMessage}/>} />

            </Box>
            
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
