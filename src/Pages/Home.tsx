import NavBar from '../HomeComponents/NavBar.tsx';
import EmployeeReport from '../HomeComponents/EmployeeReport.tsx';
import EmployeeReportToday from '../HomeComponents/EmployeeReportToday.tsx';
import EnquiryReport from '../HomeComponents/EnquiryReport.tsx';
import ResponseReport from '../HomeComponents/ResponseReport.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState } from 'react';


function GetReport() {
    const [employeeReportIsLoading, setEmployeeReportIsLoading] = useState(true);
    const employeeReportClass = employeeReportIsLoading ? 'inner innerLoader' : 'inner'

    const [employeeReportTodayIsLoading, setEmployeeReportTodayIsLoading] = useState(true);
    const employeeReportTodayClass = employeeReportTodayIsLoading ? 'inner innerLoader' : 'inner'

    const [enquiryReportIsLoading, setEnquiryReportIsLoading] = useState(true);
    const enquiryReportClass = enquiryReportIsLoading ? 'inner innerLoader' : 'inner'

    const [responseReportIsLoading, setResponseReportIsLoading] = useState(true);
    const responseReportClass = responseReportIsLoading ? 'inner innerLoader' : 'inner'

    return (
        <>
            <NavBar key="WMENU" />
            <div className="row">
                <div className='col-md-1'></div>
                <div className='col-md-5'>
                    <div className='outer'>
                        <div className={employeeReportClass}>
                            <EmployeeReport
                                key="WEF-E"
                                employeeReportIsLoading={employeeReportIsLoading}
                                setEmployeeReportIsLoading={setEmployeeReportIsLoading}
                            />
                        </div>
                    </div>
                </div>
                <div className='col-md-5'>
                    <div className='outer'>
                        <div className={employeeReportTodayClass}>
                            <EmployeeReportToday
                                key="WEF-E-T"
                                employeeReportTodayIsLoading={employeeReportTodayIsLoading}
                                setEmployeeReportTodayIsLoading={setEmployeeReportTodayIsLoading}
                            />
                        </div>
                    </div>
                </div>
                <div className='col-md-1'></div>
            </div>
            <div className="row">
                <div className='col-md-1'></div>
                <div className='col-md-5'>
                    <div className='outer'>
                        <div className={enquiryReportClass}>
                            <EnquiryReport
                                key="WETR"
                                enquiryReportIsLoading={enquiryReportIsLoading}
                                setEnquiryReportIsLoading={setEnquiryReportIsLoading}
                            />
                        </div>
                    </div>
                </div>
                <div className='col-md-5'>
                    <div className='outer'>
                        <div className={responseReportClass}>
                            <ResponseReport
                                key="WFTR"
                                responseReportIsLoading={responseReportIsLoading}
                                setResponseReportIsLoading={setResponseReportIsLoading}
                            />
                        </div>
                    </div>
                </div>
                <div className='col-md-1'></div>
            </div>
        </>

    )
}

export default GetReport