"use client";

import { memo, useState } from "react";
import { Loader2 } from "lucide-react";
import { authApi } from "@/lib/api";
import logo from "@/public/logo.svg"
import Image from "next/image";

export interface AuthScreenProps {
  mode: "login" | "forgot";
  onLogin: (credentials: { email: string; password: string }) => Promise<void>;
  onModeChange: (mode: "login" | "forgot") => void;
  isLoading?: boolean;
  error?: string | null;
}

export const AuthScreen = memo(function AuthScreen({
  mode,
  onLogin,
  onModeChange,
  isLoading = false,
  error = null,
}: AuthScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || isLoading) return;
    await onLogin({ email, password });
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || forgotLoading) return;
    setForgotLoading(true);
    setForgotError(null);
    setForgotMessage(null);

    try {
      const response = await authApi.forgotPassword({ email: forgotEmail });
      setForgotMessage(
        response.message || "If the account exists, reset instructions have been sent."
      );
    } catch (err: any) {
      setForgotError(err.message || "Failed to request password reset");
    } finally {
      setForgotLoading(false);
    }
  };

  if (mode === "forgot") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F2F2F2] px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-[#333333]">
            Reset your password
          </h1>
          <p className="mt-2 text-sm text-[#666666]">
            Enter your email to receive reset instructions.
          </p>

          {forgotError && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-600">
              {forgotError}
            </div>
          )}

          {forgotMessage ? (
            <div className="mt-6 rounded-lg bg-[#F9EFE1] p-4 text-sm text-[#666666]">
              {forgotMessage}
            </div>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={handleForgotSubmit}>
              <input
                required
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="admin@example.com"
                className="h-10 w-full rounded-lg border border-[#e6e6e6] bg-white px-3 text-sm text-[#333333] placeholder:text-[#999999] outline-none focus:border-[#FFA136] focus:ring-2 focus:ring-[#F9EFE1]"
              />
              <button
                type="submit"
                disabled={forgotLoading}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#FFA136] text-sm font-bold text-white hover:bg-[#ff941a] disabled:opacity-60"
              >
                {forgotLoading && <Loader2 size={16} className="animate-spin" />}
                Send reset link
              </button>
            </form>
          )}
          <button
            type="button"
            onClick={() => {
              setForgotError(null);
              setForgotMessage(null);
              onModeChange("login");
            }}
            className="mt-5 text-xs font-semibold text-[#FFA136] hover:underline"
          >
            Back to sign in
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F2F2F2] px-4">
      <form
        onSubmit={handleLoginSubmit}
        className="w-full max-w-md space-y-4 rounded-2xl bg-white p-8 shadow-sm"
      >
        <div className="mb-6 flex flex-col items-center justify-center ">
          {/* <h1 className="text-2xl font-bold text-[#333333]">Digital Grandpa</h1> */}
          <Image src={logo} alt="Logo" width={260} height={40} />
          <p className=" text-xs text-[#666666]">Sign in to admin portal</p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-600">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-semibold text-[#666666]">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            className="h-10 w-full rounded-lg border border-[#e6e6e6] bg-white px-3 text-sm text-[#333333] placeholder:text-[#999999] outline-none focus:border-[#FFA136] focus:ring-2 focus:ring-[#F9EFE1]"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-[#666666]">Password</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-10 w-full rounded-lg border border-[#e6e6e6] bg-white px-3 text-sm text-[#333333] placeholder:text-[#999999] outline-none focus:border-[#FFA136] focus:ring-2 focus:ring-[#F9EFE1]"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onModeChange("forgot")}
            className="text-xs font-semibold text-[#FFA136] hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#FFA136] text-sm font-bold text-white hover:bg-[#ff941a] disabled:opacity-60"
        >
          {isLoading && <Loader2 size={16} className="animate-spin" />}
          Sign in
        </button>
      </form>
    </main>
  );
});

