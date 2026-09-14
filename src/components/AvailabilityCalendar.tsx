import { bookedDates, checkoutDates } from "@/data/availability";

const checkoutGradient =
  "linear-gradient(90deg, var(--orange-200) 50%, var(--green-100) 50%)";

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

function MonthGrid({ year, month }: { year: number; month: number }) {
  const cells = buildMonthCells(year, month);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const bookedSet = new Set(bookedDates);
  const checkoutSet = new Set(checkoutDates);

  return (
    <div className="rounded-[2rem] border border-forest-100 bg-white p-5 shadow-sm shadow-forest-900/5 sm:p-6">
      <h3 className="text-center text-lg font-bold text-forest-900">
        {monthLabels[month]} {year}
      </h3>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-bold text-forest-400">
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
          return (
            <span
              key={i}
              className={[
                "flex h-9 items-center justify-center rounded-full text-sm font-semibold",
                isPast
                  ? "text-forest-200"
                  : isBooked
                    ? "bg-sunset-200 text-sunset-800"
                    : isCheckout
                      ? "text-forest-800"
                      : "bg-forest-100 text-forest-700",
              ].join(" ")}
              style={
                !isPast && isCheckout
                  ? { background: checkoutGradient }
                  : undefined
              }
              title={
                !isPast && isCheckout
                  ? "Vertrekdag: vanaf 11:00 weer vrij"
                  : undefined
              }
            >
              {date.getDate()}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function AvailabilityCalendar() {
  const now = new Date();
  const months = [0, 1].map((offset) => {
    const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-2">
        {months.map(({ year, month }) => (
          <MonthGrid key={`${year}-${month}`} year={year} month={month} />
        ))}
      </div>
      <div className="mt-5 flex items-center justify-center gap-6 text-sm font-semibold text-forest-700">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-forest-100" /> Vrij
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-sunset-200" /> Bezet
        </span>
        <span className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{ background: checkoutGradient }}
          />
          Vertrekdag (vanaf 11:00 vrij)
        </span>
      </div>
    </div>
  );
}
