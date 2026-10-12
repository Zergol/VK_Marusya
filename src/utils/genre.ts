const genreTranslations: Record<string, string> = {
  action: 'Боевик',
  comedy: 'Комедия',
  drama: 'Драма',
  horror: 'Ужасы',
  scifi: 'Фантастика',
  thriller: 'Триллер',
  crime: 'Криминал',
  mystery: 'Детектив',
  adventure: 'Приключения',
  war: 'Война',
  animation: 'Мультфильм',
  documentary: 'Документальный',
  fantasy: 'Фэнтези',
  romance: 'Мелодрама',
  family: 'Семейный',
  history: 'Исторический',
  suspense: 'Триллер',
};

export const translateGenre = (genre: string): string => {
  return genreTranslations[genre.toLowerCase()] || genre;
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours} ч ${mins} мин`;
  }
  return `${mins} мин`;
};