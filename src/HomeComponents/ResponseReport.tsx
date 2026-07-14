import { useEffect, useState } from 'react';
import { Config } from '../Config/Index.ts';
import Loader from './Loader.tsx';
import type { Dispatch, SetStateAction } from 'react';


interface ResponseReportItem {
    [key: string]: any;
    MAIN_FOLLOWUPTYPE_NAME?: string;
    FOLLOWUPTYPE?: string;
}

interface ResponseReportJson {
    data?: {
        reportData?: ResponseReportItem[][];
    };
}

interface ResponseReportProps {
    responseReportIsLoading: boolean;
    setResponseReportIsLoading: Dispatch<SetStateAction<boolean>>;
}

const url = Config.API_URL + Config.GET_REPORT;

export default function ResponseReport({ responseReportIsLoading, setResponseReportIsLoading }: ResponseReportProps) {
    const [json, setJson] = useState<ResponseReportJson | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchReports() {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Token not found. Please login again.");
                setResponseReportIsLoading(false);
                return;
            }

            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + token,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "reportType": "WFTR",
                        "param1": "1"
                    }),
                });

                setJson(await response.json());
            } catch {
                setError("Unable to load reports.");
            } finally {
                setResponseReportIsLoading(false);
            }
        }

        fetchReports();
    }, []);

    if (responseReportIsLoading) {
        return <Loader />;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const groupedData = Object.values(
        json?.data?.reportData?.[0]?.reduce(
            (acc, item: ResponseReportItem) => {
                const key = item.MAIN_FOLLOWUPTYPE_NAME || "";

                if (!acc[key]) {
                    acc[key] = {
                        main: key,
                        items: [] as ResponseReportItem[]
                    };
                }

                acc[key].items.push(item);
                return acc;
            },
            {} as Record<string, { main: string; items: ResponseReportItem[] }>
        ) || {}
    );

    let serial = 1;

    return (
        <>
            <h4>&ensp;Response Type Report</h4>

            <table className="table table-hover table-bordered small shadow">
                <thead className="table-secondary">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Response Type</th>
                        <th scope="col">Sub-Response Type</th>
                        <th scope="col">New</th>
                        <th scope="col">Pending</th>
                        <th scope="col">Today</th>
                        <th scope="col">Future</th>
                        <th scope="col">Attempted</th>
                        <th scope="col">Dump</th>
                        <th scope="col">Success</th>
                        <th scope="col">Total</th>

                    </tr>
                </thead>
                <tbody>
                    {groupedData.map((group) =>
                        group.items.map((item, index) => {
                            const currentSerial = serial++;
                            return (
                                <tr>
                                    <td>{currentSerial}</td>
                                    {/* First column: only render once with rowspan */}
                                    {index === 0 && (
                                        <td rowSpan={group.items.length} className="align-middle text-center">
                                            {group.main}
                                        </td>
                                    )}

                                    <td>{item.FOLLOWUPTYPE}</td>
                                    <td>{item.NEW}</td>
                                    <td>{item.Pending}</td>
                                    <td>{item.Today}</td>
                                    <td>{item.Future}</td>
                                    <td>{item.Attempted}</td>
                                    <td>{item.Dump}</td>
                                    <td>{item.Success}</td>
                                    <td>{item.Total}</td>
                                </tr>
                            )
                        })
                    )}
                </tbody>

            </table>
        </>
    )
}

