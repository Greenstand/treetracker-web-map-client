import copy from 'copy-to-clipboard';
import { useCallback, useEffect, useState } from 'react';

/**
 * @param {String} text - the text you want to be copied
 * @param {Number} timeout - timeout before you can copy again
 */
function useClipboard(text, timeout = 1500) {
  const [hasCopied, setHasCopied] = useState(false);

  const onCopy = useCallback(() => {
    const didCopy = copy(text, { timeout });
    setHasCopied(didCopy);
  }, [text, timeout]);

  useEffect(() => {
    let timeoutId = null;

    if (hasCopied) {
      timeoutId = window.setTimeout(() => {
        setHasCopied(false);
      }, timeout);
    }

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [timeout, hasCopied]);

  return { value: text, hasCopied, onCopy };
}

export default useClipboard;
