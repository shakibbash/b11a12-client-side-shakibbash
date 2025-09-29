import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useUserRole from "../../Hooks/useUserRole";
import { toast } from "react-hot-toast";
import { Link } from "react-router";

const AnnouncementsLists = () => {
  const axiosSecure = useAxiosSecure();
  const { isAdmin } = useUserRole();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  // modal state
  const [editing, setEditing] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  // ✅ Fetch announcements
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

  // ✅ Delete announcement
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

  // ✅ Open modal for edit
  const handleEdit = (a) => {
    setEditing(a);
    setEditTitle(a.title);
    setEditDesc(a.description);
    document.getElementById("edit_modal").showModal();
  };

  // ✅ Save edit
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

  if (loading) {
    return <p className="text-center text-gray-500 mt-6">Loading announcements...</p>;
  }

  return (
    <div className="p-6">
     

      {announcements.length === 0 ? (<>
             <div className="flex justify-center items-center mb-5">
  <Link
    to="/dashboard/announcement"
    className="btn btn-primary text-white"
  >
    Make an announcement
  </Link>
</div>
        <p className="text-gray-500 text-center">No announcements found.</p></>

      ) : (
        <div className="space-y-6">
          {announcements.map((a) => (
            <div
              key={a._id}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
            >
              {/* Author Info */}
              <div className="flex items-center gap-3 mb-3 ">
                <img
                  src={a.authorImage || "https://i.pravatar.cc/40"}
                  alt={a.authorName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-700">{a.authorName}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(a.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Announcement */}
              <h3 className="text-xl font-semibold text-gray-800">{a.title}</h3>
              <p className="text-gray-600">{a.description}</p>

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

      {/* DaisyUI Modal for Edit */}
      <dialog id="edit_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit Announcement</h3>
          <div className="mt-4 space-y-3">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Title"
              className="input input-bordered w-full"
            />
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              placeholder="Description"
              className="textarea textarea-bordered w-full"
              rows={4}
            ></textarea>
          </div>
          <div className="modal-action">
            <button
              onClick={handleSaveEdit}
              className="btn btn-primary"
            >
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

export default AnnouncementsLists;
