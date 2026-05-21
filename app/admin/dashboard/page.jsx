export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Admin Dashboard</h1>
      <p className="text-slate-500 mb-8">Welcome back! Here is an overview of your cafe.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placeholder cards for dashboard stats */}
        <div className="glass-panel p-6 rounded-3xl">
          <h3 className="text-lg font-bold text-slate-700 mb-2">Total Menu Items</h3>
          <p className="text-3xl font-black text-sky-500">...</p>
        </div>
        <div className="glass-panel p-6 rounded-3xl">
          <h3 className="text-lg font-bold text-slate-700 mb-2">Total Accounts</h3>
          <p className="text-3xl font-black text-sky-500">...</p>
        </div>
        <div className="glass-panel p-6 rounded-3xl">
          <h3 className="text-lg font-bold text-slate-700 mb-2">Pending Orders</h3>
          <p className="text-3xl font-black text-sky-500">...</p>
        </div>
      </div>
    </div>
  );
}
