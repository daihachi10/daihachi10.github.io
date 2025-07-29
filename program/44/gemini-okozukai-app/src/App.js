import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { motion } from 'framer-motion';
import './style.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [history, setHistory] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');

  const taskPrice = 50;

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
  }, [history]);

  const handleAddTask = () => {
    if (newTaskName && !tasks.includes(newTaskName)) {
      setTasks([...tasks, newTaskName]);
      setNewTaskName('');
    }
  };

  const handleRecordTask = (taskName) => {
    const today = new Date().toISOString().slice(0, 10);
    setHistory([...history, { task: taskName, date: today }]);
  };

  const getCalendarEvents = () => {
    return history.map((item) => ({
      title: item.task,
      start: item.date,
      allDay: true,
    }));
  };

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
      <h1>おこづかい帳</h1>
      <div className="main-layout">
        <div className="controls">
          <h2>お手伝いリスト</h2>
          <div className="task-buttons">
            {tasks.map((task) => (
              <motion.button
                key={task}
                onClick={() => handleRecordTask(task)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {task}
              </motion.button>
            ))}
          </div>
          <hr />
          <h3>お手伝いを追加する</h3>
          <input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="お手伝いの名前"
          />
          <button onClick={handleAddTask}>追加</button>
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
            events={getCalendarEvents()}
          />
          <div className="total-amount">
            今月の合計: <span>{calculateTotal()}</span> 円
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;