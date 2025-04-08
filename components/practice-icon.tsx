const PracticeIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} fill="currentColor">
    <use href="#practice-icon" />
  </svg>
);

export default PracticeIcon;
