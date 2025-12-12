import React, { useEffect, useState } from "react";
import { Trash2, CheckCircle, Circle, LogOut, Plus, Search, ShieldAlert, UserX, Edit2, Settings, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = ({ setAuth }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [todos, setTodos] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showSettings, setShowSettings] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // FETCH DATA
  const getProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5000/dashboard/?name=${search}&filter=${filter}`, {
        method: "GET",
        headers: { token: localStorage.getItem("token") }
      });
      const parseData = await res.json();
      if (parseData.username) {
          setName(parseData.username);
          setRole(parseData.role);
          setTodos(parseData.todos || []);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const getAllUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/admin/users", {
            method: "GET",
            headers: { token: localStorage.getItem("token") }
        });
        const parseData = await res.json();
        setAllUsers(parseData);
      } catch (err) {
          console.error(err.message);
      }
  };

  useEffect(() => {
    getProfile();
  }, [search, filter]);

  useEffect(() => {
    if (role === 'admin') getAllUsers();
  }, [role]);

  // ACTIONS

  const onSubmitTodo = async e => {
    e.preventDefault();
    if (!description) return;
    try {
      const body = { description };
      const response = await fetch("http://localhost:5000/dashboard/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json", token: localStorage.getItem("token") },
        body: JSON.stringify(body)
      });
      const parseResponse = await response.json();
      setTodos([parseResponse, ...todos]); 
      setDescription("");
    } catch (err) { console.error(err.message); }
  };

  // EDIT TODO
  const startEdit = (todo) => {
      setEditId(todo.todo_id);
      setEditText(todo.description);
  };

  // SAVE EDIT
  const saveEdit = async (id) => {
      try {
          const body = { description: editText };
          await fetch(`http://localhost:5000/dashboard/todos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", token: localStorage.getItem("token") },
            body: JSON.stringify(body)
          });
          setTodos(todos.map(t => t.todo_id === id ? {...t, description: editText} : t));
          setEditId(null);
      } catch (err) { console.error(err.message); }
  };

  // UPDATE PROFILE
  const updateProfile = async (e) => {
      e.preventDefault();
      try {
          const body = { username: name, password: newPassword || undefined };
          await fetch("http://localhost:5000/dashboard/user", {
              method: "PUT",
              headers: { "Content-Type": "application/json", token: localStorage.getItem("token") },
              body: JSON.stringify(body)
          });
          alert("Profile updated successfully!");
          setNewPassword("");
          setShowSettings(false);
      } catch (err) { console.error(err.message); }
  };

  const deleteTodo = async id => {
    try {
      await fetch(`http://localhost:5000/dashboard/todos/${id}`, {
        method: "DELETE",
        headers: { token: localStorage.getItem("token") }
      });
      setTodos(todos.filter(todo => todo.todo_id !== id));
    } catch (err) { console.error(err.message); }
  };

  const toggleTodo = async (id, status) => {
      setTodos(todos.map(todo => todo.todo_id === id ? { ...todo, is_completed: !status } : todo));
      try {
        const body = { is_completed: !status };
        await fetch(`http://localhost:5000/dashboard/todos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", token: localStorage.getItem("token") },
            body: JSON.stringify(body)
        });
      } catch (err) { console.error(err.message); }
  };

  const deleteUser = async (id) => {
      if(!window.confirm("Are you sure?")) return;
      try {
        await fetch(`http://localhost:5000/admin/users/${id}`, {
            method: "DELETE",
            headers: { token: localStorage.getItem("token") }
        });
        setAllUsers(allUsers.filter(u => u.user_id !== id));
      } catch (err) { console.error(err); }
  };

  const logout = e => {
    e.preventDefault();
    localStorage.removeItem("token");
    setAuth(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-10 text-white font-sans">
        <div className="max-w-3xl mx-auto">
            
            {/*HEADER*/}
            <div className="flex justify-between items-center mb-10 bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm shadow-xl">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        {name ? `Hello, ${name}` : "Dashboard"}
                    </h1>
                    {role === 'admin' && <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest bg-yellow-400/10 px-2 py-1 rounded mt-2 inline-block">Administrator</span>}
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setShowSettings(!showSettings)} className="bg-slate-700 hover:bg-blue-500/20 hover:text-blue-400 p-3 rounded-xl transition duration-300">
                        <Settings size={20}/>
                    </button>
                    <button onClick={logout} className="bg-slate-700 hover:bg-red-500/20 hover:text-red-400 p-3 rounded-xl transition duration-300">
                        <LogOut size={20}/>
                    </button>
                </div>
            </div>

            {/*SETTINGS PANEL*/}
            <AnimatePresence>
            {showSettings && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-6">
                    <form onSubmit={updateProfile} className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col gap-4">
                        <h2 className="text-xl font-bold text-slate-300">Profile Settings</h2>
                        <div>
                            <label className="text-xs text-slate-400 uppercase font-bold">Display Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-900 p-3 rounded-lg border border-slate-700 mt-1 focus:border-blue-500 outline-none"/>
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 uppercase font-bold">New Password (Optional)</label>
                            <input type="password" placeholder="Leave blank to keep current" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-slate-900 p-3 rounded-lg border border-slate-700 mt-1 focus:border-blue-500 outline-none"/>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold transition">Save Changes</button>
                    </form>
                </motion.div>
            )}
            </AnimatePresence>

            {/*CONTROLS*/}
             <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-blue-400 transition" size={20} />
                    <input type="text" placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" />
                </div>
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 cursor-pointer hover:bg-slate-700 transition">
                    <option value="all">All Tasks</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            <form onSubmit={onSubmitTodo} className="flex gap-4 mb-8">
                <input type="text" className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition shadow-lg shadow-black/20" 
                    placeholder="What needs to be done?" value={description} onChange={e => setDescription(e.target.value)} />
                <button className="bg-blue-600 hover:bg-blue-500 px-6 rounded-xl font-bold transition flex items-center shadow-lg shadow-blue-500/20 active:scale-95"><Plus size={24}/></button>
            </form>

            {/*TODO LIST*/}
            <div className="space-y-3 mb-20">
                <AnimatePresence>
                    {todos.map(todo => (
                        <motion.div key={todo.todo_id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
                            className={`group flex items-center justify-between p-4 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 rounded-xl transition-all ${todo.is_completed ? 'opacity-50' : ''}`}
                        >
                            {/* CHECKBOX */}
                            <div className="flex items-center gap-4 cursor-pointer flex-1">
                                <button onClick={() => toggleTodo(todo.todo_id, todo.is_completed)} className="transition-transform active:scale-90">
                                    {todo.is_completed ? <CheckCircle className="text-green-500" /> : <Circle className="text-slate-500 group-hover:text-blue-400" />}
                                </button>
                                
                                {/* EDIT MODE TOGGLE */}
                                {editId === todo.todo_id ? (
                                    <form onSubmit={(e) => { e.preventDefault(); saveEdit(todo.todo_id); }} className="flex-1 flex gap-2">
                                        <input autoFocus type="text" value={editText} onChange={e => setEditText(e.target.value)} className="flex-1 bg-slate-900 border border-blue-500 rounded px-2 py-1 outline-none text-white"/>
                                        <button type="submit" className="text-green-400 hover:text-green-300"><Save size={18}/></button>
                                        <button type="button" onClick={() => setEditId(null)} className="text-red-400 hover:text-red-300"><X size={18}/></button>
                                    </form>
                                ) : (
                                    <span onClick={() => toggleTodo(todo.todo_id, todo.is_completed)} className={`text-lg flex-1 ${todo.is_completed ? "line-through text-slate-500" : "text-slate-200"}`}>
                                        {todo.description}
                                    </span>
                                )}
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition duration-200">
                                <button onClick={() => startEdit(todo)} className="text-slate-500 hover:text-blue-400 p-2 hover:bg-blue-500/10 rounded-lg">
                                    <Edit2 size={18} />
                                </button>
                                <button onClick={() => deleteTodo(todo.todo_id)} className="text-slate-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/*ADMIN PANEL*/}
            {role === 'admin' && (
                <div className="border-t border-slate-700 pt-10">
                    <div className="flex items-center gap-3 mb-6 text-yellow-500">
                        <ShieldAlert /> <h2 className="text-2xl font-bold">Admin Control Panel</h2>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-800 text-slate-400 border-b border-slate-700">
                                    <th className="p-4">Username</th><th className="p-4">Email</th><th className="p-4">Tasks</th><th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allUsers.map(user => (
                                    <tr key={user.user_id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                                        <td className="p-4 font-medium flex items-center gap-2">{user.username}{user.role === 'admin' && <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">ADMIN</span>}</td>
                                        <td className="p-4 text-slate-400">{user.email}</td><td className="p-4 text-slate-300">{user.task_count}</td>
                                        <td className="p-4 text-right">{user.role !== 'admin' && (<button onClick={() => deleteUser(user.user_id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition" title="Ban User"><UserX size={18} /></button>)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default Dashboard;