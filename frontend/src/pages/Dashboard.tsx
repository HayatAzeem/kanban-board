import { useState } from "react";
import { Plus } from "lucide-react";
import { Board } from "../features/kanban/components/Board";
import { ApplicationFormModal } from "../components/ApplicationFormModal";
import { type Application, useKanbanStore } from "../features/kanban/store/kanbanStore";
import { Button } from "../components/ui/Button";

export const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const { fetchApplications, deleteApplication } = useKanbanStore();

  const handleOpenModal = (app?: Application) => {
    setEditingApplication(app || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingApplication(null);
  };

  const handleSave = () => {
    fetchApplications();
  };

  const handleDelete = async (id: string) => {
    await deleteApplication(id);
    handleCloseModal();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-textMain">Boards</h2>
          <p className="mt-1 text-sm text-textMuted">Manage your job applications across different stages.</p>
        </div>
        <Button onClick={() => handleOpenModal()} size="sm">
          <Plus className="mr-2 h-4 w-4" /> New Application
        </Button>
      </div>
      
      <div className="flex-1 min-h-0">
        <Board onCardClick={handleOpenModal} />
      </div>

      <ApplicationFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        applicationToEdit={editingApplication}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
};
