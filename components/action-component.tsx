import { JSX } from "react";

export interface ActionItem {
  title: string;
  action: () => void;
  icon: JSX.ElementType;
}

const ActionComponent = (item: ActionItem) => {
  return (
    <button onClick={item.action}>
      <item.icon />
      <span className="ml-2">{item.title}</span>
    </button>
  );
};
export default ActionComponent;
