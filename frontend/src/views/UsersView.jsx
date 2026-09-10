import React, { useState, useMemo } from 'react';
import {
  UserCog,
  Shield,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Mail,
  Clock,
  Briefcase,
  X,
  AlertCircle,
  Key
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

const ROLE_STYLES = {
  ADMIN: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  PROJECT_MANAGER: 'bg-[#4F7CFF]/15 text-[#39D9FF] border-[#4F7CFF]/30',
  CLIENT: 'bg-[#F5B942]/15 text-[#F5B942] border-[#F5B942]/30',
  EMPLOYEE: 'bg-[#18C997]/15 text-[#18C997] border-[#18C997]/30',
  EXECUTIVE: 'bg-[#FF4D6D]/15 text-[#FF859B] border-[#FF4D6D]/30'
};

const ROLE_PERMISSIONS = [
  { role: 'Project Manager', key: 'PROJECT_MANAGER', permissions: 'Full tactical cockpit, WBS planning, task allocation, 1-click AI interventions, risk recalculation' },
  { role: 'Developer / Engineer', key: 'EMPLOYEE', permissions: 'Execution cockpit, capacity meters, blocker reporting, Git PR linkage, effort hours logging' },
  { role: 'Client / Stakeholder', key: 'CLIENT', permissions: 'Milestone tracking, formal deliverable sign-offs with audit signatures, Change Request initiation' },
  { role: 'Executive Leadership', key: 'EXECUTIVE', permissions: 'Portfolio health indices, budget burn rates, strategic risk distributions, cross-project oversight' },
  { role: 'Platform Administrator', key: 'ADMIN', permissions: 'System governance, user provisioning, RBAC role assignments, status management, audit ledger' }
];

export default function UsersView() {
  const { users, toggleUserStatus, addUser, showToast, activeRole } = useProject();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // New user form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'EMPLOYEE',
    title: '',
    capacityHoursPerWeek: 40
  });

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchRole = selectedRole === 'ALL' || u.role === selectedRole;
      const matchSearch =
        u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.title && u.title.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchRole && matchSearch;
    });
  }, [users, selectedRole, searchQuery]);

  const activeCount = users.filter(u => u.isActive !== false).length;
  const deactivatedCount = users.length - activeCount;

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      showToast('Please provide both user name and email', 'warning');
      return;
    }
    addUser({
      fullName: formData.fullName,
      email: formData.email,
      role: formData.role,
      title: formData.title || 'Technical Specialist',
      capacityHoursPerWeek: Number(formData.capacityHoursPerWeek) || 40,
      avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + users.length}?w=150&auto=format&fit=crop&q=80`
    });
    setIsAddUserModalOpen(false);
    setFormData({
      fullName: '',
      email: '',
      role: 'EMPLOYEE',
      title: '',
      capacityHoursPerWeek: 40
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#252A3A]">
        <div>
          <div className="label-tech text-[#39D9FF]">GOVERNANCE & RBAC</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7FF] tracking-tight mt-0.5">
            PLATFORM USER & ROLE ADMINISTRATION
          </h1>
          <p className="text-xs sm:text-sm text-[#8992A8] mt-1">
            "Manage registered accounts, weekly capacity allocations, role privileges, and security access."
          </p>
        </div>

        <button
          onClick={() => setIsAddUserModalOpen(true)}
          className="btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 w-fit"
        >
          <Plus size={14} className="stroke-[2.5]" />
          <span>Provision User Account</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="surface-card rounded-2xl p-4 border border-[#252A3A]">
          <div className="label-tech text-[#8992A8]">TOTAL REGISTERED</div>
          <div className="text-3xl font-black font-mono text-[#F4F7FF] mt-1">{users.length}</div>
          <div className="text-[10px] text-[#8992A8] mt-0.5">System-wide Identities</div>
        </div>

        <div className="surface-card rounded-2xl p-4 border border-[#18C997]/30">
          <div className="label-tech text-[#18C997]">ACTIVE ACCOUNTS</div>
          <div className="text-3xl font-black font-mono text-[#18C997] mt-1">{activeCount}</div>
          <div className="text-[10px] text-[#18C997] mt-0.5">Authorized & Synced</div>
        </div>

        <div className="surface-card rounded-2xl p-4 border border-[#FF4D6D]/30">
          <div className="label-tech text-[#FF4D6D]">DEACTIVATED</div>
          <div className="text-3xl font-black font-mono text-[#FF4D6D] mt-1">{deactivatedCount}</div>
          <div className="text-[10px] text-[#FF4D6D] mt-0.5">Access Suspended</div>
        </div>

        <div className="surface-card rounded-2xl p-4 border border-[#4F7CFF]/30">
          <div className="label-tech text-[#39D9FF]">AVG CAPACITY</div>
          <div className="text-3xl font-black font-mono text-[#39D9FF] mt-1">36.5h</div>
          <div className="text-[10px] text-[#8992A8] mt-0.5">Per Member / Week</div>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="surface-card rounded-2xl p-4 border border-[#252A3A] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8992A8]" />
          <input
            type="text"
            placeholder="Search by name, email, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#0D101A] border border-[#252A3A] text-xs text-[#F4F7FF] placeholder-[#555E73] focus:outline-none focus:border-[#4F7CFF]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'PROJECT_MANAGER', 'EMPLOYEE', 'CLIENT', 'EXECUTIVE', 'ADMIN'].map(r => (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition shrink-0 ${
                selectedRole === r
                  ? 'bg-[#4F7CFF] text-white shadow-md shadow-[#4F7CFF]/30'
                  : 'bg-[#0D101A] text-[#8992A8] hover:text-[#F4F7FF] border border-[#252A3A]'
              }`}
            >
              {r === 'ALL' ? 'All Roles' : r.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="surface-card rounded-2xl border border-[#252A3A] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#8992A8]">
            <thead className="bg-[#0D101A] text-[10px] font-bold text-[#8992A8] uppercase tracking-wider border-b border-[#252A3A] font-mono">
              <tr>
                <th className="p-3.5">User Identity</th>
                <th className="p-3.5">Organizational Email</th>
                <th className="p-3.5">Assigned Role</th>
                <th className="p-3.5">Designation / Title</th>
                <th className="p-3.5">Weekly Bandwidth</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Access Governance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252A3A]">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-[#171A2A] transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                        alt={u.fullName}
                        className="w-8 h-8 rounded-full object-cover border border-[#252A3A]"
                      />
                      <div>
                        <span className="font-bold text-[#F4F7FF] block">{u.fullName}</span>
                        <span className="text-[10px] text-[#555E73] font-mono">ID: {u.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5 font-mono text-[11px] text-[#39D9FF]">
                    {u.email}
                  </td>

                  <td className="p-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border font-mono ${ROLE_STYLES[u.role] || 'bg-slate-800 text-slate-300'}`}>
                      {u.role}
                    </span>
                  </td>

                  <td className="p-3.5 text-[#F4F7FF]">
                    {u.title || 'Specialist'}
                  </td>

                  <td className="p-3.5 font-mono text-[#F4F7FF]">
                    <span className="px-2 py-0.5 rounded bg-[#0D101A] border border-[#252A3A]">
                      {u.capacityHoursPerWeek || 40}h / week
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                      u.isActive !== false ? 'badge-success' : 'badge-critical'
                    }`}>
                      {u.isActive !== false ? '● ACTIVE' : '○ DEACTIVATED'}
                    </span>
                  </td>

                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        u.isActive !== false
                          ? 'bg-[#FF4D6D]/15 text-[#FF859B] hover:bg-[#FF4D6D]/25 border border-[#FF4D6D]/30'
                          : 'bg-[#18C997]/15 text-[#18C997] hover:bg-[#18C997]/25 border border-[#18C997]/30'
                      }`}
                    >
                      {u.isActive !== false ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RBAC Role Definitions & Permission Matrix */}
      <div className="surface-card rounded-2xl p-6 border border-[#252A3A] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#252A3A]">
          <div className="flex items-center gap-2">
            <Key size={16} className="text-[#39D9FF]" />
            <h2 className="text-sm font-bold text-[#F4F7FF] uppercase tracking-wider">
              RBAC ROLE CAPABILITIES & PERMISSION MATRIX
            </h2>
          </div>
          <span className="text-xs text-[#8992A8] font-mono">5 Persona Hierarchy</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {ROLE_PERMISSIONS.map(p => (
            <div key={p.key} className="p-4 rounded-xl bg-[#0D101A] border border-[#252A3A] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#F4F7FF]">{p.role}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border font-mono ${ROLE_STYLES[p.key]}`}>
                  {p.key}
                </span>
              </div>
              <p className="text-[#8992A8] text-[11px] leading-relaxed">
                {p.permissions}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ADD USER MODAL */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="surface-card rounded-2xl border border-[#252A3A] w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#252A3A]">
              <div className="flex items-center gap-2">
                <UserCog size={18} className="text-[#39D9FF]" />
                <h3 className="text-base font-bold text-[#F4F7FF]">Provision Platform Account</h3>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-[#8992A8] hover:text-[#F4F7FF]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8992A8] font-semibold mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Batra"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0D101A] border border-[#252A3A] text-[#F4F7FF] focus:outline-none focus:border-[#4F7CFF]"
                />
              </div>

              <div>
                <label className="block text-[#8992A8] font-semibold mb-1.5">Organizational Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@intelix.gov.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0D101A] border border-[#252A3A] text-[#F4F7FF] focus:outline-none focus:border-[#4F7CFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8992A8] font-semibold mb-1.5">System Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0D101A] border border-[#252A3A] text-[#F4F7FF] focus:outline-none focus:border-[#4F7CFF]"
                  >
                    <option value="EMPLOYEE">Developer / Engineer</option>
                    <option value="PROJECT_MANAGER">Project Manager</option>
                    <option value="CLIENT">Client / Sponsor</option>
                    <option value="EXECUTIVE">Executive / Leadership</option>
                    <option value="ADMIN">Platform Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8992A8] font-semibold mb-1.5">Weekly Capacity</label>
                  <input
                    type="number"
                    min={5}
                    max={60}
                    value={formData.capacityHoursPerWeek}
                    onChange={(e) => setFormData({ ...formData, capacityHoursPerWeek: +e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0D101A] border border-[#252A3A] text-[#F4F7FF] focus:outline-none focus:border-[#4F7CFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8992A8] font-semibold mb-1.5">Official Title / Designation</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Cloud Infrastructure Specialist"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0D101A] border border-[#252A3A] text-[#F4F7FF] focus:outline-none focus:border-[#4F7CFF]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#252A3A]">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="btn-secondary px-4 py-2 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-5 py-2 rounded-xl text-xs font-bold"
                >
                  Provision Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
