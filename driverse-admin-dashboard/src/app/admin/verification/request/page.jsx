"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, ChevronLeft, ChevronRight, X, FileText, CheckCircle, Clock } from "lucide-react";

const AdminVerificationRequest = () => {
  // State management
  const [kycData, setKycData] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(false);

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
      const response = await axios.get(`/api/getkyc?${query}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      setKycData(response.data.data || []);
      setPagination(prev => ({
        ...prev,
        totalRecords: response.data.totalRecords || 0,
        verifiedCount: response.data.verifiedCount || 0,
        unverifiedCount: response.data.unverifiedCount || 0
      }));
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch KYC data');
      console.error('KYC Data Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKYCData();
  }, [pagination.page, pagination.limit, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleVerification = async (userId, documentType) => {
    setVerifying(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/api/verifyDoc?userId=${userId}&documentType=${documentType}`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert('Document verified successfully!');
        fetchKYCData(); // Refresh data
        setIsModalOpen(false); // Close modal
      } else {
        throw new Error(response.data.message || 'Verification failed');
      }
    } catch (err) {
      alert(err.message || 'Verification failed');
      console.error('Verification error:', err);
    } finally {
      setVerifying(false);
    }
  };

  const getDocuments = (doc) => {
    return [
      { 
        id: doc.userId, 
        verify: doc?.verify_articleOfIncorporation?.verified, 
        doc_name: 'articleOfIncorporation', 
        label: "Article of Incorporation", 
        url: doc?.articleOfIncorporation 
      },
      { 
        id: doc.userId, 
        verify: doc?.verify_wsibCertificate?.verified, 
        doc_name: 'wsibCertificate', 
        label: "WSIB Certificate", 
        url: doc?.wsibCertificate 
      },
      { 
        id: doc.userId, 
        verify: doc?.verify_insuranceCertificate?.verified, 
        doc_name: 'insuranceCertificate', 
        label: "Insurance Certificate", 
        url: doc?.insuranceCertificate 
      },
      { 
        id: doc.userId, 
        verify: doc?.verify_operatingAuthorities?.verified, 
        doc_name: 'operatingAuthorities', 
        label: "Operating Authorities", 
        url: doc?.operatingAuthorities 
      },
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

  const documents = selectedDoc ? getDocuments(selectedDoc) : [];
  const currentDocument = documents[currentPage];
  const totalPages = Math.ceil(pagination.totalRecords / pagination.limit);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Document Verification
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Review and verify business documents
            </p>
          </div>

          {/* Statistics */}
          <div className="flex gap-3">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 min-w-[100px]">
              <p className="text-xs text-gray-500">Verified</p>
              <p className="text-lg font-bold text-green-600">
                {pagination.verifiedCount}
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 min-w-[100px]">
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-lg font-bold text-yellow-600">
                {pagination.unverifiedCount}
              </p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-4 mb-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                name="search"
                placeholder="Search by name..."
                value={filters.search}
                onChange={handleFilterChange}
                className="pl-10 w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">From Date</label>
              <input
                type="date"
                name="fromDate"
                value={filters.fromDate}
                onChange={handleFilterChange}
                className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">To Date</label>
              <input
                type="date"
                name="toDate"
                value={filters.toDate}
                onChange={handleFilterChange}
                min={filters.fromDate}
                className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => {
                setFilters({ search: '', fromDate: '', toDate: '' });
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className="self-end bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm transition"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading && kycData.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center p-8 text-red-500">
              {error}
              <button 
                onClick={fetchKYCData}
                className="mt-2 text-blue-500 hover:text-blue-700"
              >
                Retry
              </button>
            </div>
          ) : kycData.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              No documents found matching your criteria
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {kycData.map((kycDoc) => (
                      <tr key={kycDoc.userId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {kycDoc.userName || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {kycDoc.serviceType || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            kycDoc.isVerified 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {kycDoc.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getDocuments(kycDoc).length} documents
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => showDocument(kycDoc)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.page * pagination.limit, pagination.totalRecords)}
                      </span>{' '}
                      of <span className="font-medium">{pagination.totalRecords}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        Page {pagination.page} of {totalPages}
                      </span>
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                        disabled={pagination.page >= totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Document Viewer Modal */}
      {isModalOpen && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">
                Document Review - {selectedDoc.userName}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {currentDocument ? (
              <div className="flex-1 overflow-auto p-4">
                <div className="mb-4 flex justify-between items-center">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    {currentDocument.label}
                  </h3>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    currentDocument.verify 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {currentDocument.verify ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Verified
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 mr-1" />
                        Pending
                      </>
                    )}
                  </span>
                </div>

                <div className="border rounded-lg overflow-hidden bg-gray-100 flex justify-center">
                  <img
                    src={currentDocument.url}
                    alt={currentDocument.label}
                    className="max-h-[60vh] object-contain"
                  />
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                      disabled={currentPage === 0}
                      className="flex items-center gap-1 px-3 py-2 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, documents.length - 1))}
                      disabled={currentPage >= documents.length - 1}
                      className="flex items-center gap-1 px-3 py-2 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    Document {currentPage + 1} of {documents.length}
                  </span>
                  {!currentDocument.verify && (
                    <button
                      onClick={() => handleVerification(currentDocument.id, currentDocument.doc_name)}
                      disabled={verifying}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 disabled:opacity-70"
                    >
                      {verifying ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Verifying...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Verify Document
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                No documents available for review
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVerificationRequest;