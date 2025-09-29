import { useEffect, useState } from "react";
import { 
  FaSearch, 
  FaCrown, 
  FaUser, 
  FaUserShield, 
  FaUsers, 
  FaEnvelope, 
  FaStar,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { toast } from "react-hot-toast";
import Loader from "../../Components/Loader";
import useAuth from "../../Hooks/useAuth";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const { loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axiosSecure.get(`/users?search=${search}`);
      setUsers(res.data);
      setCurrentPage(1); // Reset to first page when search changes
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

  // ===== PAGINATION LOGIC =====
  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Generate page numbers with ellipsis for better UX
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end of visible page numbers
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're at the beginning
      if (currentPage <= 2) {
        endPage = 4;
      }

      // Adjust if we're at the end
      if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  if (loading) return <Loader />;

  return (
    <div className="p-4 lg:p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <FaUsers className="text-2xl lg:text-3xl text-blue-500" />
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-700">Manage Users</h2>
        </div>
        <p className="text-gray-500 text-sm lg:text-base">Search and manage all users</p>
      </div>

      {/* Stats and Search */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        {/* Stats */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{users.length}</div>
              <div className="text-sm text-gray-500">Total Users</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {users.filter(user => user.role === 'admin').length}
              </div>
              <div className="text-sm text-gray-500">Admins</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {users.filter(user => user.membership === true).length}
              </div>
              <div className="text-sm text-gray-500">Gold Members</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full lg:w-auto lg:min-w-80">
          <div className="flex shadow-sm rounded-lg overflow-hidden border border-gray-200 bg-white">
            <input
              type="text"
              placeholder="Search by name or email..."
              className="flex-grow px-4 py-2 text-gray-700 focus:outline-none text-sm lg:text-base"
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
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs lg:text-sm">
            <tr>
              <th className="py-3 px-3 lg:px-4 text-left">
                <div className="flex items-center gap-2">
                  <FaUser className="text-blue-500" />
                  <span className="hidden sm:inline">User</span>
                </div>
              </th>
              <th className="py-3 px-3 lg:px-4">
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-purple-500" />
                  <span className="hidden sm:inline">Email</span>
                </div>
              </th>
              <th className="py-3 px-3 lg:px-4">
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-500" />
                  <span className="hidden sm:inline">Membership</span>
                </div>
              </th>
              <th className="py-3 px-3 lg:px-4">
                <div className="flex items-center gap-2">
                  <FaUserShield className="text-green-500" />
                  <span className="hidden sm:inline">Role</span>
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  {/* User Info */}
                  <td className="py-3 px-3 lg:px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.photoURL || "https://i.pravatar.cc/40"}
                        alt={user.name}
                        className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover"
                      />
                      <div>
                        <span className="font-medium text-gray-700 text-sm lg:text-base block">
                          {user.name}
                        </span>
                        <span className="text-gray-500 text-xs sm:hidden">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Email - Hidden on mobile */}
                  <td className="py-3 px-3 lg:px-4 text-gray-600 text-sm lg:text-base hidden sm:table-cell">
                    {user.email}
                  </td>

                  {/* Membership */}
                  <td className="py-3 px-3 lg:px-4">
                    {user.membership === true ? (
                      <span className="inline-flex items-center gap-1 px-2 lg:px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                        <FaCrown className="text-xs" /> 
                        <span className="hidden xs:inline">Gold</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 lg:px-3 py-1 rounded-full text-xs bg-amber-600 text-white">
                        <FaUser className="text-xs" /> 
                        <span className="hidden xs:inline">Bronze</span>
                      </span>
                    )}
                  </td>

                  {/* Role Toggle */}
                  <td className="py-3 px-3 lg:px-4">
                    <button
                      className={`flex items-center gap-1 px-3 lg:px-4 py-1 rounded-full text-xs font-medium transition ${
                        user.role === "admin"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      }`}
                      onClick={() => handleToggleAdmin(user)}
                      disabled={updating === user._id}
                    >
                      {updating === user._id ? (
                        <span className="flex items-center gap-1">
                          <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="hidden sm:inline">Updating</span>
                        </span>
                      ) : (
                        <>
                          {user.role === "admin" ? (
                            <>
                              <FaUserShield className="text-xs" />
                              <span className="hidden sm:inline">Admin</span>
                            </>
                          ) : (
                            <>
                              <FaUser className="text-xs" />
                              <span className="hidden sm:inline">User</span>
                            </>
                          )}
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <FaUsers className="text-4xl text-gray-300" />
                    <p className="text-lg font-medium">No users found</p>
                    <p className="text-sm">Try adjusting your search terms</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===== PAGINATION CONTROLS ===== */}
      {users.length > usersPerPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Page Info */}
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{indexOfFirstUser + 1}</span> to{" "}
            <span className="font-semibold">
              {Math.min(indexOfLastUser, users.length)}
            </span> of{" "}
            <span className="font-semibold">{users.length}</span> users
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              <FaChevronLeft className="text-xs" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((number, index) => (
                number === '...' ? (
                  <span 
                    key={`ellipsis-${index}`} 
                    className="px-2 py-1 text-gray-500 text-sm"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`min-w-8 h-8 px-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === number
                        ? "bg-blue-500 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {number}
                  </button>
                )
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              <span className="hidden sm:inline">Next</span>
              <FaChevronRight className="text-xs" />
            </button>
          </div>

          {/* Page Size Info */}
          <div className="text-xs text-gray-500 hidden md:block">
            {usersPerPage} per page
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;