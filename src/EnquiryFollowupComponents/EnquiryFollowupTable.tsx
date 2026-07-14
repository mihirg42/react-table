import { useEffect, useRef, useState, useEffectEvent } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Config } from '../Config/Index.ts';
import Loader from '../HomeComponents/Loader.tsx';

const url = Config.API_URL + Config.GET_ENQUIRY_FOLLOWUP;

const width = 1100;
const height = 600;

const left = window.screenX + (window.outerWidth - width) / 2;
const top = window.screenY + (window.outerHeight - height) / 2;

interface EnquiryFollowupTableProps {
    currentPage: number;
    rowsPerPage: number;
    filters: { email: string; status: string; owner: string };
    totalPages: number;
    setTotalPages: Dispatch<SetStateAction<number>>;
    setCurrentPage: Dispatch<SetStateAction<number>>;
    sortConfig: { key: string; direction: string };
    setSortConfig: Dispatch<SetStateAction<{ key: string; direction: string }>>;
    visibleColumns: string[];
    setVisibleColumns: Dispatch<SetStateAction<string[]>>;
    allColumns: Array<{ key: string; label: string }>;
    employeeName: string;
    allData: any[];
    setAllData: Dispatch<SetStateAction<any[]>>;
    manualPageChange: boolean;
    setManualPageChange: Dispatch<SetStateAction<boolean>>;
    scrollPage: number;
    setScrollPage: Dispatch<SetStateAction<number>>;
    loadingMore: boolean;
    setLoadingMore: Dispatch<SetStateAction<boolean>>;
    lastFetchedPageRef: React.RefObject<number>;
}

export default function EnquiryFollowupTable({ currentPage, setCurrentPage, rowsPerPage, filters, totalPages, setTotalPages,
    sortConfig, setSortConfig, visibleColumns, setVisibleColumns,
    allColumns, employeeName, allData, setAllData, loadingMore, setLoadingMore,
    manualPageChange, setManualPageChange, scrollPage, lastFetchedPageRef }: EnquiryFollowupTableProps) {
    const [, setJson] = useState<any>(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const observerRef = useRef<IntersectionObserver | null>(null);
    const requestIdRef = useRef(0n);


    useEffect(() => {
        localStorage.setItem(
            `columns_${employeeName}`,
            JSON.stringify(visibleColumns)
        );
    }, [visibleColumns, employeeName]);

    const fetchCheck = useEffectEvent(() => {
        if (lastFetchedPageRef.current === currentPage && !manualPageChange) return;

        lastFetchedPageRef.current = currentPage;
        setLoadingMore(true);
    })

    useEffect(() => {
        const requestId = ++requestIdRef.current;
        async function fetchReports() {
            const token = localStorage.getItem("token");

            fetchCheck();

            if (!token) {
                setError("Token not found. Please login again.");
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
                        "loginType": "",
                        "pageIndex": currentPage,
                        "pageSize": rowsPerPage,
                        "source_Id": 0,
                        "sStatus": ""
                    }),
                });
                const data = await response.json();

                if (requestId !== requestIdRef.current) {
                    return;
                }
                setJson(data);

                if (data?.message !== "Success") {
                    alert("Session Expired");
                    setLoadingMore(false);
                    setManualPageChange(false);
                    setIsLoading(false);
                    return {};
                }
                const newData = data?.data?.leadList || [];
                setAllData(prev => [...prev, ...newData]);
                if (data?.data?.totalRecords) {
                    setTotalPages(
                        Math.ceil(data.data.totalRecords / rowsPerPage)
                    );
                }
                setLoadingMore(false);
                setManualPageChange(false);
                setIsLoading(false);
            }
            catch {
                setError("Unable to load reports.");
            }
        }
        fetchReports();

    }, [currentPage, rowsPerPage]);

    function parseCustomDate(dateStr: string) {
        if (dateStr === "") return new Date(0);

        // Example: "30 Apr 2026 03:30 PM"
        const [dayStr, month, yearStr, time, modifier] = dateStr.split(" ");
        const day = Number(dayStr);
        const year = Number(yearStr);

        const monthMap = {
            Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
            Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
        };

        const [h, m] = time.split(":").map(Number);
        let hours = h;
        const minutes = m;
        const monthNumber = monthMap[month as keyof typeof monthMap] ?? 0;

        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;

        return new Date(year, monthNumber, day, hours, minutes);
    }

    function parseCustomDateLastFollowed(dateStr: string) {
        if (dateStr === "") return new Date(0);

        const parts = dateStr.split(" ");

        const day = parseInt(parts[0], 10);
        const month = parts[1];
        const year = parseInt(parts[2], 10);

        const monthMap = {
            Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
            Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
        };
        const monthNumber = monthMap[month as keyof typeof monthMap] ?? 0;

        return new Date(year, monthNumber, day);
    }

    const handleSort = (key: string) => {
        setSortConfig(prev => {
            if (prev.key === key && prev.direction === "asc") {
                return {
                    key,
                    direction: "desc"
                };
            }
            else if (prev.key === key && prev.direction === "desc")
                return { key: "", direction: "" };
            return { key, direction: "asc" };
        });
    };

    const processedData = (allData || [])
        .filter((item: any) => {
            const email = (item.emailId1 || "").toLowerCase();
            const status = (item.status || "").toLowerCase();
            const owner = (item.owner || "").toLowerCase();

            return (
                email.includes(filters.email.toLowerCase()) &&
                status.includes(filters.status.toLowerCase()) &&
                owner.includes(filters.owner.toLowerCase())
            );
        })
        .sort((a: any, b: any) => {
            if (!sortConfig.key) return 0;

            let aValue, bValue;

            if (sortConfig.key !== "customer") {
                aValue = a[sortConfig.key];
                bValue = b[sortConfig.key];
            }
            if (
                sortConfig.key === "displayNextFollowupDate" ||
                sortConfig.key === "displayEnquiryDate"
            ) {
                aValue = parseCustomDate(aValue);
                bValue = parseCustomDate(bValue);
            } else if (sortConfig.key === "displayLastFollowedDate") {
                aValue = parseCustomDateLastFollowed(aValue);
                bValue = parseCustomDateLastFollowed(bValue);
            }

            // Special handling
            if (sortConfig.key === "customer") {
                aValue = `${a.salutation || ""} ${a.firstName || ""} ${a.lastName || ""}`;
                bValue = `${b.salutation || ""} ${b.firstName || ""} ${b.lastName || ""}`;
            }

            if (!(aValue instanceof Date)) {
                aValue = (aValue ?? "").toString().trim().toLowerCase();
                bValue = (bValue ?? "").toString().trim().toLowerCase();
            }

            if (sortConfig.key === 'futAll') {
                aValue = Number(aValue);
                bValue = Number(bValue);
            }

            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });


    useEffect(() => {
        const target = document.getElementById("loadMoreTrigger");
        if (!target) return;

        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loadingMore && !manualPageChange) {
                    setCurrentPage(Math.min(totalPages, currentPage + 1));
                }
            },
            {
                root: document.getElementById("scrollContainer"), // important
                threshold: 0.1,
            }
        );

        observerRef.current.observe(target);

        return () => observerRef.current?.disconnect();
    }, [totalPages, loadingMore, manualPageChange]);


    if (error) {
        return <p>{error}</p>;
    }

    const handleOnClick = () => window.open('https://example.com', 'popup', `width=${width},height=${height},left=${left},top=${top}`)

    const tableClass = isLoading ? 'innerEnq table-shadow innerLoader' : 'innerEnq table-shadow';

    return (
        <>
            <div style={{ marginBottom: "10px" }}>
                <strong>Select Columns:</strong>
                {allColumns.map(col => (
                    <label style={{ marginLeft: "10px" }}>
                        <input
                            type="checkbox"
                            checked={visibleColumns.includes(col.key)}
                            onChange={() => {
                                setVisibleColumns(prev =>
                                    prev.includes(col.key)
                                        ? prev.filter(c => c !== col.key)
                                        : [...prev, col.key]
                                );
                            }}
                        />
                        {col.label}
                    </label>
                ))}
            </div>
            <div className='innerLoader'>
                <button
                    onClick={() => {
                        localStorage.removeItem(`columns_${employeeName}`);
                        setVisibleColumns(allColumns.map(c => c.key))
                    }}>
                    Select All Columns
                </button>
                <button
                    style={{ marginLeft: "10px" }}
                    onClick={() => {
                        localStorage.setItem(`columns_${employeeName}`, "[]");
                        setVisibleColumns([])
                    }}>
                    Deselect All Columns
                </button>
            </div >
            <div id="scrollContainer">
                <div className='outerEnq'>
                    <div className={tableClass}>
                        {
                            isLoading ? <Loader /> :
                                (<table className="table table-hover small">
                                    <thead className="table-secondary">
                                        <tr>
                                            <th>S.No</th>
                                            <th style={{ width: "500px" }}>Actions</th>
                                            {allColumns
                                                .filter(col => visibleColumns.includes(col.key))
                                                .map(col => (
                                                    <th key={col.key} onClick={() => handleSort(col.key)} style={{ cursor: "pointer" }}>
                                                        {col.label}
                                                        {sortConfig.key === col.key && (
                                                            sortConfig.direction === "asc" ? " 🔼" : " 🔽"
                                                        )}
                                                    </th>
                                                ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {processedData.map((item, index) => (
                                            <tr key={index}>
                                                <td>{(scrollPage - 1) * rowsPerPage + index + 1}</td>
                                                <td>
                                                    {
                                                        item["mobileNo1"] !== "" &&
                                                        <>
                                                            <a href="#" style={{ marginRight: "10px" }} onClick={handleOnClick}>
                                                                <i className="fa-solid fa-phone"></i>
                                                            </a>
                                                            <a href="#" style={{ marginRight: "10px" }} onClick={handleOnClick}>
                                                                <i className="fa-solid fa-comment-sms"></i>
                                                            </a>
                                                            <a href="#" style={{ marginRight: "10px" }} onClick={handleOnClick}>
                                                                <i className="fa-brands fa-whatsapp"></i>
                                                            </a>
                                                        </>
                                                    }
                                                    {
                                                        item["emailId1"] !== "" &&
                                                        <a href="#" style={{ marginRight: "10px" }} onClick={handleOnClick}>
                                                            <i className="fa-solid fa-envelope"></i>
                                                        </a>
                                                    }
                                                </td>
                                                {allColumns
                                                    .filter(col => visibleColumns.includes(col.key))
                                                    .map(col => {
                                                        let value = item[col.key];

                                                        switch (col.key) {
                                                            case "customer":
                                                                value = `${item.salutation || ""} ${item.firstName || ""} ${item.lastName || ""}`;
                                                                break;

                                                            case "propertyType":
                                                            case "category":
                                                            case "enquiryFrom":
                                                            case "callerRemarks":
                                                            case "salesRemarks":
                                                            case "siteVisited":
                                                            case "channelName":
                                                            case "tag":
                                                            case "purposeOfInvestment":
                                                                value = item[col.key] || ""; // fallback if API doesn't send it
                                                                break;
                                                        }

                                                        return <td key={col.key}>{value || ""}</td>;
                                                    })
                                                }
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan={allColumns.length + 1}>
                                                <div id="loadMoreTrigger" style={{ height: "120px" }}>
                                                    {loadingMore && <div className="innerLoader"><Loader /></div>}
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                )}
                    </div>
                </div>
            </div>
        </>
    )
}


