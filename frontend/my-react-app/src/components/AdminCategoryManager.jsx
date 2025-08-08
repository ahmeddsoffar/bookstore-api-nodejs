import React, { useEffect, useMemo, useState } from "react";
import { categoryApi } from "../api/categoryApi";
import { Edit, Save, X, Trash2, Plus, RefreshCw } from "lucide-react";

const emptyForm = { name: "", description: "" };

const AdminCategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [busyIds, setBusyIds] = useState({});

  const sorted = useMemo(
    () => [...categories].sort((a, b) => a.name.localeCompare(b.name)),
    [categories]
  );

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const list = await categoryApi.getCategories();
      setCategories(list);
    } catch (e) {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setForm({ name: cat.name || "", description: cat.description || "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  const saveEdit = async (id) => {
    try {
      setBusyIds((s) => ({ ...s, [id]: true }));
      setError("");
      const updated = await categoryApi.updateCategory(id, form);
      setCategories((prev) => prev.map((c) => (c._id === id ? updated : c)));
      cancelEdit();
    } catch (e) {
      const msg = e?.response?.data?.message || "Update failed";
      setError(msg);
    } finally {
      setBusyIds((s) => ({ ...s, [id]: false }));
    }
  };

  const confirmDelete = async (id) => {
    try {
      setBusyIds((s) => ({ ...s, [id]: true }));
      setError("");
      await categoryApi.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      setDeletingId(null);
    } catch (e) {
      const msg = e?.response?.data?.message || "Delete failed";
      setError(msg);
    } finally {
      setBusyIds((s) => ({ ...s, [id]: false }));
    }
  };

  const startCreate = () => {
    setCreating(true);
    setForm(emptyForm);
    setError("");
  };

  const cancelCreate = () => {
    setCreating(false);
    setForm(emptyForm);
    setError("");
  };

  const saveCreate = async () => {
    try {
      setBusyIds((s) => ({ ...s, __create__: true }));
      setError("");
      const created = await categoryApi.createCategory(form);
      setCategories((prev) => [...prev, created]);
      cancelCreate();
    } catch (e) {
      const msg = e?.response?.data?.message || "Create failed";
      setError(msg);
    } finally {
      setBusyIds((s) => ({ ...s, __create__: false }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Category Management</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={startCreate}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> New Category
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {creating && (
        <div className="border rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-3">Create Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="px-3 py-2 border rounded-md"
            />
          </div>
          <div className="flex gap-2 justify-end mt-3">
            <button
              onClick={cancelCreate}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={saveCreate}
              disabled={busyIds.__create__}
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {busyIds.__create__ ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  Loading categories...
                </td>
              </tr>
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  No categories found
                </td>
              </tr>
            ) : (
              sorted.map((c) => {
                const isEditing = editingId === c._id;
                return (
                  <tr key={c._id}>
                    <td className="px-4 py-2">
                      {isEditing ? (
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          className="px-3 py-2 border rounded-md w-full"
                        />
                      ) : (
                        <span className="font-medium text-gray-800">
                          {c.name}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {c.slug}
                      </code>
                    </td>
                    <td className="px-4 py-2">
                      {isEditing ? (
                        <input
                          type="text"
                          value={form.description}
                          onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                          }
                          className="px-3 py-2 border rounded-md w-full"
                        />
                      ) : (
                        <span className="text-gray-700">
                          {c.description || "—"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-right whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => saveEdit(c._id)}
                            disabled={!!busyIds[c._id]}
                            className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                          >
                            <Save className="h-4 w-4" /> Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-1"
                          >
                            <X className="h-4 w-4" /> Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => startEdit(c)}
                            className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-1"
                          >
                            <Edit className="h-4 w-4" /> Edit
                          </button>
                          <button
                            onClick={() => setDeletingId(c._id)}
                            className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={() => setDeletingId(null)}
          />
          <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 rounded-full text-red-600">
                <Trash2 className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Delete category?
                </h3>
                <p className="text-sm text-gray-600">
                  This will permanently delete the category. It cannot be
                  undone.
                </p>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deletingId)}
                disabled={!!busyIds[deletingId]}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {busyIds[deletingId] ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoryManager;
