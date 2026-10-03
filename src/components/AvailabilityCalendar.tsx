import { bookedDates, checkoutDates, checkinDates } from "@/data/availability";

const checkoutGradient =
  "linear-gradient(90deg, var(--orange-500) 50%, var(--green-200) 50%)";
const checkinGradient =
  "linear-gradient(90deg, var(--green-200) 50%, var(--orange-500) 50%)";

const dayLabels = ["ma", "di", "wo", "do", "vr", "za", "zo"];
const monthLabels = [
  "januari",
  "februari",
  "maart",
  "april",
  "mei",
  "juni",
  "juli",
  "augustus",
  "september",
  "oktober",
  "november",
  "december",
];

function toISODate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function buildMonthCells(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

type AvailabilityCalendarProps = {
  selectedCheckIn?: string;
  selectedCheckOut?: string;
  onSelectDate?: (iso: string) => void;
};

function MonthGrid({
  year,
  month,
  selectedCheckIn,
  selectedCheckOut,
  onSelectDate,
}: {
  year: number;
  month: number;
} & AvailabilityCalendarProps) {
  const cells = buildMonthCells(year, month);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const bookedSet = new Set(bookedDates);
  const checkoutSet = new Set(checkoutDates);
  const checkinSet = new Set(checkinDates);

  return (
    <div className="rounded-[2rem] border border-forest-100 bg-white p-5 shadow-sm shadow-forest-900/5 sm:p-6">
      <h3 className="text-center text-lg font-bold text-forest-900">
        {monthLabels[month]} {year}
      </h3>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-bold text-forest-600">
        {dayLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <span key={i} />;
          const iso = toISODate(date);
          const isPast = date < today;
          const isBooked = bookedSet.has(iso);
          const isCheckout = checkoutSet.has(iso);
          const isCheckin = checkinSet.has(iso);
          const isTurnover = isCheckout || isCheckin;
          const isSelectedStart = iso === selectedCheckIn;
          const isSelectedEnd = iso === selectedCheckOut;
          const isInRange =
            !!selectedCheckIn &&
            !!selectedCheckOut &&
            iso > selectedCheckIn &&
            iso < selectedCheckOut;
          const isClickable = !isPast && !isBooked && onSelectDate;

          return (
            <button
              key={i}
              type="button"
              disabled={!isClickable}
              onClick={isClickable ? () => onSelectDate(iso) : undefined}
              className={[
                "flex h-9 items-center justify-center rounded-full text-sm font-semibold transition",
                isClickable ? "cursor-pointer" : "cursor-default",
                isPast
                  ? "text-forest-400"
                  : isBooked
                    ? "bg-sunset-500 text-white"
                    : isTurnover
                      ? "text-forest-800"
                      : isInRange
                        ? "bg-sunset-100 text-forest-800"
                        : "bg-forest-200 text-forest-700",
                isSelectedStart || isSelectedEnd
                  ? "ring-2 ring-offset-2 ring-sunset-600"
                  : "",
              ].join(" ")}
              style={
                !isPast && isTurnover
                  ? { background: isCheckout ? checkoutGradient : checkinGradient }
                  : undefined
              }
              title={
                !isPast && isCheckout
                  ? "Vertrekdag: vanaf 11:00 weer vrij"
                  : !isPast && isCheckin
                    ? "Incheckdag: 's ochtends nog vrij"
                    : undefined
              }
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function AvailabilityCalendar({
  selectedCheckIn,
  selectedCheckOut,
  onSelectDate,
}: AvailabilityCalendarProps) {
  const now = new Date();
  const months = [0, 1].map((offset) => {
    const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  return (
    <div>
      {onSelectDate && (
        <p className="mb-4 text-center text-sm font-semibold text-forest-50">
          Tik op een vrije dag om in te checken, en daarna op een vrije dag om
          uit te checken.
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        {months.map(({ year, month }) => (
          <MonthGrid
            key={`${year}-${month}`}
            year={year}
            month={month}
            selectedCheckIn={selectedCheckIn}
            selectedCheckOut={selectedCheckOut}
            onSelectDate={onSelectDate}
          />
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-semibold text-forest-50">
        <span className="flex items-center gap-2.5">
          <span className="h-5 w-5 rounded-full bg-forest-200" /> Vrij
        </span>
        <span className="flex items-center gap-2.5">
          <span className="h-5 w-5 rounded-full bg-sunset-500" /> Bezet
        </span>
        <span className="flex items-center gap-2.5">
          <span
            className="h-5 w-5 rounded-full"
            style={{ background: checkoutGradient }}
          />
          Vertrekdag (vanaf 11:00 vrij)
        </span>
        <span className="flex items-center gap-2.5">
          <span
            className="h-5 w-5 rounded-full"
            style={{ background: checkinGradient }}
          />
          Incheckdag (&apos;s ochtends nog vrij)
        </span>
      </div>
    </div>
  );
}
