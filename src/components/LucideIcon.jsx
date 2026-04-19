import * as Icons from 'lucide-react';

const LucideIcon = ({ name, ...props }) => {
  const IconComponent = Icons[name];
  if (!IconComponent) {
    return <Icons.HelpCircle {...props} />;
  }
  return <IconComponent {...props} />;
};

export default LucideIcon;
