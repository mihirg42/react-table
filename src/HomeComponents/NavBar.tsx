import { useEffect, useState } from 'react';
import { Config } from '../Config/Index.ts';
import { useNavigate } from "react-router-dom";
import logo from '../images/4qt-logo.png';
import './NavBar.css'

interface MenuItem {
    [key: string]: any;
    MenuID?: number | string;
    ParentID?: number | string;
    Url?: string;
    Name?: string;
}

interface MenuJson {
    data?: {
        reportData?: MenuItem[][];
    };
}


const url = Config.API_URL + Config.GET_REPORT;


export default function NavBar() {
    const [json, setJson] = useState<MenuJson | null>(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchMenu() {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Token not found. Please login again.");
                setIsLoading(false);
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
                        "reportType": "WMENU"
                    }),
                });

                const pjson = await response.json();
                setJson(pjson);
            } catch {
                setError("Unable to load menu.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchMenu();
    }, []);


    function handleLogoutClick() {
        localStorage.removeItem("token");
        localStorage.removeItem("EmployeeName");
        navigate("/");
    }


    function Children({ id }: { id?: number | string }) {
        const menuItems = json?.data?.reportData ?? [];
        const items = menuItems[0] ?? [];

        const childItems = items.filter(
            (item: MenuItem) => Number(item.ParentID) === Number(id)
        );


        if (childItems.length === 0) return null;

        return childItems.map((item) => {
            // check if THIS item has children
            const hasChildren = items.some(
                (m: MenuItem) => Number(m.ParentID) === Number(item.MenuID)
            );

            return (
                <li
                    key={item.MenuID}
                    className={hasChildren ? "dropdown-submenu" : ""}
                >
                    <a
                        className={hasChildren ? "dropdown-item dropdown-toggle" : "dropdown-item"}
                        href={`/${item.Url}`}
                    >
                        {item.Name}
                    </a>

                    {/* only render submenu if children exist */}
                    {hasChildren && (
                        <ul className="dropdown-menu">
                            <Children id={item.MenuID} />
                        </ul>
                    )}
                </li>
            );
        });
    }


    function Parent() {
        const menuItems = json?.data?.reportData ?? [];
        const parentItems = menuItems[0].filter((item) => !Number.isFinite(item.ParentID));

        // if (parentItems.length === 0) {
        //   return <li className="nav-item">No menu found</li>;
        // }
        return parentItems.map((item) => (
            <li className="nav-item dropdown" key={item.MenuID}>
                <a className="nav-link dropdown-toggle" href={item.Url} role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {item.Name}
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <Children id={item.MenuID} />
                </ul>
            </li>
        ));
    }

    if (isLoading) {
        return <p>Loading menu...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const empName = localStorage.getItem("EmployeeName") || "Employee";


    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid d-flex">
                <a className="navbar-brand" href="/Home.aspx">
                    <img src={logo} alt="4qt" width="35" height="31"></img>
                </a>
                {/* Hamburger button */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <Parent />
                    </ul>
                </div>
                {/* Logout button */}
                <div className="ms-auto logout-container">
                    <button
                        className="btn btn-primary"
                        onClick={handleLogoutClick}
                    >
                        Logout
                    </button>
                    <div className="hover-box">{empName}</div>
                </div>
            </div>
        </nav>
    );
}


