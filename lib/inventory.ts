// Печатно издание "Чудовището без уши" — управление на тираж.
// PRINT_RUN_TOTAL = физическия отпечатан тираж.
// ALREADY_DISTRIBUTED = копия, раздадени извън сайта (подаръци, преса, партньори), преди да тръгнат онлайн продажби.
// INTERNAL_SELL_LIMIT = вътрешен таван за продажба през сайта — пазим резерв над ALREADY_DISTRIBUTED, за да не се изчерпи тиражът от забавена синхронизация на наличността.
export const PRINT_RUN_TOTAL = 200;
export const ALREADY_DISTRIBUTED = 20;
export const INTERNAL_SELL_LIMIT = 160;

// Когато тръгне Postgres фазата: AVAILABLE_FOR_SALE = INTERNAL_SELL_LIMIT - (брой продадени през сайта, от таблица orders).
