import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase/supabaseClient';
import toast from 'react-hot-toast';
import { useAuth, type UserRole } from '../../context/AuthContext';
import { Shield, ShieldAlert, User as UserIcon, Trash2, Unlink } from 'lucide-react';
import { localDb } from '../../utils/localDb';
import type { Member } from '../../types';

interface Profile {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

const SettingsDashboard: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
      
      const allMembers = await localDb.getMembers();
      setMembers(allMembers);
    } catch (error: any) {
      toast.error('Failed to load users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (profileId: string, newRole: UserRole) => {
    if (!newRole) return;
    
    // Prevent removing your own admin privileges accidentally
    if (profileId === user?.id && newRole !== 'ADMIN') {
      const confirmed = window.confirm("Are you sure you want to remove your own ADMIN role? You will lose access to this page immediately.");
      if (!confirmed) return;
    }

    setUpdatingId(profileId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', profileId);

      if (error) throw error;

      toast.success('User role updated successfully');
      setProfiles(profiles.map(p => p.id === profileId ? { ...p, role: newRole } : p));
      
      // If user demoted themselves, reload to trigger route protection
      if (profileId === user?.id && newRole !== 'ADMIN') {
        window.location.reload();
      }
    } catch (error: any) {
      toast.error('Failed to update role: ' + error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (profileId: string) => {
    if (profileId === user?.id) {
      toast.error("You cannot delete your own profile.");
      return;
    }
    
    if (!window.confirm("Are you sure you want to delete this user? This will remove their app access and unlink any claimed member profile.")) return;
    
    setUpdatingId(profileId);
    try {
      // 1. Find if they have a linked member profile and clear it
      const linkedMember = members.find(m => m.userId === profileId);
      if (linkedMember) {
        linkedMember.userId = undefined;
        linkedMember.updatedAt = new Date().toISOString();
        await localDb.saveMembers([linkedMember]);
      }
      
      // 2. Delete the profile record (revokes access)
      const { error } = await supabase.from('profiles').delete().eq('id', profileId);
      if (error) throw error;
      
      toast.success('User deleted successfully');
      setProfiles(profiles.filter(p => p.id !== profileId));
      if (linkedMember) {
        setMembers(members.map(m => m.id === linkedMember.id ? linkedMember : m));
      }
    } catch (err: any) {
      toast.error('Failed to delete user: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUnlink = async (memberId: string) => {
    if (!window.confirm("Are you sure you want to unlink this member profile from this user?")) return;
    setUpdatingId(memberId);
    try {
      const member = members.find(m => m.id === memberId);
      if (member) {
        member.userId = undefined;
        member.updatedAt = new Date().toISOString();
        await localDb.saveMembers([member]);
        setMembers(members.map(m => m.id === memberId ? member : m));
        toast.success("Profile unlinked successfully");
      }
    } catch (err: any) {
      toast.error('Failed to unlink: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLinkUser = async (userId: string, memberId: string) => {
    if (!memberId) return;
    setUpdatingId(userId);
    try {
      const member = members.find(m => m.id === memberId);
      if (member) {
        member.userId = userId;
        member.updatedAt = new Date().toISOString();
        await localDb.saveMembers([member]);
        setMembers(members.map(m => m.id === memberId ? member : m));
        toast.success("Profile linked successfully");
      }
    } catch (err: any) {
      toast.error('Failed to link: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container py-8 animate-fade-in flex justify-center items-center" style={{ minHeight: '60vh' }}>
        <p className="text-slate-500 font-medium">Loading user settings...</p>
      </div>
    );
  }

  return (
    <div className="container py-8 animate-fade-in max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Shield className="text-primary-600" size={28} />
            System Settings
          </h1>
          <p className="text-slate-500 mt-1">Manage user roles and system access.</p>
        </div>
      </div>

      <div className="glass-card p-6 md:p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <ShieldAlert className="text-rose-500" size={22} />
          User Role Management
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-3 pt-2 px-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">User</th>
                <th className="pb-3 pt-2 px-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Email</th>
                <th className="pb-3 pt-2 px-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Current Role</th>
                <th className="pb-3 pt-2 px-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Linked Profile</th>
                <th className="pb-3 pt-2 px-4 font-semibold text-sm text-slate-500 uppercase tracking-wider text-right">Assign Role</th>
                <th className="pb-3 pt-2 px-4 font-semibold text-sm text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => {
                const linkedMember = members.find(m => m.userId === profile.id);
                return (
                <tr key={profile.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center">
                        <UserIcon size={16} />
                      </div>
                      <span className="font-medium text-slate-700 font-mono text-xs">
                        {profile.id.substring(0, 8)}...
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-600">{profile.email}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${
                      profile.role === 'ADMIN' ? 'bg-rose-100 text-rose-700' :
                      profile.role === 'INTERNAL_MANAGER' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {profile.role || 'MEMBER'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {linkedMember ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-700">{linkedMember.fullName}</span>
                        <button 
                          onClick={() => handleUnlink(linkedMember.id)}
                          disabled={updatingId === linkedMember.id}
                          className="text-slate-400 hover:text-rose-500 transition-colors"
                          title="Unlink profile"
                        >
                          <Unlink size={14} />
                        </button>
                      </div>
                    ) : (
                      <select
                        className="bg-white border border-slate-200 text-slate-500 text-xs font-medium rounded-md focus:ring-primary-500 focus:border-primary-500 py-1.5 px-2 max-w-[140px]"
                        onChange={(e) => handleLinkUser(profile.id, e.target.value)}
                        value=""
                        disabled={updatingId === profile.id}
                      >
                        <option value="">Link Member...</option>
                        {members
                          .filter(m => !m.userId)
                          .sort((a, b) => a.cycleOrder - b.cycleOrder)
                          .map(m => (
                            <option key={m.id} value={m.id}>{m.fullName}</option>
                          ))
                        }
                      </select>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <select
                      className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2"
                      value={profile.role || 'MEMBER'}
                      onChange={(e) => handleRoleChange(profile.id, e.target.value as UserRole)}
                      disabled={updatingId === profile.id}
                    >
                      <option value="MEMBER">Member</option>
                      <option value="INTERNAL_MANAGER">Internal Manager</option>
                      <option value="ADMIN">Administrator</option>
                    </select>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleDeleteUser(profile.id)}
                      disabled={updatingId === profile.id || profile.id === user?.id}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-30"
                      title="Delete User"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
          
          {profiles.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No registered users found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsDashboard;
