import { useState, useEffect } from "react";
import { KanbanBoard } from "../components/KanbanBoard";
import { ApplicationFormModal } from "../components/ApplicationFormModal";
import apiClient from "../api/apiClient";
import { useAuth } from "../context/AuthContext";
import { Plus, LogOut, Briefcase } from "lucide-react";

export const Dashboard = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<any | null>(null);
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const { data } = await apiClient.get("/applications");
      setApplications(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleOpenModal = (app: any | null = null) => {
    setEditingApplication(app);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/applications/${id}`);
      fetchApplications();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col h-screen overflow-hidden">
      <header className="border-b border-slate-800 bg-card/50 backdrop-blur-md px-6 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-lg">
            <Briefcase className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-textMain hidden sm:block">JobTracker AI</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-textMuted hidden sm:block">{user?.email}</span>
          <button 
            onClick={() => handleOpenModal()} 
            className="btn-primary flex items-center text-sm py-2"
          >
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Application</span>
          </button>
          <button 
            onClick={logout} 
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden p-6">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <KanbanBoard 
            applications={applications} 
            setApplications={setApplications}
            onCardClick={handleOpenModal}
          />
        )}
      </main>

      <ApplicationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        applicationToEdit={editingApplication}
        onSave={fetchApplications}
        onDelete={handleDelete}
      />
    </div>
  );
};
