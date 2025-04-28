import { ActionItem } from "@/types/left-side-bar";

const ActionComponent = ({
  item,
  className,
  isLoggedIn,
}: {
  item: ActionItem;
  className?: string;
  isLoggedIn: boolean;
}) => {
  return (
    <button onClick={() => item.action(isLoggedIn)} className={className}>
      <item.icon />
      <span className="ml-2">{item.title}</span>
    </button>
  );
};
export default ActionComponent;
