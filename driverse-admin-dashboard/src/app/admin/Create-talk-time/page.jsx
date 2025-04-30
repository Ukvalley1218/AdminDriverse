"use client";
import React, { useState, useEffect } from "react";

const Page = () => {
    const [plans, setPlans] = useState([]); // State to store all plans
    const [formData, setFormData] = useState({ hours: "", price: "", costPerHour: "" }); // State for form inputs
    const [editPlanId, setEditPlanId] = useState(null); // State to track which plan is being edited
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [error, setError] = useState(null); // State for error messages

    // Fetch all plans on component mount
    useEffect(() => {
        fetchPlans();
    }, []);

    // Fetch all plans from the API
    const fetchPlans = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/plan");
            if (!response.ok) throw new Error("Failed to fetch plans");
            const data = await response.json();
            setPlans(data.plans);
        } catch (error) {
            console.error("Error fetching plans:", error);
            setError("Failed to fetch plans. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission (Create or Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const url = editPlanId ? `/api/plan/${editPlanId}` : "/api/plan";
            const method = editPlanId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to save plan");

            const data = await response.json();
            console.log(data.message);

            // Reset form and fetch updated plans
            setFormData({ hours: "", price: "", costPerHour: "" });
            setEditPlanId(null);
            fetchPlans();
        } catch (error) {
            console.error("Error saving plan:", error);
            setError("Failed to save plan. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handle editing a plan
    const handleEdit = (plan) => {
        setFormData({ hours: plan.hours, price: plan.price, costPerHour: plan.costPerHour });
        setEditPlanId(plan._id);
    };

    // Handle deleting a plan
    const handleDelete = async (planId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/plan/${planId}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete plan");

            const data = await response.json();
            console.log(data.message);

            // Fetch updated plans
            fetchPlans();
        } catch (error) {
            console.error("Error deleting plan:", error);
            setError("Failed to delete plan. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Talk Time Plans</h1>

                {/* Form for creating/updating a plan */}
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">
                        {editPlanId ? "Edit Plan" : "Create New Plan"}
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Hours:</label>
                            <input
                                type="number"
                                name="hours"
                                value={formData.hours}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price:</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Cost Per Hour:</label>
                            <input
                                type="number"
                                name="costPerHour"
                                value={formData.costPerHour}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                        {loading ? "Processing..." : editPlanId ? "Update Plan" : "Create Plan"}
                    </button>
                </form>

                {/* Error message */}
                {error && (
                    <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                {/* Table to display all plans */}
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">All Plans</h2>
                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : plans.length === 0 ? (
                    <p className="text-gray-600 text-center">No plans found.</p>
                ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Hours
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cost Per Hour
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {plans.map((plan) => (
                                    <tr key={plan._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-700">{plan.hours}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{plan.price}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{plan.costPerHour}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <button
                                                onClick={() => handleEdit(plan)}
                                                className="mr-2 text-blue-500 hover:text-blue-700"
                                                disabled={loading}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(plan._id)}
                                                className="text-red-500 hover:text-red-700"
                                                disabled={loading}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;