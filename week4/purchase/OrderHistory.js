import { useState, useEffect } from "react";
import { BaseTable } from "src/components/table";
import { DefaultPaginationData } from "src/constants/index";
import { CampaignManagementService } from "src/api/services";
import { fDateTime } from "src/utils/formatTime";
import { useTranslation } from "react-i18next";

export default function OrderHistory() {
  const { t } = useTranslation();
  const TABLE_HEAD = [
    { key: "name", label: t("package-name") },
    { key: "subscriptionStart", label: t("subscription-start") },
    { key: "subscriptionEnd", label: t("subs-end") },
  ];

  const TABLE_FIELD_MAPPING = {
    id: { key: "id", cellComponentType: "th", index: 0, noRender: true },
    name: { key: "name", index: 1 },
    subscription_start: { key: "subscriptionStart", index: 2 },
    subscription_end: { key: "subscriptionEnd", index: 3 },
  };

  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState(DefaultPaginationData);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingData, setLoadingData] = useState(false);
  const [subscribedPackages, setSubscribedPackages] = useState([]);


  const fetchOrders = () => {
    const params = {
      page: paginationData.page + 1,
      page_size: paginationData.rowsPerPage,
    };
    setLoadingData(true);
    CampaignManagementService.listAnnouncements(params) // changeFurkan -> change here after listOrdersHistory(?) ready
      .then((response) => {
        response.data = {
          count: 3,
          next: null,
          previous: null,
          results: [
            {
              id: 26,
              name: "Standard Ucass Package",
              subscription_start: "1666684829",
              subscription_end: "1668684930",
            },
            {
              id: 28,
              name: "Premium Ucass Package",
              subscription_start: "1668688930",
              subscription_end: "",
            },
            {
              id: 27,
              name: "Gold Ucass Package",
              subscription_start: "1678694930",
              subscription_end: "",
            },
          ],
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
  const fetchSubscribedPackages = () => {
    //changeFurkan ask how to get subscribed package. For now return an id(package id)
    setSubscribedPackages([27, 28]);
  };

  useEffect(() => {
    fetchOrders();
    return () => {
      setData([]);
    };
  }, [paginationData]);
  useEffect(() => {
    fetchSubscribedPackages();
  }, []);

  const formatRowData = (rowData) => {
    let formatted = [];
    rowData.map((d, idx) => {
      if (d.key === "subscriptionStart") {
        formatted.push({
          ...d,
          value: fDateTime(+d.value * 1000),
        });
      } else if (d.key === "subscriptionEnd") {
        if (d.value === "") {
          
           formatted.push({
            ...d,
            value: "01 Jan 2099 23:59",
          });
        } else {
          formatted.push({
            ...d,
            value: fDateTime(+d.value * 1000),
          });
        }
      } else {
        formatted.push(d);
      }
    });
    return formatted;
  };

  
  return (
    <>
      <br />
      <BaseTable
        head={TABLE_HEAD}
        data={[...data].map((d, idx) => {
          return formatRowData(d);
        })}
        pagination={{
          paginationData: { ...paginationData, totalCount: totalCount },
          setPaginationData: setPaginationData,
        }}
        loadingData={loadingData}
        subscribedPackageIds={subscribedPackages}
      />
    </>
  );
}
