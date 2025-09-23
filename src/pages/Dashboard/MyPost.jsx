import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Table } from "antd";
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

  // Fetch user's posts only if user exists
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

  // Table columns
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => (
        <p className="truncate max-w-xs" title={text}>
          {text}
        </p>
      ),
    },
    {
      title: "Votes",
      key: "votes",
      render: (_, record) => (
        <div className="flex gap-4 items-center">
          <FaThumbsUp className="text-green-600" /> {record.upVote || 0}
          <FaThumbsDown className="text-red-600" /> {record.downVote || 0}
        </div>
      ),
    },
    {
      title: "Comments",
      key: "comments",
      render: (_,record) => (
        <div className="flex gap-2 items-center">
          <FaComment className="text-blue-500" /> {record.commentCount || 0}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<FaComment />}
            onClick={() => navigate(`/dashboard/comments/${record._id}`)}
          >
            Comment
          </Button>
          <Button danger icon={<FaTrash />} onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (!user) {
    return (
      <p className="text-red-500 text-center mt-10">
        Please log in to view your posts.
      </p>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Posts</h1>

      {posts.length === 0 && !isLoading ? (
        <p className="text-gray-500 mt-4">
          You have not posted anything yet. Start sharing your thoughts!
        </p>
      ) : (
        <Table
          columns={columns}
          dataSource={posts.map((post) => ({ ...post, key: post._id }))}
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default MyPosts;
