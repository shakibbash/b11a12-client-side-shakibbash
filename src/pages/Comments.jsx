import React, { useState } from "react";
import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import useAuth from "../Hooks/useAuth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaExclamationTriangle, FaEye, FaUser } from "react-icons/fa";

const feedbackOptions = ["Spam", "Abusive", "Irrelevant"];

const Comments = () => {
  const { postId } = useParams();
  const { user } = useAuth();
  const axios = useAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedFeedback, setSelectedFeedback] = useState({});
  const [reportedComments, setReportedComments] = useState({});
  const [modalComment, setModalComment] = useState(""); // store comment for modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const res = await axios.get(`/comments?postId=${postId}`);
      return res.data;
    },
  });

  const reportMutation = useMutation({
    mutationFn: async ({ commentId, feedback }) =>
      await axios.post("/reported-comments", { commentId, postId, feedback }),
    onSuccess: (_, { commentId }) => {
      toast.info("Comment reported!");
      setReportedComments((prev) => ({ ...prev, [commentId]: true }));
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  if (isLoading)
    return <p className="text-center mt-10">Loading comments...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>

      {!user && (
        <div className="text-center p-4 bg-yellow-100 border border-yellow-300 rounded mb-4">
          Please{" "}
          <a href="/login" className="text-blue-600 underline">
            login
          </a>{" "}
          to report comments.
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>
                <FaUser className="inline mr-1 text-gray-600" />
                Email
              </th>
              <th>
                <FaEye className="inline mr-1 text-gray-600" />
                Comment
              </th>
              <th>
                <FaExclamationTriangle className="inline mr-1 text-gray-600" />
                Feedback
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((c) => {
              const isOwner = user?.email && c.userEmail === user.email;
              const isReported = reportedComments[c._id];

              return (
                <tr key={c._id}>
                  <td className="flex items-center gap-2">
                    <FaUser className="text-gray-500" />
                    {c.userEmail}
                  </td>
                  <td>
                    {c.text.length > 20 ? (
                      <>
                        {c.text.slice(0, 20)}...
                        <button
                          className="ml-2 text-blue-600 underline btn btn-ghost btn-xs gap-1 flex items-center"
                          onClick={() => {
                            setModalComment(c.text);
                            setIsModalOpen(true);
                          }}
                        >
                          <FaEye /> Read More
                        </button>
                      </>
                    ) : (
                      c.text
                    )}
                  </td>
                  <td>
                    <select
                      className="select select-bordered w-full max-w-xs"
                      disabled={!user || isOwner || isReported}
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
                  <td>
                    <button
                      className={`btn btn-sm gap-2 ${
                        isReported ? "btn-disabled" : "btn-error"
                      }`}
                      disabled={
                        !user || !selectedFeedback[c._id] || isOwner || isReported
                      }
                      onClick={() =>
                        reportMutation.mutate({
                          commentId: c._id,
                          feedback: selectedFeedback[c._id],
                        })
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

      {/* Modal for Read More */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box relative">
            <h3 className="text-lg font-bold mb-4">Full Comment</h3>
            <p className="mb-4">{modalComment}</p>
            <div className="modal-action">
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

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Comments;
