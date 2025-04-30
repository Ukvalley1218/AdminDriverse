'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { MoveVertical, Download, Upload, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';

export default function TruckDetailsPage() {
    const router = useRouter();
    const [trucks, setTrucks] = useState([]);
    const [formData, setFormData] = useState({
        model: '',
        make: '',
        year: ''
    });
    const [editId, setEditId] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const fileInputRef = useRef(null);

    // Sample CSV data
    const sampleCSV = `model,make,year
F-150,Ford,2022
Silverado,Chevrolet,2021
Ram 1500,Dodge,2023
Sierra,GMC,2020
Tundra,Toyota,2019`;

    // Fetch all trucks on component mount or when page changes
    useEffect(() => {
        fetchTrucks();
    }, [currentPage]);

    const fetchTrucks = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/addtruckdeatils?page=${currentPage}&limit=${itemsPerPage}`);

            if (!response.ok) {
                throw new Error('Failed to fetch truck data');
            }

            const data = await response.json();
            console.log('Truck data:', data);
            setTrucks(data.data || []);
            setTotalPages(data.pagination?.totalPages || 1);
        } catch (error) {
            showMessage('Failed to fetch trucks: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'year' ? (value ? parseInt(value) : '') : value
        }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Form validation
        if (!formData.model || !formData.make || !formData.year) {
            showMessage('Please fill in all required fields', 'error');
            return;
        }
        console.log(formData.model, formData.make, formData.year)

        if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
            showMessage('Please enter a valid year between 1900 and ' + (new Date().getFullYear() + 1), 'error');
            return;
        }

        setLoading(true);

        try {
            let response;
            if (editId) {
                // Update existing truck
                response = await axios.put(`/api/addtruckdeatils`, {
                    id: editId,
                    ...formData
                });
                showMessage('Truck updated successfully', 'success');
            } else {
                // Create new truck
                response = await axios.post('/api/addtruckdeatils', formData);
                showMessage('Truck added successfully', 'success');

            }

            console.log('Truck response:', response.data);
            setFormData({ model: '', make: '', year: '' });
            setEditId(null);
            fetchTrucks();
        } catch (error) {
            showMessage(error.response?.data?.message || error.message || 'Failed to save truck', 'error');
            console.error('Error:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCSVUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            showMessage('Please select a CSV file', 'error');
            return;
        }

        // Validate file type
        if (!file.name.toLowerCase().endsWith('.csv')) {
            showMessage('Please upload a valid CSV file', 'error');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/api/addtruckdeatils', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            showMessage(`CSV uploaded successfully. ${response.data.imported || 0} trucks imported.`, 'success');
            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            fetchTrucks();
        } catch (error) {
            console.log('CSV upload error:', error.response?.data || error.message);
            showMessage(error.response?.data?.message || error.message || 'Failed to upload CSV', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (truck) => {
        setFormData({
            model: truck.modal,
            make: truck.make,
            year: truck.year
        });
        setEditId(truck._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this truck?')) return;

        setLoading(true);
        try {
            await axios.delete('/api/addtruckdeatils', { data: { id } });
            showMessage('Truck deleted successfully', 'success');

            // Reset to first page if the last item on the current page was deleted
            if (trucks.length === 1 && currentPage > 1) {
                setCurrentPage(prev => prev - 1);
            } else {
                fetchTrucks();
            }
        } catch (error) {
            showMessage(error.response?.data?.message || error.message || 'Failed to delete truck', 'error');
        } finally {
            setLoading(false);
        }
    };

    const downloadSampleCSV = () => {
        try {
            const blob = new Blob([sampleCSV], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'truck_details_sample.csv';
            document.body.appendChild(a);
            a.click();

            // Clean up
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);

            showMessage('Sample CSV downloaded successfully', 'success');
        } catch (error) {
            showMessage('Failed to download sample: ' + error.message, 'error');
        }
    };

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const { source, destination } = result;
        if (source.index === destination.index) return;

        const items = Array.from(trucks);
        const [reorderedItem] = items.splice(source.index, 1);
        items.splice(destination.index, 0, reorderedItem);
        setTrucks(items);
    };

    const paginate = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    const renderPaginationControls = () => {
        if (totalPages <= 1) return null;

        const pageNumbers = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            pageNumbers.push(1);
            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            if (endPage - startPage < maxVisiblePages - 3) {
                if (currentPage < totalPages / 2) {
                    endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);
                } else {
                    startPage = Math.max(2, endPage - (maxVisiblePages - 3));
                }
            }

            if (startPage > 2) {
                pageNumbers.push('...');
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            if (endPage < totalPages - 1) {
                pageNumbers.push('...');
            }

            pageNumbers.push(totalPages);
        }

        return (
            <div className="flex justify-center mt-4">
                <nav className="inline-flex rounded-md shadow">
                    <button
                        onClick={() => paginate(1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="First page"
                    >
                        First
                    </button>
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border-t border-b border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Previous page"
                    >
                        Prev
                    </button>

                    {pageNumbers.map((number, index) => (
                        number === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-3 py-1 border-t border-b border-gray-300 bg-white text-gray-500">
                                ...
                            </span>
                        ) : (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`px-3 py-1 border-t border-b border-gray-300 ${currentPage === number
                                    ? 'bg-black-500 text-white font-bold'
                                    : 'bg-white text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                {number}
                            </button>
                        )
                    ))}

                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border-t border-b border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Next page"
                    >
                        Next
                    </button>
                    <button
                        onClick={() => paginate(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Last page"
                    >
                        Last
                    </button>
                </nav>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Truck Details Management</h1>

            {message.text && (
                <div
                    className={`mb-4 p-4 rounded flex items-center justify-between ${message.type === 'success'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                        }`}
                >
                    <span>{message.text}</span>
                    <button
                        onClick={() => setMessage({ text: '', type: '' })}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Close message"
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Truck Form */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        {editId ? (
                            <>
                                <Edit size={20} className="mr-2" />
                                Edit Truck
                            </>
                        ) : (
                            <>Add New Truck</>
                        )}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-2 font-medium" htmlFor="model">
                                Model <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="model"
                                name="model"
                                value={formData.model}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                                required
                                placeholder="E.g. F-150, Silverado"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2 font-medium" htmlFor="make">
                                Make <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="make"
                                name="make"
                                value={formData.make}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                                required
                                placeholder="E.g. Ford, Chevrolet"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2 font-medium" htmlFor="year">
                                Year <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="year"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                                required
                                min="1900"
                                max={new Date().getFullYear() + 1}
                                placeholder={new Date().getFullYear().toString()}
                            />
                        </div>
                        <div className="flex space-x-2 pt-2">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 transition duration-200 flex items-center justify-center min-w-24"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    <span>{editId ? 'Update Truck' : 'Add Truck'}</span>
                                )}
                            </button>
                            {editId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData({ model: '', make: '', year: '' });
                                        setEditId(null);
                                    }}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* CSV Upload */}
                <div className="bg-white p-6 rounded-lg shadow-md ">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <Upload size={20} className="mr-2" />
                        Upload Truck Data CSV
                    </h2>
                    <form onSubmit={handleCSVUpload} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-2 font-medium" htmlFor="csv-upload">
                                Select CSV File
                            </label>
                            <input
                                type="file"
                                id="csv-upload"
                                ref={fileInputRef}
                                accept=".csv"
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                                required
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                CSV should have columns: model, make, year
                            </p>
                        </div>
                        <div className="flex space-x-2 pt-2">
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-300 transition duration-200 flex items-center"
                                disabled={loading || !file}
                            >
                                <Upload size={16} className="mr-2" />
                                {loading ? 'Uploading...' : 'Upload CSV'}
                            </button>
                            <button
                                type="button"
                                onClick={downloadSampleCSV}
                                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-200 flex items-center"
                            >
                                <Download size={16} className="mr-2" />
                                Download Sample
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Trucks List */}
            <div className="mt-12">
                <h2 className="text-2xl font-semibold mb-4">Truck List</h2>
                {loading && !trucks.length ? (
                    <div className="flex justify-center">
                        <div className="animate-pulse flex space-x-4">
                            <div className="flex-1 space-y-4 py-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : trucks.length === 0 ? (
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <p className="text-gray-600">No trucks found. Add some trucks or upload a CSV.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="trucks">
                                {(provided) => (
                                    <table
                                        className="min-w-full"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        <thead className="bg-gray-800 text-white">
                                            <tr>
                                                <th className="py-3 px-4 text-left w-16">#</th>
                                                <th className="py-3 px-4 text-left">Model</th>
                                                <th className="py-3 px-4 text-left">Make</th>
                                                <th className="py-3 px-4 text-left">Year</th>
                                                <th className="py-3 px-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-700">
                                            {trucks.map((truck, index) => (
                                                <Draggable key={truck._id} draggableId={truck._id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <tr
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            className={`border-b border-gray-200 ${snapshot.isDragging
                                                                ? 'bg-blue-50'
                                                                : 'hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            <td className="py-3 px-4 flex items-center">
                                                                <span className="mr-2">
                                                                    {(currentPage - 1) * itemsPerPage + index + 1}
                                                                </span>
                                                                <div
                                                                    {...provided.dragHandleProps}
                                                                    className="cursor-grab hover:bg-gray-200 p-1 rounded"
                                                                >
                                                                    <MoveVertical size={16} className="text-gray-500" />
                                                                </div>
                                                            </td>
                                                            <td className="py-3 px-4">{truck.modal}</td>
                                                            <td className="py-3 px-4">{truck.make}</td>
                                                            <td className="py-3 px-4">{truck.year}</td>
                                                            <td className="py-3 px-2 text-right">
                                                                <button
                                                                    onClick={() => handleEdit(truck)}
                                                                    className="text-blue-600 hover:text-blue-800 p-1 mr-2"
                                                                    aria-label="Edit truck"
                                                                >
                                                                    <Edit size={18} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(truck._id)}
                                                                    className="text-red-600 hover:text-red-800 p-1"
                                                                    aria-label="Delete truck"
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </tbody>
                                    </table>
                                )}
                            </Droppable>
                        </DragDropContext>

                        {/* Pagination */}
                        {renderPaginationControls()}
                    </div>


                )}
            </div>
        </div>
    );
}