import { useEffect, useRef } from "react";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";

interface PaginationControlsProps {
    currentPage: number;
    setCurrentPage: Dispatch<SetStateAction<number>>;
    rowsPerPage: number;
    setRowsPerPage: Dispatch<SetStateAction<number>>;
    totalPages: number;
    setAllData: Dispatch<SetStateAction<any[]>>;
    setManualPageChange: Dispatch<SetStateAction<boolean>>;
    setScrollPage: Dispatch<SetStateAction<number>>;
    pageInput: string | number;
    setPageInput: Dispatch<SetStateAction<string | number>>;
    loadingMore: boolean;
    lastFetchedPageRef: React.RefObject<number>;
    setLoadingMore: Dispatch<SetStateAction<boolean>>;
}

export default function PaginationControls({ currentPage, setCurrentPage, rowsPerPage, setRowsPerPage, totalPages, setLoadingMore,
    setAllData, setManualPageChange, setScrollPage, pageInput, setPageInput, lastFetchedPageRef }: PaginationControlsProps) {

    const inputEmptyRef = useRef(false);
    useEffect(() => {
        if (inputEmptyRef.current === true) {
            inputEmptyRef.current = false;
            return;
        }
        setPageInput(currentPage);
    }, [currentPage, rowsPerPage]);

    function handleOnChangePageNo(e: ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setManualPageChange(true);
        setPageInput(value);

        if (value === "") {
            inputEmptyRef.current = true;
            setCurrentPage(0);
            return;
        }

        const pg = Number(value);

        if (pg > totalPages || pg < 1) { setCurrentPage(pg); return alert("Page number out of bounds"); }
        setAllData([]);
        setCurrentPage(pg);
        setScrollPage(pg);
        setManualPageChange(true);

    }

    return (
        <>
            <div style={{ marginTop: "10px", textAlign: "center" }}>
                <button
                    onClick={() => {
                        const newPage = Math.max(currentPage - 1, 1);
                        setCurrentPage(newPage);
                        setScrollPage(newPage);
                        setAllData([]);
                        setManualPageChange(true);
                    }}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>

                <span style={{ margin: "0 10px" }}>
                    Page
                    <input
                        type="number"
                        value={pageInput}
                        onChange={handleOnChangePageNo}
                        onFocus={() => setManualPageChange(true)}
                        style={{ width: "80px", margin: "0 10px" }}
                    />
                    of {totalPages}
                </span>

                <button
                    onClick={() => {
                        const newPage = Math.min(currentPage + 1, totalPages);
                        setCurrentPage(newPage);
                        setScrollPage(newPage);
                        setAllData([]);
                        setManualPageChange(true);
                    }}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button >
            </div >
            <div style={{ marginTop: "10px", textAlign: "center" }}>
                <span style={{ margin: "0 10px" }}>
                    Records per page:
                </span>
                <select
                    value={rowsPerPage}
                    onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setAllData([]);
                        setCurrentPage(1);
                        setScrollPage(1);
                        lastFetchedPageRef.current = 1;
                        setManualPageChange(true);
                        setLoadingMore(true);
                    }}
                >
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={150}>150</option>
                    <option value={200}>200</option>
                    <option value={250}>250</option>
                    <option value={300}>300</option>
                    <option value={350}>350</option>
                </select>
            </div>
        </>
    )
}