"use client";

import React, { useState, useEffect } from "react";
import {
  FaTachometerAlt,
  FaUser,
  FaTools,
  FaBuilding,
  FaRegFileAlt,
  FaCog,
  FaTruck,
  FaTimes,
} from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Sidebar = ({ isOpen, onClose }) => {
  const [openDrawer, setOpenDrawer] = useState({});
  const pathname = usePathname();

  const toggleDrawer = (section) => {
    setOpenDrawer((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  async function checkToken() {
    try {
      const token = localStorage.getItem("accesstocken");
      const response = await fetch("/api/VarifyToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (!response.ok || !result.isValid) {
        console.error("Token validation failed:", result.message || "Invalid token");
        window.location.href = "/login";
        return false;
      }

      return true;
    } catch (error) {
      console.error("Validation request failed", error);
      return false;
    }
  }

  useEffect(() => {
    checkToken();
  }, []);

  const links = [
    { name: "Dashboard", icon: <FaTachometerAlt />, href: "/admin" },
    { name: "Talk to Friend", icon: <FaUser />, href: "/admin/talk-to-friend" },
    { name: "Question", icon: <FaUser />, href: "/admin/question" },
    { name: "Truck Details", icon: <FaUser />, href: "/admin/truckDeatils" },
    {
      name: "Verification",
      icon: <FaCog />,
      subLinks: [
        { name: "Request", href: "/admin/verification/request" },
        { name: "Verified", href: "/admin/verification/verified" },
      ],
    },
    {
      name: "Agent Verification",
      icon: <FaCog />,
      subLinks: [
        { name: "Request", href: "/admin/Agentkyc/AgentRequest" },
        { name: "Verified", href: "/admin/Agentkyc/AgentVerify" },
      ],
    },
    {
      name: "Agent Pay Out",
      icon: <FaCog />,
      subLinks: [
        { name: "Withdrawal Request", href: "/admin/AgentPayOut/RequestPayout" },
        { name: "Withdrawal Completed", href: "/admin/AgentPayOut/CompletedPayout" },
      ],
    },
    { name: "All User", icon: <FaUser />, href: "/admin/user" },
    { name: "Post Mechanic", icon: <FaTools />, href: "/admin/mechanic" },
    { name: "Post Tow", icon: <FaTruck />, href: "/admin/tow" },
    { name: "Create TalkTime", icon: <FaTruck />, href: "/admin/Create-talk-time" },
    { name: "Add Dynamic Plan", icon: <FaTruck />, href: "/admin/AddDynamicPlan" },
    { name: "Create Promo Code ", icon: <FaTruck />, href: "/admin/Promo" },
    {
      name: "Company",
      icon: <FaBuilding />,
      subLinks: [
        { name: "Mech Request", href: "/admin/company/requestMech" },
        { name: "Tow Request", href: "/admin/company/requestTow" },
        { name: "Vehicle", href: "/admin/company/Vachical" },
      ],
    },
    {
      name: "All Requests",
      icon: <FaBuilding />,
      subLinks: [
        { name: "Mechanic  Request", href: "/admin/userrequest/UserRequestMech" },
        { name: "Tower Request", href: "/admin/userrequest/UserRequestTow" },
      ],
    },
    {
      name: "Premium User Reports",
      icon: <FaRegFileAlt />,
      subLinks: [
        { name: "Driver", href: "/admin/reports/user" },
        { name: "Mechanic", href: "/admin/reports/mechanic" },
        { name: "Tow", href: "/admin/reports/tow" },
        { name: "Company", href: "/admin/reports/Company" },
        { name: "All Premium", href: "/admin/reports/all-premium" },
      ],
    },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-black text-white w-64 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 lg:translate-x-0 z-50 overflow-y-auto`}
    >
      <div className="flex justify-between items-center pt-4 pl-4 pb-4 border-b border-gray-700">
        <div className="flex items-center">
          <div className="h-10 w-10">
            <img
              src="/admin/favicon.png"
              alt="Logo"
              className="h-10 w-10 rounded-2xl"
            />
          </div>
          <h1 className="text-2xl font-bold ml-3">DRIVERSE</h1>
        </div>
        <button className="lg:hidden pr-4" onClick={onClose}>
          <FaTimes size={24} />
        </button>
      </div>

      <ul className="mt-4">
        {links.map((link, index) => (
          <div key={index}>
            <li
              className={`p-4 flex items-center justify-between hover:bg-gray-700 cursor-pointer ${
                pathname === link.href
                  ? "bg-[#ffffff] text-black rounded-l-xl ml-2 hover:bg-slate-200"
                  : ""
              }`}
              onClick={() => link.subLinks && toggleDrawer(link.name)}
            >
              <Link
                href={link.href || "#"} // Use "#" as a fallback for items with subLinks
                className="flex items-center w-full"
              >
                {link.icon}
                <span className="ml-3">{link.name}</span>
                {link.subLinks && (
                  <span className="ml-auto">
                    {openDrawer[link.name] ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </span>
                )}
              </Link>
            </li>
            {link.subLinks && openDrawer[link.name] && (
              <ul className="ml-8">
                {link.subLinks.map((subLink, subIndex) => (
                  <li
                    key={subIndex}
                    className={`p-2 hover:bg-gray-700 ${
                      pathname === subLink.href
                        ? "bg-[#ffffff] text-black rounded-l-xl ml-2 hover:bg-slate-200"
                        : ""
                    }`}
                  >
                    <Link href={subLink.href} className="block w-full">
                      {subLink.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;