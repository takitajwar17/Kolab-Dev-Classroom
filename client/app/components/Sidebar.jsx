"use client";
import { useState } from "react";
import Link from "next/link";
import {
  FaHome,
  FaUser,
  FaCog,
  FaChevronDown,
  FaCodepen,
} from "react-icons/fa";
import {
  TbLayoutDashboardFilled,
  TbLayoutSidebarLeftCollapseFilled,
  TbLayoutSidebarLeftExpandFilled,
} from "react-icons/tb";
import { SiGoogleclassroom } from "react-icons/si";
import { MdAddBox, MdNotifications } from "react-icons/md";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  return (
    <div className="flex flex-row">
      <div
        className={`fixed top-0 left-0 h-full bg-black transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } `}
      >
        <button onClick={toggleSidebar} className="p-4">
          <TbLayoutSidebarLeftCollapseFilled color="white" fontSize="22px" />
        </button>
        <nav className="flex flex-col w-56 p-4 pr-12 space-y-4">
          <Link
            href="/"
            className="flex items-center text-white hover:text-orange"
          >
            <TbLayoutDashboardFilled className="mr-2" />
            Dashboard
          </Link>
          <Link
            href="/"
            className="flex items-center text-white hover:text-orange"
          >
            <SiGoogleclassroom className="mr-2" />
            Courses
          </Link>
          <Link
            href="/"
            className="flex items-center text-white hover:text-orange"
          >
            <FaCodepen className="mr-2" />
            My Projects
          </Link>
          <div>
            <button
              onClick={toggleSubMenu}
              className="flex items-center text-white hover:text-orange"
            >
              <MdAddBox className="mr-2" />
              Create new
              <FaChevronDown
                className={`ml-auto transition-transform ${
                  isSubMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isSubMenuOpen && (
              <div className="ml-4 mt-2 space-y-2 flex flex-col">
                <Link href="/" className="text-gray-300 hover:text-orange">
                  Course
                </Link>
                <Link href="/" className="text-gray-300 hover:text-orange">
                  Project
                </Link>
              </div>
            )}
          </div>
          <Link
            href="/"
            className="flex items-center text-white hover:text-orange"
          >
            <MdNotifications className="mr-2" />
            Notifications
          </Link>
        </nav>
      </div>
      <div className={"mt-2 p-2 bg-black flex rounded-r-md"}>
        <button
          onClick={toggleSidebar}
          onMouseOver={({ target }) => (target.style.color = "#cf4500")}
          onMouseOut={({ target }) => (target.style.color = "white")}
        >
          <TbLayoutSidebarLeftExpandFilled color="#cf4500" fontSize="22px" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
