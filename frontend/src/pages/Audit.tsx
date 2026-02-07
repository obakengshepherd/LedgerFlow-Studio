import React from 'react';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Audit() {
  const auditItems = [
    {
      label: 'Hash Chain Verification',
      status: 'passed',
      details: 'All 12,487 entries verified',
    },
    {
      label: 'Double Entry Validation',
      status: 'passed',
      details: '100% balanced transactions',
    },
    {
      label: 'Timestamp Consistency',
      status: 'passed',
      details: 'Chronological order maintained',
    },
    {
      label: 'Signature Validation',
      status: 'warning',
      details: '3 entries pending verification',
    },
  ];

  const reports = [
    { title: 'SARB Monthly Report', date: '2026-02-01' },
    { title: 'FICA Transaction Summary', date: '2026-01-31' },
    { title: 'Tax Compliance Export', date: '2026-01-28' },
    { title: 'Internal Audit Trail', date: '2026-01-25' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Audit & Compliance</h1>
        <p className="text-gray-600 mt-1">Financial audit trails and regulatory reports</p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Integrity Check */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Integrity Check Results</h2>
          </div>

          <div className="space-y-3">
            {auditItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.details}</p>
                </div>
                {item.status === 'passed' ? (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Compliance Reports</h2>

          <div className="space-y-3">
            {reports.map((report, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer bg-gray-50"
              >
                <span className="text-sm font-medium text-gray-900">{report.title}</span>
                <span className="text-xs text-gray-500">{report.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Trail Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Audit Trail Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <AuditStat label="Total Actions Logged" value="2,847" />
          <AuditStat label="User Logins" value="1,243" />
          <AuditStat label="Data Modifications" value="1,158" />
          <AuditStat label="Security Events" value="446" />
        </div>
      </div>
    </div>
  );
}

function AuditStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
  );
}
