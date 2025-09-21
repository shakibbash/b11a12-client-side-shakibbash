import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Select from "react-select";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { UploadOutlined } from "@ant-design/icons";
import { Upload, Button, Avatar } from "antd";
import { FaUser, FaEnvelope } from "react-icons/fa";

const AddPost = () => {
  const { user } = useAuth();
  const axios = useAxiosSecure();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [fileList, setFileList] = useState([]);

  // Fetch tags
  const { data: tags = [], isLoading: tagsLoading, error: tagsError } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const res = await axios.get("/tags");
      return res.data.map(tag => ({ value: tag.name, label: tag.name }));
    },
  });

  // Fetch user posts
  const { data: posts = [] } = useQuery({
    queryKey: ["userPosts", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axios.get(`/posts?authorEmail=${user.email}`);
      return res.data.data || [];
    },
    enabled: !!user?.email,
  });

  // Upload props for AntD Upload
  const uploadProps = {
    multiple: false,
    listType: "picture",
    fileList,
    onChange(info) {
      setFileList(info.fileList);
    },
    beforeUpload(file) {
      return false; // prevent auto upload, handle manually
    },
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!title || !description || selectedTags.length === 0) {
      Swal.fire("Error", "Please fill all fields", "error");
      return;
    }

    // Get image URL from fileList if exists
    const imageUrl = fileList[0]?.thumbUrl || "";

    try {
      await axios.post("/posts", {
        authorImage: user?.photoURL || "",
        authorName: user?.displayName || "Anonymous",
        authorEmail: user?.email,
        title,
        description,
        tags: selectedTags.map(tag => tag.value),
        upVote: 0,
        downVote: 0,
        image: imageUrl,
        createdAt: new Date(),
      });
      Swal.fire("Success", "Post added successfully", "success");
      setTitle("");
      setDescription("");
      setSelectedTags([]);
      setFileList([]);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to add post", "error");
    }
  };

  if (!user) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500 font-medium">Please log in to add a post.</p>
      </div>
    );
  }

  if (posts.length >= 5 && !user.membership) {
    Swal.fire({
      title: "Post Limit Reached!",
      text: "Become a Gold Member to add more posts.",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Go to Membership",
      timer: 8000,
    }).then(result => {
      if (result.isConfirmed) navigate("/membership");
    });
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4">Add a New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

          <div className="flex items-center gap-4 mb-4">
          <img
            src={user?.photoURL || "https://via.placeholder.com/100"}
            alt="Author"
            className="w-16 h-16 rounded-full border-2 border-gray-300"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <FaUser className="text-gray-500" />
              <p className="font-semibold">{user?.displayName || "Anonymous"}</p>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-gray-500" />
              <p className="text-gray-500">{user?.email || "No email"}</p>
            </div>
          </div>
        </div>

        {/* Title */}
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Description */}
        <textarea
          placeholder="Post Description"
          rows={4}
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Multi-select Tags */}
        <Select
          options={tags}
          value={selectedTags}
          onChange={setSelectedTags}
          placeholder={tagsLoading ? "Loading tags..." : "Select tags"}
          isLoading={tagsLoading}
          isMulti
          styles={{
            multiValue: (styles) => ({
              ...styles,
              backgroundColor: "#3b82f6",
              color: "white",
            }),
            multiValueLabel: (styles) => ({ ...styles, color: "white" }),
            multiValueRemove: (styles) => ({ ...styles, color: "white" }),
          }}
        />
        {tagsError && <p className="text-red-500">Failed to load tags</p>}

        {/* Image Upload */}
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />} type="primary">
            Select Image
          </Button>
        </Upload>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-5 w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-600 transition duration-300"
        >
          Add Post
        </button>
      </form>
    </div>
  );
};

export default AddPost;
