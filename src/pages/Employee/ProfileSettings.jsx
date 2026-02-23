import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./ProfileSettings.css";

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    address: "",
    position: { designationTitle: "" },
    emailNotifications: false
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [passwordMessage, setPasswordMessage] = useState("");

  const fetchProfile = useCallback(async () => {
    setLoading(true);

    const sessionData = localStorage.getItem("user_session");

    if (!sessionData) {
      setLoading(false);
      setMessage("Session Error: No session found. Please log in.");
      return;
    }

    const session = JSON.parse(sessionData);
    const targetId = session.empId;

    if (!targetId) {
      setLoading(false);
      setMessage("No Employee ID found in session. Please Reset.");
      return;
    }

    try {
      const token = session.token || session.jwt;

      const res = await axios.get(
        `http://localhost:8080/api/employees/profile/${targetId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data) {
        setProfile({
          ...res.data,
          emailNotifications: res.data.emailNotifications ?? false
        });
        setMessage("");
      } else {
        setMessage("Profile record not found.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Session out of sync with database.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ============================
  // UPDATE PROFILE
  // ============================

  const handleUpdate = async (e) => {
    e.preventDefault();

    const sessionData = localStorage.getItem("user_session");
    if (!sessionData) return;

    const session = JSON.parse(sessionData);

    try {
      await axios.put(
        `http://localhost:8080/api/employees/profile/update/${session.empId}`,
        profile,
        {
          headers: { Authorization: `Bearer ${session.token || session.jwt}` }
        }
      );

      setMessage("✅ Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ Update failed. Check backend.");
    }
  };

  // ============================
  // CHANGE PASSWORD
  // ============================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage("❌ New passwords do not match.");
      return;
    }

    const sessionData = localStorage.getItem("user_session");
    if (!sessionData) return;

    const session = JSON.parse(sessionData);

    try {
      await axios.put(
        `http://localhost:8080/api/employees/change-password/${session.empId}`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: { Authorization: `Bearer ${session.token || session.jwt}` }
        }
      );

      setPasswordMessage("✅ Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      setTimeout(() => setPasswordMessage(""), 3000);
    } catch (err) {
      setPasswordMessage("❌ Password change failed.");
    }
  };

  // ============================
  // EMAIL TOGGLE
  // ============================

  const handleToggleEmail = async () => {
    const sessionData = localStorage.getItem("user_session");
    if (!sessionData) return;

    const session = JSON.parse(sessionData);
    const newValue = !profile.emailNotifications;

    try {
      await axios.put(
        `http://localhost:8080/api/employees/email-preference/${session.empId}`,
        { emailNotifications: newValue },
        {
          headers: { Authorization: `Bearer ${session.token || session.jwt}` }
        }
      );

      setProfile({ ...profile, emailNotifications: newValue });
    } catch (err) {
      console.error("Email preference update failed");
    }
  };

  const handleLogoutFix = () => {
    localStorage.removeItem("user_session");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div className="spinner"></div>
        <p>Fetching your profile data...</p>
      </div>
    );
  }

  return (
    <div className="profile-settings-container">
      <div className="profile-card">
        {/* ================= Sidebar ================= */}
        <div className="profile-sidebar">
          <div className="avatar-circle">
            {profile.firstName?.charAt(0) || "U"}
            {profile.lastName?.charAt(0) || ""}
          </div>

          <h3>
            {profile.firstName || "User"} {profile.lastName || ""}
          </h3>

          <p className="role-tag">
            {profile.position?.designationTitle || "Staff Member"}
          </p>

          {(message.includes("ID") || message.includes("sync")) && (
            <button onClick={handleLogoutFix} className="fix-session-btn">
              Reset Session & Log In
            </button>
          )}
        </div>

        {/* ================= Main Form ================= */}
        <div className="profile-main-form">

          {/* Account Info */}
          <form onSubmit={handleUpdate}>
            <div className="form-section">
              <h4>Account Information</h4>

              <div className="input-group">
                <label>Email</label>
                <input type="email" value={profile.email} disabled />
              </div>

              <div className="input-group">
                <label>Contact Number</label>
                <input
                  type="text"
                  value={profile.contactNumber || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, contactNumber: e.target.value })
                  }
                />
              </div>

              <div className="input-group">
                <label>Address</label>
                <input
                  type="text"
                  value={profile.address || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, address: e.target.value })
                  }
                />
              </div>

              <button type="submit" className="update-profile-btn">
                Save Changes
              </button>

              {message && (
                <p
                  className={`form-feedback ${
                    message.includes("✅") ? "success" : "error"
                  }`}
                >
                  {message}
                </p>
              )}
            </div>
          </form>

          {/* Change Password */}
          <div className="form-section">
            <h4>Security - Change Password</h4>

            <form onSubmit={handleChangePassword}>
              <div className="input-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="input-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="input-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value
                    })
                  }
                  required
                />
              </div>

              <button type="submit" className="update-profile-btn">
                Update Password
              </button>

              {passwordMessage && (
                <p
                  className={`form-feedback ${
                    passwordMessage.includes("✅")
                      ? "success"
                      : "error"
                  }`}
                >
                  {passwordMessage}
                </p>
              )}
            </form>
          </div>

          {/* Email Preference */}
          <div className="form-section">
            <h4>Email Notifications</h4>

            <div className="toggle-container">
              <label>Receive Payslip & Leave Alerts</label>
              <input
                type="checkbox"
                checked={profile.emailNotifications}
                onChange={handleToggleEmail}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;