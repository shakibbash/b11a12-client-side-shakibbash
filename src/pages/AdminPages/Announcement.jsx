import { useEffect, useState } from "react";
import { FaBullhorn, FaEdit, FaTrash, FaAlignLeft, FaPaperPlane, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useUserRole from "../../Hooks/useUserRole";
import useAuth from "../../Hooks/useAuth";
import { toast } from "react-hot-toast";

const Announcement = () => {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const axiosSecure = useAxiosSecure();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  // Add Announcement Modal
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit Announcement Modal
  const [editing, setEditing] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  // Fetched user info from users collection
  const [userInfo, setUserInfo] = useState(null);

  // Fetch user info
  useEffect(() => {
    if (!user?.email) return;
    const fetchUser = async () => {
      try {
        const res = await axiosSecure.get(`/users/${encodeURIComponent(user.email)}`);
        setUserInfo(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch user info");
      }
    };
    fetchUser();
  }, [user?.email, axiosSecure]);

  // Fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axiosSecure.get("/announcements");
        setAnnouncements(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load announcements");
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, [axiosSecure]);

  // Add new announcement
 const handleSubmit = async () => {
  if (!title || !description) {
    toast.error("Please fill in both Title and Description");
    return;
  }
  if (!userInfo) return;

  setSubmitting(true);

  const newAnnouncement = {
    authorName: userInfo.displayName,
    authorImage: userInfo.photoURL || "https://i.pravatar.cc/40",
    email: userInfo.email,
    title,
    description,
    createdAt: new Date(), // make sure it's a Date object
  };

  try {
    // Optimistically update UI first
    setAnnouncements((prev) => [newAnnouncement, ...prev]);

    const res = await axiosSecure.post("/announcements", newAnnouncement);


    setAnnouncements((prev) =>
      prev.map((a) => (a === newAnnouncement ? res.data : a))
    );

    toast.success("Announcement posted successfully!");
    setTitle("");
    setDescription("");
    document.getElementById("add_modal").close();
  } catch (err) {
    console.error(err);
    toast.error("Failed to post announcement");


    setAnnouncements((prev) => prev.filter((a) => a !== newAnnouncement));
  } finally {
    setSubmitting(false);
  }
};


  // Delete announcement
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This announcement will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if (!confirm.isConfirmed) return;

    setDeleting(id);
    try {
      await axiosSecure.delete(`/announcements/${id}`);
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
      Swal.fire("Deleted!", "The announcement has been deleted.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete announcement.", "error");
    } finally {
      setDeleting(null);
    }
  };

  // Open edit modal
  const handleEdit = (a) => {
    setEditing(a);
    setEditTitle(a.title || "");
    setEditDesc(a.description || "");
    document.getElementById("edit_modal").showModal();
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!editTitle || !editDesc) {
      Swal.fire("Error", "Both fields are required", "error");
      return;
    }

    try {
      await axiosSecure.patch(`/announcements/${editing._id}`, {
        title: editTitle,
        description: editDesc,
      });

      setAnnouncements((prev) =>
        prev.map((item) =>
          item._id === editing._id
            ? { ...item, title: editTitle, description: editDesc }
            : item
        )
      );

      Swal.fire("Updated!", "Announcement updated successfully", "success");
      document.getElementById("edit_modal").close();
      setEditing(null);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update announcement.", "error");
    }
  };

  if (loading) return <p className="text-center text-gray-500 mt-6">Loading announcements...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <FaBullhorn className="text-3xl text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-800">Announcements</h2>
        </div>
        {isAdmin && (
          <button
            className="btn btn-primary flex items-center gap-2"
            onClick={() => document.getElementById("add_modal").showModal()}
          >
            <FaPlus /> Add Announcement
          </button>
        )}
      </div>

      {/* Announcements List */}
      {announcements.length === 0 ? (
     <div className="rounded-xl bg-white p-5">
         <p className="text-gray-500 text-center">No announcements found.</p>
     </div>
      ) : (
        <div className="space-y-6">
          {announcements.map((a, idx) => (
            <div
              key={a._id || `announcement-${idx}`}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
            >
              {/* Author Info */}
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={a.authorImage || "https://i.pravatar.cc/150"}
                  alt={a.authorName || "Author"}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-700">{a.authorName || "Unknown"}</p>
                  <p className="text-xs text-gray-400">
                    {a.createdAt ? new Date(a.createdAt).toLocaleString() : ""}
                  </p>
                </div>
              </div>

              {/* Announcement */}
              <h3 className="text-xl font-semibold text-gray-800">{a.title || ""}</h3>
              <p className="text-gray-600">{a.description || ""}</p>

              {/* Admin Actions */}
              {isAdmin && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(a)}
                    className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 text-sm"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(a._id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200 text-sm"
                    disabled={deleting === a._id}
                  >
                    <FaTrash /> {deleting === a._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Announcement Modal */}
      <dialog id="add_modal" className="modal">
        <div className="modal-box max-w-xl">
          <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
            <FaBullhorn /> Make Announcement
          </h3>

          <form className="space-y-5">
            {userInfo && (
              <div className="flex items-center justify-center gap-3 mb-4">
                <img
                  src={userInfo.photoURL || "https://i.pravatar.cc/150"}
                  alt={userInfo.displayName || "User"}
                  className="w-12 h-12 rounded-full ring-2 ring-blue-400"
                />
                <div>
                  <span className="font-semibold text-gray-800">{userInfo.displayName || ""}</span>
                  <span className="text-sm text-gray-500">{userInfo.email || ""}</span>
                </div>
              </div>
            )}

            <div>
              <label className="text-gray-600 mb-2 flex items-center gap-2">
                <FaEdit className="text-blue-500" /> Title
              </label>
              <input
                type="text"
                placeholder="Enter announcement title"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={title || ""}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-gray-600 mb-2 flex items-center gap-2">
                <FaAlignLeft className="text-green-500" /> Description
              </label>
              <textarea
                placeholder="Enter announcement details"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={4}
                value={description || ""}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className={`w-full py-2 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition ${
                submitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-md"
              }`}
              disabled={submitting}
            >
              <FaPaperPlane /> {submitting ? "Posting..." : "Post Announcement"}
            </button>
          </form>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Edit Announcement Modal */}
      <dialog id="edit_modal" className="modal">
        <div className="modal-box max-w-3xl">
          <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
            <FaEdit /> Edit Announcement
          </h3>

          <div className="space-y-3">
            <input
              type="text"
              value={editTitle || ""}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Title"
              className="input input-bordered w-full"
            />
            <textarea
              value={editDesc || ""}
              onChange={(e) => setEditDesc(e.target.value)}
              placeholder="Description"
              className="textarea textarea-bordered w-full"
              rows={4}
            />
          </div>

          <div className="modal-action">
            <button onClick={handleSaveEdit} className="btn btn-primary">
              Save
            </button>
            <form method="dialog">
              <button className="btn">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Announcement;
