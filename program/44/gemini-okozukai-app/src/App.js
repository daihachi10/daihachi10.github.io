
import React, { useState, useEffect, useMemo } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import Notification from './Notification';

function App() {
  const [tasks, setTasks] = useState([]);
  const [history, setHistory] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');

  const taskPrice = 50;

  const total = useSpring(0, { damping: 20, stiffness: 100 });

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('okozukai_tasks')) || [];
    const savedHistory = JSON.parse(localStorage.getItem('okozukai_history')) || [];
    setTasks(savedTasks);
    setHistory(savedHistory);
  }, []);

  useEffect(() => {
    localStorage.setItem('okozukai_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('okozukai_history', JSON.stringify(history));
    total.set(calculateTotal());
  }, [history]);

  const roundedTotal = useTransform(total, (value) => Math.round(value));

  const handleAddTask = () => {
    if (newTaskName && !tasks.includes(newTaskName)) {
      setTasks([...tasks, newTaskName]);
      setNewTaskName('');
    }
  };

  const [notification, setNotification] = useState('');

  const handleRecordTask = (taskName) => {
    const today = new Date().toISOString().slice(0, 10);
    setHistory([...history, { task: taskName, date: today }]);
    setNotification(`「${taskName}」を記録しました！`);

    // Flash effect on calendar
    const dateCell = document.querySelector(`.fc-day[data-date='${today}']`);
    if (dateCell) {
      dateCell.classList.add('event-added');
      setTimeout(() => {
        dateCell.classList.remove('event-added');
      }, 1000);
    }

    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  const calendarEvents = useMemo(() => {
    return history.map((item) => ({
      title: item.task,
      start: item.date,
      allDay: true,
    }));
  }, [history]);

  const calculateTotal = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    return (
      history.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate.getFullYear() === year && itemDate.getMonth() === month;
      }).length * taskPrice
    );
  };

  return (
    <div className="container">
      <Notification message={notification} />
      <h1>おこづかい帳</h1>
      <div className="main-layout">
        <div className="controls">
          <h2>お手伝いリスト</h2>
          <div className="task-buttons">
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.button
                  key={task}
                  onClick={() => handleRecordTask(task)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {task}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
          <hr />
          <h3>お手伝いを追加する</h3>
          <input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="お手伝いの名前"
          />
          <motion.button 
            onClick={handleAddTask}
            whileTap={{ scale: 0.9, rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 0.3 }}
          >
            追加
          </motion.button>
        </div>
        <div className="main-content">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            locale="ja"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: ''
            }}
            events={calendarEvents}
          />
          <div className="total-amount">
            今月の合計: <motion.span>{roundedTotal}</motion.span> 円
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;