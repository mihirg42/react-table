import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useEffect, useState } from 'react';
import { Config } from '../Config/Index.ts';

const url = Config.API_URL + Config.GET_ENQUIRY_FOLLOWUP;

interface ColumnConfig {
    key: string;
    label: string;
}

interface ExportButtonProps {
    columns: ColumnConfig[];
    visibleColumns: string[];
    fileName?: string;
}

interface LeadListItem {
    [key: string]: any;
    salutation?: string;
    firstName?: string;
    lastName?: string;
}

interface ExportResponse {
    message?: string;
    data?: {
        leadList?: LeadListItem[];
        totalRecords?: number;
    };
}

export default function ExportButton({
    columns,
    visibleColumns,
    fileName = "EnquiryDetail.xlsx"
}: ExportButtonProps) {

    const [json, setJson] = useState<ExportResponse | null>(null);

    useEffect(() => {
        async function fetchReports() {
            const token = localStorage.getItem("token");
            let response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "loginType": "",
                    "pageIndex": 1,
                    "pageSize": 1,
                    "source_Id": 0,
                    "sStatus": ""
                }),
            });

            const data1 = await response.json();


            response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "loginType": "",
                    "pageIndex": 1,
                    "pageSize": data1.data.totalRecords,
                    "source_Id": 0,
                    "sStatus": ""
                }),
            });
            const data = await response.json();
            setJson(data);
            if (data.message !== "Success") {
                alert("Invalid Credentials");
                return {};
            }
        }

        fetchReports();
    }, []);


    const exportToExcel = () => {
        if (!json?.data?.leadList || json?.data?.leadList.length === 0) {
            alert("No data to export");
            return;
        }

        const exportData = json.data.leadList.map((item) => {
            const row: Record<string, string> = {};

            columns
                .filter(col => visibleColumns.includes(col.key))
                .forEach(col => {
                    let value = item[col.key];

                    if (col.key === "customer") {
                        value = `${item.salutation || ""} ${item.firstName || ""} ${item.lastName || ""}`;
                    }

                    row[col.label] = value || "";
                });

            return row;
        });

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });

        saveAs(blob, fileName);
    };

    return (
        <div className="d-flex justify-content-end align-items-center" style={{ height: "100%" }}>
            <button
                onClick={exportToExcel}
                style={{
                    fontSize: "16px",
                    cursor: "pointer"
                }}
                className="btn btn-danger"
            >
                <i className="fa-solid fa-download"></i>
            </button>
        </div>
    );
}