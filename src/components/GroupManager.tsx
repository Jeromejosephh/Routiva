"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useThemeClasses } from "./ThemeProvider";

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
  { name: "Indigo", value: "indigo", class: "bg-indigo-400" },
  { name: "Cyan", value: "cyan", class: "bg-cyan-400" },
  { name: "Emerald", value: "emerald", class: "bg-emerald-400" },
  { name: "Lime", value: "lime", class: "bg-lime-400" },
  { name: "Amber", value: "amber", class: "bg-amber-400" },
  { name: "Rose", value: "rose", class: "bg-rose-400" },
  { name: "Violet", value: "violet", class: "bg-violet-400" },
  { name: "Sky", value: "sky", class: "bg-sky-400" },
];

const ICONS = ["💪", "🏃", "📚", "🎯", "💼", "🏠", "🎨", "🧘", "🍎", "💡", "⚡", "🌱", "🔥", "🚀", "🎵", "💤"];
const NO_ICON_VALUE = "__no_icon__";

export default function GroupManager({ groups }: { groups: Group[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [pending, startTransition] = useTransition();
  const [selectedColor, setSelectedColor] = useState<string>("blue");
  const [selectedIcon, setSelectedIcon] = useState<string>(NO_ICON_VALUE);
  const [formError, setFormError] = useState<string>("");
  const router = useRouter();
  const themeClasses = useThemeClasses();

  const handleSubmit = async (formData: FormData) => {
    const name = formData.get('name') as string;
    const color = selectedColor;
    const icon = selectedIcon === NO_ICON_VALUE || selectedIcon === "" ? undefined : selectedIcon;
    
    if (!name?.trim()) {
      setFormError("Group name is required");
      return;
    }

    setFormError("");
    startTransition(async () => {
      try {
        if (editingGroup) {
          const response = await fetch(`/api/groups/${editingGroup.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, color, icon }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to update group");
          }
          
          toast({ message: "Group updated!", variant: "success" });
        } else {
          const response = await fetch("/api/groups", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, color, icon }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to create group");
          }
          
          toast({ message: "Group created!", variant: "success" });
        }
        setShowForm(false);
        setEditingGroup(null);
        setSelectedColor("blue");
        setSelectedIcon(NO_ICON_VALUE);
        router.refresh();
      } catch (error) {
        console.error('Error saving group:', error);
        const errorMessage = error instanceof Error ? error.message : "Failed to save group";
        setFormError(errorMessage);
        toast({ message: errorMessage, variant: "error" });
      }
    });
  };  const handleDelete = (group: Group) => {
    if (group._count.habits > 0) {
      toast({ message: "Cannot delete group with habits. Move habits to another group first.", variant: "warning" });
      return;
    }

    if (!confirm(`Delete "${group.name}" group?`)) return;

    startTransition(async () => {
      try {
        const response = await fetch(`/api/groups/${group.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to delete group");
        }

        toast({ message: "Group deleted!", variant: "success" });
        router.refresh();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Something went wrong";
        toast({ message: `Error: ${errorMessage}`, variant: "error" });
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Habit Groups</h2>
        <button
          onClick={() => {
            setEditingGroup(null);
            setSelectedColor("blue");
            setSelectedIcon(NO_ICON_VALUE);
            setFormError("");
            setShowForm(true);
          }}
          className={`flex items-center gap-2 px-3 py-2 text-white rounded ${themeClasses.button}`}
        >
          <Plus size={16} />
          Add Group
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {groups.map((group) => (
          <div key={group.id} className="flex items-center justify-between p-3 border rounded backdrop-blur-sm bg-white/60 dark:bg-gray-700/60">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded ${COLORS.find(c => c.value === group.color)?.class || 'bg-gray-500'}`} />
              <span className="text-lg">{group.icon}</span>
              <div>
                <div className="font-medium">{group.name}</div>
                <div className="text-sm text-white/60">{group._count.habits} habits</div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setEditingGroup(group);
                  setSelectedColor(group.color || "blue");
                  setSelectedIcon(group.icon || NO_ICON_VALUE);
                  setFormError("");
                  setShowForm(true);
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => handleDelete(group)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-600 transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]"
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
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md backdrop-blur-lg">
            <h3 className="text-lg font-semibold mb-4 text-white">
              {editingGroup ? "Edit Group" : "Create Group"}
            </h3>
            
            {formError && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded text-red-700 dark:text-red-300 text-sm">
                {formError}
              </div>
            )}
            
            <form action={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-white/90">Name</label>
                <input
                  name="name"
                  defaultValue={editingGroup?.name || ""}
                  className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                  placeholder="e.g., Health, Work, Personal"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white/90">Color</label>
                <div className="grid grid-cols-2 gap-3">
                  {COLORS.map((color) => (
                    <div key={color.value} className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedColor(color.value)}
                        className={`relative w-7 h-7 rounded-full ${color.class} transition-all duration-200 ${
                          selectedColor === color.value 
                            ? 'scale-110 ring-3 ring-gray-800 dark:ring-gray-200 ring-offset-2 ring-offset-white dark:ring-offset-gray-800' 
                            : 'hover:scale-105 border-2 border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {selectedColor === color.value && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
                          </div>
                        )}
                      </button>
                      <span className={`text-sm transition-colors ${
                        selectedColor === color.value 
                          ? 'font-medium text-white' 
                          : 'text-white/90'
                      }`}>
                        {color.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white/90">Icon (Optional)</label>
                <div className="grid grid-cols-6 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedIcon(NO_ICON_VALUE)}
                    className={`w-10 h-10 flex items-center justify-center text-xs border-2 rounded-lg transition-all duration-200 ${
                      selectedIcon === NO_ICON_VALUE || selectedIcon === ""
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 scale-105 ring-2 ring-blue-200 dark:ring-blue-800'
                        : 'border-gray-300 dark:border-gray-600 text-white/60 hover:border-gray-400 dark:hover:border-gray-500 hover:scale-105'
                    }`}
                  >
                    None
                  </button>
                  {ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setSelectedIcon(icon)}
                      className={`w-10 h-10 flex items-center justify-center text-xl border-2 rounded-lg transition-all duration-200 ${
                        selectedIcon === icon
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 scale-105 ring-2 ring-blue-200 dark:ring-blue-800'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:scale-105'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingGroup(null);
                    setSelectedColor("blue");
                    setSelectedIcon(NO_ICON_VALUE);
                    setFormError("");
                  }}
                  className="flex-1 px-4 py-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 text-white/90 transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className={`flex-1 px-4 py-2 text-white rounded disabled:opacity-50 ${themeClasses.button}`}
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