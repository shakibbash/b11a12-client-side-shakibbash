import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";
import Swal from "sweetalert2";
import {
  UploadOutlined,
  UserOutlined,
  MailOutlined,
  InfoCircleOutlined,
  FileImageOutlined,
  TagsOutlined,
  BulbOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import { Upload, Button } from "antd";
import { FaBell, FaCrown, FaPenFancy, FaUsers } from "react-icons/fa";
import { NavLink } from "react-router";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const AddPost = () => {
  const { user } = useAuth();
  const axios = useAxiosSecure();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [postCount, setPostCount] = useState(0);
  const [visibility, setVisibility] = useState("public"); // <-- Visibility state

  // Fetch predefined tags
  const { data: tags = [], isLoading: tagsLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const res = await axios.get("/tags");
      return res.data.map((tag) => ({ value: tag.name, label: tag.name }));
    },
  });

  // Fetch user's posts to count
  const { data: userPosts = [], isLoading: postsLoading } = useQuery({
    queryKey: ["userPosts", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axios.get(`/posts?authorEmail=${user.email}`);
      return res.data;
    },
  });

  // Initialize local post count
  useEffect(() => {
    if (!postsLoading) setPostCount(userPosts.length);
  }, [userPosts, postsLoading]);

  // Image upload handler
  const handleUpload = async ({ file }) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      setImageUrl(data.secure_url);
      Swal.fire("Success", "Image uploaded!", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to upload image", "error");
    } finally {
      setUploading(false);
    }
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (postCount >= 5) {
      Swal.fire(
        "Limit Reached",
        "New users can only add up to 5 posts.",
        "warning"
      );
      return;
    }

    if (!title || !description || selectedTags.length === 0) {
      Swal.fire("Error", "Please fill all fields", "error");
      return;
    }

    try {
      await axios.post("/posts", {
        authorImage: user?.photoURL || "",
        authorName: user?.displayName || "Anonymous",
        authorEmail: user?.email,
        title,
        description,
        tags: selectedTags.map((tag) => tag.value),
        upVote: 0,
        downVote: 0,
        image: imageUrl,
        visibility, // <-- Add visibility here
        createdAt: new Date(),
      });

      setPostCount((prev) => prev + 1);

      Swal.fire("Success", "Post added successfully", "success");
      setTitle("");
      setDescription("");
      setSelectedTags([]);
      setImageUrl("");
      setVisibility("public"); // Reset visibility after submit
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to add post", "error");
    }
  };

  if (!user) {
    return (
      <p className="text-red-500 text-center mt-10">
        Please log in to add a post.
      </p>
    );
  }

  const isLimitReached = postCount >= 5;

  return (
    <div className="min-h-screen p-4 flex flex-col items-center">
      {/* Heading */}
      <div className="flex flex-col gap-3 mb-4 w-full max-w-6xl">
        <div className="flex items-center gap-3">
          <FileAddOutlined className="text-blue-500 text-4xl" />
          <div>
            <h1 className="font-urbanist text-3xl text-gray-800">ADD YOUR POST</h1>
            <p className="text-base text-gray-500">
              Share your story with the world. Submit your article for admin
              approval.
            </p>
          </div>
        </div>

        {/* Post Limit Info */}
        <p
          className={`text-sm border-l-4 p-2 rounded mb-2 ${
            !isLimitReached
              ? "text-yellow-700 bg-yellow-100 border-yellow-400"
              : "text-red-700 bg-red-100 border-red-400"
          }`}
        >
          {!isLimitReached
            ? `⚠️ New users can add up to 5 posts. You have added ${postCount} posts so far.`
            : `❌ You have reached your post limit. See the right panel to unlock membership.`}
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl w-full max-w-6xl flex flex-col lg:flex-row items-start gap-6 overflow-hidden">
        {/* Left Column */}
        <div className="lg:w-2/3 p-6 space-y-5">
          {/* User Info */}
          <div className="flex items-center gap-4 mb-4">
            <img
              src={user?.photoURL || "https://via.placeholder.com/100"}
              alt="Author"
              className="w-16 h-16 rounded-full border-2 border-gray-300"
            />
            <div className="space-y-1">
              <p className="flex items-center gap-2 font-semibold text-gray-800">
                <UserOutlined /> {user?.displayName || "Anonymous"}
              </p>
              <p className="flex items-center gap-2 text-gray-500">
                <MailOutlined /> {user?.email || "No email"}
              </p>
            </div>
          </div>

          {/* Membership Card */}
          {isLimitReached && (
            <div className="bg-blue-50 max-w-2xl mx-auto w-full p-6 rounded-3xl shadow-lg flex flex-row gap-10 text-left">
              <div className="flex flex-col items-start gap-4 w-1/3">
                <div className="flex items-center gap-3 text-black">
                  <FaCrown className="text-yellow-500 text-3xl" />
                  <h2 className="text-2xl font-bold">Upgrade to Membership</h2>
                </div>
                <p className="text-sm">
                  Unlock exclusive benefits and take your forum experience to the next level!
                </p>
              </div>

              <ul className="flex flex-col gap-3 text-black text-sm w-2/3">
                <li className="flex items-center gap-2">
                  <FaPenFancy className="text-black" /> Post unlimited articles and stories
                </li>
                <li className="flex items-center gap-2">
                  <FaCrown className="text-black" /> Highlight your posts with a Gold Badge
                </li>
                <li className="flex items-center gap-2">
                  <FaUsers className="text-black" /> Gain access to exclusive member-only discussions
                </li>
                <li className="flex items-center gap-2">
                  <FaBell className="text-black" /> Ad-free browsing & notifications for trending posts
                </li>
              </ul>
            </div>
          )}

          {/* Post Form (only if under limit) */}
          {!isLimitReached && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Post Title"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                rows={5}
                placeholder="Post Description"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <Select
                options={tags}
                value={selectedTags}
                onChange={setSelectedTags}
                placeholder={tagsLoading ? "Loading tags..." : "Select tags"}
                isMulti
              />

              {/* Visibility Dropdown */}
              <div className="w-full">
                <label className="block text-gray-700 mb-1 font-medium">Visibility</label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-xl shadow-md hover:from-blue-600 hover:to-indigo-600 transition duration-300"
              >
                Add Post
              </button>
            </form>
          )}
        </div>

        {/* Right Column */}
        <div className="lg:w-1/3 p-4 flex flex-col items-center justify-start gap-4">
          {!isLimitReached ? (
            // Post Tips
            <div className="bg-gradient-to-b from-blue-50 to-indigo-50 p-4 flex flex-col items-center justify-start gap-3 rounded-2xl shadow w-full">
              <h3 className="text-xl font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <BulbOutlined className="text-blue-500 text-2xl" /> Post Tips
              </h3>

              <div className="space-y-2 w-full text-gray-700 text-sm">
                <p className="flex items-start gap-2">
                  <FileImageOutlined className="mt-1 text-blue-500" /> Upload a
                  clear and high-quality image for better visibility. (Optional)
                </p>
                <p className="flex items-start gap-2">
                  <TagsOutlined className="mt-1 text-green-500" /> Select relevant
                  tags so your post reaches the right audience.
                </p>
                <p className="flex items-start gap-2">
                  <InfoCircleOutlined className="mt-1 text-purple-500" /> Write a
                  concise description summarizing your post content.
                </p>
              </div>

              {/* Image Preview */}
              <h3 className="text-lg font-semibold text-gray-700 mt-2">Image Preview</h3>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-36 object-cover rounded-lg shadow"
                />
              ) : (
                <div className="w-full h-36 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              <Upload
                customRequest={handleUpload}
                listType="picture"
                maxCount={1}
                showUploadList={false}
              >
                <Button type="primary" icon={<UploadOutlined />} loading={uploading}>
                  {imageUrl ? "Change Image" : "Upload Image"}
                </Button>
              </Upload>
              <p className="text-gray-500 text-center text-xs mt-1">
                Supported formats: JPG, PNG.
              </p>
            </div>
          ) : (
            // Membership Lock
            <div className="bg-amber-400 w-full p-6 mr-20 flex flex-col items-center justify-center rounded-2xl shadow-md gap-2 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 p-4 rounded-full text-yellow-600 bg-amber-50"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
              </svg>
              <h3 className="text-lg font-bold text-white">Unlock Gold Membership</h3>
              <p className="text-white text-sm">
                You have reached the free post limit (5/5). Become a member to post
                unlimited articles and earn a Gold Badge!
              </p>
              <NavLink to="/dashboard-membership">
                <button className="mt-2 py-2 px-4 bg-yellow-600 text-white font-medium rounded-xl shadow-md flex items-center justify-center gap-2 hover:bg-yellow-700 transition duration-300">
                  <FaCrown className="text-sm" /> Buy Membership
                </button>
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPost;
