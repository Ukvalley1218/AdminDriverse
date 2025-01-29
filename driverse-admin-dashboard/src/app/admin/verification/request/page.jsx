"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminVerificationRequest = () => {
  const [kycData, setKycData] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchKYCData = async () => {
      try {
        const response = await axios.get(`/api/getkyc`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setKycData(response.data);
        console.log()
      } catch (error) {
        alert('Failed to fetch KYC data');
        console.error('KYC Data Fetch Error:', error);
      }
    };

    fetchKYCData();
  }, []);

  const getDocuments = (doc) => {
    return [
      { label: "Article of Incorporation", url: doc?.articleOfIncorporation },
      { label: "WSIB Certificate", url: doc?.wsibCertificate },
      { label: "Insurance Certificate", url: doc?.insuranceCertificate },
      { label: "Operating Authorities", url: doc?.operatingAuthorities },
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

  const verifyed = async (kycDoc) => {
    try {
      console.log("kycDoc", kycDoc);
      const response = await axios.put(`/api/getkyc/${kycDoc}`);
      console.log('KYC Verification Response:', response.data);
      alert('KYC verified successfully');
    } catch (error) {
      console.error('Error verifying KYC:', error);
      alert('Failed to verify KYC');
    }
  };

  const documents = selectedDoc ? getDocuments(selectedDoc) : [];
  const currentDocument = documents[currentPage];
  const hasNextPage = currentPage < documents.length - 1;
  const hasPrevPage = currentPage > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Document Verification
            </h1>
            <p className="text-sm sm:text-base text-gray-500">
              Manage and verify business documentation
            </p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 shadow rounded-lg overflow-x-auto">
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
                <tr key={kycDoc._id || Math.random()} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2 sm:px-4">{kycDoc.userName || 'N/A'}</td>
                  <td className="py-2 px-2 sm:px-4">{kycDoc.serviceType || 'N/A'}</td>
                  <td className="py-2 px-2 sm:px-4">
                    {kycDoc.isVerified === true ? 'Active' : 'Pending'}
                  </td>


                  <td className="py-2 px-2 sm:px-4">
                    <button
                      onClick={() => verifyed(kycDoc.userId)}
                      className="bg-blue-500 text-white px-2 sm:px-4 py-1 sm:py-2 text-sm rounded hover:bg-blue-600"
                    >
                      Verify
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
        </div>
      </div>

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

export default AdminVerificationRequest;