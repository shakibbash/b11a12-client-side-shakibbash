import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { FaThumbsUp, FaThumbsDown, FaComment, FaTrash } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const MyPosts = () => {
  const { user } = useAuth();
  const axios = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch user's posts
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["myPosts", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(`/user-posts/${user.email}`);
      return res.data; // posts now include commentCount
    },
  });

  // Delete post handler
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
      } catch (err) {
        Swal.fire("Error!", "Failed to delete post.", "error");
      }
    }
  };

  if (!user) {
    return (
      <p className="text-red-500 text-center mt-10">
        Please log in to view your posts.
      </p>
    );
  }

  return (
    <div className="p-4">
 

      {isLoading ? (
        <p className="text-gray-500 text-center mt-4">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500 mt-4">
          You have not posted anything yet. Start sharing your thoughts!
        </p>
      ) : (
        <div className="overflow-x-auto bg-white p-5 rounded-xl">
               <h1 className="text-2xl font-bold mb-4 text-center">My Posts</h1>
          <table className="table table-zebra w-full">
            {/* Table Head */}
            <thead className="bg-blue-400 text-white">
              <tr>
                <th>Title</th>
                <th>Votes</th>
                <th>Comments</th>
                <th>Actions</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {posts.map((post) => (
                <tr key={post._id}>
                  <td>
                    <p className="truncate max-w-xs" title={post.title}>
                      {post.title}
                    </p>
                  </td>
                  <td>
                    <div className="flex gap-2 items-center">
                      <FaThumbsUp className="text-green-600" /> {post.upVote || 0}
                      <FaThumbsDown className="text-red-600" /> {post.downVote || 0}
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-2 items-center">
                      <FaComment className="text-blue-500" /> {post.commentCount || 0}
                    </div>
                  </td>
                  <td className="flex gap-2">
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
          {/* Pagination */}
          <div className="flex justify-end mt-4">
            {/* You can add custom pagination here if needed */}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPosts;
