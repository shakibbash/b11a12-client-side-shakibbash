import React, { useState } from "react";
import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import useAuth from "../Hooks/useAuth";
import { FaExclamationTriangle, FaUser, FaEye } from "react-icons/fa";

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

  // Fetch comments
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const res = await axios.get(`/comments?postId=${postId}`);
      return res.data;
    },
  });

  // Report mutation
  const reportMutation = useMutation({
    mutationFn: async ({ commentId }) =>
      await axios.patch(`/comments/report/${commentId}`),
    onSuccess: (_, { commentId }) => {
      setReportedComments((prev) => ({ ...prev, [commentId]: true }));
      queryClient.invalidateQueries(["comments", postId]);
    },
  });

  if (isLoading) return <p className="text-center mt-10">Loading comments...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-xl border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Comments
      </h2>

      <div className="overflow-x-auto">
        <table className="table w-full  rounded-xl">
          <thead className="bg-blue-400 text-white">
            <tr>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Comment</th>
              <th className="py-3 px-4">Feedback</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((c) => {
              const isOwner = user?.email && c.userEmail === user.email;
              const isReported = reportedComments[c._id] || c.reported;
              const hasSelectedFeedback = !!selectedFeedback[c._id];

              return (
                <tr
                  key={c._id}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  {/* User */}
                  <td className="py-3 px-4 flex items-center gap-2">
                    <FaUser className="text-indigo-600" />
                    <span className="font-medium text-gray-700">
                      {c.userEmail}
                    </span>
                  </td>

                  {/* Comment */}
                  <td className="py-3 px-2 text-gray-600">
                    {c.text.length > 20 ? (
                      <>
                        {c.text.slice(0, 20)}...
                        <button
                          className="ml-1 text-indigo-600 underline text-sm flex items-center gap-1"
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
                  </td>

                  {/* Feedback Dropdown */}
                  <td className="py-3 px-4">
                    <select
                      className="select select-bordered w-full max-w-xs"
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
                  <td className="py-3 px-4 text-center">
                    <button
                      className={`btn btn-sm gap-2 rounded-lg shadow-md ${
                        isReported || isOwner
                          ? "btn-disabled bg-gray-400 text-white"
                          : "btn-error text-white hover:bg-red-600"
                      }`}
                      disabled={!hasSelectedFeedback || isReported || isOwner}
                      onClick={() =>
                        reportMutation.mutate({ commentId: c._id })
                      }
                    >
                      <FaExclamationTriangle />
                      {isReported ? "Reported" : "Report"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Read More Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Full Comment
            </h3>
            <p className="mb-6 text-gray-700">{modalComment}</p>
            <div className="flex justify-end">
              <button
                className="btn btn-primary"
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
