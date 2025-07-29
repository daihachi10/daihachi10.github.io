
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Notification.css';

const notificationVariants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.3,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.5,
  },
};

const Notification = ({ message }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className="notification"
          variants={notificationVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
