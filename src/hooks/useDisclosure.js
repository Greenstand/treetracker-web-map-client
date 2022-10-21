import { useState } from 'react';

const useDisclosure = (defaultIsOpen) => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen || false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const onToggle = () => setIsOpen((prev) => !prev);

  return { isOpen, onOpen, onClose, onToggle };
};

export default useDisclosure;
