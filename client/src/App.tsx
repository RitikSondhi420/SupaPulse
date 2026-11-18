import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { KanbanBoard } from './components/KanbanBoard';
import { ListView } from './components/ListView';
import { WorkflowSettings } from './components/WorkflowSettings';
import { TeamMembersModal } from './components/TeamMembersModal';
import { TaskDetailModal } from './components/TaskDetailModal';
import { NewTaskModal } from './components/NewTaskModal';
import { ToastContainer } from './components/ToastContainer';
import { TaskStatus } from './types';

const MainLayout: React.FC = () => {
  const { activeView, selectedTask } = useApp();
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [defaultNewTaskStatus, setDefaultNewTaskStatus] = useState<TaskStatus>('pending');

  const handleOpenNewTask = (status: TaskStatus = 'pending') => {
    setDefaultNewTaskStatus(status);
    setIsNewTaskOpen(true);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#121212] text-neutral-100">
      {/* Top Navbar */}
      <Navbar onOpenNewTaskModal={() => handleOpenNewTask('pending')} />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Dynamic Center Canvas */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {activeView === 'board' && (
            <KanbanBoard onOpenNewTaskModal={handleOpenNewTask} />
          )}
          {activeView === 'list' && (
            <ListView onOpenNewTaskModal={handleOpenNewTask} />
          )}
          {activeView === 'rules' && (
            <WorkflowSettings />
          )}
          {activeView === 'members' && (
            <TeamMembersModal />
          )}
        </main>
      </div>

      {/* Global Task Details Drawer / Modal */}
      {selectedTask && <TaskDetailModal />}

      {/* New Task Creation Modal */}
      <NewTaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        defaultStatus={defaultNewTaskStatus}
      />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
