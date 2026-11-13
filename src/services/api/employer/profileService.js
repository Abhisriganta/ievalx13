import axiosInstance, { clearGetCacheFor } from "../axiosInstance";

let _profileCache = null;
let _profileCacheTime = 0;
let _profilePromise = null;

const profileService = {
  // GET own profile
  getProfile: async () => {
    const now = Date.now();
    if (_profileCache && now - _profileCacheTime < 30000) return _profileCache;
    if (_profilePromise) return _profilePromise;
    _profilePromise = (async () => {
      try {
        const response = await axiosInstance.get("/employer/profile");
        _profileCache = response.data;
        _profileCacheTime = Date.now();
        return response.data;
      } finally { _profilePromise = null; }
    })();
    return _profilePromise;
  },

  // PATCH editable fields
  updateProfile: async (data) => {
    const response = await axiosInstance.patch(
      "/employer/profile/update",
      data
    );
    _profileCache = null; _profileCacheTime = 0; _profilePromise = null; clearGetCacheFor("/employer/profile");
    return response.data;
  },

  // POST avatar (multipart)
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append("profile_image", file);
    const response = await axiosInstance.post(
      "/employer/profile/avatar",
      formData,
       { headers: { "Content-Type": "multipart/form-data" } }
    );
        _profileCache = null; _profileCacheTime = 0; _profilePromise = null; clearGetCacheFor("/employer/profile");
    return response.data;
  },
  // DELETE avatar
  removeAvatar: async () => {
    const response = await axiosInstance.delete("/employer/profile/avatar/remove");
       _profileCache = null; _profileCacheTime = 0; _profilePromise = null; clearGetCacheFor("/employer/profile");
    return response.data;
  },

  // POST regular change password (from profile page)
  changePassword: async ({ current_password, new_password }) => {
    const response = await axiosInstance.post(
      "/employer/profile/change-password",
      { current_password, new_password }
    );
    return response.data;
  },

  // POST first-login forced password change
  changeFirstLoginPassword: async ({ new_password }) => {
    const response = await axiosInstance.post(
      "/employers/change-password-first-login",
      { new_password }
    );
    return response.data;
  },
};

export default profileService;