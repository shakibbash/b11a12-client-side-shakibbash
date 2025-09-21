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
  FaEnvelope,
  FaAward,
  FaCalendarAlt,
  FaClipboardList,
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const Profile = () => {
  const { user } = useAuth();
  const axios = useAxiosSecure();

  const [profileData, setProfileData] = useState(null);
  const [bio, setBio] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [uploading, setUploading] = useState({ profile: false, cover: false });

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

  const { data: posts = [], isLoading, isError } = useQuery({
    queryKey: ['userPosts', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axios.get(`/posts?authorEmail=${user.email}&limit=3`);
      return res.data.data || [];
    },
  });

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
    <div className="w-full h-screen overflow-y-auto bg-gray-50">
      <div className="flex flex-col items-center py-6">
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
        
            
            </div>
                    <label className="absolute bottom-2 right-2 cursor-pointer bg-white p-2 rounded-full shadow hover:bg-gray-100">
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

        {/* Personal Info */}
        <div className="mt-28 flex flex-col items-center gap-4 bg-white w-full max-w-6xl p-8 rounded-xl shadow-lg text-center">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold">{profileData.name}</h1>
              {profileData.badge && (
                <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
                  <FaCrown /> {profileData.badge.charAt(0).toUpperCase() + profileData.badge.slice(1)}
                </span>
              )}
            </div>
            <p className="text-gray-600 md:text-lg">🟢{profileData.email}</p>
          </div>

          {/* Info Cards with Icon Circles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full">
            <div className="bg-blue-50 rounded-xl shadow p-4 flex flex-col items-center gap-2 hover:shadow-lg transition">
              <div className="bg-blue-100 p-3 rounded-full mb-2">
                <FaUser className="text-blue-600 text-xl" />
              </div>
              <h1 className="text-lg font-semibold font-urbanist">Role</h1>
              <p className='text-lg font-urbanist'>{profileData.role}</p>
            </div>

            <div className="bg-green-50 rounded-xl shadow p-4 flex flex-col items-center gap-2 hover:shadow-lg transition">
              <div className="bg-green-100 p-3 rounded-full mb-2">
                <FaAward className="text-green-600 text-xl" />
              </div>
              <h1 className="text-lg font-semibold font-urbanist ">Membership</h1>
              <p className=' font-urbanist text-lg'>{profileData.membership ? 'Gold' : 'Bronze'}</p>
            </div>

            <div className="bg-yellow-50 rounded-xl shadow p-4 flex flex-col items-center gap-2 hover:shadow-lg transition">
              <div className="bg-yellow-100 p-3 rounded-full mb-2">
                <FaCalendarAlt className="text-yellow-600 text-xl" />
              </div>
              <h1 className="font-semibold text-lg font-urbanist ">Joined</h1>
              <p className='text-lg font-urbanist'>{new Date(profileData.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Extended Stats */}
          <div className="mt-6 bg-white rounded-lg shadow-md p-6 w-full max-w-6xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">📊Activity Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-4 rounded-lg bg-blue-50 flex flex-col items-center shadow hover:shadow-md transition">
                <div className="bg-blue-100 p-3 rounded-full mb-2">
                  <FaClipboardList className="text-blue-600 text-xl" />
                </div>
                <span className="text-xl font-bold">{profileData.postCount || 0}</span>
                <span className="text-gray-500">Total Posts</span>
              </div>
              <div className="p-4 rounded-lg bg-green-50 flex flex-col items-center shadow hover:shadow-md transition">
                <div className="bg-green-100 p-3 rounded-full mb-2">
                  <FaArrowUp className="text-green-600 text-xl" />
                </div>
                <span className="text-xl font-bold">{profileData.totalUpvotes || 0}</span>
                <span className="text-gray-500">Total Upvotes</span>
              </div>
              <div className="p-4 rounded-lg bg-red-50 flex flex-col items-center shadow hover:shadow-md transition">
                <div className="bg-red-100 p-3 rounded-full mb-2">
                  <FaArrowDown className="text-red-600 text-xl" />
                </div>
                <span className="text-xl font-bold">{profileData.totalDownvotes || 0}</span>
                <span className="text-gray-500">Total Downvotes</span>
              </div>
              <div className="p-4 rounded-lg bg-orange-50 flex flex-col items-center shadow hover:shadow-md transition">
                <div className="bg-orange-100 p-3 rounded-full mb-2">
                  <FaClock className="text-orange-600 text-xl" />
                </div>
                <span className="font-semibold mb-2">Last Login</span>
                <span className='text-gray-500'>{new Date(profileData.last_login).toLocaleString()}</span>
              </div>
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
        <div className='p-3 bg-gray-50'>
                <p className="text-gray-700 text-lg">{bio || 'No bio provided yet.'}</p>
        </div>
            )}
          </div>



{/* Membership Card */}
<div className="flex flex-col md:flex-row items-center justify-center bg-gradient-to-r from-yellow-400 to-amber-500 p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-500 w-full max-w-4xl mt-6">
   {/* Icon Circle */}
  <div className="bg-yellow-100 p-4 rounded-full flex items-center justify-center mr-2">
    {profileData.membership === 'gold' ? (
      <FaCrown className="text-yellow-600 text-3xl animate-bounce" />
    ) : profileData.membership === 'bronze' ? (
      <FaAward className="text-orange-600 text-3xl animate-pulse" />
    ) : (
      <FaAward className="text-gray-400 text-3xl" />
    )}
  </div>
  {/* Membership Info */}
  <div className="flex-1 text-center md:text-left">
    <h3 className="text-2xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
      {profileData.membership
        ? `${profileData.membership.charAt(0).toUpperCase() + profileData.membership.slice(1)} Member`
        : 'Free User'}
      {profileData.membership === 'gold' && (
        <FaCrown className="text-yellow-300 animate-bounce w-6 h-6" />
      )}
      {profileData.membership === 'bronze' && (
        <FaAward className="text-orange-600 animate-pulse w-6 h-6" />
      )}
    </h3>
    <p className="text-yellow-100 mt-2 text-sm md:text-base">
      {profileData.membership
        ? 'You have full access to all features!'
        : 'Limited access. Upgrade to enjoy more.'}
    </p>
  </div>

  {/* Upgrade Button with Icon */}
  {!profileData.membership && (
    <Link to="/membership">
      <button className="flex items-center gap-3 mt-4 md:mt-0 px-6 py-3 bg-white text-yellow-500 font-semibold rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300">
        <FaCrown className="w-5 h-5" />
        Upgrade to Gold
      </button>
    </Link>
  )}
</div>

          {/* Recent Posts */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6 w-full max-w-6xl text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
              <FaClock /> Recent Posts
            </h2>
            {isLoading ? (
              <p className="text-gray-500 py-4">Loading posts...</p>
            ) : isError ? (
              <p className="text-red-500 py-4">Failed to load posts.</p>
            ) : posts.length === 0 ? (
              <p className="text-gray-500 py-4">No posts yet.</p>
            ) : (
              <ul className="space-y-5">
                {posts.map((post) => (
                  <li
                    key={post.uid}
                    className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition bg-gray-50"
                  >
                    <Link
                      to={`/post/${post.uid}`}
                      className="text-blue-600 font-semibold text-lg hover:underline"
                    >
                      {post.title}
                    </Link>
                    <p className="text-gray-600 mt-2 text-sm">
                      {post.content.slice(0, 120)}
                      {post.content.length > 120 ? '...' : ''}
                    </p>
                    <div className="flex items-center justify-center mt-3 text-gray-500 text-xs gap-5">
                      <span className="flex items-center gap-1">
                        <FaArrowUp /> {post.upvotes || 0} <FaArrowDown /> {post.downvotes || 0}
                      </span>
                      {post.tag && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {post.tag}
                        </span>
                      )}
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
