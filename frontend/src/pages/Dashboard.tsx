import React from 'react';
import { TrendingUp, Shield, FileCheck, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    {
      label: 'Total Transactions',
      value: '12,487',
      icon: TrendingUp,
      color: 'bg-blue-500',
      trend: '+245.8%',
    },
    {
      label: 'Ledger Integrity',
      value: '100%',
      icon: Shield,
      color: 'bg-green-500',
      trend: 'Verified',
    },
    {
      label: 'Pending Audits',
      value: '3',
      icon: FileCheck,
      color: 'bg-yellow-500',
      trend: '12 - 48h due',
    },
    {
      label: 'Active Entities',
      value: '47',
      icon: Users,
      color: 'bg-purple-500',
      trend: '+8 this month',
    },
  ];

  const systemHealth = [
    { label: 'Ledger Hash Chain', status: 'Verified', statusColor: 'text-green-600 bg-green-50' },
    { label: 'Database Connection', status: 'Healthy', statusColor: 'text-green-600 bg-green-50' },
    { label: 'Backup Status', status: 'Current', statusColor: 'text-green-600 bg-green-50' },
    { label: 'Audit Logs', status: 'Active', statusColor: 'text-green-600 bg-green-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, <span className="font-semibold text-gray-900">{user?.firstName}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-gray-600">{stat.trend}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-gray-600 text-sm mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
          <div className="space-y-3">
            {systemHealth.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <span className="text-gray-700 text-sm font-medium">{item.label}</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${item.statusColor}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-3">
            <StatRow label="Month-to-Date Transactions" value="3,247" />
            <StatRow label="Reconciliation Success Rate" value="99.8%" />
            <StatRow label="Average Transaction Time" value="142ms" />
            <StatRow label="System Uptime" value="99.99%" />
          </div>
        </div>
      </div>

      {/* Key Features Info */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Platform Highlights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex gap-2">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <p className="text-blue-800">
              <strong>Cryptographic Integrity:</strong> All entries hash-chained and immutable
            </p>
          </div>
          <div className="flex gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <p className="text-blue-800">
              <strong>Double-Entry Accounting:</strong> Ledger always balanced by design
            </p>
          </div>
          <div className="flex gap-2">
            <FileCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <p className="text-blue-800">
              <strong>Audit-Ready:</strong> Full traceability and compliance reporting
            </p>
          </div>
          <div className="flex gap-2">
            <Users className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <p className="text-blue-800">
              <strong>RBAC Enabled:</strong> Role-based access control for all operations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100">
      <span className="text-gray-600 text-sm">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}
