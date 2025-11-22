import React from 'react';
import { FaCircle } from 'react-icons/fa';
import BufferTimer from '../shared/BufferTimer'; // <--- Import the new timer

const TeacherTable = ({ teachers }) => {
  const getStatusColor = (isOnPremises) => {
    return isOnPremises 
      ? 'bg-green-100 text-green-700' 
      : 'bg-red-100 text-red-700';
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800">Active Teacher Roster</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-gray-500 uppercase bg-gray-50">
              <th className="px-6 py-4">Teacher Name</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Log</th>
              <th className="px-6 py-4">Buffer Window</th> {/* Renamed Header */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {teachers.map((teacher) => (
              <tr key={teacher._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 mr-3 font-bold text-indigo-600 bg-indigo-100 rounded-full">
                      {teacher.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{teacher.name}</p>
                      <p className="text-xs text-gray-500">{teacher.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(teacher.onPremises)}`}>
                    <FaCircle className="w-2 h-2 mr-1.5" />
                    {teacher.onPremises ? 'Inside Campus' : 'Outside'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatTime(teacher.lastSeen)}
                </td>
                <td className="px-6 py-4">
                   {/* Use the new Live Timer Component here */}
                   <BufferTimer expiresAt={teacher.bufferExpiresAt} />
                </td>
              </tr>
            ))}
            {teachers.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                  No teachers found in the system.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherTable;