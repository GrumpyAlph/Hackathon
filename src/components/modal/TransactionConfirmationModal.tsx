"use client";

import React, { ReactNode, useState, useEffect, useRef } from 'react';
import './confirmationModal.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (result: boolean) => void;
  messageArrays?: ReactNode[][];
  message?: ReactNode;
  buttonLabels: { confirm: string; cancel: string };
  isLoading?: boolean;
  interval?: number;
  progressInterval?: number;
}

const TransactionConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  messageArrays,
  message,
  buttonLabels,
  isLoading = true,
  interval = 30000,
  progressInterval = 10000,
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentArrayIndex, setCurrentArrayIndex] = useState(0);

  const currentArrayIndexRef = useRef(currentArrayIndex);

  useEffect(() => {
    currentArrayIndexRef.current = currentArrayIndex;
  }, [currentArrayIndex]);

  useEffect(() => {
    if (isOpen && messageArrays && messageArrays.length > 0) {
      const arrayIndex = currentArrayIndexRef.current;
      if (messageArrays[arrayIndex] && messageArrays[arrayIndex].length > 0) {
        const newIndex = Math.floor(
          Math.random() * messageArrays[arrayIndex].length
        );
        setCurrentMessageIndex(newIndex);
      }
    }
  }, [isOpen, messageArrays]);

  useEffect(() => {
    if (isOpen && messageArrays && messageArrays.length > 0) {
      const messageInterval = setInterval(() => {
        const arrayIndex = currentArrayIndexRef.current;
        if (messageArrays[arrayIndex] && messageArrays[arrayIndex].length > 0) {
          const newIndex = Math.floor(
            Math.random() * messageArrays[arrayIndex].length
          );
          setCurrentMessageIndex(newIndex);
        }
      }, interval);

      const arrayInterval = setInterval(() => {
        setCurrentArrayIndex((prevIndex) => {
          const nextArrayIndex = (prevIndex + 1) % messageArrays.length;
          currentArrayIndexRef.current = nextArrayIndex;

          if (
            messageArrays[nextArrayIndex] &&
            messageArrays[nextArrayIndex].length > 0
          ) {
            const newIndex = Math.floor(
              Math.random() * messageArrays[nextArrayIndex].length
            );
            setCurrentMessageIndex(newIndex);
          }

          return nextArrayIndex;
        });
      }, progressInterval);

      return () => {
        clearInterval(messageInterval);
        clearInterval(arrayInterval);
      };
    }
  }, [isOpen, messageArrays, interval, progressInterval]);

  const handleConfirm = (result: boolean) => {
    onConfirm(result);
    onClose();
  };

  if (!isOpen) return null;

  const includeCancel = buttonLabels.cancel !== '';
  const includeConfirm = buttonLabels.confirm !== '';

  let currentMessage: ReactNode | null = null;
  if (message) {
    currentMessage = message;
  } else if (
    messageArrays &&
    messageArrays[currentArrayIndex] &&
    messageArrays[currentArrayIndex][currentMessageIndex]
  ) {
    currentMessage = messageArrays[currentArrayIndex][currentMessageIndex];
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-body">
          {isLoading && (
            <div className="spinner-container">
              <img
                src="./GrumpyFortunes.png"
                alt={'Dizzy Grumpy'}
                className="spinner"
              />
            </div>
          )}
          <div className="message-container">{currentMessage}</div>
        </div>
        <div className="modal-buttons">
          {includeCancel && (
            <button onClick={() => handleConfirm(false)}>
              {buttonLabels.cancel}
            </button>
          )}
          {includeConfirm && (
            <button onClick={() => handleConfirm(true)}>
              {buttonLabels.confirm}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionConfirmationModal;
