import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const Home = () => {
  const axios = useAxiosSecure();

  // Fetch all public posts
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["allPosts"],
    queryFn: async () => {
      const res = await axios.get("/posts"); // fetch all posts from backend
      return res.data.filter(post => post.visibility === "public");
    },
  });

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">All Posts</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post._id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            {/* Post Image */}
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
            )}

            {/* Post Title (Clickable) */}
            <Link
              to={`/post/${post._id}`}
              className="text-xl font-semibold text-blue-600 hover:underline"
            >
              {post.title}
            </Link>

            {/* Author Info */}
            <div className="flex items-center gap-2 mt-2">
              <img
                src={post.authorImage || "https://via.placeholder.com/40"}
                alt={post.authorName}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-gray-700 text-sm">{post.authorName}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-200 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Votes / Date */}
            <div className="flex justify-between items-center mt-3 text-gray-600 text-sm">
              <span>👍 {post.upVote} | 👎 {post.downVote}</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
