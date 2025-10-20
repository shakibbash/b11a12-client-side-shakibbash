import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import {
  FaUser,
  FaCrown,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaEdit,
  FaCamera,
  FaAward,
  FaCalendarAlt,
  FaClipboardList,
  FaComment,
  FaTag,
  FaArrowRight
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import bronzeBadge from "../../../Public/assets/New Medal.json";
import goldBadge from "../../../Public/assets/gold medal.json";
import Lottie from 'lottie-react';

const Profile = () => {
  const { user } = useAuth();
  const axios = useAxiosSecure();

  const [profileData, setProfileData] = useState(null);
  const [bio, setBio] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [uploading, setUploading] = useState({ profile: false, cover: false });

  const fetchUser = useCallback(async () => {
    if (!user?.email) return;
    try {
      const res = await axios.get(`/users/${user.email}`);
      setProfileData(res.data);
      setBio(res.data.aboutMe || '');
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
  }, [axios, user?.email]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const { data: posts = [], isError } = useQuery({
    queryKey: ['userPosts', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axios.get(`/user-posts/${user.email}`);
      return res.data || [];
    },
  });

  if (isError) return <p className="text-center py-4 text-red-500">Failed to load posts.</p>;

  const recentPosts = posts
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const totalPosts = posts.length;
  const totalUpvotes = posts.reduce((acc, p) => acc + (p.upVote || 0), 0);
  const totalDownvotes = posts.reduce((acc, p) => acc + (p.downVote || 0), 0);

  const handleUpload = async (file, type) => {
    if (!file || !user?.email) return;
    setUploading((prev) => ({ ...prev, [type]: true }));

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();

      await axios.put(`/users/${user.email}`, {
        [type === 'profile' ? 'photoURL' : 'coverURL']: data.secure_url,
      });

      await fetchUser();
      Swal.fire('Success', `${type === 'profile' ? 'Profile' : 'Cover'} image updated!`, 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to upload image', 'error');
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleSaveBio = async () => {
    try {
      await axios.put(`/users/${user.email}`, { aboutMe: bio });
      setIsEditingBio(false);
      await fetchUser();
      Swal.fire('Saved!', 'Your bio has been updated.', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update bio.', 'error');
    }
  };

  if (!profileData) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading profile...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen ">
      <div className="max-w-8xl bg-gray-100 ">
        {/* Cover Photo */}
        <div className="relative rounded-2xl overflow-hidden shadow-sm mb-20">
          <img
            src={profileData.coverURL || 'https://via.placeholder.com/1200x300?text=Cover+Photo'}
            alt="Cover"
            className="w-full h-64 object-cover"
          />
          <label className="absolute top-4 right-4 cursor-pointer bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm hover:bg-white transition-colors">
            <FaCamera className="text-gray-600" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleUpload(e.target.files[0], 'cover')}
              disabled={uploading.cover}
            />
          </label>

          {/* Profile Picture - Left Aligned */}
          <div className="absolute top-30 left-8 transform">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg">
                <img
                  src={profileData.photoURL || 'https://via.placeholder.com/200?text=Profile'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute bottom-2 right-2 cursor-pointer bg-white p-2 rounded-full shadow-sm hover:bg-gray-100 transition-colors">
                <FaCamera className="text-gray-600 w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files[0], 'profile')}
                  disabled={uploading.profile}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="max-w-full">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex items-start gap-6">
                {/* Avatar Display - Left Side */}
                <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-lg">
                  <img
                    src={profileData.photoURL || 'https://via.placeholder.com/200?text=Profile'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{profileData.name}</h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{profileData.email}</span>
                  </div>
                </div>
              </div>
              
              {/* Badge */}
              <div className="flex items-center gap-3">
                {profileData.badge === 'bronze' ? (
                  <div className="w-20 h-20">
                    <Lottie animationData={bronzeBadge} loop autoplay />
                  </div>
                ) : (
                  <div className="w-20 h-20">
                    <Lottie animationData={goldBadge} loop autoplay />
                  </div>
                )}
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                  {profileData.badge || 'No Badge'}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
    <div className="flex items-center gap-4">
      <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center">
        <FaClipboardList className="text-blue-600 text-xl" />
      </div>
      <div className="text-left">
        <h3 className="text-lg font-semibold text-gray-900">Total Posts</h3>
        <p className="text-2xl font-bold text-gray-900">{totalPosts}</p>
      </div>
    </div>
  </div>

  <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
    <div className="flex items-center gap-4">
      <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center">
        <FaArrowUp className="text-green-600 text-xl" />
      </div>
      <div className="text-left">
        <h3 className="text-lg font-semibold text-gray-900">Total Upvotes</h3>
        <p className="text-2xl font-bold text-gray-900">{totalUpvotes}</p>
      </div>
    </div>
  </div>

  <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
    <div className="flex items-center gap-4">
      <div className="bg-red-50 w-12 h-12 rounded-lg flex items-center justify-center">
        <FaArrowDown className="text-red-600 text-xl" />
      </div>
      <div className="text-left">
        <h3 className="text-lg font-semibold text-gray-900">Total Downvotes</h3>
        <p className="text-2xl font-bold text-gray-900">{totalDownvotes}</p>
      </div>
    </div>
  </div>
</div>

          {/* About Me Section */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">About Me</h2>
              <button
                onClick={() => setIsEditingBio((prev) => !prev)}
                className="text-gray-500 hover:text-indigo-600 transition-colors p-2"
              >
                <FaEdit className="w-5 h-5" />
              </button>
            </div>
            
            {isEditingBio ? (
              <div className="space-y-4">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Tell us about yourself..."
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveBio}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Save Bio
                  </button>
                  <button
                    onClick={() => setIsEditingBio(false)}
                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed">
                  {bio || 'No bio provided yet. Click the edit button to add something about yourself.'}
                </p>
              </div>
            )}
          </div>

          {/* Recent Posts Section - Using Your Post Grid Layout */}
          <div className="bg-gray-100 rounded-2xl shadow-sm ">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Posts</h2>
            
            {recentPosts.length === 0 ? (
              <div className="text-center py-8">
                <FaClipboardList className="text-gray-300 text-4xl mx-auto mb-3" />
                <p className="text-gray-500">No posts yet. Start sharing your thoughts!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {recentPosts.map((post) => (
                  <article
                    key={post._id}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden flex flex-col"
                  >
                    {/* Post Image */}
                    {post.image && (
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                      </div>
                    )}

                    {/* Card Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Author Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative">
                          <img
                            src={profileData.photoURL || "/default-avatar.png"}
                            alt="Author"
                            className="w-10 h-10 rounded-full border-2 border-indigo-200 object-cover group-hover:border-indigo-400 transition-colors"
                          />
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {profileData.name || "Anonymous"}
                          </h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <FaClock className="text-indigo-500" />
                            {new Date(post.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="font-bold text-lg text-gray-900 mb-3 leading-tight group-hover:text-indigo-500 transition-colors line-clamp-2">
                        {post.title}
                      </h2>

                      {/* Description */}
                      {post.content && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                          {post.content}
                        </p>
                      )}

                      {/* Tags */}
                      {post.tag && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full border bg-indigo-50 text-indigo-600 border-indigo-200">
                            <FaTag className="w-3 h-3" />
                            {post.tag}
                          </span>
                        </div>
                      )}

                      {/* Stats and Read More */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600">
                            <FaArrowUp className="w-3 h-3" />
                            {post.upVote || 0}
                          </span>
                          <span className="flex items-center gap-1 px-1 py-1 rounded-lg bg-indigo-50 text-indigo-600">
                            <FaArrowDown className="w-3 h-3" />
                            {post.downVote || 0}
                          </span>
                        </div>

                        <Link
                          to={`/post/${post._id}`}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors"
                        >
                          Read More
                          <FaArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;