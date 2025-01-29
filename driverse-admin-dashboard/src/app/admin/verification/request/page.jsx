"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  Clock,
} from "lucide-react";
import { TbCalendarRepeat } from "react-icons/tb";


const AdminVerificationRequest = () => {
  const [kycData, setKycData] = useState([]);
  const [selectedUserDocs, setSelectedUserDocs] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDocIndex, setCurrentDocIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchKYCData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/auth/getAllUserKYC', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setKycData(response.data.data);
      } catch (error) {
        alert('Failed to fetch KYC data');
        console.error('KYC Data Fetch Error:', error);
      }
    };

    fetchKYCData();
  }, []);

  const filteredUserData = kycData.filter(
    (kyc) =>
      kyc.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kyc.userId.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredUserData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openModal = (documents) => {
    const docEntries = Object.entries(documents)
      .filter(([key]) => 
        ['articleOfIncorporation', 'wsibCertificate', 'insuranceCertificate', 'operatingAuthorities']
        .includes(key)
      )
      .map(([key, value]) => [key, value.url]);

    setSelectedUserDocs(docEntries);
    setSelectedUserId(documents.userId._id);
    setCurrentDocIndex(0);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUserDocs(null);
    setIsModalOpen(false);
    setCurrentDocIndex(0);
  };

  const goToNextDoc = () => {
    if (selectedUserDocs && currentDocIndex < selectedUserDocs.length - 1) {
      setCurrentDocIndex((prevIndex) => prevIndex + 1);
    }
  };

  const goToPrevDoc = () => {
    if (selectedUserDocs && currentDocIndex > 0) {
      setCurrentDocIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleVerifyKYC = async (userId) => {
    try {
      await axios.post(`http://localhost:8080/api/v1/auth/verifyKYC/${userId}`, 
        {}, 
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      alert('KYC Verified Successfully');
      
      const response = await axios.get('http://localhost:8080/api/v1/auth/getAllUserKYC', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setKycData(response.data.data);
    } catch (error) {
      alert('KYC Verification Failed');
      console.error('Verification Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Document Verification
            </h1>
            <p className="text-gray-500">
              Manage and verify business documentation
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name or company"
              className="border rounded-md px-4 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Date Range Inputs */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600">From</span>
            <TbCalendarRepeat className="w-5 h-5 text-gray-500" />
            <input
              type="date"
              className="border rounded-md px-4 py-2"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-600">To</span>
            <TbCalendarRepeat className="w-5 h-5 text-gray-500" />
            <input
              type="date"
              className="border rounded-md px-4 py-2"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* User Data Table */}
        <div className="bg-white p-6 shadow rounded-lg">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Company</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Actions</th>
                <th className="py-2 px-4">Verify</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((kycDoc) => (
                <tr key={kycDoc._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{kycDoc.userId.name}</td>
                  <td className="py-2 px-4">{kycDoc.userId.company}</td>
                  <td className="py-2 px-4">
                    {kycDoc.verify.isVerified ? (
                      <span className="text-green-500">Verified</span>
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-500" />
                    )}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center gap-2"
                      onClick={() => openModal(kycDoc)}
                    >
                      <Eye className="w-4 h-4" />
                      View Documents
                    </button>
                  </td>
                  <td className="py-2 px-4">
                    <button
                      className="px-2 py-2 text-sm font-medium text-white bg-green-600 rounded-md flex items-center gap-2 disabled:opacity-50"
                      onClick={() => handleVerifyKYC(kycDoc.userId._id)}
                      disabled={kycDoc.verify.isVerified}
                    >
                      Verify Documents
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span>
            Page {currentPage} of {" "}
            {Math.ceil(filteredUserData.length / itemsPerPage)}
          </span>
          <button
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(
                  prev + 1,
                  Math.ceil(filteredUserData.length / itemsPerPage)
                )
              )
            }
            disabled={
              currentPage ===
              Math.ceil(filteredUserData.length / itemsPerPage)
            }
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && selectedUserDocs && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg max-w-lg w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Verification Document</h2>
                <button onClick={closeModal}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex flex-col items-center">
                <p className="font-semibold text-gray-700 mb-2">
                  {selectedUserDocs[currentDocIndex][0]
                    .replace(/([A-Z])/g, " $1")
                    .toUpperCase()}
                </p>
                <img
                  src={selectedUserDocs[currentDocIndex][1]}
                  alt={selectedUserDocs[currentDocIndex][0]}
                  className="w-full h-auto border rounded-md mb-4"
                />
              </div>
              <div className="flex justify-between">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 disabled:opacity-50"
                  onClick={goToPrevDoc}
                  disabled={currentDocIndex === 0}
                >
                  Previous
                </button>
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 disabled:opacity-50"
                  onClick={goToNextDoc}
                  disabled={currentDocIndex === selectedUserDocs.length - 1}
                >
                  Next
                </button>
              </div>
              <button
                className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 w-full"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVerificationRequest;