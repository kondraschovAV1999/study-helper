import { JSX } from "react";

export interface ActionItem {
  title: string;
  action: () => void;
  icon: JSX.ElementType;
}

const ActionComponent = ({
  item,
  className,
}: {
  item: ActionItem;
  className?: string;
}) => {
  return (
    <button onClick={item.action} className={className}>
      <item.icon />
      <span className="ml-2">{item.title}</span>
    </button>
  );
};
export default ActionComponent;
