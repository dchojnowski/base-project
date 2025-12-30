# Sales Dashboard (Vite + React 18 + TypeScript)

## Jak uruchomić

```bash
npm install
npm run dev
```

## Technologie

- Vite + React 18 + TypeScript
- React Router v7
- TanStack React Query v5
- Tailwind CSS + shadcn/ui

## Opis działania

Aplikacja prezentuje mini-dashboard sprzedażowy oparty o lokalny plik JSON. Dane są pobierane przez symulowany fetch z opóźnieniem i obsługą błędów, a następnie agregowane do KPI oraz tabel przekrojowych.

W widoku Overview znajdują się najważniejsze wskaźniki, rozbicie sprzedaży po kanałach i statusach oraz krótkie wnioski. Widok Records umożliwia filtrowanie po dacie, kanale i statusie, sortowanie podstawowych kolumn oraz paginację z synchronizacją filtrów w URL.