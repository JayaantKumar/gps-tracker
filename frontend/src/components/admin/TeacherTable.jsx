import React from 'react';

const TeacherTable = ({ teachers }) => {
  const getBufferTime = (bufferExpiresAt) => {
    if (!bufferExpiresAt) return 'N/A';
    const expires = new Date(bufferExpiresAt).getTime();
    const now = new Date().getTime();
    const diff = expires - now;

    if (diff <= 0) return <span className="text-red-500">Expired</span>;

    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return (
      <span className="text-blue-600">{`${minutes}m ${seconds}s`}</span>
    );
  };

  const formatTimestamp = (ts) => {
    if (!ts) return 'N/A';
    return new Date(ts).toLocaleTimeString();
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Name
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Last Seen
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Buffer Window
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {teachers.length === 0 && (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                No teachers found.
              </td>
            </tr>
          )}
          {teachers.map((teacher) => (
            <tr key={teacher._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {teacher.name}
                </div>
                <div className="text-sm text-gray-500">{teacher.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {teacher.onPremises ? (
                  <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                    Inside
                  </span>
                ) : (
                  <span className="inline-flex px-2 text-xs font-semibold leading-5 text-red-800 bg-red-100 rounded-full">
                    Outside
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                {formatTimestamp(teacher.lastSeen)}
              </td>
              <td className="px-6 py-4 text-sm whitespace-nowrap">
                {getBufferTime(teacher.bufferExpiresAt)}
              </td>
              <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                <button className="text-indigo-600 hover:text-indigo-900">
                  Mark Manual
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherTable;