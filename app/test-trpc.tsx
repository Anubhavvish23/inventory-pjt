"use client";
import { useState } from 'react';
import { useInventory } from '@/hooks/use-inventory';

export default function TestTRPC() {
  const {
    products,
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
    logCheckout,
    getProductHistory,
  } = useInventory();
  const [newName, setNewName] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pickedBy, setPickedBy] = useState('');

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">tRPC Backend Test</h1>
      <div>
        <input
          className="border p-2 mr-2"
          placeholder="Product name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => {
            createProduct.mutate({
              name: newName,
              description: 'Test product description',
              category: 'Test Category',
              location: 'Test Location',
              status: 'AVAILABLE',
            });
            setNewName('');
          }}
        >
          Add Product
        </button>
      </div>
      <ul className="space-y-2">
        {products.map(p => (
          <li key={p.id} className="border p-2 flex items-center justify-between">
            <span>{p.name} ({p.status})</span>
            <div className="space-x-2">
              <button
                className="bg-yellow-500 text-white px-2 py-1 rounded"
                onClick={() => updateProduct.mutate({ id: p.id, data: { status: 'IN_EVENT', pickedBy: 'Tester' } })}
              >
                Set In-Event
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => deleteProduct.mutate({ id: p.id })}
              >
                Delete
              </button>
              <button
                className="bg-green-500 text-white px-2 py-1 rounded"
                onClick={() => setSelectedId(p.id)}
              >
                View History
              </button>
            </div>
          </li>
        ))}
      </ul>
      {selectedId && (
        <div className="border p-4 mt-4">
          <h2 className="font-bold mb-2">Checkout History</h2>
          <button className="mb-2 text-sm underline" onClick={() => setSelectedId(null)}>Close</button>
          <History productId={selectedId} getProductHistory={getProductHistory} />
          <div className="mt-2">
            <input
              className="border p-1 mr-2"
              placeholder="Picked By"
              value={pickedBy}
              onChange={e => setPickedBy(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-2 py-1 rounded"
              onClick={() => {
                logCheckout.mutate({ productId: selectedId, status: 'IN_EVENT', pickedBy });
                setPickedBy('');
              }}
            >
              Log In-Event
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function History({ productId, getProductHistory }: { productId: string, getProductHistory: any }) {
  const { data, isLoading } = getProductHistory({ productId });
  if (isLoading) return <div>Loading history...</div>;
  if (!data?.length) return <div>No history.</div>;
  return (
    <ul className="text-sm space-y-1">
      {data.map((log: any) => (
        <li key={log.id}>{log.status} {log.pickedBy ? `by ${log.pickedBy}` : ''} at {new Date(log.timestamp).toLocaleString()}</li>
      ))}
    </ul>
  );
} 