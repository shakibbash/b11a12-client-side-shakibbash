import React, { useState } from "react";
import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { 
  HiOutlineDotsVertical, 
  HiFlag, 
  HiBookmark, 
  HiUserAdd, 
  HiLink,
  HiOutlineShare
} from "react-icons/hi";
import { TbArrowBigUp, TbArrowBigDown } from "react-icons/tb";
import { Dialog } from "@headlessui/react";
import useAuth from "../Hooks/useAuth";
import { 
  FaRegComment, 
  FaEdit, 
  FaTrash, 
  FaReply, 
  FaUserCircle,
  FaCalendarAlt,
  FaEnvelope
} from "react-icons/fa";
import { BiUpvote, BiDownvote } from "react-icons/bi";

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
  const [editInputs, setEditInputs] = useState({});

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

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    });
  };

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
      toast.success("Comment added successfully!");
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
      toast.info("Comment reported to moderators!");
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
        toast.info("📋 Post URL copied to clipboard!");
      }
    } catch {
      toast.error("Failed to share the post.");
    }
  };

  if (postLoading) return (
    <div className="flex justify-center items-center min-h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
  
  if (!post) return (
    <div className="text-center mt-10 text-gray-500">
      <p className="text-lg">Post not found</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6 my-20">
      {/* Post Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Author Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src={post.authorImage || "/default-avatar.png"} 
                  alt={post.authorName} 
                  className="w-14 h-14 rounded-full border-4 border-indigo-100 object-cover"
                />
               
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-gray-900">{post.authorName || "Anonymous"}</h3>
                  {post.authorEmail && (
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                      Author
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  {post.authorEmail && (
                    <div className="flex items-center gap-1">
                      <FaEnvelope className="w-3 h-3" />
                      <span className="text-xs">{post.authorEmail}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <FaCalendarAlt className="w-3 h-3" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Post Actions Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <HiOutlineDotsVertical className="w-5 h-5 text-gray-600" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-10 py-2">
                  <button onClick={() => toast.info("Post reported to moderators")} className="flex items-center gap-3 px-4 py-2 w-full hover:bg-red-50 text-gray-700 text-sm">
                    <HiFlag className="text-red-500" /> Report Post
                  </button>
                  <button onClick={() => toast.success("Following this post")} className="flex items-center gap-3 px-4 py-2 w-full hover:bg-blue-50 text-gray-700 text-sm">
                    <HiUserAdd className="text-blue-500" /> Follow Post
                  </button>
                  <button onClick={() => toast.success("Post saved to your collection")} className="flex items-center gap-3 px-4 py-2 w-full hover:bg-green-50 text-gray-700 text-sm">
                    <HiBookmark className="text-green-500" /> Save Post
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="p-6">
          {post.image && (
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-80 object-cover rounded-xl mb-6 shadow-md"
            />
          )}
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            {post.description}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags?.map(tag => (
              <span 
                key={tag} 
                className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm rounded-full shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Engagement Stats */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Votes */}
              <div className="flex items-center gap-1 bg-white rounded-full shadow-sm px-4 py-2">
                <button
                  onClick={() => postVoteMutation.mutate({ id: post._id, type: "upvote" })}
                  className={`flex items-center gap-2 transition-all ${
                    userVote === "upvote" 
                      ? "text-green-600 font-bold transform scale-110" 
                      : "text-gray-600 hover:text-green-600 hover:scale-105"
                  }`}
                >
                  <BiUpvote className="w-5 h-5" />
                  <span className="font-semibold">{post.upVote || 0}</span>
                </button>
                
                <div className="w-px h-6 bg-gray-300 mx-2"></div>
                
                <button
                  onClick={() => postVoteMutation.mutate({ id: post._id, type: "downvote" })}
                  className={`flex items-center gap-2 transition-all ${
                    userVote === "downvote" 
                      ? "text-red-600 font-bold transform scale-110" 
                      : "text-gray-600 hover:text-red-600 hover:scale-105"
                  }`}
                >
                  <BiDownvote className="w-5 h-5" />
                  <span className="font-semibold">{post.downVote || 0}</span>
                </button>
              </div>

              {/* Comments */}
              <button
                onClick={() => setIsCommentModalOpen(true)}
                className="flex items-center gap-2 bg-white rounded-full shadow-sm px-4 py-2 text-gray-600 hover:text-indigo-600 hover:shadow-md transition-all"
              >
                <FaRegComment className="w-4 h-4" />
                <span className="font-semibold">{comments.length}</span>
                <span className="text-sm">Comments</span>
              </button>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-indigo-500 text-white rounded-full px-5 py-2 hover:bg-indigo-600 shadow-sm hover:shadow-md transition-all"
            >
              <HiOutlineShare className="w-4 h-4" />
              <span className="font-semibold">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comments Modal */}
      <Dialog open={isCommentModalOpen} onClose={() => setIsCommentModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Discussion</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {comments.length} comment{comments.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => setIsCommentModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Add Comment */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex gap-3">
                <img 
                  src={user?.photoURL || "/default-avatar.png"} 
                  alt={user?.displayName} 
                  className="w-10 h-10 rounded-full border-2 border-indigo-200"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={user ? "Share your thoughts..." : "Please login to comment"}
                    disabled={!user}
                    className="w-full bg-gray-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                    onKeyPress={(e) => e.key === 'Enter' && addCommentMutation.mutate(newComment)}
                  />
                  {user && (
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => addCommentMutation.mutate(newComment)}
                        disabled={!newComment.trim()}
                        className="bg-indigo-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                      >
                        Post Comment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {comments.filter(c => !c.parentId).map(c => {
                const replies = comments.filter(r => r.parentId === c._id);
                const isExpanded = expandedComments[c._id];

                return (
                  <div key={c._id} className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                    {/* Comment Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={c.userPhoto || "/default-avatar.png"} 
                          alt={c.userName} 
                          className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">{c.userName}</p>
                            {c.userEmail === post.authorEmail && (
                              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                                Author
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <FaEnvelope className="w-3 h-3" />
                            <span>{c.userEmail}</span>
                            <span>•</span>
                            <FaCalendarAlt className="w-3 h-3" />
                            <span>{formatDate(c.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Comment Actions Dropdown */}
                      {user && (
                        <div className="relative">
                          <button 
                            onClick={() => setCommentDropdownOpen(prev => ({ ...prev, [c._id]: !prev[c._id] }))} 
                            className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <HiOutlineDotsVertical className="w-4 h-4 text-gray-500" />
                          </button>
                          {commentDropdownOpen[c._id] && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-xl z-10 py-2">
                              {c.userEmail === user.email ? (
                                <>
                                  <button 
                                    onClick={() => setEditInputs(prev => ({ ...prev, [c._id]: c.text }))} 
                                    className="flex items-center gap-2 px-4 py-2 w-full hover:bg-blue-50 text-gray-700 text-sm"
                                  >
                                    <FaEdit className="text-blue-500" /> Edit
                                  </button>
                                  <button 
                                    onClick={() => deleteCommentMutation.mutate(c._id)} 
                                    className="flex items-center gap-2 px-4 py-2 w-full hover:bg-red-50 text-red-600 text-sm"
                                  >
                                    <FaTrash /> Delete
                                  </button>
                                </>
                              ) : (
                                <button 
                                  onClick={() => reportCommentMutation.mutate({ id: c._id, feedback: "Abusive" })} 
                                  disabled={reported[c._id]}
                                  className="flex items-center gap-2 px-4 py-2 w-full hover:bg-red-50 text-gray-700 text-sm disabled:opacity-50"
                                >
                                  <HiFlag className="text-red-500" /> 
                                  {reported[c._id] ? "Reported" : "Report"}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Comment Content */}
                    <div className="mb-3">
                      {editInputs[c._id] !== undefined ? (
                        <div className="space-y-2">
                          <textarea
                            value={editInputs[c._id]}
                            onChange={(e) => setEditInputs(prev => ({ ...prev, [c._id]: e.target.value }))}
                            className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            rows="3"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                if (editInputs[c._id].trim()) {
                                  editCommentMutation.mutate({ id: c._id, text: editInputs[c._id] });
                                  setEditInputs(prev => ({ ...prev, [c._id]: undefined }));
                                }
                              }}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditInputs(prev => ({ ...prev, [c._id]: undefined }))}
                              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-700 leading-relaxed">{c.text}</p>
                      )}
                    </div>

                    {/* Comment Actions */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <button 
                        onClick={() => commentVoteMutation.mutate({ id: c._id, type: "upvote" })} 
                        className="flex items-center gap-1 hover:text-green-600 transition-colors"
                      >
                        <BiUpvote className="w-4 h-4" /> {c.upvotes || 0}
                      </button>
                      <button 
                        onClick={() => commentVoteMutation.mutate({ id: c._id, type: "downvote" })} 
                        className="flex items-center gap-1 hover:text-red-600 transition-colors"
                      >
                        <BiDownvote className="w-4 h-4" /> {c.downvotes || 0}
                      </button>
                      
                      {user && (
                        <button 
                          onClick={() => setShowReplyInput(prev => ({ ...prev, [c._id]: !prev[c._id] }))} 
                          className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                        >
                          <FaReply className="w-3 h-3" /> Reply
                        </button>
                      )}
                    </div>

                    {/* Reply Input */}
                    {showReplyInput[c._id] && user && (
                      <div className="mt-4 pl-4 border-l-2 border-indigo-200">
                        <div className="flex gap-3">
                          <img 
                            src={user.photoURL || "/default-avatar.png"} 
                            alt={user.displayName} 
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-1">
                            <input
                              type="text"
                              value={replyInputs[c._id] || ""}
                              onChange={e => setReplyInputs(prev => ({ ...prev, [c._id]: e.target.value }))}
                              placeholder="Write a reply..."
                              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              onKeyPress={(e) => e.key === 'Enter' && addReplyMutation.mutate({ parentId: c._id, text: replyInputs[c._id] })}
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => {
                                  if (replyInputs[c._id]?.trim()) {
                                    addReplyMutation.mutate({ parentId: c._id, text: replyInputs[c._id] });
                                    setReplyInputs(prev => ({ ...prev, [c._id]: "" }));
                                    setShowReplyInput(prev => ({ ...prev, [c._id]: false }));
                                  }
                                }}
                                className="px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium"
                              >
                                Post Reply
                              </button>
                              <button
                                onClick={() => setShowReplyInput(prev => ({ ...prev, [c._id]: false }))}
                                className="px-3 py-1 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Nested Replies */}
                    {replies.length > 0 && (
                      <div className="mt-4">
                        {!isExpanded && (
                          <button 
                            onClick={() => setExpandedComments(prev => ({ ...prev, [c._id]: true }))} 
                            className="text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors"
                          >
                            👁️ View {replies.length} repl{replies.length === 1 ? 'y' : 'ies'}
                          </button>
                        )}
                        {isExpanded && (
                          <div className="space-y-4 mt-3">
                            <button 
                              onClick={() => setExpandedComments(prev => ({ ...prev, [c._id]: false }))} 
                              className="text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors"
                            >
                              🔼 Show less
                            </button>
                            {replies.map(r => (
                              <div key={r._id} className="bg-white rounded-xl p-3 border border-gray-200">
                                {/* Reply Header */}
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-2">
                                    <img 
                                      src={r.userPhoto || "/default-avatar.png"} 
                                      alt={r.userName} 
                                      className="w-8 h-8 rounded-full"
                                    />
                                    <div>
                                      <div className="flex items-center gap-1">
                                        <p className="font-semibold text-sm text-gray-900">{r.userName}</p>
                                        {r.userEmail === post.authorEmail && (
                                          <span className="text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full">
                                            Author
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <FaCalendarAlt className="w-2 h-2" />
                                        <span>{formatDate(r.createdAt)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Reply Content */}
                                <p className="text-sm text-gray-700 mb-2">{r.text}</p>

                                {/* Reply Actions */}
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                  <button 
                                    onClick={() => commentVoteMutation.mutate({ id: r._id, type: "upvote" })} 
                                    className="hover:text-green-600 transition-colors"
                                  >
                                    👍 {r.upvotes || 0}
                                  </button>
                                  <button 
                                    onClick={() => commentVoteMutation.mutate({ id: r._id, type: "downvote" })} 
                                    className="hover:text-red-600 transition-colors"
                                  >
                                    👎 {r.downvotes || 0}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              
              {comments.filter(c => !c.parentId).length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <FaRegComment className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No comments yet</p>
                  <p className="text-sm mt-1">Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Dialog>

      <ToastContainer position="top-right" />
    </div>
  );
};

export default PostDetails;