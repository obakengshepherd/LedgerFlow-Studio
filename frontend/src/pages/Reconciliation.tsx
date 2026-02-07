import React, { useState } from 'react';
import { Settings, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Reconciliation() {
  const { api } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('');

  const reconciliations = [
    {
      id: '1',
      accountId: 'BANK001',
      period: 'January 2026',
      ledgerBalance: 125000.00,
      sourceBalance: 125000.00,
      difference: 0.00,
      status: 'COMPLETED',
    },
    {
      id: '2',
      accountId: 'AR100',
      period: 'January 2026',
      ledgerBalance: 87500.50,
      sourceBalance: 87500.50,
      difference: 0.00,
      status: 'COMPLETED',
    },
    {
      id: '3',
      accountId: 'AP200',
      period: 'Febr February 2026',
      ledgerBalance: 45200.00,
      sourceBalance: 45200.00,
      difference: 0.00,
      status: 'IN_PROGRESS',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reconciliation</h1>
          <p className="text-gray-600 mt-1">Account reconciliation and variance analysis</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          <Download className="w-5 h-5 mr-2" />
          Export Report
        </button>
      </div>

      {/* Period Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Period</label>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">All Periods</option>
          <option value="2026-02">February 2026</option>
          <option value="2026-01">January 2026</option>
          <option value="2025-12">December 2025</option>
        </select>
      </div>

      {/* Reconciliation Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ledger Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Difference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reconciliations.map((recon) => (
                <tr key={recon.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">{recon.accountId}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{recon.period}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">R {recon.ledgerBalance.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">R {recon.sourceBalance.toFixed(2)}</td>
                  <td className={`px-6 py-4 text-sm font-semibold ${recon.difference === 0 ? 'text-green-600' : 'text-red-600'}`}>
                    R {recon.difference.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        recon.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {recon.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reconciliation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-gray-600 text-sm font-medium">Completed Reconciliations</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">47</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-gray-600 text-sm font-medium">Balanced Accounts</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">46</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-gray-600 text-sm font-medium">Pending Review</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">1</p>
        </div>
      </div>
    </div>
  );
}
