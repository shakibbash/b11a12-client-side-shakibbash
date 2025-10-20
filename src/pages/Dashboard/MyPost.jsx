import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { FaThumbsUp, FaThumbsDown, FaComment, FaTrash, FaChevronLeft, FaChevronRight, FaEye, FaEdit } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const MyPost = () => {
  const { user } = useAuth();
  const axios = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["myPosts", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(`/user-posts/${user.email}`);
      return res.data;
    },
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(`/posts/${id}`);
        Swal.fire("Deleted!", res.data.message, "success");
        queryClient.invalidateQueries(["myPosts", user?.email]);

        const remainingPosts = posts.filter(post => post._id !== id);
        const totalPagesAfterDelete = Math.ceil(remainingPosts.length / postsPerPage);
        if (currentPage > totalPagesAfterDelete && totalPagesAfterDelete > 0) {
          setCurrentPage(totalPagesAfterDelete);
        }
      } catch {
        Swal.fire("Error!", "Failed to delete post.", "error");
      }
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const goToNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const goToPrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const goToPage = (pageNumber) => setCurrentPage(pageNumber);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      if (currentPage <= 3) pageNumbers.push(1, 2, 3, 4, '...', totalPages);
      else if (currentPage >= totalPages - 2) pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      else pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
    return pageNumbers;
  };

  if (!user) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-red-500 text-lg">Please log in to view your posts.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-2">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Posts</h1>
          <p className="text-gray-600">Manage and view all your published posts</p>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-gray-600 mt-4">Loading your posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <FaComment className="text-gray-300 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No posts yet</h3>
            <p className="text-gray-500 mb-6">Start sharing your thoughts with the community!</p>
            <button 
              onClick={() => navigate("/create-post")}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Create Your First Post
            </button>
          </div>
        ) : (
          <div>
            {/* Stats Summary */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Showing <span className="font-semibold text-gray-900">{indexOfFirstPost + 1}-{Math.min(indexOfLastPost, posts.length)}</span> of <span className="font-semibold text-gray-900">{posts.length}</span> posts</p>
                </div>
                <div className="text-sm text-gray-500">{postsPerPage} per page</div>
              </div>
            </div>

            {/* Table for medium+ screens */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Post Title</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Engagement</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentPosts.map(post => (
                    <tr key={post._id} className="hover:bg-gray-100 transition-colors">
                      {/* Title */}
                      <td className="px-6 py-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 line-clamp-2" title={post.title}>
                            {post.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </td>

                      {/* Engagement Stats */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <div className="bg-green-50 p-2 rounded-lg">
                              <FaThumbsUp className="text-green-600 w-4 h-4" />
                            </div>
                            <span className="font-medium text-gray-900">{post.upVote || 0}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="bg-red-50 p-2 rounded-lg">
                              <FaThumbsDown className="text-red-600 w-4 h-4" />
                            </div>
                            <span className="font-medium text-gray-900">{post.downVote || 0}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="bg-blue-50 p-2 rounded-lg">
                              <FaComment className="text-blue-600 w-4 h-4" />
                            </div>
                            <span className="font-medium text-gray-900">{post.commentCount || 0}</span>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/post/${post._id}`)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                          >
                            <FaEye className="w-4 h-4" />
                            View
                          </button>
                          <button
                            onClick={() => navigate(`/dashboard/comments/${post._id}`)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            <FaComment className="w-4 h-4" />
                            Comments
                          </button>
                          <button
                            onClick={() => handleDelete(post._id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                          >
                            <FaTrash className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card view for small screens */}
            <div className="md:hidden space-y-4">
              {currentPosts.map(post => (
                <div key={post._id} className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Engagement Stats */}
                  <div className="flex items-center justify-around mb-6 py-3 bg-gray-100 rounded-lg">
                    <div className="text-center">
                      <div className="flex items-center gap-1 justify-center text-green-600 mb-1">
                        <FaThumbsUp className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-gray-900">{post.upVote || 0}</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 justify-center text-red-600 mb-1">
                        <FaThumbsDown className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-gray-900">{post.downVote || 0}</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 justify-center text-blue-600 mb-1">
                        <FaComment className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-gray-900">{post.commentCount || 0}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => navigate(`/post/${post._id}`)}
                      className="flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                      <FaEye className="w-4 h-4" />
                      View Post
                    </button>
                    <button
                      onClick={() => navigate(`/dashboard/comments/${post._id}`)}
                      className="flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <FaComment className="w-4 h-4" />
                      Manage Comments
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      <FaTrash className="w-4 h-4" />
                      Delete Post
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={goToPrevPage}
                      disabled={currentPage === 1}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                        currentPage === 1 
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300" 
                          : "bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 border-gray-300"
                      }`}
                    >
                      <FaChevronLeft className="w-4 h-4" />
                      Previous
                    </button>

                    <div className="flex items-center gap-1">
                      {getPageNumbers().map((pageNum, index) => (
                        <React.Fragment key={index}>
                          {pageNum === "..." ? (
                            <span className="px-3 py-2 text-gray-500">...</span>
                          ) : (
                            <button
                              onClick={() => goToPage(pageNum)}
                              className={`min-w-[44px] h-10 flex items-center justify-center rounded-lg border transition-all ${
                                currentPage === pageNum 
                                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" 
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                              }`}
                            >
                              {pageNum}
                            </button>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                        currentPage === totalPages 
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300" 
                          : "bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 border-gray-300"
                      }`}
                    >
                      Next
                      <FaChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPost;