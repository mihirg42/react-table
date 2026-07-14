import { useEffect, useState } from 'react';
import { Config } from '../Config/Index.ts';
import type { Dispatch, SetStateAction } from 'react';
import Loader from './Loader.tsx';

interface ReportItem {
    [key: string]: any;
}

interface ReportJson {
    data?: {
        reportData?: ReportItem[][];
    };
}

interface EmployeeReportTodayProps {
    employeeReportTodayIsLoading: boolean;
    setEmployeeReportTodayIsLoading: Dispatch<SetStateAction<boolean>>;
}

const url = Config.API_URL + Config.GET_REPORT;

export default function EmployeeReportToday({ employeeReportTodayIsLoading, setEmployeeReportTodayIsLoading }: EmployeeReportTodayProps) {
    const [json, setJson] = useState<ReportJson | null>(null);
    const [error, setError] = useState("");


    useEffect(() => {
        async function fetchReports() {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Token not found. Please login again.");
                setEmployeeReportTodayIsLoading(false);
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
                        "reportType": "WEF-E-T",
                        "param1": "1"
                    }),
                });

                setJson(await response.json());
            } catch {
                setError("Unable to load reports.");
            } finally {
                setEmployeeReportTodayIsLoading(false);
            }
        }

        fetchReports();
    }, []);

    if (employeeReportTodayIsLoading) {
        return <Loader />;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const totals = json?.data?.reportData?.[0].reduce(
        (acc, item) => {
            acc.new += item.NEWNotUploaded || 0;
            acc.data += item.NewUploaded || 0;
            acc.totalToday += item.TodayFollowuP || 0;
            acc.t6 += item["6PM-9PM"] || 0;
            acc.t7 += item["9AM-12AM"] || 0;
            acc.t12 += item["12AM-3PM"] || 0;
            acc.t3 += item["3PM-6PM"] || 0;
            acc.transferredToMe += item.Today_Transferred_To_Me || 0;
            acc.transferredByMe += item.Today_Transferred || 0;
            acc.todayWorked += item.TODAY_CALLEDUP || 0;
            return acc;
        },
        {
            new: 0,
            data: 0,
            totalToday: 0,
            t7: 0,
            t12: 0,
            t3: 0,
            t6: 0,
            transferredToMe: 0,
            transferredByMe: 0,
            todayWorked: 0,
        }
    ) || {
        new: 0,
        data: 0,
        totalToday: 0,
        t7: 0,
        t12: 0,
        t3: 0,
        t6: 0,
        transferredToMe: 0,
        transferredByMe: 0,
        todayWorked: 0,
    };


    return (
        <>
            <h4>&ensp;Enquiry Followup: Employee-Wise (Today)</h4>

            <table className="table table-hover table-bordered small shadow-sm">
                <thead className="table-secondary">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Employee</th>
                        <th scope="col">New</th>
                        <th scope="col">Data</th>
                        <th scope="col">Total Today</th>
                        <th scope="col">7 AM - 12 PM</th>
                        <th scope="col">12 PM - 3 PM</th>
                        <th scope="col">3 PM - 6 PM</th>
                        <th scope="col">6 PM - 9 PM</th>
                        <th scope="col">Transferred To Me</th>
                        <th scope="col">Transferred By Me</th>
                        <th scope="col">Today Worked</th>

                    </tr>
                </thead>
                <tbody>
                    {json?.data?.reportData?.[0].map((item, index) => (


                        <tr>
                            <td>{index + 1}</td>
                            <td>{item.EmpName}</td>
                            <td>{item.NEWNotUploaded}</td>
                            <td>{item.NewUploaded}</td>
                            <td>{item.TodayFollowuP}</td>
                            <td>{item["9AM-12AM"]}</td>
                            <td>{item["12AM-3PM"]}</td>
                            <td>{item["3PM-6PM"]}</td>
                            <td>{item["6PM-9PM"]}</td>
                            <td>{item.Today_Transferred_To_Me}</td>
                            <td>{item.Today_Transferred}</td>
                            <td>{item.TODAY_CALLEDUP}</td>

                        </tr>

                    ))}
                    <tr className="fw-bold">
                        <td colSpan={2}>Total</td>
                        <td>{totals.new}</td>
                        <td>{totals.data}</td>
                        <td>{totals.totalToday}</td>
                        <td>{totals.t7}</td>
                        <td>{totals.t12}</td>
                        <td>{totals.t3}</td>
                        <td>{totals.t6}</td>
                        <td>{totals.transferredToMe}</td>
                        <td>{totals.transferredByMe}</td>
                        <td>{totals.todayWorked}</td>

                    </tr>
                </tbody>

            </table>
        </>
    )
}

