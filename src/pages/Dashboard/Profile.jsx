import React, { useState, useEffect } from 'react';
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

  // Fetch user info
  const fetchUser = async () => {
    if (!user?.email) return;
    try {
      const res = await axios.get(`/users/${user.email}`);
      setProfileData(res.data);
      setBio(res.data.aboutMe || '');
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [user?.email]);

  // Fetch user's posts
  const { data: posts = [], isLoading, isError } = useQuery({
    queryKey: ['userPosts', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axios.get(`/user-posts/${user.email}`);
      return res.data || [];
    },
  });

  // if (isLoading) return <p className="text-center py-4">Loading posts...</p>;
  if (isError) return <p className="text-center py-4 text-red-500">Failed to load posts.</p>;

  // Sort and get only 3 most recent posts
  const recentPosts = posts
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  // Compute stats dynamically
  const totalPosts = posts.length;
  const totalUpvotes = posts.reduce((acc, p) => acc + (p.upVote || 0), 0);
  const totalDownvotes = posts.reduce((acc, p) => acc + (p.downVote || 0), 0);

  // Upload profile or cover image
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

  if (!profileData) return <p className="text-center py-6 text-lg">Loading profile...</p>;

  return (
    <div className="w-full h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        {/* Cover Photo */}
        <div className="relative w-full max-w-6xl">
          <img
            src={profileData.coverURL || 'https://via.placeholder.com/1200x300?text=Cover+Photo'}
            alt="Cover"
            className="w-full h-72 object-cover rounded-b-xl shadow-md"
          />
          <label className="absolute top-4 right-4 cursor-pointer bg-white p-3 rounded-full shadow hover:bg-gray-100 transition">
            <FaCamera className="text-xl text-gray-700" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleUpload(e.target.files[0], 'cover')}
              disabled={uploading.cover}
            />
          </label>

          {/* Profile Picture */}
          <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
            <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full border-6 border-white overflow-hidden shadow-xl">
              <img
                src={profileData.photoURL || 'https://via.placeholder.com/200?text=Profile'}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              <label className="absolute bottom-6 right-4 cursor-pointer bg-white p-2 rounded-full shadow hover:bg-gray-100">
                <FaEdit className="text-gray-700 w-5 h-5" />
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

        {/* Personal Info */}
    {/* Personal Info */}
<div className="mt-28 flex flex-col items-center gap-4 bg-white w-full max-w-6xl p-8 rounded-xl shadow-lg text-center relative">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full relative">
    <div className="flex items-center relative ">
      <h1 className="text-4xl font-bold">{profileData.name}</h1>

      {/* Badge */}
      {profileData.badge === 'bronze' ? (
        <div className="w-40 h-40 absolute md:-right-26    ">
          <Lottie
            animationData={bronzeBadge}
            loop
            autoplay
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      ) :  (
        <div className="w-25 h-25 absolute md:-right-26 -right-6   ">
          <Lottie
            animationData={goldBadge}
            loop
            autoplay
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        
      )}
<span className='ml-5 bg-amber-400 px-3 py-1 text-sm rounded-4xl'>badge</span>
    </div>

    <p className="text-gray-600 md:text-lg mt-2 md:mt-0">
      <span className="animate-pulse">🟢</span> {profileData.email}
    </p>
  </div>


          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full">
            <div className="bg-blue-50 border-l-[8px] border-blue-500 rounded-xl shadow p-4 flex flex-col items-center gap-2 hover:shadow-lg transition">
              <div className="bg-blue-100 p-3 rounded-full mb-2">
                <FaClipboardList className="text-blue-600 text-xl" />
              </div>
              <h1 className="text-lg font-semibold">Total Posts</h1>
              <p className="text-lg">{totalPosts}</p>
            </div>

            <div className="bg-green-50  border-l-[8px] border-green-500 rounded-xl shadow p-4 flex flex-col items-center gap-2 hover:shadow-lg transition">
              <div className="bg-green-100 p-3 rounded-full mb-2">
                <FaArrowUp className="text-green-600 text-xl" />
              </div>
              <h1 className="text-lg font-semibold">Total Upvotes</h1>
              <p className="text-lg">{totalUpvotes}</p>
            </div>

            <div className="bg-red-50 border-l-[8px] border-red-500 rounded-xl shadow p-4 flex flex-col items-center gap-2 hover:shadow-lg transition">
              <div className="bg-red-100 p-3 rounded-full mb-2">
                <FaArrowDown className="text-red-600 text-xl" />
              </div>
              <h1 className="text-lg font-semibold">Total Downvotes</h1>
              <p className="text-lg">{totalDownvotes}</p>
            </div>
          </div>

          {/* About Me */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6 w-full max-w-6xl text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <h2 className="text-2xl font-bold text-gray-800">About Me</h2>
              <button
                onClick={() => setIsEditingBio((prev) => !prev)}
                className="text-gray-500 hover:text-blue-600 transition"
              >
                <FaEdit />
              </button>
            </div>
            {isEditingBio ? (
              <div className="flex flex-col items-center gap-3">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSaveBio}
                  className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="p-3 bg-gray-50">
                <p className="text-gray-700 text-lg">{bio || 'No bio provided yet.'}</p>
              </div>
            )}
          </div>

          {/* Recent Posts */}
          <h1 className="mt-8 text-3xl font-bold text-gray-800">My Recent Posts</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {recentPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 p-5 flex flex-col justify-between"
              >
                {/* Author Info */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={profileData.photoURL || 'https://via.placeholder.com/40?text=User'}
                    alt={profileData.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-400 hover:scale-110 transition"
                  />
                  <span className="font-semibold text-gray-800 hover:text-blue-600 cursor-pointer">
                    {profileData.name}
                  </span>
                </div>

                {/* Post Title */}
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 hover:underline cursor-pointer mb-3">
                  {post.title || 'Untitled'}
                </h3>

                {/* Post Content */}
                <p className="text-gray-600 text-sm mb-4">
                  {(post.content || '').slice(0, 120)}
                  {(post.content || '').length > 120 ? '...' : ''}
                </p>

                {/* Tags */}
                {post.tag && (
                  <span className="inline-block bg-gradient-to-r from-purple-200 to-pink-200 text-purple-800 px-3 py-1 rounded-full text-xs font-medium mb-4">
                    {post.tag}
                  </span>
                )}

                {/* Post Stats */}
                <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 hover:text-green-500 transition">
                      <FaArrowUp /> {post.upVote || 0}
                    </div>
                    <div className="flex items-center gap-1 hover:text-red-500 transition">
                      <FaArrowDown /> {post.downVote || 0}
                    </div>
                    <div className="flex items-center gap-1 hover:text-blue-500 transition">
                      <FaComment /> {post.commentCount || 0}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* View Post Button */}
                <Link
                  to={`/post/${post._id}`}
                  className="mt-auto text-center px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition font-semibold"
                >
                  View Post
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
