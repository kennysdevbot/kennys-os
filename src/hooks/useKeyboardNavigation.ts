import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useKeyboardNavigation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if no input is focused
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      switch (true) {
        // Number keys: 1=Dashboard, 2=Kanban, 3=Notes, 4=Inbox
        case e.key === '1' && (e.altKey || e.ctrlKey):
          e.preventDefault();
          navigate('/');
          break;
        case e.key === '2' && (e.altKey || e.ctrlKey):
          e.preventDefault();
          navigate('/kanban');
          break;
        case e.key === '3' && (e.altKey || e.ctrlKey):
          e.preventDefault();
          navigate('/notes');
          break;
        case e.key === '4' && (e.altKey || e.ctrlKey):
          e.preventDefault();
          navigate('/inbox');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);
};
