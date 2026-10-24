import { useState } from "react";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    login(email, isLogin ? "Dear user" : name);
    navigate("/dashboard");
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-rose-50 p-8 rounded-2xl shadow-lg border border-primary">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          {isLogin ? "Sign In!" : "Create an Account"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col gap-4">
          {!isLogin && (
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Please enter your Full Name"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-rose-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          )}

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Plese enter your email"
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-rose-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />

          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Please enter your chosen password"
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-rose-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />

          <Button type="submit" className="w-full mt-2">
            {isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account?" : "Aleady have an account?"}
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </Button>
        </div>
      </div>
    </div>
  );
}
