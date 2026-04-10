import { Outlet } from "react-router-dom";
import { Briefcase } from "lucide-react";

export const AuthLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-surface p-8 shadow-soft">
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20">
            <Briefcase className="h-6 w-6 text-accent" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-textMain">
            JobTracker AI
          </h2>
          <p className="mt-2 text-center text-sm text-textMuted">
            The intelligent way to organize your career
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};
