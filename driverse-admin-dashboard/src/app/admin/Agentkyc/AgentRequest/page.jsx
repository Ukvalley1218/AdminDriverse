"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";


const AdminAgentRequest = () => {
    // State management
    const [kycData, setKycData] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalRecords: 0,
        verifiedCount: 0,
        unverifiedCount: 0
    });
    const [filters, setFilters] = useState({
        search: '',
        fromDate: '',
        toDate: ''
    });

    // Fetch KYC data with pagination and filters
    const fetchKYCData = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                ...filters,
                page: pagination.page,
                limit: pagination.limit
            }).toString();

            const token = localStorage.getItem('token');

            const response = await axios.get(`/api/Agent?${query}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log("response.data.data", response.data.data);
            setKycData(response.data.data);
            setPagination(prev => ({
                ...prev,
                totalRecords: response.data.totalRecords,
                verifiedCount: response.data.verifiedCount,
                unverifiedCount: response.data.unverifiedCount
            }));
            setError(null);
        } catch (error) {
            setError('Failed to fetch KYC data');
            toast.error('Failed to fetch KYC data');
            console.error('KYC Data Fetch Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Initial data fetch and refresh on filter/pagination changes
    useEffect(() => {
        fetchKYCData();
    }, [pagination.page, pagination.limit, filters]);

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on filter change
    };



    // handdlel verify

    const handleVerification = async (userId, documentType) => {
        setLoading(true)
        try {
            const response = await fetch(`/api/Agent/verifyDoc?userId=${userId}&documentType=${documentType}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    // Add any additional data you want to send in the body
                })
            });

            const data = await response.json();
            console.log("data", data);
            setLoading(false)
            if (!response.ok) {
                throw new Error(data.message || 'Verification failed');
                // setLoading(false)
            }

            // You can add success notification here
            alert('Verification successful!');

        } catch (err) {
            setError(err.message);
            console.error('Verification error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Document handling functions
    const getDocuments = (doc) => {

        return [
            { id: doc.userId, verify: doc?.verify_AddharCard.verified, doc_name: 'AddharCard', label: "Article of Incorporation", url: doc?.AddharCard },
            { id: doc.userId, verify: doc?.verify_PanCard.verified, doc_name: 'PanCard', label: "WSIB Certificate", url: doc?.PanCard },
            { id: doc.userId, verify: doc?.verify_BankPassbook.verified, doc_name: 'BankPassbook', label: "Insurance Certificate", url: doc?.BankPassbook },
            { id: doc.userId, verify: doc?.verify_Photo.verified, doc_name: 'Photo', label: "Operating Authorities", url: doc?.Photo },
        ].filter(doc => doc.url);
    };

    const showDocument = (kycDoc) => {
        setSelectedDoc(kycDoc);
        setIsModalOpen(true);
        setCurrentPage(0);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDoc(null);
        setCurrentPage(0);
    };

    // Verify KYC document
    const verifyKYC = async (id) => {
        try {
            
            const token = localStorage.getItem('token');
            
            await axios.put(`/api/Agent/${id}`, null, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            toast.success('KYC verified successfully');
            fetchKYCData(); // Refresh the data
        } catch (error) {
            console.error('Error verifying KYC:', error);
            toast.error('Failed to verify KYC');
        }
    };

    const documents = selectedDoc ? getDocuments(selectedDoc) : [];
    const currentDocument = documents[currentPage];
    const hasNextPage = currentPage < documents.length - 1;
    const hasPrevPage = currentPage > 0;

    // Calculate pagination
    const totalPages = Math.ceil(pagination.totalRecords / pagination.limit);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Document Verification
                        </h1>
                        <p className="text-sm sm:text-base text-gray-500">
                            Manage and verify business documentation
                        </p>
                    </div>

                    {/* Statistics */}
                    <div className="flex gap-4 mt-4 sm:mt-0">
                        <div className="bg-white p-3 rounded-lg shadow">
                            <p className="text-sm text-gray-500">Verified</p>
                            <p className="text-lg font-bold text-center  text-green-600">{pagination.verifiedCount}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow">
                            <p className="text-sm text-gray-500">Pending</p>
                            <p className="text-lg font-bold  text-center text-yellow-600">{pagination.unverifiedCount}</p>
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white p-4 mb-4 rounded-lg shadow">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input
                            type="text"
                            name="search"
                            placeholder="Search by name..."
                            value={filters.search}
                            onChange={handleFilterChange}
                            className="border p-2 rounded"
                        />
                        <input
                            type="date"
                            name="fromDate"
                            value={filters.fromDate}
                            onChange={handleFilterChange}
                            className="border p-2 rounded"
                        />
                        <input
                            type="date"
                            name="toDate"
                            value={filters.toDate}
                            onChange={handleFilterChange}
                            className="border p-2 rounded"
                        />
                    </div>
                </div>

                {/* Main Table */}
                <div className="bg-white p-4 sm:p-6 shadow rounded-lg overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500 p-4">{error}</div>
                    ) : (
                        <>
                            <table className="w-full table-auto text-left text-sm sm:text-base">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-2 px-2 sm:px-4">Name</th>
                                        <th className="py-2 px-2 sm:px-4">Company</th>
                                        <th className="py-2 px-2 sm:px-4">Status</th>
                                        <th className="py-2 px-2 sm:px-4">Action</th>
                                        <th className="py-2 px-2 sm:px-4">Documents</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {kycData.map((kycDoc) => (
                                        <tr key={kycDoc.userId || Math.random()} className="border-b hover:bg-gray-50">
                                            <td className="py-2 px-2 sm:px-4">{kycDoc.userName || 'N/A'}</td>
                                            <td className="py-2 px-2 sm:px-4">{kycDoc.serviceType || 'N/A'}</td>
                                            <td className="py-2 px-2 sm:px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${kycDoc.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {kycDoc.isVerified ? 'Active' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="py-2 px-2 sm:px-4">
                                                <button
                                                    onClick={() => verifyKYC(kycDoc.userId)}
                                                    disabled={kycDoc.isVerified}
                                                    className={`px-2 sm:px-4 py-1 sm:py-2 text-sm rounded ${kycDoc.isVerified
                                                        ? 'bg-gray-300 cursor-not-allowed'
                                                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                                                        }`}
                                                >
                                                    {kycDoc.isVerified ? 'Verified' : 'Verify'}

                                                    {/* {kycDoc?.AddharCard?.verified ? 'Verified' : 'Verify'} */}
                                                </button>
                                            </td>
                                            <td className="py-2 px-2 sm:px-4">
                                                <button
                                                    onClick={() => showDocument(kycDoc)}
                                                    className="bg-green-500 text-white px-2 sm:px-4 py-1 sm:py-2 text-sm rounded hover:bg-green-600"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination Controls */}
                            <div className="mt-4 flex justify-between items-center">
                                <div className="text-sm text-gray-500">
                                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.totalRecords)} of {pagination.totalRecords} entries
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                        disabled={pagination.page === 1}
                                        className="px-3 py-1 border rounded disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                        disabled={pagination.page >= totalPages}
                                        className="px-3 py-1 border rounded disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Document Viewer Modal */}
            {isModalOpen && selectedDoc && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg sm:text-xl font-bold">
                                Documents for {selectedDoc.userName}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        {currentDocument ? (
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-700">{currentDocument.label}</h3>
                                <div className="relative w-full h-64 sm:h-96">
                                    <img
                                        src={currentDocument.url}
                                        alt={currentDocument.label}
                                        className="absolute inset-0 w-full h-full object-contain rounded"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleVerification(currentDocument.id, currentDocument.doc_name)}
                                        className="text-white bg-black p-2 rounded-xl hover:text-white"
                                    >
                                        {loading ? (
                                            <>
                                                <svg
                                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    />
                                                </svg>
                                                Verifying...
                                            </>
                                        ) : (
                                            `Verify ${currentDocument.doc_name}`
                                        )}
                                    </button>

                                    <div
                                        className={`text-white p-2 rounded-xl ${currentDocument?.verify ? 'bg-green-600' : 'bg-red-600'
                                            }`}
                                    >
                                        {currentDocument.verify ? 'Verified' : 'Pending'}
                                    </div>

                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500">No documents available.</p>
                        )}

                        <div className="flex justify-between mt-4 gap-4">
                            <button
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                disabled={!hasPrevPage}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex-1"
                            >
                                Previous
                            </button>
                            <span className="flex items-center">
                                {currentPage + 1} / {documents.length}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                disabled={!hasNextPage}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex-1"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAgentRequest;