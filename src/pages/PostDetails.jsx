import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { 
  HiOutlineDotsVertical, 
  HiFlag, 
  HiBookmark, 
  HiUserAdd,
  HiOutlineShare,
  HiArrowLeft,
  HiOutlineEye,
  HiOutlineClock
} from "react-icons/hi";
import { Dialog } from "@headlessui/react";
import useAuth from "../Hooks/useAuth";
import { 
  FaRegComment, 
  FaEdit, 
  FaTrash, 
  FaReply, 
  FaCalendarAlt,
  FaEnvelope,
  FaShare,
  FaRegBookmark,
  FaBookmark
} from "react-icons/fa";
import { BiUpvote, BiDownvote, BiSolidUpvote, BiSolidDownvote } from "react-icons/bi";

const PostDetails = () => {
  const { postId } = useParams();
  const axios = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [commentDropdownOpen, setCommentDropdownOpen] = useState({});
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [newComment, setNewComment] = useState("");

  const [expandedComments, setExpandedComments] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [editInputs, setEditInputs] = useState({});
  const [savedPosts, setSavedPosts] = useState({});


  // Fetch post with related data
  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const response = await axios.get(`/posts/${postId}`);
      return response.data;
    },
    enabled: !!postId,
  });

  // Fetch comments
  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const response = await axios.get(`/comments?postId=${postId}`);
      return response.data;
    },
    enabled: !!postId,
  });

  // Fetch related posts
  const { data: relatedPosts = [] } = useQuery({
    queryKey: ["related-posts", post?.tags],
    queryFn: async () => {
      if (!post?.tags?.length) return [];
      const response = await axios.get(`/posts/related?tags=${post.tags.join(',')}&exclude=${postId}`);
      return response.data.slice(0, 4);
    },
    enabled: !!post?.tags?.length,
  });

  // Utility functions
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

  const calculateReadTime = (text) => {
    const wordsPerMinute = 200;
    const words = text?.split(/\s+/).length || 0;
    return Math.ceil(words / wordsPerMinute);
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
      toast.success("💬 Comment added successfully!");
    },
  });

  const editCommentMutation = useMutation({
    mutationFn: async ({ id, text }) => 
      await axios.patch(`/comments/${id}`, { text, userEmail: user.email }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("✏️ Comment updated!");
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (id) => 
      await axios.delete(`/comments/${id}`, { data: { userEmail: user?.email } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.error("🗑️ Comment deleted!");
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("↩️ Reply posted!");
    },
  });

  const savePostMutation = useMutation({
    mutationFn: async (postId) => {
      return await axios.post("/user/save-post", { postId, userEmail: user.email });
    },
    onSuccess: (_, postId) => {
      setSavedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
      toast.success(savedPosts[postId] ? "📚 Post removed from saved" : "🔖 Post saved!");
    },
  });

  // Event handlers
  const handleShare = async () => {
    if (!post) return;
    const shareUrl = `${window.location.origin}/post/${postId}`;
    try {
      if (navigator.share) {
        await navigator.share({ 
          title: post.title, 
          text: post.description, 
          url: shareUrl 
        });
        toast.success("📤 Post shared successfully!");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.info("📋 Post URL copied to clipboard!");
      }
    } catch {
      toast.error("❌ Failed to share the post.");
    }
  };

  const handleSavePost = () => {
    if (!user) {
      toast.info("🔐 Please login to save posts");
      return;
    }
    savePostMutation.mutate(postId);
  };

  // Loading states
  if (postLoading) return (
    <div className="flex justify-center items-center min-h-96">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
    </div>
  );
  
  if (!post) return (
    <div className="text-center mt-20 text-gray-500">
      <div className="text-6xl mb-4">📄</div>
      <p className="text-xl font-semibold">Post not found</p>
      <button 
        onClick={() => navigate('/')}
        className="mt-4 px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
      >
        Back to Home
      </button>
    </div>
  );

  return (
    <div className="max-w-8xl md:px-20 bg-gray-100 py-20 ">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 px-6 py-3 bg-white text-gray-700 hover:bg-gray-50 font-semibold rounded-xl transition-all duration-300 hover:shadow-lg border border-gray-200"
        >
          <HiArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Back to Feed</span>
        </button>
   
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-5">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Post Card */}
         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
  {/* Author Header */}
  <div className="p-4 sm:p-6 border-b border-gray-100">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="relative flex-shrink-0">
          <img 
            src={post.authorImage || "/default-avatar.png"} 
            alt={post.authorName} 
            className="w-14 h-14 rounded-full border-4 border-indigo-100 object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-lg text-gray-900 truncate">{post.authorName || "Anonymous"}</h3>
            {post.authorEmail && (
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
                Author
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-4 mt-1 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <FaCalendarAlt className="w-4 h-4" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <HiOutlineClock className="w-4 h-4" />
              <span>{calculateReadTime(post.description)} min read</span>
            </div>
            <div className="flex items-center gap-1">
              <HiOutlineEye className="w-4 h-4" />
              <span>{post.views || 0} views</span>
            </div>
          </div>
        </div>
      </div>

      {/* Post Actions */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          onClick={handleSavePost}
          className="p-2 sm:p-3 hover:bg-gray-100 rounded-xl transition-colors"
          title="Save post"
        >
          {/* {savedPosts[postId] ? (
            <FaBookmark className="w-5 h-5 text-indigo-500" />
          ) : (
            <FaRegBookmark className="w-5 h-5 text-gray-500" />
          )} */}
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)} 
            className="p-2 sm:p-3 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <HiOutlineDotsVertical className="w-5 h-5 text-gray-600" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-10 py-2">
              <button 
                onClick={() => toast.info("📢 Post reported to moderators")} 
                className="flex items-center gap-2 px-4 py-2 w-full hover:bg-red-50 text-gray-700 text-sm"
              >
                <HiFlag className="text-red-500" /> Report Post
              </button>
              <button 
                onClick={() => toast.success("👤 Following this post")} 
                className="flex items-center gap-2 px-4 py-2 w-full hover:bg-blue-50 text-gray-700 text-sm"
              >
                <HiUserAdd className="text-blue-500" /> Follow Post
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>

  {/* Post Content */}
  <div className="p-4 sm:p-6">
    {post.image && (
      <img 
        src={post.image} 
        alt={post.title} 
        className="w-full h-64 sm:h-96 object-cover rounded-2xl mb-4 sm:mb-6 shadow-md"
      />
    )}
    
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
      {post.title}
    </h1>
    
    <div className="prose prose-sm sm:prose-lg max-w-none text-gray-700 leading-relaxed mb-4 sm:mb-6">
      {post.description}
    </div>
    
    {/* Tags */}
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {post.tags?.map(tag => (
        <span 
          key={tag} 
          className="px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs sm:text-sm rounded-full shadow-sm hover:shadow-md transition-shadow cursor-pointer font-medium"
        >
          #{tag}
        </span>
      ))}
    </div>
  </div>

  {/* Engagement Stats */}
  <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-100">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
      <div className="flex flex-wrap gap-2 sm:gap-6 items-center">
        {/* Votes */}
        <div className="flex items-center gap-1 bg-white rounded-full shadow-sm px-3 sm:px-4 py-2 sm:py-3">
          <button
            onClick={() => postVoteMutation.mutate({ id: post._id, type: "upvote" })}
            className={`flex items-center gap-1 sm:gap-2 transition-all ${
              post.userVote === "upvote" 
                ? "text-green-600 font-bold transform scale-110" 
                : "text-gray-600 hover:text-green-600 hover:scale-105"
            }`}
          >
            {post.userVote === "upvote" ? (
              <BiSolidUpvote className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <BiUpvote className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
            <span className="font-semibold text-sm sm:text-lg">{post.upVote || 0}</span>
          </button>
          
          <div className="w-px h-6 sm:h-8 bg-gray-300 mx-2 sm:mx-3"></div>
          
          <button
            onClick={() => postVoteMutation.mutate({ id: post._id, type: "downvote" })}
            className={`flex items-center gap-1 sm:gap-2 transition-all ${
              post.userVote === "downvote" 
                ? "text-red-600 font-bold transform scale-110" 
                : "text-gray-600 hover:text-red-600 hover:scale-105"
            }`}
          >
            {post.userVote === "downvote" ? (
              <BiSolidDownvote className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <BiDownvote className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
            <span className="font-semibold text-sm sm:text-lg">{post.downVote || 0}</span>
          </button>
        </div>

        {/* Comments */}
        <button
          onClick={() => setIsCommentModalOpen(true)}
          className="flex items-center gap-2 sm:gap-3 bg-white rounded-full shadow-sm px-3 sm:px-5 py-2 sm:py-3 text-gray-600 hover:text-indigo-600 hover:shadow-md transition-all"
        >
          <FaRegComment className="w-4 h-5" />
          <span className="font-semibold text-sm sm:text-lg">{comments.length}</span>
          <span className="text-xs sm:text-sm">Comments</span>
        </button>
      </div>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="flex items-center gap-2 sm:gap-3 bg-indigo-500 text-white rounded-full px-4 sm:px-6 py-2 sm:py-3 hover:bg-indigo-600 shadow-sm hover:shadow-md transition-all font-semibold"
      >
        <FaShare className="w-4 h-4 sm:w-4 sm:h-4" />
        <span className="text-sm sm:text-base">Share</span>
      </button>
    </div>
  </div>
</div>


          {/* Related Posts Grid */}
          {relatedPosts.length > 0 && (
            <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map(relatedPost => (
                  <div 
                    key={relatedPost._id}
                    onClick={() => navigate(`/post/${relatedPost._id}`)}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img 
                        src={relatedPost.authorImage || "/default-avatar.png"} 
                        alt={relatedPost.authorName}
                        className="w-10 h-10 rounded-full border-2 border-white"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{relatedPost.authorName}</p>
                        <p className="text-xs text-gray-500">{formatDate(relatedPost.createdAt)}</p>
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {relatedPost.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        <span>👍 {relatedPost.upVote || 0}</span>
                        <span>👎 {relatedPost.downVote || 0}</span>
                        <span>💬 {relatedPost.commentCount || 0}</span>
                      </div>
                      <span>{calculateReadTime(relatedPost.description)} min read</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Post Stats */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Post Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Views</span>
                <span className="font-semibold">{post.views || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Engagement Rate</span>
                <span className="font-semibold text-green-600">
                  {((((post.upVote || 0) + (post.downVote || 0) + (comments.length)) / (post.views || 1)) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Upvote Ratio</span>
                <span className="font-semibold">
                  {((post.upVote || 0) / ((post.upVote || 0) + (post.downVote || 1)) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {/* Author Info */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">About Author</h3>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={post.authorImage || "/default-avatar.png"} 
                alt={post.authorName}
                className="w-12 h-12 rounded-full border-2 border-indigo-100"
              />
              <div>
                <p className="font-semibold text-gray-900">{post.authorName}</p>
                <p className="text-sm text-gray-500">Post Author</p>
              </div>
            </div>
            {post.authorEmail && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <FaEnvelope className="w-4 h-4" />
                <span>{post.authorEmail}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaCalendarAlt className="w-4 h-4" />
              <span>Joined {formatDate(post.authorJoined || post.createdAt)}</span>
            </div>
          </div>

          {/* Trending Tags */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Trending Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags?.slice(0, 8).map(tag => (
                <span 
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-indigo-100 hover:text-indigo-700 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comments Modal */}
      <Dialog open={isCommentModalOpen} onClose={() => setIsCommentModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Discussion</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {comments.length} comment{comments.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => setIsCommentModalOpen(false)}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Add Comment */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex gap-4">
                <img 
                  src={user?.photoURL || "/default-avatar.png"} 
                  alt={user?.displayName} 
                  className="w-12 h-12 rounded-full border-2 border-indigo-200"
                />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={user ? "Share your thoughts..." : "Please login to comment"}
                    disabled={!user}
                    rows="3"
                    className="w-full bg-gray-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 resize-none"
                  />
                  {user && (
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-gray-500">
                        {newComment.length}/500 characters
                      </span>
                      <button
                        onClick={() => addCommentMutation.mutate(newComment)}
                        disabled={!newComment.trim() || newComment.length > 500}
                        className="bg-indigo-500 text-white px-8 py-2 rounded-full hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
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
              {commentsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse bg-gray-200 rounded-2xl p-4 h-24"></div>
                  ))}
                </div>
              ) : comments.filter(c => !c.parentId).map(comment => (
                <CommentItem 
                  key={comment._id}
                  comment={comment}
                  comments={comments}
                  post={post}
                  user={user}
                  formatDate={formatDate}
                  commentDropdownOpen={commentDropdownOpen}
                  setCommentDropdownOpen={setCommentDropdownOpen}
                  editInputs={editInputs}
                  setEditInputs={setEditInputs}
                  showReplyInput={showReplyInput}
                  setShowReplyInput={setShowReplyInput}
                  replyInputs={replyInputs}
                  setReplyInputs={setReplyInputs}
                  expandedComments={expandedComments}
                  setExpandedComments={setExpandedComments}
              
                  editCommentMutation={editCommentMutation}
                  deleteCommentMutation={deleteCommentMutation}
                  
                  commentVoteMutation={commentVoteMutation}
                  addReplyMutation={addReplyMutation}
                />
              ))}
              
              {comments.filter(c => !c.parentId).length === 0 && !commentsLoading && (
                <div className="text-center py-16 text-gray-500">
                  <FaRegComment className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-xl font-medium">No comments yet</p>
                  <p className="text-sm mt-2">Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Dialog>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

// Separate component for comment items to reduce complexity
const CommentItem = ({
  comment,
  comments,
  post,
  user,
  formatDate,
  commentDropdownOpen,
  setCommentDropdownOpen,
  editInputs,
  setEditInputs,
  showReplyInput,
  setShowReplyInput,
  replyInputs,
  setReplyInputs,
  expandedComments,
  setExpandedComments,
  reported,
  editCommentMutation,
  deleteCommentMutation,
  reportCommentMutation,
  commentVoteMutation,
  addReplyMutation
}) => {
  const replies = comments.filter(r => r.parentId === comment._id);
  const isExpanded = expandedComments[comment._id];

  return (
    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
      {/* Comment Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <img 
            src={comment.userPhoto || "/default-avatar.png"} 
            alt={comment.userName} 
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900">{comment.userName}</p>
              {comment.userEmail === post.authorEmail && (
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                  Author
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <FaCalendarAlt className="w-3 h-3" />
              <span>{formatDate(comment.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Comment Actions Dropdown */}
        {user && (
          <div className="relative">
            <button 
              onClick={() => setCommentDropdownOpen(prev => ({ ...prev, [comment._id]: !prev[comment._id] }))} 
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <HiOutlineDotsVertical className="w-4 h-4 text-gray-500" />
            </button>
            {commentDropdownOpen[comment._id] && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-xl z-10 py-2">
                {comment.userEmail === user.email ? (
                  <>
                    <button 
                      onClick={() => setEditInputs(prev => ({ ...prev, [comment._id]: comment.text }))} 
                      className="flex items-center gap-2 px-4 py-2 w-full hover:bg-blue-50 text-gray-700 text-sm"
                    >
                      <FaEdit className="text-blue-500" /> Edit
                    </button>
                    <button 
                      onClick={() => deleteCommentMutation.mutate(comment._id)} 
                      className="flex items-center gap-2 px-4 py-2 w-full hover:bg-red-50 text-red-600 text-sm"
                    >
                      <FaTrash /> Delete
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => reportCommentMutation.mutate({ id: comment._id, feedback: "Abusive" })} 
                    disabled={reported[comment._id]}
                    className="flex items-center gap-2 px-4 py-2 w-full hover:bg-red-50 text-gray-700 text-sm disabled:opacity-50"
                  >
                    <HiFlag className="text-red-500" /> 
                    {reported[comment._id] ? "Reported" : "Report"}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comment Content */}
      <div className="mb-4">
        {editInputs[comment._id] !== undefined ? (
          <div className="space-y-3">
            <textarea
              value={editInputs[comment._id]}
              onChange={(e) => setEditInputs(prev => ({ ...prev, [comment._id]: e.target.value }))}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows="3"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (editInputs[comment._id].trim()) {
                    editCommentMutation.mutate({ id: comment._id, text: editInputs[comment._id] });
                    setEditInputs(prev => ({ ...prev, [comment._id]: undefined }));
                  }
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
              >
                Save
              </button>
              <button
                onClick={() => setEditInputs(prev => ({ ...prev, [comment._id]: undefined }))}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 leading-relaxed">{comment.text}</p>
        )}
      </div>

      {/* Comment Actions */}
      <div className="flex items-center gap-6 text-sm text-gray-500">
        <button 
          onClick={() => commentVoteMutation.mutate({ id: comment._id, type: "upvote" })} 
          className={`flex items-center gap-2 transition-colors ${
            comment.userVote === "upvote" ? "text-green-600 font-semibold" : "hover:text-green-600"
          }`}
        >
          {comment.userVote === "upvote" ? (
            <BiSolidUpvote className="w-5 h-5" />
          ) : (
            <BiUpvote className="w-5 h-5" />
          )}
          <span>{comment.upvotes || 0}</span>
        </button>
        <button 
          onClick={() => commentVoteMutation.mutate({ id: comment._id, type: "downvote" })} 
          className={`flex items-center gap-2 transition-colors ${
            comment.userVote === "downvote" ? "text-red-600 font-semibold" : "hover:text-red-600"
          }`}
        >
          {comment.userVote === "downvote" ? (
            <BiSolidDownvote className="w-5 h-5" />
          ) : (
            <BiDownvote className="w-5 h-5" />
          )}
          <span>{comment.downvotes || 0}</span>
        </button>
        
        {user && (
          <button 
            onClick={() => setShowReplyInput(prev => ({ ...prev, [comment._id]: !prev[comment._id] }))} 
            className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
          >
            <FaReply className="w-4 h-4" /> 
            <span>Reply</span>
          </button>
        )}
      </div>

      {/* Reply Input */}
      {showReplyInput[comment._id] && user && (
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
                value={replyInputs[comment._id] || ""}
                onChange={e => setReplyInputs(prev => ({ ...prev, [comment._id]: e.target.value }))}
                placeholder="Write a reply..."
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addReplyMutation.mutate({ 
                  parentId: comment._id, 
                  text: replyInputs[comment._id] 
                })}
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => {
                    if (replyInputs[comment._id]?.trim()) {
                      addReplyMutation.mutate({ 
                        parentId: comment._id, 
                        text: replyInputs[comment._id] 
                      });
                      setReplyInputs(prev => ({ ...prev, [comment._id]: "" }));
                      setShowReplyInput(prev => ({ ...prev, [comment._id]: false }));
                    }
                  }}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium"
                >
                  Post Reply
                </button>
                <button
                  onClick={() => setShowReplyInput(prev => ({ ...prev, [comment._id]: false }))}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
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
          {!isExpanded ? (
            <button 
              onClick={() => setExpandedComments(prev => ({ ...prev, [comment._id]: true }))} 
              className="flex items-center gap-2 text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors"
            >
              <FaRegComment className="w-4 h-4" />
              <span>View {replies.length} repl{replies.length === 1 ? 'y' : 'ies'}</span>
            </button>
          ) : (
            <div className="space-y-4 mt-3">
              <button 
                onClick={() => setExpandedComments(prev => ({ ...prev, [comment._id]: false }))} 
                className="text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors"
              >
                ▲ Show less
              </button>
              {replies.map(reply => (
                <div key={reply._id} className="bg-white rounded-xl p-4 border border-gray-200">
                  {/* Reply Header */}
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <img 
                        src={reply.userPhoto || "/default-avatar.png"} 
                        alt={reply.userName} 
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="font-semibold text-sm text-gray-900">{reply.userName}</p>
                          {reply.userEmail === post.authorEmail && (
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full">
                              Author
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <FaCalendarAlt className="w-2 h-2" />
                          <span>{formatDate(reply.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reply Content */}
                  <p className="text-sm text-gray-700 mb-3">{reply.text}</p>

                  {/* Reply Actions */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <button 
                      onClick={() => commentVoteMutation.mutate({ id: reply._id, type: "upvote" })} 
                      className={`flex items-center gap-1 transition-colors ${
                        reply.userVote === "upvote" ? "text-green-600 font-semibold" : "hover:text-green-600"
                      }`}
                    >
                      <BiUpvote className="w-4 h-4" />
                      <span>{reply.upvotes || 0}</span>
                    </button>
                    <button 
                      onClick={() => commentVoteMutation.mutate({ id: reply._id, type: "downvote" })} 
                      className={`flex items-center gap-1 transition-colors ${
                        reply.userVote === "downvote" ? "text-red-600 font-semibold" : "hover:text-red-600"
                      }`}
                    >
                      <BiDownvote className="w-4 h-4" />
                      <span>{reply.downvotes || 0}</span>
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
};

export default PostDetails;