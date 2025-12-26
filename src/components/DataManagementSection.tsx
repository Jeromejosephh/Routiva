'use client';

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useThemeClasses } from "@/components/ThemeProvider";
import { toast } from "@/lib/toast";
import { Download, Trash2, AlertTriangle } from "lucide-react";

export default function DataManagementSection() {
  const themeClasses = useThemeClasses();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleExportData = async () => {
    startTransition(async () => {
      try {
        const response = await fetch('/api/user/export');
        
        if (!response.ok) {
          throw new Error('Export failed');
        }

        // Get the blob and create download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Extract filename from response headers or use default
        const contentDisposition = response.headers.get('Content-Disposition');
        const filename = contentDisposition?.match(/filename="(.+)"/)?.[1] || 'routiva-export.json';
        
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast("Data exported successfully!");
      } catch (error) {
        console.error('Export error:', error);
        toast("Failed to export data. Please try again.");
      }
    });
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast("Please type DELETE to confirm account deletion");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/user/delete', {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Deletion failed');
        }

        toast("Account deleted successfully. You will be signed out.");
        
        // Sign out and redirect to home
        setTimeout(async () => {
          await signOut({ redirect: false });
          router.push('/');
        }, 2000);

      } catch (error) {
        console.error('Delete error:', error);
        toast("Failed to delete account. Please contact support.");
      }
    });
  };

  return (
    <div className="border rounded-lg p-6 backdrop-blur-sm bg-gray-100 dark:bg-gray-800/80">
      <h2 className="text-lg font-semibold mb-4">Data Management</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Export Data</h3>
          <p className="text-sm text-white/70 mb-3">
            Download all your habit data, logs, groups, and statistics as a JSON file.
          </p>
          <button 
            onClick={handleExportData}
            disabled={isPending}
            className={`${themeClasses.button} text-white px-4 py-2 rounded transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
          >
            <Download size={16} />
            {isPending ? 'Exporting...' : 'Export Data'}
          </button>
          <p className="text-xs text-white/60 mt-1">Includes habits, logs, groups, and statistics</p>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-2 text-red-600 flex items-center gap-2">
            <AlertTriangle size={16} />
            Danger Zone
          </h3>
          <p className="text-sm text-white/70 mb-3">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          
          {!showDeleteConfirm ? (
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="border border-red-300 text-red-600 px-4 py-2 rounded text-sm bg-red-50 hover:bg-red-100 transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
            >
              <Trash2 size={16} />
              Delete Account
            </button>
          ) : (
            <div className="space-y-3 p-4 border border-red-300 rounded bg-white">
              <p className="text-sm text-gray-900 font-medium">
                Are you absolutely sure? This will permanently delete your account, all habits, logs, and groups.
              </p>
              <p className="text-sm text-gray-800">
                Type <strong>DELETE</strong> to confirm:
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full px-3 py-2 border border-red-300 rounded text-sm text-gray-900 bg-gray-50"
                placeholder="Type DELETE to confirm"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isPending || deleteConfirmText !== "DELETE"}
                  className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isPending ? 'Deleting...' : 'Delete Account'}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText("");
                  }}
                  className="border border-gray-300 px-4 py-2 rounded text-sm text-gray-900 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          <p className="text-xs text-white/60 mt-1">
            {showDeleteConfirm ? "This action cannot be undone" : "We recommend exporting your data first"}
          </p>
        </div>
      </div>
    </div>
  );
}