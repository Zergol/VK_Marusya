export type RatingGrade = 'very-bad' | 'bad' | 'normal' | 'good';

interface RatingStyle {
  background: string;
  className?: string;
}

export const getRatingStyle = (rating: number): RatingStyle => {
  if (rating < 5) {
    return { background: '#C82020', className: 'rating--very-bad' };
  }
  if (rating <= 7) {
    return { background: '#777777', className: 'rating--bad' };
  }
  if (rating <= 8) {
    return { background: '#308E21', className: 'rating--normal' };
  }
  return { background: '#A59400', className: 'rating--good' };
};

export const formatRating = (rating: number): string => {
  return rating % 1 === 0 ? String(rating) : rating.toFixed(1);
};
