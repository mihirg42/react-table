import { useEffect, useState } from 'react';
import { Config } from '../Config/Index.ts';
import Loader from './Loader.tsx';
import type { Dispatch, SetStateAction } from 'react';


interface ReportItem {
    [key: string]: any;
}

interface ReportJson {
    data?: {
        reportData?: ReportItem[][];
    };
}

interface EnquiryReportProps {
    enquiryReportIsLoading: boolean;
    setEnquiryReportIsLoading: Dispatch<SetStateAction<boolean>>;
}

const url = Config.API_URL + Config.GET_REPORT;

export default function EnquiryReport({ enquiryReportIsLoading, setEnquiryReportIsLoading }: EnquiryReportProps) {
    const [json, setJson] = useState<ReportJson | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchReports() {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Token not found. Please login again.");
                setEnquiryReportIsLoading(false);
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
                        "reportType": "WETR",
                        "param1": "1"
                    }),
                });

                setJson(await response.json());

            } catch {
                setError("Unable to load reports.");
            } finally {
                setEnquiryReportIsLoading(false);
            }
        }

        fetchReports();
    }, []);

    if (enquiryReportIsLoading) {
        return <Loader />;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const totals = json?.data?.reportData?.[0].reduce(
        (acc, item) => {
            // acc.enquiryType += item.Enquiry_Type
            acc.new += item.New || 0;
            acc.pending += item.Pending || 0;
            acc.today += item.Today || 0;
            acc.future += item.Future || 0;
            acc.attempted += item.Attempted || 0;
            acc.dump += item.Dump || 0;
            acc.success += item.Success || 0;
            acc.total += item.Total || 0;
            return acc;
        },
        {
            new: 0,
            pending: 0,
            today: 0,
            future: 0,
            attempted: 0,
            dump: 0,
            success: 0,
            total: 0,
        }
    ) || {
        new: 0,
        pending: 0,
        today: 0,
        future: 0,
        attempted: 0,
        dump: 0,
        success: 0,
        total: 0,
    };


    return (
        <>
            <h4>&ensp;Enquiry Type Report</h4>

            <table className="table table-hover table-bordered small shadow-sm">
                <thead className="table-secondary">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Enquiry Type</th>
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
                    {json?.data?.reportData?.[0].map((item, index) => (


                        <tr>
                            <td>{index + 1}</td>
                            <td>{item.Enquiry_Type}</td>
                            <td>{item.New}</td>
                            <td>{item.Pending}</td>
                            <td>{item.Today}</td>
                            <td>{item.Future}</td>
                            <td>{item.Attempted}</td>
                            <td>{item.Dump}</td>
                            <td>{item.Success}</td>
                            <td>{item.Total}</td>
                        </tr>

                    ))}
                    <tr className="fw-bold">
                        <td colSpan={2}>Total</td>
                        <td>{totals.new}</td>
                        <td>{totals.pending}</td>
                        <td>{totals.today}</td>
                        <td>{totals.future}</td>
                        <td>{totals.attempted}</td>
                        <td>{totals.dump}</td>
                        <td>{totals.success}</td>
                        <td>{totals.total}</td>

                    </tr>
                </tbody>

            </table>
        </>
    )
}

