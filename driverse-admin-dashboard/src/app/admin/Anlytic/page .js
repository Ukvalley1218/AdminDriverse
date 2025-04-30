
import React, { useState, useEffect } from 'react';
import { IoMdClose } from "react-icons/io";
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { FaUser, FaCheck, FaClock, FaPhone, FaStar } from 'react-icons/fa';

const AnalyticsModal = ({ isOpen, onClose, userId }) => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!userId) return;

            try {
                const response = await fetch(`/api/Analytics/${userId}`);
                const data = await response.json();
                if (data.success) {
                    setAnalytics(data.analytics);
                    console.log(data.analytics)
                } else {
                    setError(data.message);
                }
            } catch (err) {
                setError('Failed to fetch analytics');
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchAnalytics();
        }
    }, [userId, isOpen]);

    if (!isOpen) return null;

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-8">
                    <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    if (!analytics) return null;

    const renderUserProfile = () => (
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">User Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <p className="text-gray-500 text-sm">Username</p>
                    <p className="font-semibold text-gray-800">
                        {analytics.userProfile.username}
                    </p>
                </div>
                <div>
                    <p className="text-gray-500 text-sm">Service Type</p>
                    <p className="font-semibold text-gray-800">
                        {analytics.userProfile.serviceType}
                    </p>
                </div>
                <div>
                    <p className="text-gray-500 text-sm">Subscription Status</p>
                    <span
                        className={`inline-block px-4 py-1 rounded-full text-sm font-semibold tracking-wide
              ${analytics.userProfile.subscriptionStatus === 'active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                    >
                        {analytics.userProfile.subscriptionStatus}
                    </span>
                </div>
            </div>
        </div>

    );

    const renderKYCStatus = () => (
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
            <FaCheck />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">   KYC Status</h2>

            <div className="space-y-6">
                {/* Verification Status */}
                <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm font-medium">Verification Status</span>
                    <span className={`px-4 py-1 rounded-full text-sm font-semibold tracking-wide 
                ${analytics.kyc?.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {analytics.kyc?.isVerified ? 'Verified' : 'Pending'}
                    </span>
                </div>

                {/* Documents Section */}
                {analytics.kyc?.documents && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(analytics.kyc.documents).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                                <span className="capitalize text-gray-600 text-sm font-medium">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                <span className={`px-4 py-1 rounded-full text-sm font-semibold tracking-wide
                            ${value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {value ? 'Verified' : 'Pending'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

    );

    const renderServiceMetrics = () => {
        if (!analytics.serviceMetrics && !analytics.serviceRequests) return null;
        const metrics = analytics.serviceMetrics || analytics.serviceRequests;

        const chartData = [
            {
                name: 'Mechanic',
                value: metrics.mechanicRequests?.total || metrics.mechanical?.total || 0,
            },
            {
                name: 'Towing',
                value: metrics.towingRequests?.total || metrics.towing?.total || 0,
            }
        ];

        return (
            <div className="bg-white rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Service Metrics</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Service metrics grid */}
                    {(metrics.mechanicRequests || metrics.mechanical) && (
                        <div className="border rounded-lg p-4">
                            <h3 className="font-semibold mb-3">Mechanic Requests</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-600">Total</p>
                                    <p className="text-2xl font-bold">
                                        {metrics.mechanicRequests?.total || metrics.mechanical?.total}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Recent Requests</p>
                                    <div className="space-y-2 mt-2">
                                        {(metrics.mechanicRequests?.recent || metrics.mechanical?.recent || [])
                                            .slice(0, 3)
                                            .map((req, idx) => (
                                                <div key={idx} className="text-sm bg-gray-50 p-2 rounded">
                                                    {req.vehicleType} - {new Date(req.createdAt).toLocaleDateString()}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Chart */}
                    <div className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-3">Service Distribution</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#4F46E5" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderFleetMetrics = () => {
        if (!analytics.fleetMetrics) return null;

        const chartData = [
            { name: 'Trucks', value: analytics.fleetMetrics.byType.trucks },
            { name: 'Trailers', value: analytics.fleetMetrics.byType.trailers }
        ];

        return (
            <div className="bg-white rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Fleet Management</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <p className="text-gray-600">Total Vehicles</p>
                                <p className="text-2xl font-bold">{analytics.fleetMetrics.totalVehicles}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Trucks</p>
                                <p className="text-2xl font-bold">{analytics.fleetMetrics.byType.trucks}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Trailers</p>
                                <p className="text-2xl font-bold">{analytics.fleetMetrics.byType.trailers}</p>
                            </div>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    <Cell fill="#4F46E5" />
                                    <Cell fill="#818CF8" />
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        );
    };

    const renderCallMetrics = () => {
        if (!analytics.callMetrics) return null;

        const chartData = [
            { name: 'Completed', value: analytics.callMetrics.byStatus.completed },
            { name: 'Missed', value: analytics.callMetrics.byStatus.missed },
            { name: 'Failed', value: analytics.callMetrics.byStatus.failed }
        ];

        const COLORS = ['#10B981', '#EF4444', '#F59E0B'];

        return (
            <div className="bg-white rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Call Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-gray-600">Total Calls</p>
                                <p className="text-2xl font-bold">{analytics.callMetrics.total}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {analytics.callMetrics.byStatus.completed}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600">Missed</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {analytics.callMetrics.byStatus.missed}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600">Failed</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {analytics.callMetrics.byStatus.failed}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        );
    };

    const renderReviewMetrics = () => {
        if (!analytics.reviewMetrics) return null;

        const ratingData = analytics.reviewMetrics.recent.map(review => ({
            date: new Date(review.createdAt).toLocaleDateString(),
            rating: review.rating
        })).reverse();

        return (
            <div className="bg-white rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Reviews & Ratings</h2>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <FaStar className="text-yellow-400 w-6 h-6" />
                                <span className="text-2xl font-bold">{analytics.reviewMetrics.averageRating}</span>
                                <span className="text-gray-600">
                                    ({analytics.reviewMetrics.total} reviews)
                                </span>
                            </div>
                            {analytics.reviewMetrics.distribution && (
                                <div className="space-y-2">
                                    {analytics.reviewMetrics.distribution.map((dist) => (
                                        <div key={dist._id} className="flex items-center space-x-2">
                                            <span className="w-12 text-sm">{dist._id} stars</span>
                                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-yellow-400 rounded-full"
                                                    style={{
                                                        width: `${(dist.count / analytics.reviewMetrics.total) * 100}%`
                                                    }}
                                                />
                                            </div>
                                            <span className="text-sm text-gray-600">{dist.count}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold mb-3">Recent Reviews</h3>
                            <div className="space-y-3">
                                {analytics.reviewMetrics.recent.map((review, idx) => (
                                    <div key={idx} className="bg-gray-50 p-3 rounded">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium">{review.reviewer.username}</span>
                                            <span className="flex items-center">
                                                {review.rating}
                                                <FaStar className="text-yellow-400 w-4 h-4 ml-1" />
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">{review.review}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Rating Trend Chart */}
                    <div className="h-64">
                        <h3 className="font-semibold mb-3">Rating Trend</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ratingData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis domain={[0, 5]} />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="rating"
                                    stroke="#F59E0B"
                                    strokeWidth={2}
                                    dot={{ fill: '#F59E0B' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-y-auto mx-4">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
                    <div className="flex items-center gap-3">
                        <FaUser className="text-3xl text-gray-700" />
                        <h2 className="text-2xl font-bold text-gray-800">User Analytics</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <IoMdClose size={24} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <div className="space-y-6">
                        {renderUserProfile()}
                        {renderKYCStatus()}
                        {renderServiceMetrics()}
                        {renderFleetMetrics()}
                        {renderCallMetrics()}
                        {/* {renderReviewMetrics()} */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsModal;