// "use client"

// import React, { useState, useEffect } from 'react';

// const WithdrawalRequestsPage = () => {
//     // State management
//     const [requests, setRequests] = useState([]);
//     const [pagination, setPagination] = useState({
//         total: 0,
//         page: 1,
//         pages: 0,
//         limit: 10
//     });

//     // Filters state
//     const [filters, setFilters] = useState({
//         username: '',
//         status: '',
//         fromDate: '',
//         toDate: ''
//     });

//     // Modal state
//     const [showModal, setShowModal] = useState(false);
//     const [confirmationData, setConfirmationData] = useState({
//         requestId: null,
//         status: '',
//         remarks: ''
//     });

//     // Fetch withdrawal requests
//     const fetchRequests = async () => {
//         try {
//             const queryParams = new URLSearchParams({
//                 page: pagination.page.toString(),
//                 limit: pagination.limit.toString(),
//                 ...filters
//             });

//             const response = await fetch(`/api/AgentPayout/getRequest?${queryParams}`);
//             const data = await response.json();

//             if (data.success) {
//                 setRequests(data.data.requests);
//                 setPagination(data.data.pagination);
//             }
//         } catch (error) {
//             console.error('Error fetching requests:', error);
//         }
//     };

//     // Handle confirmation
//     const handleConfirmPayment = async () => {
//         try {
//             const response = await fetch('/api/AgentPayout/confiram', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     requestId: confirmationData.requestId,
//                     status: confirmationData.status,
//                     remarks: confirmationData.remarks
//                 }),
//             });

//             const data = await response.json();

//             if (data.success) {
//                 fetchRequests();
//                 setShowModal(false);
//                 setConfirmationData({ requestId: null, status: '', remarks: '' });
//             }
//         } catch (error) {
//             console.error('Error confirming payment:', error);
//         }
//     };

//     // Format date
//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: '2-digit'
//         });
//     };

//     // Effect to fetch data
//     useEffect(() => {
//         fetchRequests();
//     }, [pagination.page, filters]);

//     return (
//         <div className="container mx-auto p-6">
//             <div className="bg-white rounded-lg shadow p-6">
//                 <h1 className="text-2xl font-bold mb-6">Withdrawal Requests</h1>

//                 {/* Filters */}
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                     <input
//                         type="text"
//                         placeholder="Search by username"
//                         value={filters.username}
//                         onChange={(e) => setFilters(prev => ({ ...prev, username: e.target.value }))}
//                         className="w-full px-4 py-2 border rounded focus:outline-none focus:border-black"
//                     />
//                     <select
//                         value={filters.status}
//                         onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
//                         className="w-full px-4 py-2 border rounded focus:outline-none focus:border-black"
//                     >
//                         <option value="">All Status</option>
//                         <option value="PENDING">Pending</option>
//                         <option value="APPROVED">Approved</option>
//                         <option value="REJECTED">Rejected</option>
//                         <option value="COMPLETED">Completed</option>
//                     </select>
//                     <input
//                         type="date"
//                         value={filters.fromDate}
//                         onChange={(e) => setFilters(prev => ({ ...prev, fromDate: e.target.value }))}
//                         className="w-full px-4 py-2 border rounded focus:outline-none focus:border-black"
//                     />
//                     <input
//                         type="date"
//                         value={filters.toDate}
//                         onChange={(e) => setFilters(prev => ({ ...prev, toDate: e.target.value }))}
//                         className="w-full px-4 py-2 border rounded focus:outline-none focus:border-black"
//                     />
//                 </div>

//                 {/* Table */}
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full border-collapse">
//                         <thead>
//                             <tr className="bg-gray-50">
//                                 <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border-b">Username</th>
//                                 <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border-b">Amount</th>
//                                 <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border-b">Status</th>
//                                 <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border-b">Request Date</th>
//                                 <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border-b">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {requests.map((request) => (
//                                 <tr key={request.requestId} className="border-b hover:bg-gray-50">
//                                     <td className="px-6 py-4 text-sm">{request.agent.username}</td>
//                                     <td className="px-6 py-4 text-sm">${request.amount.toFixed(2)}</td>
//                                     <td className="px-6 py-4 text-sm">
//                                         <span className={`px-2 py-1 rounded-full text-xs
//                       ${request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
//                       ${request.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' : ''}
//                       ${request.status === 'REJECTED' ? 'bg-red-100 text-red-800' : ''}
//                       ${request.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : ''}
//                     `}>
//                                             {request.status}
//                                         </span>
//                                     </td>
//                                     <td className="px-6 py-4 text-sm">{formatDate(request.requestDate)}</td>
//                                     <td className="px-6 py-4 text-sm">
//                                         {request.status === 'PENDING' && (
//                                             <div className="space-x-2">
//                                                 <button
//                                                     onClick={() => {
//                                                         setConfirmationData({ requestId: request.requestId, status: 'APPROVED', remarks: '' });
//                                                         setShowModal(true);
//                                                     }}
//                                                     className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
//                                                 >
//                                                     Approve
//                                                 </button>
//                                                 <button
//                                                     onClick={() => {
//                                                         setConfirmationData({ requestId: request.requestId, status: 'REJECTED', remarks: '' });
//                                                         setShowModal(true);
//                                                     }}
//                                                     className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
//                                                 >
//                                                     Reject
//                                                 </button>
//                                             </div>
//                                         )}
//                                         {request.status === 'APPROVED' && (
//                                             <button
//                                                 onClick={() => {
//                                                     setConfirmationData({ requestId: request.requestId, status: 'COMPLETED', remarks: '' });
//                                                     setShowModal(true);
//                                                 }}
//                                                 className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
//                                             >
//                                                 Complete
//                                             </button>
//                                         )}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Pagination */}
//                 <div className="mt-4 flex items-center justify-between">
//                     <div className="text-sm text-gray-600">
//                         Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
//                     </div>
//                     <div className="space-x-2">
//                         <button
//                             disabled={pagination.page === 1}
//                             onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
//                             className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             Previous
//                         </button>
//                         <button
//                             disabled={pagination.page === pagination.pages}
//                             onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
//                             className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             Next
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Confirmation Modal */}
//             {showModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                     <div className="bg-white rounded-lg p-6 w-full max-w-md">
//                         <h2 className="text-xl font-bold mb-4">Confirm Action</h2>
//                         <p className="mb-4">
//                             Are you sure you want to mark this withdrawal request as {confirmationData.status.toLowerCase()}?
//                         </p>
//                         <textarea
//                             placeholder="Enter remarks"
//                             value={confirmationData.remarks}
//                             onChange={(e) => setConfirmationData(prev => ({ ...prev, remarks: e.target.value }))}
//                             className="w-full px-4 py-2 border rounded mb-4 focus:outline-none focus:border-black"
//                             rows={3}
//                         />
//                         <div className="flex justify-end space-x-2">
//                             <button
//                                 onClick={() => setShowModal(false)}
//                                 className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={handleConfirmPayment}
//                                 className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
//                             >
//                                 Confirm
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default WithdrawalRequestsPage;


"use client"

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

const WithdrawalRequestsPage = () => {
    // State management
    const [requests, setRequests] = useState([]);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        pages: 0,
        limit: 10
    });

    // Filters state
    const [filters, setFilters] = useState({
        username: '',
        status: '',
        fromDate: '',
        toDate: ''
    });

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [confirmationData, setConfirmationData] = useState({
        requestId: null,
        status: '',
        remarks: ''
    });

    // Download function
    const handleDownload = async () => {
        try {
            // Get all requests without pagination for download
            const queryParams = new URLSearchParams({
                limit: '9999', // Large number to get all records
                ...filters
            });

            const response = await fetch(`/api/AgentPayout/getRequest?${queryParams}`);
            const data = await response.json();

            if (data.success) {
                const csvData = data.data.requests.map(request => ({
                    Username: request.agent.username,
                    Amount: request.amount.toFixed(2),
                    Status: request.status,
                    RequestDate: formatDate(request.requestDate),
                    Remarks: request.remarks || ''
                }));

                const csv = Papa.unparse(csvData);
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `withdrawal_requests_${formatDate(new Date())}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error('Error downloading requests:', error);
        }
    };

    // Fetch withdrawal requests
    const fetchRequests = async () => {
        try {
            const queryParams = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                ...filters
            });

            const response = await fetch(`/api/AgentPayout/getRequest?${queryParams}`);
            const data = await response.json();

            if (data.success) {
                setRequests(data.data.requests);
                setPagination(data.data.pagination);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    // Handle confirmation
    const handleConfirmPayment = async () => {
        try {
            // For COMPLETED status, use a different endpoint
            const endpoint = confirmationData.status === 'COMPLETED' 
                ? '/api/AgentPayout/complete' 
                : '/api/AgentPayout/confiram';

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requestId: confirmationData.requestId,
                    status: confirmationData.status,
                    remarks: confirmationData.remarks,
                    completedDate: confirmationData.status === 'COMPLETED' ? new Date().toISOString() : undefined
                }),
            });

            const data = await response.json();

            if (data.success) {
                fetchRequests();
                setShowModal(false);
                setConfirmationData({ requestId: null, status: '', remarks: '' });
            }
        } catch (error) {
            console.error('Error confirming payment:', error);
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        });
    };

    // Effect to fetch data
    useEffect(() => {
        fetchRequests();
    }, [pagination.page, filters]);

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Withdrawal Requests</h1>
                    <button
                        onClick={handleDownload}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Download CSV
                    </button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search by username"
                        value={filters.username}
                        onChange={(e) => setFilters(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:border-black"
                    />
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:border-black"
                    >
                        <option value="">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                    <input
                        type="date"
                        value={filters.fromDate}
                        onChange={(e) => setFilters(prev => ({ ...prev, fromDate: e.target.value }))}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:border-black"
                    />
                    <input
                        type="date"
                        value={filters.toDate}
                        onChange={(e) => setFilters(prev => ({ ...prev, toDate: e.target.value }))}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:border-black"
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border-b">Username</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border-b">Amount</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border-b">Status</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border-b">Request Date</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border-b">Remarks</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((request) => (
                                <tr key={request.requestId} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm">{request.agent.username}</td>
                                    <td className="px-6 py-4 text-sm">${request.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs
                                            ${request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                                            ${request.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' : ''}
                                            ${request.status === 'REJECTED' ? 'bg-red-100 text-red-800' : ''}
                                            ${request.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : ''}
                                        `}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">{formatDate(request.requestDate)}</td>
                                    <td className="px-6 py-4 text-sm">{request.remarks || '-'}</td>
                                    <td className="px-6 py-4 text-sm">
                                        {request.status === 'PENDING' && (
                                            <div className="space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setConfirmationData({ requestId: request.requestId, status: 'APPROVED', remarks: '' });
                                                        setShowModal(true);
                                                    }}
                                                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setConfirmationData({ requestId: request.requestId, status: 'REJECTED', remarks: '' });
                                                        setShowModal(true);
                                                    }}
                                                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                        {request.status === 'APPROVED' && (
                                            <button
                                                onClick={() => {
                                                    setConfirmationData({ requestId: request.requestId, status: 'COMPLETED', remarks: '' });
                                                    setShowModal(true);
                                                }}
                                                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                                            >
                                                Complete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                    </div>
                    <div className="space-x-2">
                        <button
                            disabled={pagination.page === 1}
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                            className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            disabled={pagination.page === pagination.pages}
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                            className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Confirm Action</h2>
                        <p className="mb-4">
                            Are you sure you want to mark this withdrawal request as {confirmationData.status.toLowerCase()}?
                        </p>
                        <textarea
                            placeholder="Enter remarks"
                            value={confirmationData.remarks}
                            onChange={(e) => setConfirmationData(prev => ({ ...prev, remarks: e.target.value }))}
                            className="w-full px-4 py-2 border rounded mb-4 focus:outline-none focus:border-black"
                            rows={3}
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmPayment}
                                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WithdrawalRequestsPage;