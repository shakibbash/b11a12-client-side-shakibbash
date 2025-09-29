import React, { useState } from "react";
import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import useAuth from "../Hooks/useAuth";
import { 
  FaExclamationTriangle, 
  FaUser, 
  FaEye, 
  FaChevronLeft, 
  FaChevronRight,
  FaComment,
  FaSearch
} from "react-icons/fa";
import Swal from "sweetalert2";

const feedbackOptions = [
  "Spam or misleading",
  "Harassment or abusive",
  "Irrelevant or off-topic",
];

const Comments = () => {
  const { postId } = useParams();
  const { user } = useAuth();
  const axios = useAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedFeedback, setSelectedFeedback] = useState({});
  const [reportedComments, setReportedComments] = useState({});
  const [modalComment, setModalComment] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch comments
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const res = await axios.get(`/comments?postId=${postId}`);
      return res.data;
    },
  });

  // Filter comments based on search
  const filteredComments = comments.filter(comment =>
    comment.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = filteredComments.slice(indexOfFirstComment, indexOfLastComment);
  const totalPages = Math.ceil(filteredComments.length / commentsPerPage);

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

  // Report mutation
  const reportMutation = useMutation({
    mutationFn: async ({ commentId, reason }) =>
      await axios.patch(`/comments/report/${commentId}`, {
        userEmail: user.email,
        reason,
      }),
    onSuccess: (_, { commentId }) => {
      setReportedComments((prev) => ({ ...prev, [commentId]: true }));
      queryClient.invalidateQueries(["comments", postId]);
      setSelectedFeedback((prev) => ({ ...prev, [commentId]: "" }));

      // SweetAlert2 success message
      Swal.fire({
        icon: "success",
        title: "Report Submitted",
        text: "Thank you for helping us maintain a safe community. The comment has been reported to moderators.",
        timer: 3000,
        showConfirmButton: false,
        background: '#f0f9ff',
        iconColor: '#10b981'
      });
    },
    onError: (err) => {
      console.error("Report failed:", err.response?.data?.message || err.message);
      Swal.fire({
        icon: "error",
        title: "Report Failed",
        text: "Something went wrong. Please try again.",
        background: '#fef2f2',
        iconColor: '#ef4444'
      });
    },
  });

  // Handle report with confirmation
  const handleReport = (commentId, reason, commentText) => {
    Swal.fire({
      title: "Confirm Report",
      html: `
        <div class="text-left">
          <p class="text-gray-700 mb-3"><strong>Reason:</strong> ${reason}</p>
          <p class="text-gray-700 mb-4"><strong>Comment:</strong> "${commentText.length > 100 ? commentText.substring(0, 100) + '...' : commentText}"</p>
          <p class="text-sm text-gray-600">Are you sure you want to report this comment? This action cannot be undone.</p>
        </div>
      `,
      icon: "warning",
      iconColor: "#f59e0b",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Report It",
      cancelButtonText: "Cancel",
      background: '#fffbeb',
      customClass: {
        confirmButton: 'px-4 py-2 rounded-lg font-medium',
        cancelButton: 'px-4 py-2 rounded-lg font-medium'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        reportMutation.mutate({
          commentId,
          reason,
        });
      }
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <FaComment className="text-3xl text-blue-500" />
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
              Comments Management
            </h2>
            <p className="text-gray-500 text-sm lg:text-base mt-1">
              Manage and moderate post comments
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">{filteredComments.length}</div>
            <div className="text-xs text-gray-500">Total Comments</div>
          </div>
          <div className="w-px h-8 bg-gray-300"></div>
          <div className="text-center">
            <div className="text-xl font-bold text-red-600">
              {filteredComments.filter(c => c.reported).length}
            </div>
            <div className="text-xs text-gray-500">Reported</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search comments or users..."
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

      {/* Table Container */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-3 px-3 lg:px-4 text-left text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <FaUser className="text-white" />
                  <span className="hidden sm:inline">User</span>
                </div>
              </th>
              <th className="py-3 px-3 lg:px-4 text-left text-sm font-semibold">
                Comment
              </th>
              <th className="py-3 px-3 lg:px-4 text-left text-sm font-semibold hidden md:table-cell">
                Feedback
              </th>
              <th className="py-3 px-3 lg:px-4 text-center text-sm font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentComments.length > 0 ? (
              currentComments.map((c) => {
                const isOwner = user?.email && c.userEmail === user.email;
                const isReported = reportedComments[c._id] || c.reported;
                const hasSelectedFeedback = !!selectedFeedback[c._id];

                return (
                  <tr
                    key={c._id}
                    className="hover:bg-gray-50 transition duration-200"
                  >
                    {/* User */}
                    <td className="py-3 px-3 lg:px-4">
                      <div className="flex items-center gap-2">
                        <FaUser className="text-indigo-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="font-medium text-gray-700 text-sm block truncate max-w-[120px] lg:max-w-[200px]">
                            {c.userEmail}
                          </span>
                          {isOwner && (
                            <span className="text-xs text-green-600 bg-green-100 px-1 rounded">
                              You
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Comment */}
                    <td className="py-3 px-3 lg:px-4">
                      <div className="text-gray-600 text-sm">
                        {c.text.length > 30 ? (
                          <>
                            {c.text.slice(0, 30)}...
                            <button
                              className="ml-1 text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1 transition-colors"
                              onClick={() => {
                                setModalComment(c.text);
                                setIsModalOpen(true);
                              }}
                            >
                              <FaEye className="inline" /> Read More
                            </button>
                          </>
                        ) : (
                          c.text
                        )}
                      </div>
                    </td>

                    {/* Feedback Dropdown - Hidden on mobile */}
                    <td className="py-3 px-3 lg:px-4 hidden md:table-cell">
                      <select
                        className="select select-bordered w-full max-w-xs text-sm"
                        disabled={isOwner || isReported}
                        value={selectedFeedback[c._id] || ""}
                        onChange={(e) =>
                          setSelectedFeedback((prev) => ({
                            ...prev,
                            [c._id]: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Feedback</option>
                        {feedbackOptions.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Report Button */}
                    <td className="py-3 px-3 lg:px-4 text-center">
                      <button
                        className={`btn btn-sm gap-2 rounded-lg shadow-sm text-xs ${
                          isReported || isOwner
                            ? "btn-disabled bg-gray-300 text-gray-500"
                            : hasSelectedFeedback
                            ? "btn-error text-white hover:bg-red-600"
                            : "btn-disabled bg-gray-200 text-gray-400"
                        }`}
                        disabled={!hasSelectedFeedback || isReported || isOwner}
                        onClick={() =>
                          handleReport(c._id, selectedFeedback[c._id], c.text)
                        }
                      >
                        <FaExclamationTriangle />
                        <span className="hidden xs:inline">
                          {isReported ? "Reported" : "Report"}
                        </span>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <FaComment className="text-4xl text-gray-300" />
                    <p className="text-lg font-medium">No comments found</p>
                    <p className="text-sm">
                      {searchTerm ? "Try adjusting your search terms" : "No comments for this post yet"}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredComments.length > commentsPerPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          {/* Page Info */}
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{indexOfFirstComment + 1}</span> to{" "}
            <span className="font-semibold">
              {Math.min(indexOfLastComment, filteredComments.length)}
            </span> of{" "}
            <span className="font-semibold">{filteredComments.length}</span> comments
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
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
                        ? "bg-blue-500 text-white shadow-sm"
                        : "text-gray-600 hover:bg-white border border-gray-200"
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
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              <span className="hidden sm:inline">Next</span>
              <FaChevronRight className="text-xs" />
            </button>
          </div>

          {/* Page Size Info */}
          <div className="text-xs text-gray-500 hidden md:block">
            {commentsPerPage} per page
          </div>
        </div>
      )}

      {/* Read More Modal */}
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

export default Comments;