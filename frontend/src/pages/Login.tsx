import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Loader2 } from "lucide-react";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await apiClient.post("/auth/login", { email, password });
      login(data.token, data.user);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <div className="rounded-md bg-danger/10 p-3 text-sm text-danger text-center">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-textMain">Email Address</label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-textMain">Password</label>
          </div>
          <Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        
        <Button type="submit" disabled={loading} className="w-full mt-6">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign in to your account"}
        </Button>
      </form>
      
      <p className="mt-6 text-center text-sm text-textMuted">
        Don't have an account? <Link to="/register" className="font-semibold text-accent hover:text-primaryHover transition-colors">Register here</Link>
      </p>
    </>
  );
};
