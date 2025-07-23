"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const AdminAgentRequest = () => {
    // State management
    const [kycData, setKycData] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [verifyingDoc, setVerifyingDoc] = useState(null);
    const [downloading, setDownloading] = useState(false);

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
    });

    const [filters, setFilters] = useState({
        email: '',
        fromDate: '',
        toDate: ''
    });

    // Fetch KYC data with pagination and filters
    const fetchKYCData = async (download = false) => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                ...filters,
                page: download ? 1 : pagination.page,
                limit: download ? 10000 : pagination.limit,
                download
            }).toString();

            const token = localStorage.getItem('token');

            const response = await axios.get(`/api/Agent/getall?${query}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (download) {
                return response.data.data;
            }

            setKycData(response.data.data);
            setPagination(prev => ({
                ...prev,
                total: response.data.pagination.total,
                totalPages: response.data.pagination.totalPages
            }));
            setError(null);
        } catch (error) {
            setError('Failed to fetch KYC data');
            console.error('KYC Data Fetch Error:', error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKYCData();
    }, [pagination.page, pagination.limit, filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchKYCData();
    };

    const handleResetFilters = () => {
        setFilters({
            email: '',
            fromDate: '',
            toDate: ''
        });
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleDocumentVerification = async (userId, documentKey, status, rejectionReason = '') => {
        setVerifyingDoc(documentKey);
        try {
            const token = localStorage.getItem('token');

            // Optimistically update the UI
            setKycData(prevData => {
                return prevData.map(doc => {
                    if (doc.userId._id === userId) {
                        const updatedDoc = { ...doc };
                        if (updatedDoc.documents && updatedDoc.documents[documentKey]) {
                            updatedDoc.documents[documentKey].verification = {
                                status,
                                verifiedAt: status === 'verified' ? new Date().toISOString() : null,
                                rejectionReason: status === 'rejected' ? rejectionReason : null
                            };

                            // Update overall status if all documents are verified
                            if (status === 'verified') {
                                const allVerified = Object.values(updatedDoc.documents).every(
                                    d => d.verification?.status === 'verified'
                                );
                                if (allVerified) {
                                    updatedDoc.overallStatus = 'approved';
                                }
                            }
                        }
                        return updatedDoc;
                    }
                    return doc;
                });
            });

            // Also update the selectedDoc if it's the current one being viewed
            if (selectedDoc && selectedDoc.userId._id === userId) {
                setSelectedDoc(prev => {
                    const updatedDoc = { ...prev };
                    if (updatedDoc.documents && updatedDoc.documents[documentKey]) {
                        updatedDoc.documents[documentKey].verification = {
                            status,
                            verifiedAt: status === 'verified' ? new Date().toISOString() : null,
                            rejectionReason: status === 'rejected' ? rejectionReason : null
                        };
                    }
                    return updatedDoc;
                });
            }

            // Make the API call
            const response = await axios.post(`/api/Agent/verifyDoc`,
                {
                    userId,
                    documentKey,
                    status,
                    rejectionReason
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            alert(response.data.message || 'Document verification status updated');
            return response.data;
        } catch (error) {
            console.error('Error verifying document:', error);
            alert(error.response?.data?.message || 'Error verifying document');
            fetchKYCData(); // Refetch data to ensure consistency
            throw error;
        } finally {
            setVerifyingDoc(null);
        }
    };

    const getDocuments = (kycDoc) => {
        if (!kycDoc || !kycDoc.documents) return [];

        const documentTypes = {
            aadhar: "Aadhaar Card",
            pan: "PAN Card",
            bank: "Bank Passbook",
            photo: "Passport Photo",
            ssn: "Social Security Number",
            id: "Government ID",
            proof_of_address: "Proof of Address",
            sin: "SIN Number",
            ni: "National Insurance Number",
            emirates_id: "Emirates ID",
            passport: "Passport",
            visa: "Visa",
            national_id: "National ID",
            tax_id: "Tax ID"
        };

        return Array.from(Object.entries(kycDoc.documents)).map(([key, docData]) => ({
            key,
            label: documentTypes[key] || key,
            required: true,
            url: docData.url,
            status: docData.verification?.status || 'pending',
            verifiedAt: docData.verification?.verifiedAt,
            rejectionReason: docData.verification?.rejectionReason
        }));
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

    const verifyKYC = async (userId) => {
        try {
            const kycDoc = kycData.find(doc => doc.userId._id === userId);
            if (!kycDoc) {
                alert('User KYC not found');
                return;
            }

            const verificationPromises = Object.keys(kycDoc.documents).map(key =>
                handleDocumentVerification(userId, key, 'verified')
            );

            await Promise.all(verificationPromises);
            alert('All documents verified successfully');
        } catch (error) {
            console.error('Error verifying KYC:', error);
            alert('Error verifying KYC');
        }
    };

    const downloadPDF = async () => {
        setDownloading(true);
        try {
            const allData = await fetchKYCData(true);

            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm'
            });

            // Add title
            doc.setFontSize(18);
            doc.text('Agent KYC Requests Report', 14, 20);

            // Add filters info
            doc.setFontSize(10);
            let yPos = 30;

            if (filters.email) {
                doc.text(`Email Filter: ${filters.email}`, 14, yPos);
                yPos += 7;
            }

            if (filters.fromDate || filters.toDate) {
                const dateRange = `${filters.fromDate || 'Start'} to ${filters.toDate || 'End'}`;
                doc.text(`Date Range: ${dateRange}`, 14, yPos);
                yPos += 7;
            }

            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, yPos);
            yPos += 15;

            // Prepare data for the summary table
            const summaryTableData = allData.map(item => [
                item.userId?.email || 'N/A',
                item.country || 'N/A',
                item.overallStatus || 'pending',
                Object.keys(item.documents || {}).length,
                new Date(item.createdAt).toLocaleDateString()
            ]);

            // Add summary table
            doc.autoTable({
                startY: yPos,
                head: [['Email', 'Country', 'Status', 'Documents', 'Created Date']],
                body: summaryTableData,
                theme: 'grid',
                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255,
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                },
                margin: { top: 10 }
            });

            // Add detailed information for each record
            allData.forEach((item, index) => {
                if (index > 0) {
                    doc.addPage();
                    yPos = 20;
                } else {
                    yPos = doc.lastAutoTable.finalY + 20;
                }

                // Record header
                doc.setFontSize(14);
                doc.text(`KYC Details for: ${item.userId?.email || 'N/A'}`, 14, yPos);
                yPos += 10;

                // Basic info
                doc.setFontSize(10);
                doc.text(`Country: ${item.country || 'N/A'}`, 14, yPos);
                yPos += 7;
                doc.text(`Status: ${item.overallStatus || 'pending'}`, 14, yPos);
                yPos += 7;
                doc.text(`Submitted: ${new Date(item.createdAt).toLocaleString()}`, 14, yPos);
                yPos += 10;

                // Documents table
                const docTableData = Object.entries(item.documents || {}).map(([key, docData]) => [
                    key,
                    docData.verification?.status || 'pending',
                    docData.verification?.verifiedAt ?
                        new Date(docData.verification.verifiedAt).toLocaleDateString() : 'N/A',
                    docData.verification?.rejectionReason || 'N/A'
                ]);

                doc.autoTable({
                    startY: yPos,
                    head: [['Document Type', 'Status', 'Verified Date', 'Rejection Reason']],
                    body: docTableData,
                    theme: 'grid',
                    headStyles: {
                        fillColor: [41, 128, 185],
                        textColor: 255,
                        fontStyle: 'bold'
                    },
                    alternateRowStyles: {
                        fillColor: [245, 245, 245]
                    }
                });
            });

            // Save the PDF
            doc.save(`agent_kyc_requests_${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF');
        } finally {
            setDownloading(false);
        }
    };

    const documents = selectedDoc ? getDocuments(selectedDoc) : [];
    const currentDocument = documents[currentPage];
    const hasNextPage = currentPage < documents.length - 1;
    const hasPrevPage = currentPage > 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Agent KYC Verification
                        </h1>
                        <p className="text-sm sm:text-base text-gray-500">
                            Manage and verify agent KYC documentation
                        </p>
                    </div>
                    <button
                        onClick={downloadPDF}
                        disabled={downloading || loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center mt-4 sm:mt-0"
                    >
                        {downloading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Download Full Report
                            </>
                        )}
                    </button>
                </div>

                {/* Filters Section */}
                <div className="bg-white p-4 mb-4 rounded-lg shadow">
                    <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="text"
                                name="email"
                                placeholder="Search by email..."
                                value={filters.email}
                                onChange={handleFilterChange}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                            <input
                                type="date"
                                name="fromDate"
                                value={filters.fromDate}
                                onChange={handleFilterChange}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                            <input
                                type="date"
                                name="toDate"
                                value={filters.toDate}
                                onChange={handleFilterChange}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div className="flex items-end space-x-2">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                            >
                                Apply Filters
                            </button>
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>

                {/* Main Table */}
                <div className="bg-white p-4 sm:p-6 shadow rounded-lg overflow-x-auto">
                    {loading && !downloading ? (
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
                                        <th className="py-2 px-2 sm:px-4">Email</th>
                                        <th className="py-2 px-2 sm:px-4">Country</th>
                                        <th className="py-2 px-2 sm:px-4">Status</th>
                                        <th className="py-2 px-2 sm:px-4">Documents</th>
                                        <th className="py-2 px-2 sm:px-4">Created Date</th>
                                        <th className="py-2 px-2 sm:px-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {kycData.map((kycDoc) => (
                                        <tr key={kycDoc._id} className="border-b hover:bg-gray-50">
                                            <td className="py-2 px-2 sm:px-4">
                                                {kycDoc.userId?.email || 'N/A'}
                                            </td>
                                            <td className="py-2 px-2 sm:px-4">{kycDoc.country || 'N/A'}</td>
                                            <td className="py-2 px-2 sm:px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${kycDoc.overallStatus === 'approved' ? 'bg-green-100 text-green-800' :
                                                    kycDoc.overallStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {kycDoc.overallStatus || 'pending'}
                                                </span>
                                            </td>
                                            <td className="py-2 px-2 sm:px-4">
                                                {kycDoc.documents ? Object.keys(kycDoc.documents).length : 0}
                                            </td>
                                            <td className="py-2 px-2 sm:px-4">
                                                {new Date(kycDoc.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-2 px-2 sm:px-4 flex gap-2">
                                                <button
                                                    onClick={() => verifyKYC(kycDoc.userId?._id)}
                                                    disabled={kycDoc.overallStatus === 'approved'}
                                                    className={`px-2 sm:px-4 py-1 sm:py-2 text-sm rounded ${kycDoc.overallStatus === 'approved' ?
                                                        'bg-gray-300 cursor-not-allowed' :
                                                        'bg-blue-500 hover:bg-blue-600 text-white'
                                                        }`}
                                                >
                                                    {kycDoc.overallStatus === 'approved' ? 'Approved' : 'Approve All'}
                                                </button>
                                                <button
                                                    onClick={() => showDocument(kycDoc)}
                                                    className="bg-green-500 text-white px-2 sm:px-4 py-1 sm:py-2 text-sm rounded hover:bg-green-600"
                                                >
                                                    View Docs
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination Controls */}
                            <div className="mt-4 flex justify-between items-center">
                                <div className="text-sm text-gray-500">
                                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
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
                                        disabled={pagination.page >= pagination.totalPages}
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
                                Documents for {selectedDoc.userId?.email || selectedDoc.userId?._id} ({selectedDoc.country})
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
                                <h3 className="font-semibold text-gray-700">
                                    {currentDocument.label}
                                    {currentDocument.required && (
                                        <span className="ml-2 text-xs text-red-500">(Required)</span>
                                    )}
                                </h3>

                                <div className="relative w-full h-64 sm:h-96">
                                    {currentDocument.url?.endsWith('.pdf') ? (
                                        <iframe
                                            src={currentDocument.url}
                                            className="w-full h-full border rounded"
                                            title={currentDocument.label}
                                        />
                                    ) : (
                                        <img
                                            src={currentDocument.url}
                                            alt={currentDocument.label}
                                            className="absolute inset-0 w-full h-full object-contain rounded"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/placeholder-doc.png';
                                            }}
                                        />
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-4 items-center">
                                    <div className={`px-3 py-1 rounded-full text-sm ${currentDocument.status === 'verified' ? 'bg-green-100 text-green-800' :
                                        currentDocument.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        Status: {currentDocument.status || 'pending'}
                                    </div>

                                    {currentDocument.status !== 'verified' && (
                                        <button
                                            onClick={() => {
                                                handleDocumentVerification(
                                                    selectedDoc.userId._id,
                                                    currentDocument.key,
                                                    'verified'
                                                );
                                            }}
                                            disabled={verifyingDoc === currentDocument.key}
                                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                                        >
                                            {verifyingDoc === currentDocument.key ? 'Verifying...' : 'Verify Document'}
                                        </button>
                                    )}

                                    {currentDocument.status !== 'rejected' && (
                                        <button
                                            onClick={() => {
                                                const reason = prompt('Enter rejection reason:');
                                                if (reason) {
                                                    handleDocumentVerification(
                                                        selectedDoc.userId._id,
                                                        currentDocument.key,
                                                        'rejected',
                                                        reason
                                                    );
                                                }
                                            }}
                                            disabled={verifyingDoc === currentDocument.key}
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                                        >
                                            Reject Document
                                        </button>
                                    )}
                                </div>

                                {currentDocument.rejectionReason && (
                                    <div className="bg-red-50 p-3 rounded">
                                        <p className="font-medium text-red-800">Rejection Reason:</p>
                                        <p className="text-red-600">{currentDocument.rejectionReason}</p>
                                    </div>
                                )}
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