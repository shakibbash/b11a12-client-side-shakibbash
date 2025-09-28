import { useEffect, useState } from "react";
import { FaSearch, FaCrown, FaUser, FaUserShield, FaUsers, FaEnvelope, FaStar } from "react-icons/fa";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { toast } from "react-hot-toast";
import Loader from "../../Components/Loader";
import useAuth from "../../Hooks/useAuth";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(null); 
  const { loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axiosSecure.get(`/users?search=${search}`);
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => fetchUsers(), 500);
    return () => clearTimeout(debounce);
  }, [search]);

  // Toggle admin/user role
  const handleToggleAdmin = async (user) => {
    try {
      setUpdating(user._id);
      const res = await axiosSecure.patch(`/admin/users/${user._id}/toggle-role`);
      const newRole = res.data.role;
      toast.success(`${user.name} is now a ${newRole}`, { duration: 2000 });
      fetchUsers(); 
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with Icon */}
      <div className="mb-6 flex items-center gap-3">
        <FaUsers className="text-3xl text-blue-500" />
        <h2 className="text-3xl font-bold text-gray-700">Manage Users</h2>
      </div>
      <p className="text-gray-500 mb-6">Search and manage all users</p>

      {/* Search Bar */}
      <div className="mb-6 w-full max-w-md">
        <div className="flex shadow-sm rounded-lg overflow-hidden border border-gray-200 bg-white">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="flex-grow px-4 py-2 text-gray-700 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="px-4 bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center"
            onClick={fetchUsers}
          >
            <FaSearch className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="min-w-full text-left">
        <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
  <tr>
    <th className="py-3 px-4 text-left">
      <div className="flex items-center gap-2">
        <FaUser className="text-blue-500" />
        <span>User</span>
      </div>
    </th>
    <th className="py-3 px-4">
      <div className="flex items-center gap-2">
        <FaEnvelope className="text-purple-500" />
        <span>Email</span>
      </div>
    </th>
    <th className="py-3 px-4">
      <div className="flex items-center gap-2">
        <FaStar className="text-yellow-500" />
        <span>Membership</span>
      </div>
    </th>
    <th className="py-3 px-4">
      <div className="flex items-center gap-2">
        <FaUserShield className="text-green-500" />
        <span>Role</span>
      </div>
    </th>
  </tr>
</thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  {/* User Info */}
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={user.photoURL || "https://i.pravatar.cc/40"}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-medium text-gray-700">{user.name}</span>
                  </td>

                  {/* Email */}
                  <td className="py-3 px-4 text-gray-600">{user.email}</td>

                  {/* Membership */}
                  <td className="py-3 px-4">
                    {user.membership === true  ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800 ">
                        <FaCrown /> Gold
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-amber-600 text-white">
                        <FaUser /> Bronze
                      </span>
                    )}
                  </td>

                  {/* Role Toggle */}
                  <td className="py-3 px-4">
                    <button
                      className={`flex items-center gap-1 px-4 py-1 rounded-full text-sm font-medium transition ${
                        user.role === "admin"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      }`}
                      onClick={() => handleToggleAdmin(user)}
                      disabled={updating === user._id}
                    >
                      {updating === user._id
                        ? "Updating..."
                        : user.role === "admin"
                        ? "Admin"
                        : "User"}
                      {user.role === "admin" ? <FaUserShield /> : <FaUser />}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-6 text-center text-gray-400">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
