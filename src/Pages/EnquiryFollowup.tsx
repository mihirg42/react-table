import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import EnquiryFollowupTable from '../EnquiryFollowupComponents/EnquiryFollowupTable.tsx';
import PaginationControls from '../EnquiryFollowupComponents/PaginationControls.tsx'
import Filter from '../EnquiryFollowupComponents/Filter.tsx'
import NavBar from '../HomeComponents/NavBar.tsx';
import { useRef, useState } from 'react';
import ExportButton from '../EnquiryFollowupComponents/ExportButton.tsx';


export default function EnquiryFollowup() {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [filters, setFilters] = useState({
        email: "",
        status: "",
        owner: ""
    });
    const [sortConfig, setSortConfig] = useState({
        key: "",
        direction: "asc"
    });
    const [totalPages, setTotalPages] = useState(1);
    const columns = [
        { key: "futAll", label: "FUT" },
        { key: "propertyType", label: "Property Type" },
        { key: "category", label: "Category" },
        { key: "source", label: "Source" },
        { key: "displayEnquiryDate", label: "Enquiry Date" },
        { key: "enquiryFrom", label: "Enquiry From" },
        { key: "project", label: "Project" },
        { key: "customer", label: "Customer" },
        { key: "mobileNo1", label: "Mobile No." },
        { key: "emailId1", label: "E-Mail" },
        { key: "displayNextFollowupDate", label: "Next Follow Up Date" },
        { key: "status", label: "Status" },
        { key: "enquiryType", label: "Enquiry Type" },
        { key: "callerRemarks", label: "Last Remarks (Caller)" },
        { key: "response", label: "Response" },
        { key: "salesRemarks", label: "Last Remarks (Sales)" },
        { key: "subResponse", label: "Last Sub Response Type (Sales)" },
        { key: "displayLastFollowedDate", label: "Last Followed Date (Sales)" },
        { key: "owner", label: "Enquiry Owner" },
        { key: "handler", label: "Handled By" },
        { key: "siteVisited", label: "Site Visited" },
        { key: "channelName", label: "Channel Name" },
        { key: "tag", label: "Tag" },
        { key: "purposeOfInvestment", label: "Purpose of Investment" }
    ];
    const employeeName = localStorage.getItem("EmployeeName") || "default";
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem(`columns_${employeeName}`);
        return saved ? JSON.parse(saved) : columns.map(c => c.key);
    });
    const [allData, setAllData] = useState<any[]>([]);
    const [manualPageChange, setManualPageChange] = useState(true);
    const [scrollPage, setScrollPage] = useState(1);
    const [pageInput, setPageInput] = useState<string | number>(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const lastFetchedPageRef = useRef(0);

    return (
        <>
            <NavBar />
            <div className="row">
                <div className='col-md-1'></div>
                <div className='col-md-9'>
                    <div className='outerEnq'>
                        <Filter filters={filters} setFilters={setFilters} />
                    </div>
                </div>
                <div className='col-md-1'>
                    <ExportButton columns={columns} visibleColumns={visibleColumns} />
                </div>
                <div className='col-md-1'></div>
            </div>
            <div className="row">
                <div className='col-md-1'></div>
                <div className='col-md-10'>
                    <EnquiryFollowupTable
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        rowsPerPage={rowsPerPage}
                        filters={filters}
                        totalPages={totalPages}
                        setTotalPages={setTotalPages}
                        sortConfig={sortConfig}
                        setSortConfig={setSortConfig}
                        visibleColumns={visibleColumns}
                        setVisibleColumns={setVisibleColumns}
                        allColumns={columns}
                        employeeName={employeeName}
                        allData={allData}
                        setAllData={setAllData}
                        manualPageChange={manualPageChange}
                        setManualPageChange={setManualPageChange}
                        scrollPage={scrollPage}
                        setScrollPage={setScrollPage}
                        loadingMore={loadingMore}
                        setLoadingMore={setLoadingMore}
                        lastFetchedPageRef={lastFetchedPageRef}
                    />
                </div>
                <div className='col-md-1'></div>
            </div >

            <div className="row">
                <div className='col-md-1'></div>
                <div className='col-md-10'>
                    <PaginationControls
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        rowsPerPage={rowsPerPage}
                        setRowsPerPage={setRowsPerPage}
                        totalPages={totalPages}
                        setAllData={setAllData}
                        setManualPageChange={setManualPageChange}
                        setScrollPage={setScrollPage}
                        pageInput={pageInput}
                        setPageInput={setPageInput}
                        loadingMore={loadingMore}
                        lastFetchedPageRef={lastFetchedPageRef}
                        setLoadingMore={setLoadingMore}
                    />
                </div>
                <div className='col-md-1'></div>
            </div>
        </>
    );
}
