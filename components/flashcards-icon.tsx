const FlashcardsSet = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size}>
    <use href="#set" />
  </svg>
);

export default FlashcardsSet;
