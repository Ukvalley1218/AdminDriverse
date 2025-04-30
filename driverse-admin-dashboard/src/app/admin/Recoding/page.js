
"use client"
import React from 'react';
import { X } from 'lucide-react';

const CallRecoding = ({ isOpen, onClose, callData }) => {


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Call Recoding</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Caller Information</h3>
            <p><span className="font-medium">Name:</span> {callData.callerName}</p>
            <p><span className="font-medium">Service:</span> {callData.callerServiceType}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Receiver Information</h3>
            <p><span className="font-medium">Name:</span> {callData.receiverName}</p>
            <p><span className="font-medium">Service:</span> {callData.receiverServiceType}</p>
          </div>
        </div>

        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Call Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <p><span className="font-medium">Status:</span> 
              <span className={`ml-2 px-2 py-1 rounded ${
                callData.status === 'completed' ? 'bg-green-100 text-green-800' :
                callData.status === 'missed' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {callData.status}
              </span>
            </p>
            <p><span className="font-medium">Duration:</span> {callData.formattedDuration}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallRecoding;