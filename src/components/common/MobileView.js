import { useMobile } from '../../hooks/globalHooks';

function MobileView({ children, hide = false }) {
  const isMobile = useMobile();

  // if hide = true, only display the children if not mobile
  if (isMobile && hide) return null;
  if (isMobile || hide) return children;
  return null;
}

export default MobileView;
