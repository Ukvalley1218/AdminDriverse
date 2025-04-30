
"use client"
import React, { useState, useEffect } from 'react';



import { ChevronDown, ChevronUp, X } from 'lucide-react';

const DetailModal = ({ request, onClose }) => {
  if (!request) return null;
  console.log("request",request)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-800">Request Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* User Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">User Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              {request.users?.map((user, index) => (
                <div key={index} className="mb-2 last:mb-0">
                  <p className="font-medium">{user.userName}</p>
                  <p className="text-gray-600">{user.userEmail}</p>
                  <p className="text-gray-600">Service Type: {user.serviceType}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Vehicle Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">Type: {request.vehicleType}</p>
              {request.truckDetails && (
                <div>
                  <p>Make: {request.truckDetails.make}</p>
                  <p>Model: {request.truckDetails.model}</p>
                  <p>Year: {request.truckDetails.year}</p>
                </div>
              )}
              {request.trailerDetails && (
                <div>
                  <p>Make: {request.trailerDetails.make}</p>
                  <p>Model: {request.trailerDetails.model}</p>
                  <p>Year: {request.trailerDetails.year}</p>
                </div>
              )}
            </div>
          </div>

          {/* Service Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Service Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><span className="font-medium">Service Type:</span> {request.serviceType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
              <p><span className="font-medium">Problem Description:</span> {request.problemDescription}</p>
              <p><span className="font-medium">Service Radius:</span> {request.radius} km</p>
            </div>
          </div>

          {/* Location Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Location Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><span className="font-medium">Address:</span> {request.address}</p>
              <p><span className="font-medium">Coordinates:</span> {request.latitude}, {request.longitude}</p>
            </div>
          </div>

          {/* Images */}
          {request.images && request.images.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Images</h3>
              <div className="grid grid-cols-2 gap-4">
                {request.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={image.url}
                      alt={`Request image ${index + 1}`}
                      className="rounded-lg w-full h-48 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Timestamps</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><span className="font-medium">Created:</span> {new Date(request.createdAt).toLocaleString()}</p>
              <p><span className="font-medium">Last Updated:</span> {new Date(request.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
const TowRequestsPage = () => {
  const [data, setData] = useState({
    requests: [],
    pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
    stats: {
      verifiedCount: 0,
      pendingCount: 0,
      serviceTypeDistribution: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    serviceTypes: [], // Array for multiple service types
    fromDate: '',
    toDate: ''
  });

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 10,
        search: filters.search,
        serviceTypes: filters.serviceTypes.join(','), // Join array with commas
        fromDate: filters.fromDate,
        toDate: filters.toDate
      });

      const response = await fetch(`/api/requestTow?${queryParams}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch requests');
      }

      setData(result.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentPage, filters]);

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
    setCurrentPage(1);
  };

  const handleServiceTypeToggle = (type) => {
    setFilters(prev => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(type)
        ? prev.serviceTypes.filter(t => t !== type)
        : [...prev.serviceTypes, type]
    }));
    setCurrentPage(1);
  };

  const formatServiceType = (type) => {
    return type.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Available service roles for filtering
  const serviceRoles = ['Driver', 'Tower', 'Mechanic'];

  // Service types from the stats
  const getServiceTypeColor = (count) => {
    if (count > 30) return 'bg-red-100 text-red-800';
    if (count > 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Service Requests Dashboard</h1>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-700">Total Requests</h3>
              <p className="text-2xl font-bold text-blue-900">{data.pagination?.total || 0}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-700">Verified Requests</h3>
              <p className="text-2xl font-bold text-green-900">{data.stats?.verifiedCount || 0}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-700">Pending Requests</h3>
              <p className="text-2xl font-bold text-yellow-900">{data.stats?.pendingCount || 0}</p>
            </div>
          </div>

          {/* Service Type Distribution */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Service Type Distribution</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.stats?.serviceTypeDistribution?.map((service) => (
                <div key={service._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{formatServiceType(service._id)}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getServiceTypeColor(service.count)}`}>
                    {service.count} requests
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Filters */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Search by username"
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="flex flex-wrap gap-2">
                {serviceRoles.map(role => (
                  <button
                    key={role}
                    onClick={() => handleServiceTypeToggle(role)}
                    className={`px-4 py-2 rounded-md border ${filters.serviceTypes.includes(role)
                      ? 'bg-blue-500 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="date"
                value={filters.fromDate}
                onChange={(e) => setFilters(prev => ({ ...prev, fromDate: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="date"
                value={filters.toDate}
                onChange={(e) => setFilters(prev => ({ ...prev, toDate: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Loading and Error States */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading requests...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          {/* Table */}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Info</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.requests?.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {request.users?.map((user, index) => (
                          <div key={index} className="text-sm">
                            <div className="font-medium text-gray-900">{user.userName}</div>
                            <div className="text-gray-500">{user.userEmail}</div>
                            <div className="text-gray-500">{user.serviceType}</div>
                          </div>
                        ))}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded bg-blue-100 text-blue-800">
                          {formatServiceType(request.serviceType)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 truncate max-w-xs">{request.location}</div>
                        <div className="text-xs text-gray-500">
                          Lat: {request.latitude}, Long: {request.longitude}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="bg-black text-white p-2  rounded-md hover:bg-blue-600 transition-colors"
                        >
                          View 
                        </button>
                      </td>


                    </tr>



                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && data.pagination && (
            <div className="flex justify-between items-center mt-6 border-t pt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-black'
                  }`}
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {currentPage} of {data.pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev =>
                  Math.min(prev + 1, data.pagination.totalPages)
                )}
                disabled={currentPage === data.pagination.totalPages}
                className={`px-4 py-2 rounded-md ${currentPage === data.pagination.totalPages
                  ? 'bg-gary-100 text-gray-400 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-black'
                  }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      {selectedRequest && (
        <DetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}

    </div>
  );
};
export default TowRequestsPage;