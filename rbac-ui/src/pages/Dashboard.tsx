import { useAuth } from "../contexts/AuthContext";
import { LogOut, Shield, User, Settings, LayoutDashboard } from "lucide-react";

export default function Dashboard() {
  const { roles, logout } = useAuth();

  const navItems = [
    { href: "/admin", label: "Admin", icon: Settings, color: "from-purple-500 to-pink-500" },
    { href: "/protected-user", label: "User Area", icon: User, color: "from-blue-500 to-cyan-500" },
    { href: "/protected-manager", label: "Manager Area", icon: Shield, color: "from-green-500 to-emerald-500" },
    { href: "/protected-admin", label: "Admin Area", icon: LayoutDashboard, color: "from-orange-500 to-red-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-3">
                Welcome Back
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-medium">Your roles:</span>
                {roles.length ? (
                  <div className="flex gap-2 flex-wrap">
                    {roles.map((role) => (
                      <span
                        key={role}
                        className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold rounded-full shadow-sm"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-400 italic">(none)</span>
                )}
              </div>
            </div>
         
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-slate-300 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} shadow-lg`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {item.label}
                      </h3>
                      <p className="text-sm text-slate-500">
                        Access {item.label.toLowerCase()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
              </a>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Select an area to navigate to its respective section
          </p>
        </div>
      </div>
    </div>
  );
}