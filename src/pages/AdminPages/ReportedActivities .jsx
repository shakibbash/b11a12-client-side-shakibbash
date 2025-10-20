import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { 
  FaUser, 
  FaEye, 
  FaEllipsisV, 
  FaExclamationTriangle,
  FaCalendarAlt,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaFlag,
  FaUserShield
} from "react-icons/fa";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const ReportedActivities = () => {
  const axios = useAxiosSecure();
  const queryClient = useQueryClient();
  const [modalComment, setModalComment] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Fetch all reports
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const res = await axios.get("/admin/reports");
      return res.data;
    },
  });

  // Filter reports based on search and status
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.commentId?.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.commentId?.text?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || report.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // Take action on a report
  const actionMutation = useMutation({
    mutationFn: async ({ reportId, action }) =>
      await axios.patch(`/admin/reports/${reportId}/action`, { action }),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["reports"]);
      Swal.fire({
        icon: "success",
        title: "Action Completed!",
        text: data.data.message || "Action completed successfully",
        timer: 2000,
        showConfirmButton: false,
        background: '#f0f9ff',
        iconColor: '#10b981'
      });
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Action Failed!",
        text: err.response?.data?.message || "Something went wrong",
        background: '#fef2f2',
        iconColor: '#ef4444'
      });
    },
  });

  const actionOptions = [
    { label: "Mark as Reviewed", value: "Reviewed", color: "blue" },
    { label: "Delete Comment", value: "DeleteComment", color: "red" },
    { label: "Warn User", value: "WarnUser", color: "orange" },
    { label: "Dismiss Report", value: "Dismiss", color: "gray" },
  ];

  const statusOptions = ["All", "Pending", "Reviewed", "ActionTaken", "Dismissed"];

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: "⏳" },
      Reviewed: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: "👁️" },
      ActionTaken: { color: "bg-red-100 text-red-800 border-red-200", icon: "⚡" },
      Dismissed: { color: "bg-gray-100 text-gray-800 border-gray-200", icon: "✅" },
    };
    
    const config = statusConfig[status] || statusConfig.Pending;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <span>{config.icon}</span>
        {status}
      </span>
    );
  };

  if (isLoading) return (
     <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="text-gray-600 mt-4 font-medium">
        Loading 
        </p>
        <p className="text-gray-400 text-sm mt-2">Please wait a moment</p>
      </div>
  );

  return (
    <div className="p-4 lg:p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <FaExclamationTriangle className="text-3xl text-red-500" />
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
              Reported Activities
            </h2>
            <p className="text-gray-500 text-sm lg:text-base mt-1">
              Manage and review reported comments
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 bg-white rounded-lg p-3 border border-gray-200">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">{filteredReports.length}</div>
            <div className="text-xs text-gray-500">Total Reports</div>
          </div>
          <div className="w-px h-8 bg-gray-300"></div>
          <div className="text-center">
            <div className="text-xl font-bold text-yellow-600">
              {filteredReports.filter(r => r.status === 'Pending').length}
            </div>
            <div className="text-xs text-gray-500">Pending</div>
          </div>
          <div className="w-px h-8 bg-gray-300"></div>
          <div className="text-center">
            <div className="text-xl font-bold text-red-600">
              {filteredReports.filter(r => r.status === 'ActionTaken').length}
            </div>
            <div className="text-xs text-gray-500">Action Taken</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search reports, users, or reasons..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Status Filter */}
        <div className="w-full lg:w-48">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            {statusOptions.map(option => (
              <option key={option} value={option}>
                {option === "All" ? "All Status" : option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full">
          <thead className="bg-red-500 text-white">
            <tr>
              <th className="py-3 px-3 lg:px-4 text-left text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <FaUser className="text-white" />
                  <span className="hidden sm:inline">Comment Author</span>
                </div>
              </th>
              <th className="py-3 px-3 lg:px-4 text-left text-sm font-semibold">
                Comment
              </th>
              <th className="py-3 px-3 lg:px-4 text-left text-sm font-semibold hidden md:table-cell">
                <div className="flex items-center gap-2">
                  <FaUserShield className="text-white" />
                  <span>Reported By</span>
                </div>
              </th>
              <th className="py-3 px-3 lg:px-4 text-left text-sm font-semibold hidden lg:table-cell">
                <div className="flex items-center gap-2">
                  <FaFlag className="text-white" />
                  <span>Reason</span>
                </div>
              </th>
              <th className="py-3 px-3 lg:px-4 text-left text-sm font-semibold hidden xl:table-cell">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-white" />
                  <span>Date</span>
                </div>
              </th>
              <th className="py-3 px-3 lg:px-4 text-left text-sm font-semibold">
                Status
              </th>
              <th className="py-3 px-3 lg:px-4 text-center text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentReports.length > 0 ? (
              currentReports.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50 transition duration-200">
                  {/* Comment Author */}
                  <td className="py-3 px-3 lg:px-4">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-indigo-600 flex-shrink-0" />
                      <span className="font-medium text-gray-700 text-sm truncate max-w-[120px]">
                        {r.commentId?.userEmail || "Unknown"}
                      </span>
                    </div>
                  </td>

                  {/* Comment */}
                  <td className="py-3 px-3 lg:px-4">
                    <div className="text-gray-600 text-sm">
                      {r.commentId?.text ? (
                        r.commentId.text.length > 25 ? (
                          <>
                            {r.commentId.text.slice(0, 25)}...
                            <button
                              className="ml-1 text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1 transition-colors"
                              onClick={() => {
                                setModalComment(r.commentId.text);
                                setIsModalOpen(true);
                              }}
                            >
                              <FaEye className="inline" /> Read More
                            </button>
                          </>
                        ) : (
                          r.commentId.text
                        )
                      ) : (
                        <span className="italic text-gray-400 text-xs">Comment deleted</span>
                      )}
                    </div>
                  </td>

                  {/* Reported By - Hidden on mobile */}
                  <td className="py-3 px-3 lg:px-4 text-gray-600 text-sm hidden md:table-cell">
                    {r.reportedBy}
                  </td>

                  {/* Reason - Hidden on smaller screens */}
                  <td className="py-3 px-3 lg:px-4 text-gray-600 text-sm hidden lg:table-cell">
                    {r.reason}
                  </td>

                  {/* Date - Hidden on smaller screens */}
                  <td className="py-3 px-3 lg:px-4 text-gray-600 text-sm hidden xl:table-cell">
                    {new Date(r.date).toLocaleDateString()}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 lg:px-4">
                    {getStatusBadge(r.status)}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 lg:px-4 text-center">
                    {r.status === "Pending" && (
                      <div className="dropdown dropdown-bottom dropdown-end">
                        <label tabIndex={0} className="btn btn-sm btn-outline border-gray-300 hover:bg-gray-50">
                          <FaEllipsisV className="text-gray-600" />
                        </label>
                        <ul
                          tabIndex={0}
                          className="dropdown-content menu p-2 shadow bg-white rounded-lg w-48 border border-gray-200 z-10"
                        >
                          {actionOptions.map((option) => (
                            <li key={option.value}>
                              <button
                                className={`text-sm hover:bg-${option.color}-50 text-${option.color}-700`}
                                onClick={() =>
                                  actionMutation.mutate({ reportId: r._id, action: option.value })
                                }
                              >
                                {option.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {r.status !== "Pending" && (
                      <span className="text-xs text-gray-400 italic">Completed</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-3">
                    <FaExclamationTriangle className="text-4xl text-gray-300" />
                    <p className="text-lg font-medium">No reports found</p>
                    <p className="text-sm">
                      {searchTerm || statusFilter !== "All" 
                        ? "Try adjusting your search or filters" 
                        : "No reported activities yet"
                      }
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredReports.length > reportsPerPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Page Info */}
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{indexOfFirstReport + 1}</span> to{" "}
            <span className="font-semibold">
              {Math.min(indexOfLastReport, filteredReports.length)}
            </span> of{" "}
            <span className="font-semibold">{filteredReports.length}</span> reports
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              <FaChevronLeft className="text-xs" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((number, index) =>
                number === '...' ? (
                  <span 
                    key={`ellipsis-${index}`} 
                    className="px-2 py-1 text-gray-500 text-sm"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`min-w-8 h-8 px-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === number
                        ? "bg-red-500 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {number}
                  </button>
                )
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              <span className="hidden sm:inline">Next</span>
              <FaChevronRight className="text-xs" />
            </button>
          </div>

          {/* Page Size Info */}
          <div className="text-xs text-gray-500 hidden md:block">
            {reportsPerPage} per page
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <FaEye className="text-blue-500" />
              Full Comment
            </h3>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-700 whitespace-pre-wrap">{modalComment}</p>
            </div>
            <div className="flex justify-end">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportedActivities;