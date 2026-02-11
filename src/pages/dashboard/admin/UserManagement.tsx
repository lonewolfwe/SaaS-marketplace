import { useState, useEffect, useCallback } from 'react';
import { MoreHorizontal, Search, RefreshCw } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/config';

interface User {
    _id: string;
    email: string;
    roles: string[];
    profile: {
        firstName: string;
        lastName: string;
    };
    status: string;
    createdAt: string;
}

export default function UserManagement() {
    const { token } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.status === 'success') {
                setUsers(data.data.users);
            }
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) fetchUsers();
    }, [token, fetchUsers]);

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            (user.profile.firstName + ' ' + user.profile.lastName).toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.roles.includes(roleFilter);
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-4 font-sans text-sm animate-fade-in">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div>
                    <h2 className="font-bold text-lg leading-none">User Database</h2>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">Total Records: {users.length}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={fetchUsers} className="h-8 text-xs">
                        <RefreshCw className={`h-3 w-3 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button size="sm" className="h-8 text-xs bg-primary text-primary-foreground">
                        Invite User
                    </Button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-4 bg-card border border-border p-2 rounded-sm">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="flex h-8 w-full rounded-sm bg-muted/20 border border-border/50 px-3 pl-8 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="h-4 w-px bg-border mx-2" />
                <div className="flex items-center gap-2">
                    {['all', 'buyer', 'seller', 'admin'].map(r => (
                        <button
                            key={r}
                            onClick={() => setRoleFilter(r)}
                            className={cn(
                                "px-3 py-1 text-xs font-medium rounded-sm uppercase tracking-wider transition-colors",
                                roleFilter === r ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"
                            )}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            {/* Data Grid */}
            <div className="border border-border rounded-sm bg-background overflow-hidden relative min-h-[200px]">
                {isLoading && users.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : null}

                <table className="w-full text-xs text-left">
                    <thead className="bg-muted/10 text-muted-foreground font-mono border-b border-border uppercase tracking-wider">
                        <tr>
                            <th className="h-10 px-4 font-medium w-[100px]">ID</th>
                            <th className="h-10 px-4 font-medium">Identity</th>
                            <th className="h-10 px-4 font-medium">Role</th>
                            <th className="h-10 px-4 font-medium">Status</th>
                            <th className="h-10 px-4 font-medium">Joined</th>
                            <th className="h-10 px-4 font-medium text-right w-[50px]"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                        {filteredUsers.map((user) => (
                            <tr key={user._id} className="group hover:bg-muted/10 transition-colors">
                                <td className="px-4 py-3 font-mono text-muted-foreground">...{user._id.slice(-6)}</td>
                                <td className="px-4 py-3">
                                    <div className="font-semibold">{user.profile.firstName} {user.profile.lastName}</div>
                                    <div className="text-muted-foreground text-[10px]">{user.email}</div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1">
                                        {user.roles.map(role => (
                                            <span key={role} className={cn(
                                                "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono uppercase border",
                                                role === 'admin' ? "bg-purple-50 text-purple-700 border-purple-200" :
                                                    role === 'seller' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                        "bg-gray-50 text-gray-700 border-gray-200"
                                            )}>
                                                {role}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5">
                                        <div className={cn("h-1.5 w-1.5 rounded-full", user.status === 'active' ? "bg-green-500" : "bg-red-500")} />
                                        <span className="capitalize">{user.status}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-mono text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td className="px-4 py-3 text-right">
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <MoreHorizontal className="h-3 w-3" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!isLoading && filteredUsers.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground italic">No records found.</div>
                )}
            </div>
        </div>
    );
}
