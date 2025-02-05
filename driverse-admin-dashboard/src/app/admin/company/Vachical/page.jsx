"use client"
import React, { useState, useEffect } from 'react';
import { Search, Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

const ViewModal = ({ vehicle, onClose }) => {
    if (!vehicle) return null;
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Vehicle Details</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="mt-6 space-y-6">
                    {/* Basic Details */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase">Vehicle Number</h3>
                            <p className="mt-1 text-lg text-gray-900">{vehicle.vehicleNumber}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase">Vehicle Type</h3>
                            <p className="mt-1 text-lg text-gray-900">{vehicle.vehicleType}</p>
                        </div>
                    </div>

                    {/* Vehicle Specific Details */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
                            {vehicle.vehicleType === 'Truck' ? 'Truck Details' : 'Trailer Details'}
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Make</p>
                                <p className="text-gray-900">
                                    {vehicle.vehicleType === 'Truck'
                                        ? vehicle.truckDetails?.make
                                        : vehicle.trailerDetails?.make}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Model</p>
                                <p className="text-gray-900">
                                    {vehicle.vehicleType === 'Truck'
                                        ? vehicle.truckDetails?.model
                                        : vehicle.trailerDetails?.model}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Year</p>
                                <p className="text-gray-900">
                                    {vehicle.vehicleType === 'Truck'
                                        ? vehicle.truckDetails?.year
                                        : vehicle.trailerDetails?.year}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Owner Details */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Owner Details</h3>
                        {vehicle.user && (
                            <div className="flex items-start space-x-4">
                                <img
                                    src={vehicle.user.avatar?.url || '/api/placeholder/40/40'}
                                    alt=""
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-medium text-gray-900">{vehicle.user.username}</p>
                                    <p className="text-gray-500">{vehicle.user.email}</p>
                                    <p className="text-gray-500">{vehicle.user.phone}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Registration Date */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase">Registration Date</h3>
                        <p className="mt-1 text-gray-900">{formatDate(vehicle.createdAt)}</p>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default function VehicleManagement() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchVehicles();
    }, [page, search, fromDate, toDate, vehicleType]);

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page,
                limit: 10,
                search,
                ...(fromDate && { fromDate }),
                ...(toDate && { toDate }),
                ...(vehicleType && { vehicleType })
            }).toString();

            const response = await fetch(`/api/CompanyVachical?${queryParams}`);
            const data = await response.json();

            setVehicles(data.vehicles);
            setTotalPages(Math.ceil(data.pagination.totalItems / data.pagination.limit));
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleDateChange = (type, value) => {
        if (type === 'from') setFromDate(value);
        else setToDate(value);
        setPage(1);
    };

    const handleVehicleTypeChange = (e) => {
        setVehicleType(e.target.value);
        setPage(1);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Vehicle Management</h1>
                <p className="text-gray-600">View and monitor registered vehicles</p>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search vehicles..."
                            value={search}
                            onChange={handleSearch}
                            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="flex gap-4 flex-wrap">
                    <select
                        value={vehicleType}
                        onChange={handleVehicleTypeChange}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Types</option>
                        <option value="Truck">Truck</option>
                        <option value="Trailer">Trailer</option>
                    </select>

                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => handleDateChange('from', e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => handleDateChange('to', e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Make</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4 text-center">Loading...</td>
                                </tr>
                            ) : vehicles.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4 text-center">No vehicles found</td>
                                </tr>
                            ) : (
                                vehicles?.map((vehicle) => (
                                    <tr key={vehicle._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {vehicle?.vehicleNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {vehicle?.vehicleType}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {vehicle?.vehicleType === 'Truck' ?
                                                vehicle?.truckDetails?.make : vehicle?.trailerDetails?.make}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {vehicle?.vehicleType === 'Truck' ?
                                                vehicle?.truckDetails?.model : vehicle?.trailerDetails?.model}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {vehicle?.vehicleType === 'Truck' ?
                                                vehicle?.truckDetails?.year : vehicle?.trailerDetails?.year}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {vehicle.user && (
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8">
                                                        <img
                                                            className="h-8 w-8 rounded-full"
                                                            src={vehicle.user.avatar?.url || '/placeholder-avatar.jpg'}
                                                            alt=""
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {vehicle.user.username.slice(0, 20)}
                                                            {vehicle.user.username.length > 20 && '...'}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(vehicle?.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button
                                                onClick={() => {
                                                    setSelectedVehicle(vehicle);
                                                    setShowModal(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={page === totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing page <span className="font-medium">{page}</span> of{' '}
                                <span className="font-medium">{totalPages}</span>
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                    disabled={page === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={page === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {/* View Modal */}
            {showModal && (
                <ViewModal
                    vehicle={selectedVehicle}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedVehicle(null);
                    }}
                />
            )}
        </div>
    );
}