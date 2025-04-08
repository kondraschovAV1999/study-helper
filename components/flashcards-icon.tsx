const FlashcardsIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size}  fill="currentColor">
    <use href="#set" />
  </svg>
);

export default FlashcardsIcon;
