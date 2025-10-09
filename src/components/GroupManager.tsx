"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import { Plus, Edit2, Trash2 } from "lucide-react";

type Group = {
  id: string;
  name: string;
  color: string;
  icon?: string;
  _count: { habits: number };
};

const COLORS = [
  { name: "Blue", value: "blue", class: "bg-blue-400" },
  { name: "Green", value: "green", class: "bg-green-400" },
  { name: "Purple", value: "purple", class: "bg-purple-400" },
  { name: "Red", value: "red", class: "bg-red-400" },
  { name: "Orange", value: "orange", class: "bg-orange-400" },
  { name: "Yellow", value: "yellow", class: "bg-yellow-400" },
  { name: "Pink", value: "pink", class: "bg-pink-400" },
  { name: "Teal", value: "teal", class: "bg-teal-400" },
];

const ICONS = ["💪", "🏃", "📚", "🎯", "💼", "🏠", "🎨", "🧘", "🍎", "💡"];

export default function GroupManager({ groups }: { groups: Group[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        const url = editingGroup ? `/api/groups/${editingGroup.id}` : "/api/groups";
        const method = editingGroup ? "PATCH" : "POST";
        
        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.get("name"),
            color: formData.get("color"),
            icon: formData.get("icon"),
          }),
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        toast(editingGroup ? "Group updated!" : "Group created!");
        setShowForm(false);
        setEditingGroup(null);
        router.refresh();
      } catch (error) {
        toast(`Error: ${error instanceof Error ? error.message : "Something went wrong"}`);
      }
    });
  };

  const handleDelete = (group: Group) => {
    if (group._count.habits > 0) {
      toast("Cannot delete group with habits. Move habits to another group first.");
      return;
    }

    if (!confirm(`Delete "${group.name}" group?`)) return;

    startTransition(async () => {
      try {
        const response = await fetch(`/api/groups/${group.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        toast("Group deleted!");
        router.refresh();
      } catch (error) {
        toast(`Error: ${error instanceof Error ? error.message : "Something went wrong"}`);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Habit Groups</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Group
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {groups.map((group) => (
          <div key={group.id} className="flex items-center justify-between p-3 border rounded">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded ${COLORS.find(c => c.value === group.color)?.class || 'bg-gray-500'}`} />
              <span className="text-lg">{group.icon}</span>
              <div>
                <div className="font-medium">{group.name}</div>
                <div className="text-sm text-gray-500">{group._count.habits} habits</div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setEditingGroup(group);
                  setShowForm(true);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => handleDelete(group)}
                className="p-1 hover:bg-gray-100 rounded text-red-600"
                disabled={group._count.habits > 0}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingGroup ? "Edit Group" : "Create Group"}
            </h3>
            
            <form action={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  name="name"
                  defaultValue={editingGroup?.name || ""}
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g., Health, Work, Personal"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {COLORS.map((color) => (
                    <label key={color.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="color"
                        value={color.value}
                        defaultChecked={editingGroup?.color === color.value || (!editingGroup && color.value === "blue")}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 rounded ${color.class} border-2 border-transparent peer-checked:border-gray-400`} />
                      <span className="text-sm">{color.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Icon (Optional)</label>
                <div className="grid grid-cols-5 gap-2">
                  {ICONS.map((icon) => (
                    <label key={icon} className="flex items-center justify-center cursor-pointer">
                      <input
                        type="radio"
                        name="icon"
                        value={icon}
                        defaultChecked={editingGroup?.icon === icon}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-10 flex items-center justify-center text-xl border rounded peer-checked:bg-blue-100 peer-checked:border-blue-500">
                        {icon}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingGroup(null);
                  }}
                  className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {pending ? "Saving..." : editingGroup ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}