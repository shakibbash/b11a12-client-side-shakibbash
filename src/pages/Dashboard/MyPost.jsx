import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { FaThumbsUp, FaThumbsDown, FaComment, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
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
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#d33",
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

  if (!user) return <p className="text-red-500 text-center mt-10">Please log in to view your posts.</p>;

  return (
    <div className="p-4">
      {isLoading ? (
        <p className="text-gray-500 text-center mt-4">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500 mt-4">You have not posted anything yet. Start sharing your thoughts!</p>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4 text-center">My Posts</h1>
          <div className="mb-4 text-sm text-gray-600">
            Showing {indexOfFirstPost + 1}-{Math.min(indexOfLastPost, posts.length)} of {posts.length} posts
          </div>

          {/* Table for medium+ screens */}
         {/* Table for medium+ screens */}
<div className="hidden md:block overflow-x-auto bg-white p-5 rounded-xl shadow-md">
  <table className="table-auto min-w-full border-collapse">
    <thead className="bg-blue-400 text-white">
      <tr>
        <th className="p-2 text-left">Title</th>
        <th className="p-2 text-left">Votes</th>
        <th className="p-2 text-left">Comments</th>
        <th className="p-2 text-left">Actions</th>
      </tr>
    </thead>
    <tbody>
      {currentPosts.map(post => (
        <tr key={post._id} className="border-b hover:bg-gray-50">
          {/* Title */}
          <td className="p-2 max-w-xs truncate" title={post.title}>{post.title}</td>

          {/* Votes */}
          <td className="p-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <FaThumbsUp className="text-green-600" /> {post.upVote || 0}
              </div>
              <div className="flex items-center gap-1">
                <FaThumbsDown className="text-red-600" /> {post.downVote || 0}
              </div>
            </div>
          </td>

          {/* Comments */}
          <td className="p-2">
            <div className="flex items-center gap-1">
              <FaComment className="text-blue-500" /> {post.commentCount || 0}
            </div>
          </td>

          {/* Actions */}
          <td className="p-2 flex flex-wrap gap-2">
            <button
              className="btn btn-primary btn-sm flex items-center gap-1"
              onClick={() => navigate(`/dashboard/comments/${post._id}`)}
            >
              <FaComment /> Comment
            </button>
            <button
              className="btn btn-error btn-sm flex items-center gap-1"
              onClick={() => handleDelete(post._id)}
            >
              <FaTrash /> Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


          {/* Card view for small screens */}
          <div className="md:hidden flex flex-col gap-4">
            {currentPosts.map(post => (
              <div key={post._id} className="bg-white p-4 rounded-xl shadow-md flex flex-col gap-2">
                {/* Title */}
                <h2 className="font-bold truncate" title={post.title}>{post.title}</h2>

                {/* Votes and Comments */}
                <div className="flex justify-start gap-4 text-sm text-gray-700">
                  <div className="flex items-center gap-1">
                    <FaThumbsUp className="text-green-600" /> {post.upVote || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <FaThumbsDown className="text-red-600" /> {post.downVote || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <FaComment className="text-blue-500" /> {post.commentCount || 0}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    className="btn btn-primary btn-sm flex-1 flex items-center justify-center gap-1"
                    onClick={() => navigate(`/dashboard/comments/${post._id}`)}
                  >
                    <FaComment /> Comment
                  </button>
                  <button
                    className="btn btn-error btn-sm flex-1 flex items-center justify-center gap-1"
                    onClick={() => handleDelete(post._id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4 flex-wrap">
              <div className="text-sm text-gray-600">Page {currentPage} of {totalPages}</div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-all ${
                    currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-gray-300"
                  }`}
                >
                  <FaChevronLeft className="w-3 h-3" /> Previous
                </button>

                {getPageNumbers().map((pageNum, index) => (
                  <React.Fragment key={index}>
                    {pageNum === "..." ? (
                      <span className="px-3 py-2 text-gray-500">...</span>
                    ) : (
                      <button
                        onClick={() => goToPage(pageNum)}
                        className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg border transition-all ${
                          currentPage === pageNum ? "bg-blue-500 text-white border-blue-500 shadow-md" : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )}
                  </React.Fragment>
                ))}

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-all ${
                    currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-gray-300"
                  }`}
                >
                  Next <FaChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="text-sm text-gray-600">{postsPerPage} per page</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyPost;
