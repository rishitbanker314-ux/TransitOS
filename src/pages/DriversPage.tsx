import React, { useState, useEffect } from 'react';
import { DriverRepository } from '../features/drivers/repositories/driver.repository';
import { Driver } from '../features/drivers/types/driver.types';

const driverRepo = new DriverRepository();

function getStatusStyle(status: string) {
  switch (status) {
    case 'Available': return 'bg-green-500/20 text-green-400 border border-green-500/30';
    case 'Assigned': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case 'On Leave': return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    case 'Suspended': return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
  }
}

export function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  // Add Driver form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [licenseCategory, setLicenseCategory] = useState('LMV');
  const [licenseExpiry, setLicenseExpiry] = useState('');

  useEffect(() => {
    const unsubscribe = driverRepo.subscribeToAll((updatedDrivers) => {
      setDrivers(updatedDrivers);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await driverRepo.add({
        firstName,
        lastName,
        email,
        phone,
        licenseNumber: licenseNo,
        licenseCategory,
        licenseExpiry,
        dateOfBirth: '',
        joinedAt: new Date().toISOString(),
        status: 'Available',
        isArchived: false,
        version: 1,
        createdAt: new Date().toISOString(),
        createdBy: 'admin',
      } as any);
      setShowAddForm(false);
      setFirstName(''); setLastName(''); setEmail(''); setPhone('');
      setLicenseNo(''); setLicenseExpiry('');
    } catch (err) {
      console.error('Failed to add driver', err);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (driverId: string, newStatus: string) => {
    try {
      await driverRepo.updateStatus(driverId, newStatus);
    } catch (err) {
      console.error('Failed to update driver status', err);
    }
  };

  const filtered = drivers.filter(d => {
    const name = `${d.firstName} ${d.lastName}`.toLowerCase();
    return name.includes(search.toLowerCase()) || d.email?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6 border-b border-[#333] pb-2">3. Drivers & Safety Profiles</h2>
      
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search drivers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#1a1a1a] border border-[#333] px-3 py-1.5 rounded focus:outline-none focus:border-amber-500 w-64 text-white"
        />
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-amber-600 text-black px-4 py-1.5 rounded font-bold hover:bg-amber-500 transition-colors"
        >
          {showAddForm ? 'Cancel' : '+ Add Driver'}
        </button>
      </div>

      {/* Add Driver Form */}
      {showAddForm && (
        <form onSubmit={handleAddDriver} className="bg-[#111] border border-[#333] rounded-lg p-6 mb-8">
          <h3 className="text-[#aaa] uppercase tracking-wider text-sm mb-4">New Driver Details</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase text-[#666] mb-1">First Name</label>
              <input required value={firstName} onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs uppercase text-[#666] mb-1">Last Name</label>
              <input required value={lastName} onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs uppercase text-[#666] mb-1">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs uppercase text-[#666] mb-1">Phone</label>
              <input required value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs uppercase text-[#666] mb-1">License No.</label>
              <input required value={licenseNo} onChange={(e) => setLicenseNo(e.target.value)}
                placeholder="DL-XXXXX"
                className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs uppercase text-[#666] mb-1">License Category</label>
              <select value={licenseCategory} onChange={(e) => setLicenseCategory(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white focus:border-amber-500 focus:outline-none">
                <option value="LMV">LMV</option>
                <option value="HMV">HMV</option>
                <option value="TRANS">Transport</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase text-[#666] mb-1">License Expiry</label>
              <input type="date" required value={licenseExpiry} onChange={(e) => setLicenseExpiry(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-4 bg-amber-600 text-black px-6 py-2 rounded font-bold hover:bg-amber-500 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Add Driver'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-[#888] py-8 text-center animate-pulse">Loading drivers...</div>
      ) : filtered.length === 0 ? (
        <div className="text-[#888] py-8 text-center bg-[#111] rounded-lg border border-[#222]">
          {drivers.length === 0 ? 'No drivers found. Add your first driver!' : 'No drivers match your search.'}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-[#222]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#111]">
              <tr className="text-[#666] text-sm uppercase tracking-wider">
                <th className="py-3 px-4">Driver</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">License No.</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Expiry</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {filtered.map((driver) => {
                const expiry = (driver as any).licenseExpiry;
                const isExpired = expiry && new Date(expiry) < new Date();
                return (
                  <tr key={driver.id} className="hover:bg-[#1a1a1a] transition-colors group">
                    <td className="py-4 px-4">
                      <div className="font-semibold">{driver.firstName} {driver.lastName}</div>
                      <div className="text-xs text-[#666]">{driver.email}</div>
                    </td>
                    <td className="py-4 px-4 font-mono text-[#aaa] text-sm">{driver.phone}</td>
                    <td className="py-4 px-4 font-mono text-sm">{(driver as any).licenseNumber || '—'}</td>
                    <td className="py-4 px-4">{(driver as any).licenseCategory || '—'}</td>
                    <td className={`py-4 px-4 text-sm ${isExpired ? 'text-rose-500 font-bold' : 'text-[#aaa]'}`}>
                      {expiry ? new Date(expiry).toLocaleDateString() : '—'}
                      {isExpired && <span className="ml-1 text-xs">EXPIRED</span>}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded text-sm ${getStatusStyle(driver.status)}`}>
                        {driver.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <select
                        value={driver.status}
                        onChange={(e) => handleStatusChange(driver.id, e.target.value)}
                        className="bg-[#222] border border-[#444] text-[#ccc] text-sm rounded px-2 py-1 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <option value="Available">Available</option>
                        <option value="Assigned">On Trip</option>
                        <option value="On Leave">Off Duty</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 text-amber-600 text-sm">
        Rule: Expired license or Suspended status → blocked from trip assignment
      </div>
    </div>
  );
}
