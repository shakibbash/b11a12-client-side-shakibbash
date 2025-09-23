import React, { useState } from "react";
import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { HiOutlineDotsVertical, HiFlag, HiBookmark, HiUserAdd, HiLink } from "react-icons/hi";
import { TbArrowBigUp,TbArrowBigDown } from "react-icons/tb";
import { Dialog } from "@headlessui/react";
import useAuth from "../Hooks/useAuth";
import { FaRegComment } from "react-icons/fa";

const PostDetails = () => {
  const { postId } = useParams();
  const axios = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();
const [userVote, setUserVote] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [commentDropdownOpen, setCommentDropdownOpen] = useState({});
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [reported, setReported] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [editInputs, setEditInputs] = useState({}); // for inline edit

  // Fetch post
  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => (await axios.get(`/posts/${postId}`)).data,
    enabled: !!postId,
  });

  // Fetch comments
  const { data: comments = [] } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => (await axios.get(`/comments?postId=${postId}`)).data,
    enabled: !!postId,
  });

  // Mutations
  const addCommentMutation = useMutation({
    mutationFn: async (text) => {
      if (!user) throw new Error("You must be logged in to comment");
      return await axios.post("/comments", {
        postId,
        text,
        userEmail: user.email,
        userName: user.displayName,
        userPhoto: user.photoURL,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setNewComment("");
      toast.success("Comment added!");
    },
  });

  const editCommentMutation = useMutation({
    mutationFn: async ({ id, text }) => await axios.patch(`/comments/${id}`, { text, userEmail: user.email }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Comment updated!");
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (id) => await axios.delete(`/comments/${id}`, { data: { userEmail: user?.email } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.error("Comment deleted!");
    },
  });

  const reportCommentMutation = useMutation({
    mutationFn: async ({ id, feedback }) => await axios.patch(`/comments/report/${id}`, { feedback }),
    onSuccess: (_, { id }) => {
      setReported((prev) => ({ ...prev, [id]: true }));
      toast.info("Comment reported!");
    },
  });

 
const postVoteMutation = useMutation({
  mutationFn: async ({ id, type }) => {
    if (!user) throw new Error("You must be logged in to vote");
    return await axios.patch(`/posts/vote/${id}`, { type, userEmail: user.email });
  },
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["post", postId] }),
});



 const commentVoteMutation = useMutation({
  mutationFn: async ({ id, type }) => {
    if (!user) throw new Error("You must be logged in to vote");
    return await axios.patch(`/comments/vote/${id}`, { type, userEmail: user.email });
  },
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comments", postId] }),
});

  const addReplyMutation = useMutation({
    mutationFn: async ({ parentId, text }) => {
      if (!user) throw new Error("You must be logged in to reply");
      return await axios.post("/comments", {
        postId,
        text,
        parentId,
        userEmail: user.email,
        userName: user.displayName,
        userPhoto: user.photoURL,
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comments", postId] }),
  });

  const handleShare = async () => {
    if (!post) return;
    const shareUrl = `${window.location.origin}/post/${postId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, text: post.description, url: shareUrl });
        toast.success("Post shared successfully!");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.info("Post URL copied to clipboard!");
      }
    } catch {
      toast.error("Failed to share the post.");
    }
  };

  if (postLoading) return <p className="text-center mt-10">Loading post...</p>;
  if (!post) return <p className="text-center mt-10">Post not found</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md space-y-4">
      {/* Post Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <img src={post.authorImage || "https://via.placeholder.com/40"} alt={post.authorName} className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-semibold text-sm">{post.authorName}</p>
            <p className="text-gray-500 text-xs">{post.createdAt}</p>
          </div>
        </div>

        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="p-2 hover:bg-gray-100 rounded-full">
            <HiOutlineDotsVertical className="w-6 h-6 text-gray-600" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-10">
              <button onClick={() => toast.info("Reported this post")} className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-gray-700"><HiFlag /> Report Post</button>
              <button onClick={() => toast.success("You are now following this post")} className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-gray-700"><HiUserAdd /> Follow Post</button>
              <button onClick={() => toast.success("Post saved successfully")} className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-gray-700"><HiBookmark /> Save Post</button>
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      {post.image && <img src={post.image} alt={post.title} className=" object-cover rounded-lg" />}
      <div>
        <h1 className="text-xl font-bold mb-2">{post.title}</h1>
        <p className="text-gray-700 text-sm mb-2">{post.description}</p>
        <div className="flex flex-wrap gap-2">{post.tags?.map(tag => <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{tag}</span>)}</div>
      </div>

      {/* Action Buttons */}
   <div className="flex items-center gap-9 mt-5">
  <div className="flex flex-row items-center gap-4 bg-[#E8E8E8] px-3 py-1 rounded-4xl">
    <button
      onClick={() => postVoteMutation.mutate({ id: post._id, type: "upvote" })}
      className={`flex items-center gap-1 ${userVote === "upvote" ? "text-green-800 font-bold" : "text-green-600 hover:text-green-800"}`}
    >
      <TbArrowBigUp className="w-5 h-5" /> {post.upVote}
    </button>

    <button
      onClick={() => postVoteMutation.mutate({ id: post._id, type: "downvote" })}
      className={`flex items-center gap-1 ${userVote === "downvote" ? "text-red-800 font-bold" : "text-red-600 hover:text-red-800"}`}
    >
      <TbArrowBigDown  className="w-5 h-5" /> {post.downVote}
    </button>
  </div>

  <button
    onClick={() => setIsCommentModalOpen(true)}
    className="flex items-center gap-1 text-gray-600 hover:text-gray-800 bg-[#E8E8E8] px-3 py-1 rounded-4xl"
  >
    <FaRegComment  className="w-5 h-5" /> {comments.length}
  </button>

  <button
    onClick={handleShare}
    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-[#E8E8E8] px-3 py-1 rounded-4xl"
  >
    <HiLink className="w-5 h-5" /> Share
  </button>
</div>

   {/* Comments Modal */}
<Dialog open={isCommentModalOpen} onClose={() => setIsCommentModalOpen(false)} className="relative z-50">
  <div className="fixed inset-0 bg-black/30" />
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="bg-white rounded-lg p-6 w-full max-w-2xl px-auto space-y-4 relative">
      
      {/* Close Button Top Right */}
      <button
        onClick={() => setIsCommentModalOpen(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <h2 className="text-lg font-bold">Comments</h2>

      {/* Add Comment */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={user ? "Write a comment..." : "Login to comment"}
          disabled={!user}
          className="flex-1 bg-gray-100 rounded-4xl px-5 py-2"
        />
        <button
          onClick={() => addCommentMutation.mutate(newComment)}
          className={`rounded-4xl px-5 py-2 text-white ${user ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"}`}
          disabled={!user}
        >
          Comment
        </button>
      </div>
            {/* Comments List */}
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {comments.filter(c => !c.parentId).map(c => {
                const replies = comments.filter(r => r.parentId === c._id);
                const isExpanded = expandedComments[c._id];

                return (
                  <div key={c._id} className="bg-gray-200 rounded p-2">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2 items-center">
                        <img src={c.userPhoto || "https://via.placeholder.com/30"} alt={c.userName} className="w-8 h-8 rounded-full" />
                        <div>
                          <p className="font-semibold text-sm">{c.userName}</p>
                          <p className="text-xs text-gray-500">{c.createdAt}</p>
                        </div>
                      </div>

                      {user && (
                        <div className="relative">
                          <button onClick={() => setCommentDropdownOpen(prev => ({ ...prev, [c._id]: !prev[c._id] }))} className="p-1 rounded hover:bg-gray-100">
                            <HiOutlineDotsVertical />
                          </button>
                          {commentDropdownOpen[c._id] && (
                            <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow-md z-10">
                              {c.userEmail === user.email ? (
                                <button onClick={() => setEditInputs(prev => ({ ...prev, [c._id]: c.text }))} className="block px-4 py-2 hover:bg-gray-100 w-full text-left">Edit</button>
                              ) : (
                                <button onClick={() => reportCommentMutation.mutate({ id: c._id, feedback: "Abusive" })} className="block px-4 py-2 hover:bg-gray-100 w-full text-left" disabled={reported[c._id]}>
                                  {reported[c._id] ? "Reported" : "Report"}
                                </button>
                              )}
                              {c.userEmail === user.email && <button onClick={() => deleteCommentMutation.mutate(c._id)} className="block px-4 py-2 hover:bg-red-100 w-full text-left">Delete</button>}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Inline Edit or Text */}
                    <p className="mt-1 text-sm">
                      {editInputs[c._id] !== undefined ? (
                        <div className="flex gap-2 items-center mt-1">
                          <input
                            type="text"
                            value={editInputs[c._id]}
                            onChange={(e) => setEditInputs(prev => ({ ...prev, [c._id]: e.target.value }))}
                            className="border rounded px-2 py-1 w-full text-sm"
                            autoFocus
                          />
                          <button
                            onClick={() => {
                              if (editInputs[c._id].trim()) {
                                editCommentMutation.mutate({ id: c._id, text: editInputs[c._id] });
                                setEditInputs(prev => ({ ...prev, [c._id]: undefined }));
                              }
                            }}
                            className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                          >Save</button>
                          <button
                            onClick={() => setEditInputs(prev => ({ ...prev, [c._id]: undefined }))}
                            className="px-2 py-1 bg-gray-300 rounded text-xs hover:bg-gray-400"
                          >Cancel</button>
                        </div>
                      ) : (
                        c.text
                      )}
                    </p>

                    {/* Comment Actions */}
                    <div className="flex gap-3 mt-2 text-xs text-gray-500 items-center">
                      <button onClick={() => commentVoteMutation.mutate({ id: c._id, type: "upvote" })} className="hover:text-green-600">👍 {c.upvotes || 0}</button>
                      <button onClick={() => commentVoteMutation.mutate({ id: c._id, type: "downvote" })} className="hover:text-red-600">👎 {c.downvotes || 0}</button>

                      {/* Reply Inline Input */}
                      {user && (
                        <div className="flex flex-col">
                          <button onClick={() => setShowReplyInput(prev => ({ ...prev, [c._id]: !prev[c._id] }))} className="hover:text-blue-600 text-xs">Reply</button>
                          {showReplyInput[c._id] && (
                            <div className="flex gap-2 mt-1">
                              <input type="text" value={replyInputs[c._id] || ""} onChange={e => setReplyInputs(prev => ({ ...prev, [c._id]: e.target.value }))} placeholder="Write a reply..." className="flex-1 border rounded px-2 py-1 text-sm"/>
                              <button onClick={() => {
                                if (replyInputs[c._id]?.trim()) {
                                  addReplyMutation.mutate({ parentId: c._id, text: replyInputs[c._id] });
                                  setReplyInputs(prev => ({ ...prev, [c._id]: "" }));
                                  setShowReplyInput(prev => ({ ...prev, [c._id]: false }));
                                }
                              }} className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">Send</button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Nested Replies */}
                    {replies.length > 0 && (
                      <>
                        {!isExpanded && (
                          <button onClick={() => setExpandedComments(prev => ({ ...prev, [c._id]: true }))} className="text-blue-600 text-xs mt-1">
                            View all {replies.length} replies
                          </button>
                        )}
                        {isExpanded && (
                          <div className="ml-8 mt-2 space-y-2">
                            <button onClick={() => setExpandedComments(prev => ({ ...prev, [c._id]: false }))} className="text-blue-600 text-xs mt-1">View less</button>
                            {replies.map(r => (
                              <div key={r._id} className="border-l pl-2">
                                <div className="flex justify-between items-start">
                                  <div className="flex gap-2 items-center">
                                    <img src={r.userPhoto || "https://via.placeholder.com/30"} alt={r.userName} className="w-7 h-7 rounded-full" />
                                    <div>
                                      <p className="font-semibold text-sm">{r.userName}</p>
                                      <p className="text-xs text-gray-500">{r.createdAt}</p>
                                    </div>
                                  </div>
                                  {user && (
                                    <div className="relative">
                                      <button onClick={() => setCommentDropdownOpen(prev => ({ ...prev, [r._id]: !prev[r._id] }))} className="p-1 rounded hover:bg-gray-100">
                                        <HiOutlineDotsVertical />
                                      </button>
                                      {commentDropdownOpen[r._id] && (
                                        <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow-md z-10">
                                          {r.userEmail === user.email ? (
                                            <button onClick={() => setEditInputs(prev => ({ ...prev, [r._id]: r.text }))} className="block px-4 py-2 hover:bg-gray-100 w-full text-left">Edit</button>
                                          ) : (
                                            <button onClick={() => reportCommentMutation.mutate({ id: r._id, feedback: "Abusive" })} className="block px-4 py-2 hover:bg-gray-100 w-full text-left" disabled={reported[r._id]}>
                                              {reported[r._id] ? "Reported" : "Report"}
                                            </button>
                                          )}
                                          {r.userEmail === user.email && <button onClick={() => deleteCommentMutation.mutate(r._id)} className="block px-4 py-2 hover:bg-red-100 w-full text-left">Delete</button>}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Inline edit for reply */}
                                <p className="mt-1 text-sm">
                                  {editInputs[r._id] !== undefined ? (
                                    <div className="flex gap-2 items-center mt-1">
                                      <input
                                        type="text"
                                        value={editInputs[r._id]}
                                        onChange={(e) => setEditInputs(prev => ({ ...prev, [r._id]: e.target.value }))}
                                        className="border rounded px-2 py-1 w-full text-sm"
                                        autoFocus
                                      />
                                      <button
                                        onClick={() => {
                                          if (editInputs[r._id].trim()) {
                                            editCommentMutation.mutate({ id: r._id, text: editInputs[r._id] });
                                            setEditInputs(prev => ({ ...prev, [r._id]: undefined }));
                                          }
                                        }}
                                        className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                                      >Save</button>
                                      <button
                                        onClick={() => setEditInputs(prev => ({ ...prev, [r._id]: undefined }))}
                                        className="px-2 py-1 bg-gray-300 rounded text-xs hover:bg-gray-400"
                                      >Cancel</button>
                                    </div>
                                  ) : (
                                    r.text
                                  )}
                                </p>

                                {/* Reply Actions */}
                                <div className="flex gap-3 mt-1 text-xs text-gray-500 items-center">
                                  <button onClick={() => commentVoteMutation.mutate({ id: r._id, type: "upvote" })} className="hover:text-green-600">👍 {r.upvotes || 0}</button>
                                  <button onClick={() => commentVoteMutation.mutate({ id: r._id, type: "downvote" })} className="hover:text-red-600">👎 {r.downvotes || 0}</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Dialog>

      <ToastContainer />
    </div>
  );
};

export default PostDetails;
