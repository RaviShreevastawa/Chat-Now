import { useState } from "react"
import API from "../../Api/api"
import { useAuthContext } from "../../Context/AuthContext";
import toast from "react-hot-toast";

const Profile = () => {
  const { authUser, setAuthUser } = useAuthContext();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(authUser?.profilePic);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) return toast.error("Please select an image");

    const formData = new FormData();
    formData.append("profilePic", image); // ✅ must match backend key

    try {
      const { data } = await API.post("/api/auth/upload-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authUser.token}`,
        },
        withCredentials: true,
      });

      console.log(data.data)
      // ✅ Update context and localStorage
      setAuthUser({ ...authUser, profilePic: data.profilePic });
      localStorage.setItem("chat-user", JSON.stringify({ ...authUser, profilePic: data.profilePic }));
      toast.success("Profile picture updated");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Upload failed");
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center p-4">
      <img
        src={preview || "/default-avatar.png"}
        alt="Profile"
        className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="file-input file-input-bordered file-input-primary w-full max-w-xs"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 px-4 py-2 text-white rounded hover:bg-blue-600 transition"
      >
        Upload
      </button>
    </div>
  );
};

export default Profile;
