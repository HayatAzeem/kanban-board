import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Avatar } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import apiClient from "../api/apiClient";

export const Settings = () => {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const displayName = user?.username || user?.email || "U";
  const initials = displayName.substring(0, 2).toUpperCase();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const payload: any = {};
      if (username !== user?.username) payload.username = username;
      if (password) payload.password = password;

      if (Object.keys(payload).length > 0) {
        const { data } = await apiClient.patch('/auth/profile', payload);
        updateUser({ username: data.username });
      }
      setIsEditing(false);
      setPassword("");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col max-w-4xl mx-auto w-full animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-textMain">Settings</h2>
        <p className="mt-1 text-sm text-textMuted">Manage your account settings and preferences.</p>
      </div>

      <div className="space-y-8">
        {/* Profile Section */}
        <section className="bg-surface border border-border rounded-xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-textMain">Profile Information</h3>
            {!isEditing && (
              <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
          
          {error && <div className="mb-4 text-sm text-danger">{error}</div>}

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4 animate-fade-in">
              <div className="flex items-center space-x-6 mb-6">
                <Avatar initials={initials} className="h-16 w-16 text-xl" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-textMuted mb-1">Email Address</p>
                  <p className="text-base text-textMain font-medium opacity-70">{user?.email}</p>
                </div>
              </div>
              <div className="grid gap-4 max-w-md">
                <Input 
                  label="Username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="Choose a display name"
                />
                <Input 
                  label="New Password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Leave blank to keep current"
                />
              </div>
              <div className="flex gap-3 pt-4 border-t border-border mt-6">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button type="button" variant="secondary" onClick={() => {
                  setIsEditing(false);
                  setUsername(user?.username || "");
                  setPassword("");
                }}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex items-center space-x-6">
              <Avatar initials={initials} className="h-16 w-16 text-xl" />
              <div>
                <p className="text-sm font-medium text-textMuted mb-1">{user?.username ? "Username" : "Email Address"}</p>
                <p className="text-base text-textMain font-semibold">{displayName}</p>
                {user?.username && <p className="text-xs text-textMuted mt-1">{user.email}</p>}
              </div>
            </div>
          )}
        </section>

        {/* Preferences Section */}
        <section className="bg-surface border border-border rounded-xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-textMain mb-4">Preferences</h3>
          
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <div>
              <p className="text-sm font-medium text-textMain">System Theme</p>
              <p className="text-xs text-textMuted mt-1">Switch between light mode and dark mode.</p>
            </div>
            <Button onClick={toggleTheme} variant="secondary" size="sm">
              {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-textMain">Email Notifications</p>
              <p className="text-xs text-textMuted mt-1">Receive updates about your job applications.</p>
            </div>
            <Button variant="primary" size="sm">Coming Soon</Button>
          </div>
        </section>
      </div>
    </div>
  );
};
