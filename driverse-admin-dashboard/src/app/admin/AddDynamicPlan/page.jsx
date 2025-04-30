"use client";

import { useEffect, useState } from "react";

const DynamicChargesPage = () => {
    const [plans, setPlans] = useState([]);
    const [form, setForm] = useState({
        title: "",
        price: "",
        features: "",
        priceId: "",
        serviceType: "",
    });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch all plans
    const fetchPlans = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/DynamicCharges/get");
            const data = await response.json();
            if (data.success) {
                setPlans(data.data);
            }
        } catch (error) {
            console.error("Error fetching plans:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle Create & Update
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = editingId
                ? `/api/DynamicCharges/${editingId}`
                : "/api/DynamicCharges";
            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await response.json();
            if (data.success) {
                alert(editingId ? "Plan updated successfully!" : "Plan created successfully!");
                fetchPlans();
                setForm({ title: "", price: "", features: "", priceId: "", serviceType: "" });
                setEditingId(null);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle Edit
    const handleEdit = (plan) => {
        setForm(plan);
        setEditingId(plan._id);
    };

    // Handle Delete
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this plan?")) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/DynamicCharges/delete/${id}`, { method: "DELETE" });
            const data = await response.json();
            if (data.success) {
                alert("Plan deleted successfully!");
                fetchPlans();
            }
        } catch (error) {
            console.error("Error deleting plan:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-5">
            <h1 className="text-3xl font-bold text-center mb-6">Subscription Plans</h1>

            {/* Create/Update Form */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <div>
                    <label className="block text-gray-600">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2"
                        placeholder="Enter title"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-600">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2"
                        placeholder="Enter price"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-600">Features</label>
                    <input
                        type="text"
                        name="features"
                        value={form.features}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2"
                        placeholder="Enter features"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-600">Price ID</label>
                    <input
                        type="text"
                        name="priceId"
                        value={form.priceId}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2"
                        placeholder="Enter Price ID"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-600">Service Type</label>
                    <select
                        name="serviceType"
                        value={form.serviceType}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2"
                        required
                    >
                        <option value="">Select Service Type</option>
                        <option value="COMMON">COMMON</option>
                        <option value="DRIVER">DRIVER</option>
                        <option value="CARRIER">CARRIER</option>
                    </select>
                </div>
               
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                    disabled={loading}
                >
                    {loading ? "Processing..." : editingId ? "Update Plan" : "Create Plan"}
                </button>
            </form>

            {/* Subscription Plans List */}
            <div className="mt-8">
                {loading ? (
                    <p className="text-center">Loading plans...</p>
                ) : (
                    <ul className="space-y-4">
                        {plans.map((plan) => (
                            <li key={plan._id} className="bg-gray-100 p-4 rounded-md shadow-md">
                                <h3 className="text-xl font-semibold">{plan.title}</h3>
                                <p>💰 Price: <strong>${plan.price}</strong></p>
                                <p>📌 Features: {plan.features}</p>
                                <p>🔖 Price ID: {plan.priceId}</p>
                                <p>🛠 Service Type: {plan.serviceType}</p>

                                <div className="mt-3 flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(plan)}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(plan._id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default DynamicChargesPage;
