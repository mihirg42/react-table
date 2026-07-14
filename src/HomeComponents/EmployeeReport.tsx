import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Config } from '../Config/Index.ts';
import Loader from './Loader.tsx';

interface ReportItem {
    [key: string]: any;
}

interface ReportJson {
    data?: {
        reportData?: ReportItem[][];
    };
}

interface EmployeeReportProps {
    employeeReportIsLoading: boolean;
    setEmployeeReportIsLoading: Dispatch<SetStateAction<boolean>>;
}

const url = Config.API_URL + Config.GET_REPORT;

// Popup Configuration
const width = 1100;
const height = 600;

const left = window.screenX + (window.outerWidth - width) / 2;
const top = window.screenY + (window.outerHeight - height) / 2;

export default function EmployeeReport({ employeeReportIsLoading, setEmployeeReportIsLoading }: EmployeeReportProps) {
    const [json, setJson] = useState<ReportJson | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchReports() {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Token not found. Please login again.");
                setEmployeeReportIsLoading(false);
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
                        "reportType": "WEF-E",
                        "param1": "1"
                    }),
                });

                setJson(await response.json());

            } catch {
                setError("Unable to load reports.");
            } finally {
                setEmployeeReportIsLoading(false);
            }
        }

        fetchReports();
    }, []);

    if (employeeReportIsLoading) {
        return <Loader />;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const totals = json?.data?.reportData?.[0].reduce(
        (acc, item) => {
            acc.new += item.NEWNotUploaded || 0;
            acc.reEnquired += item.ReEnquired || 0;
            acc.data += item.NEWUploaded || 0;
            acc.pending += item.Pendingfollowup || 0;
            acc.today += item.TodayFollowuP || 0;
            acc.future += item.F_Followup || 0;
            acc.attempted += item.Attempted || 0;
            acc.dump += item.Dump || 0;
            acc.success += item.SUCCESS || 0;
            acc.total += item.Total || 0;
            acc.siteVisit += item.SiteVisit || 0;
            acc.meetingDone += item.Meeting_Done || 0;
            acc.bookings += item.No_Of_Bookings || 0;
            acc.qualified += item.Qualified || 0;
            return acc;
        },
        {
            new: 0,
            reEnquired: 0,
            data: 0,
            pending: 0,
            today: 0,
            future: 0,
            attempted: 0,
            dump: 0,
            success: 0,
            total: 0,
            siteVisit: 0,
            meetingDone: 0,
            bookings: 0,
            qualified: 0,
        }
    ) || {
        new: 0,
        reEnquired: 0,
        data: 0,
        pending: 0,
        today: 0,
        future: 0,
        attempted: 0,
        dump: 0,
        success: 0,
        total: 0,
        siteVisit: 0,
        meetingDone: 0,
        bookings: 0,
        qualified: 0,
    };

    const handleOnClick = () => window.open('https://example.com', 'popup', `width=${width},height=${height},left=${left},top=${top}`)

    return (
        <>
            <h4>&ensp;Enquiry Followup: Employee-Wise</h4>
            <table className="table table-hover table-bordered small">
                <thead className="table-secondary">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Employee</th>
                        <th scope="col">New</th>
                        <th scope="col">Re Enquired</th>
                        <th scope="col">Data</th>
                        <th scope="col">Pending</th>
                        <th scope="col">Today</th>
                        <th scope="col">Future</th>
                        <th scope="col">Attempted</th>
                        <th scope="col">Dump</th>
                        <th scope="col">Success</th>
                        <th scope="col">Total</th>
                        <th scope="col">Site Visit</th>
                        <th scope="col">Meeting Done</th>
                        <th scope="col">Bookings</th>
                        <th scope="col">Qualified</th>
                    </tr>
                </thead>
                <tbody>
                    {json?.data?.reportData?.[0].map((item, index) => (
                        <tr>
                            <td>{index + 1}</td>
                            <td>{item.EmpName}</td>
                            <td><a href="#" onClick={handleOnClick}>
                                {item.NEWNotUploaded}</a></td>
                            <td><a href="#" onClick={handleOnClick}>{item.ReEnquired}</a></td>
                            <td><a href="#" onClick={handleOnClick}>{item.NEWUploaded}</a></td>
                            <td><a href="#" onClick={handleOnClick}>{item.Pendingfollowup}</a></td>
                            <td><a href="#" onClick={handleOnClick}>{item.TodayFollowuP}</a></td>
                            <td><a href="#" onClick={handleOnClick}>{item.F_Followup}</a></td>
                            <td><a href="#" onClick={handleOnClick}>{item.Attempted}</a></td>
                            <td><a href="#" onClick={handleOnClick}>{item.Dump}</a></td>
                            <td><a href="#" onClick={handleOnClick}>{item.SUCCESS}</a></td>
                            <td><a href="#" onClick={handleOnClick}>{item.Total}</a></td>
                            <td><a href="#" onClick={handleOnClick}>{item.SiteVisit}</a></td>
                            <td><a href="#" onClick={handleOnClick}>{item.Meeting_Done}</a></td>
                            <td><a href="#" onClick={handleOnClick}>{item.No_Of_Bookings}</a></td>
                            <td><a href="#" onClick={handleOnClick}>{item.Qualified}</a></td>
                        </tr>
                    ))}
                    <tr className="fw-bold">
                        <td colSpan={2}>Total</td>
                        <td><a href="#" onClick={handleOnClick}>{totals.new}</a></td>
                        <td><a href="#" onClick={handleOnClick}>{totals.reEnquired}</a></td>
                        <td><a href="#" onClick={handleOnClick}>{totals.data}</a></td>
                        <td><a href="#" onClick={handleOnClick}>{totals.pending}</a></td>
                        <td><a href="#" onClick={handleOnClick}>{totals.today}</a></td>
                        <td><a href="#" onClick={handleOnClick}>{totals.future}</a></td>
                        <td><a href="#" onClick={handleOnClick}>{totals.attempted}</a></td>
                        <td><a href="#" onClick={handleOnClick}>{totals.dump}</a></td>
                        <td><a href="#" onClick={handleOnClick}>{totals.success}</a></td>
                        <td><a href="#" onClick={handleOnClick}>{totals.total}</a></td>
                        <td><a href="#" onClick={handleOnClick}>{totals.siteVisit}</a></td>
                        <td><a href="#" onClick={handleOnClick}>{totals.meetingDone}</a></td>
                        <td><a href="#" onClick={handleOnClick}>{totals.bookings}</a></td>
                        <td><a href="#" onClick={handleOnClick}>{totals.qualified}</a></td>
                    </tr>
                </tbody>
            </table>

        </>
    )
}

