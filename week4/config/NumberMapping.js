import { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  FormControl,
  Stack,
  IconButton,
  Tooltip,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import { styled } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";
import { DefaultPaginationData } from "src/constants/index";
import { rowArrayToObject } from "src/utils/Util";
import { BaseTable, TableFilterContainer } from "src/components/table";
import BaseSnackbar from "src/components/BaseSnackbar";
import BaseModal from "src/components/BaseModal";
import SearchButton from "src/components/buttons/SearchButton";
import { NumberService } from "src/api/services";
import { useTranslation } from "react-i18next";
import AddNewButton from "src/components/buttons/AddNewButton";
import { useParams } from "react-router-dom";
import NumberMappingForm from "./form/NumberMappingForm";

const SearchButtonContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    textAlign: "left",
  },
  [theme.breakpoints.down("md")]: {
    textAlign: "right",
  },
}));

export default function NumberMapping() {
  const { id } = useParams();
  
  const { t } = useTranslation();

  const TABLE_HEAD = [
    { key: "first_name", label: t("first-name") },
    { key: "last_name", label: t("last-name") },
    { key: "email", label: t("email") },
    { key: "phone_number", label: t("phone-number") },
    { key: "action", label: t("actions") },
  ];

  const TABLE_FIELD_MAPPING = {
    id: { key: "id", cellComponentType: "th", index: 0, noRender: true },
    first_name: { key: "first_name", index: 1 },
    last_name: { key: "last_name", index: 2 },
    email: { key: "email", index: 3 },
    phone_number: { key: "phone_number", index: 4 },
  };

  const [openSnackbar, setSnackbarStatus] = useState(false);
  const [message, setMessage] = useState("");
  const [openAddModal, setOpenAddModalStatus] = useState(false);
  const [openEditModal, setOpenEditModalStatus] = useState(false);
  const [data, setData] = useState([]);
  const [ucPackage, setUcPackage] = useState(id || ""); // for selection and useEffect check change condition, when user select an ucPackage from selection its gonna fetch
  const [selectedRow, setSelectedRow] = useState({});
  const [paginationData, setPaginationData] = useState(DefaultPaginationData);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingData, setLoadingData] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterPhoneNumber, setFilterPhoneNumber] = useState("");
  const fetchNumbers = () => {
    const params = {
      id: ucPackage,
      name: filterName ? filterName : undefined,
      number: filterPhoneNumber ? filterPhoneNumber : undefined,
      page: paginationData.page + 1,
      page_size: paginationData.rowsPerPage,
    };
    setLoadingData(true);
    NumberService.listNumbers(params)
      .then((response) => {
        /* changeFurkan after api ready -> .getUcassPackageMappings(id) (?) */
        response.data = {
          "count": 12,
          "next": null,
          "previous": null,
          "results": [
            {
              "id": 1,
              "first_name": "Ali",
              "last_name": "Smith",
              "email": "ali@mail.com",
              "phone_number": "20310301"
            },
            {
              "id": 2,
              "first_name": "Veli",
              "last_name": "Johnson",
              "email": "veli@mail.com",
              "phone_number": "09012312"
            },
            {
              "id": 3,
              "first_name": "Can",
              "last_name": "Williams",
              "email": "can@mail.com",
              "phone_number": "12310301"
            },
            {
              "id": 4,
              "first_name": "Efe",
              "last_name": "Jones",
              "email": "efe@mail.com",
              "phone_number": "888810301"
            },
            {
              "id": 5,
              "first_name": "Mehmet",
              "last_name": "Brown",
              "email": "mehmet@mail.com",
              "phone_number": "5551234567"
            },
            {
              "id": 6,
              "first_name": "Ayşe",
              "last_name": "Davis",
              "email": "ayse@mail.com",
              "phone_number": "5559876543"
            },
            {
              "id": 7,
              "first_name": "Fatih",
              "last_name": "Miller",
              "email": "fatih@mail.com",
              "phone_number": "5552345678"
            },
            {
              "id": 8,
              "first_name": "Selin",
              "last_name": "Wilson",
              "email": "selin@mail.com",
              "phone_number": "5558765432"
            },
            {
              "id": 9,
              "first_name": "Emre",
              "last_name": "Moore",
              "email": "emre@mail.com",
              "phone_number": "5553456789"
            },
            {
              "id": 10,
              "first_name": "Gizem",
              "last_name": "Taylor",
              "email": "gizem@mail.com",
              "phone_number": "5557654321"
            },
            {
              "id": 11,
              "first_name": "Burak",
              "last_name": "Smith",
              "email": "burak@mail.com",
              "phone_number": "5551234567"
            },
            {
              "id": 12,
              "first_name": "Zeynep",
              "last_name": "Johnson",
              "email": "zeynep@mail.com",
              "phone_number": "5559876543"
            }
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
      });
  };

  useEffect(() => {
    fetchNumbers();
    return () => {
      setData([]);
    };
  }, [paginationData]);

  const getUcPackages = () => {};

  const formatRowData = (rowData) => {
    //changeFurkan  -ask for any necessary format
    let formatted = [];
    rowData.map((d, idx) => {
      if (d.key === "") {
      } else {
        formatted.push(d);
      }
    });
    return formatted;
  };
// if only return ids it need to be matched from all ucPackages data so that we can get names with our subscribed IDs. WE NEED NAMES FOR SELECTION(?)
  const fetchSubscribedPackages = () => { 

  }

  const modalHandler = (modalType, index = undefined) => {
    if (modalType === "add") {
      setOpenAddModalStatus(!openAddModal);
  } else if (modalType === "edit") {
      setOpenEditModalStatus(!openEditModal);
  }

    if (index) {
      setSelectedRow(rowArrayToObject(data[index]));
    }
  };

  const getActionItems = (index) => {
    return (
      <Stack direction="row" spacing={2}>
        <Tooltip title={t("edit-forwarding")}>
          <IconButton
            color="secondary"
            size="small"
            aria-label="edit-forwarding"
            onClick={() => modalHandler("edit", index)}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    );
  };

  return (
    <>
      <BaseSnackbar
        open={openSnackbar}
        message={message}
        setOpen={setSnackbarStatus}
      />
       <BaseModal
        title={t("add-number-map")}
        open={openAddModal}
        setOpen={setOpenAddModalStatus}
        children={
          <NumberMappingForm
            successCallback={fetchNumbers}
            formType = 'add'
            formData={selectedRow}
            setModalStatus={setOpenAddModalStatus}
            setSnackbarStatus={setSnackbarStatus}
            setMessage={setMessage}
          />
        }
      />
      <BaseModal
        title={t("edit-number-map")}
        open={openEditModal}
        setOpen={setOpenEditModalStatus}
        children={
          <NumberMappingForm
            successCallback={fetchNumbers}
            formType = 'edit'
            formData={selectedRow}
            setModalStatus={setOpenEditModalStatus}
            setSnackbarStatus={setSnackbarStatus}
            setMessage={setMessage}
          />
        }
      />
     
      <TableFilterContainer>
        <Grid sx={{ alignItems: "center" }} container spacing={4}>
          <Grid item md={3} xs={12}>
            <FormControl fullWidth>
              <TextField
                value={filterName}
                label={t("name")}
                name="name"
                margin="normal"
                variant="outlined"
                color="secondary"
                onChange={(event) => {
                  setFilterName(event.target.value);
                }}
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl fullWidth>
              <TextField
                value={filterPhoneNumber}
                label={t("phone-number")}
                name="phonenumber"
                margin="normal"
                variant="outlined"
                color="secondary"
                onChange={(event) => {
                  setFilterPhoneNumber(event.target.value);
                }}
              />
            </FormControl>
          </Grid>

          <SearchButtonContainer item md={2} xs={12}>
            <SearchButton
              onClick={() => {
                fetchNumbers();
              }}
            />
          </SearchButtonContainer>
        </Grid>
      </TableFilterContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div
          style={{
            alignSelf: "flex-start",
            backgroundColor: "white",
            marginTop: 20,
          }}
        >
          <FormControl sx={{ width: 300 }}>
            <InputLabel id="select-ucass">{t("Ucass Package")}</InputLabel>
            <Select
              label={t("ucass-packages")}
              labelId="select-ucass"
              name="ucPackage"
              color="primary"
              value={ucPackage}
              onChange={(event) => {
                setUcPackage(event.target.value);
              }}
            >
              {/*make dynamic menu items here acording to subscribed ucass packages (number data is dynamicly come acording to selection (ucPackage id))*/}
 
              <MenuItem value="27">Gold Ucass package</MenuItem>
              <MenuItem value="28">Premium Ucass package</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div style={{ alignSelf: "flex-end" }}>
          <AddNewButton sx={{height: 50}}
            label={t("map-new-number")}
            onClick={() => modalHandler("add")}
          />
        </div>
      </div>

      <br />
      <BaseTable
        head={TABLE_HEAD}
        data={[...data].map((d, idx) => {
          return formatRowData(d);
        })}
        actionItemPrep={getActionItems}
        pagination={{
          paginationData: { ...paginationData, totalCount: totalCount },
          setPaginationData: setPaginationData,
        }}
        loadingData={loadingData}
      />
    </>
  );
}
