import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './Pages/Login.tsx'
import Home from './Pages/Home.tsx'
import EnquiryFollowup from './Pages/EnquiryFollowup.tsx'
import './Style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';



createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/Home.aspx" element={<Home />} />
                <Route path="/ENQUERYMANAGEMENT/EnqueryFollowup.aspx" element={<EnquiryFollowup />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
)
