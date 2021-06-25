import { Menu } from "antd"
import { Header } from "antd/lib/layout/layout"
import React from "react"

import './style/navbar.css'

function Navbar() {
    return (
        <div className="navbar">
            <div className="start">
                <div className="logo">
                    <a href="#"><h1>Lunar</h1></a>
                </div>
            </div>

            <div className="end">
                <button>Create Project</button>

                <div className="end-btn">
                    <button>
                        <div>
                            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" width="11" height="11" title="Notifications">
                                <path d="M9.03657 1.06667C9.03657 1.10232 9.03487 1.13756 9.03155 1.17231C11.3998 1.66446 13.1829 3.81795 
                                13.1829 6.4V8.53333L15.3507 12.2512C15.7652 12.9622 15.2675 13.8667 14.4618 13.8667H8H1.53818C0.732452 
                                13.8667 0.234778 12.9622 0.649321 12.2512L2.81711 8.53333L2.81711 6.4C2.81711 3.81795 4.60022 1.66446 
                                6.96844 1.17231C6.96512 1.13756 6.96342 1.10232 6.96342 1.06667C6.96342 0.477563 7.42751 0 8 0C8.57248 
                                0 9.03657 0.477563 9.03657 1.06667ZM8.00001 16C7.23265 16 6.56267 15.571 6.20421 14.9333H9.79581C9.43735 
                                15.571 8.76737 16 8.00001 16Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd">
                                </path>
                            </svg>
                        </div>
                    </button>
                </div>

                <div className="end-btn">
                    <button>
                        <div>
                            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" width="11" height="11" title="Notifications">
                                <path d="M9.55556 1.77778C9.55556 2.75962 8.75962 3.55556 7.77778 3.55556C6.79594 3.55556 6 
                                2.75962 6 1.77778C6 0.795938 6.79594 0 7.77778 0C8.75962 0 9.55556 0.795938 9.55556 1.77778ZM9.55556 
                                8C9.55556 8.98184 8.75962 9.77778 7.77778 9.77778C6.79594 9.77778 6 8.98184 6 8C6 7.01816 6.79594 
                                6.22223 7.77778 6.22223C8.75962 6.22223 9.55556 7.01816 9.55556 8ZM7.77778 16C8.75962 16 9.55556 
                                15.2041 9.55556 14.2222C9.55556 13.2404 8.75962 12.4444 7.77778 12.4444C6.79594 12.4444 6 13.2404 
                                6 14.2222C6 15.2041 6.79594 16 7.77778 16Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd">
                                </path>
                            </svg>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Navbar