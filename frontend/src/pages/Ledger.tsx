import React from 'react';
import { Database, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';

export default function Ledger() {
  const { api } = useAuth();

  const { data: ledgerData, isLoading } = useQuery({
    queryKey: ['ledger-entries'],
    queryFn: async () => {
      const response = await api.get('/api/v1/ledger/entries', {
        params: { limit: 20 },
      });
      return response.data;
    },
  });

  const { data: integrityData } = useQuery({
    queryKey: ['ledger-integrity'],
    queryFn: async () => {
      const response = await api.get('/api/v1/ledger/verify');
      return response.data;
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Ledger Entries</h1>
        <p className="text-gray-600 mt-1">Immutable append-only financial ledger with cryptographic integrity</p>
      </div>

      {/* Integrity Status */}
      {integrityData && (
        <div className={`rounded-xl border-2 p-6 ${integrityData.valid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className={integrityData.valid ? 'w-6 h-6 text-green-600' : 'w-6 h-6 text-red-600'} />
            <h2 className={integrityData.valid ? 'text-lg font-semibold text-green-900' : 'text-lg font-semibold text-red-900'}>
              {integrityData.valid ? 'Ledger Integrity Verified' : 'Integrity Check Failed'}
            </h2>
          </div>
          <p className={integrityData.valid ? 'text-green-700' : 'text-red-700'}>
            {integrityData.totalEntries} entries verified • {integrityData.errors.length} errors
          </p>
        </div>
      )}

      {/* Cryptographic Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Cryptographic Hash Chain</h2>
            <p className="text-sm text-gray-600">Each entry is cryptographically linked via SHA-256 hashing</p>
          </div>
        </div>
      </div>

      {/* Entries */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center text-gray-500 py-8">Loading ledger entries...</div>
        ) : ledgerData?.entries.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No ledger entries yet</div>
        ) : (
          ledgerData.entries.map((entry: any, idx: number) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all bg-white"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm font-semibold text-gray-900">{entry.transactionId}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${entry.type === 'DEBIT' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {entry.type}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {entry.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{entry.description || 'No description'}</p>

                  {/* Hash Chain Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-gray-50 p-2 rounded font-mono">
                      <span className="text-gray-500">Account:</span>
                      <span className="ml-1 text-gray-900 font-semibold">{entry.accountId}</span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded font-mono">
                      <span className="text-gray-500">Hash:</span>
                      <span className="ml-1 text-gray-900">{entry.hash.substring(0, 16)}...</span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded font-mono">
                      <span className="text-gray-500">Prev:</span>
                      <span className="ml-1 text-gray-900">{entry.previousHash ? entry.previousHash.substring(0, 16) + '...' : 'GENESIS'}</span>
                    </div>
                  </div>
                </div>

                {/* Amount & Date */}
                <div className="text-right ml-4">
                  <div className={`text-lg font-bold ${entry.type === 'DEBIT' ? 'text-red-600' : 'text-green-600'}`}>
                    {entry.type === 'DEBIT' ? '-' : '+'}R {parseFloat(entry.amount).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{new Date(entry.timestamp).toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
