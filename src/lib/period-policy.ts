export type ExistingPeriod = {
  period_number: number;
  date_from: string;
  date_to: string;
};

export type PeriodProjectBounds = {
  start_date?: string | null;
  actual_end_date?: string | null;
  planned_end_date?: string | null;
  planned_completion_date?: string | null;
};

export type PeriodOpeningFailureReason =
  | "missing_project_or_user"
  | "missing_budget"
  | "invalid_dates"
  | "date_order"
  | "before_project_start"
  | "after_project_end_tolerance"
  | "not_after_previous_period"
  | "overlap";

export type PeriodOpeningDecision =
  | { ok: true; reason: "ok"; message: "" }
  | {
      ok: false;
      reason: PeriodOpeningFailureReason;
      message: string;
      previousPeriod?: ExistingPeriod;
      overlapPeriod?: ExistingPeriod;
    };

export function validatePeriodOpening(args: {
  hasProject: boolean;
  hasUser: boolean;
  hasBudgetItems: boolean;
  form: { number: number; from: string; to: string };
  periods: ExistingPeriod[];
  project?: PeriodProjectBounds | null;
  toleranceDays?: number;
}): PeriodOpeningDecision {
  if (!args.hasProject || !args.hasUser) {
    return {
      ok: false,
      reason: "missing_project_or_user",
      message: "Selecciona un proyecto y confirma la sesion antes de crear el periodo.",
    };
  }

  if (!args.hasBudgetItems) {
    return {
      ok: false,
      reason: "missing_budget",
      message: "Primero debes cargar presupuesto y partidas del proyecto.",
    };
  }

  const from = new Date(args.form.from);
  const to = new Date(args.form.to);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return { ok: false, reason: "invalid_dates", message: "Fechas invalidas." };
  }

  if (to < from) {
    return {
      ok: false,
      reason: "date_order",
      message: "La fecha 'Hasta' debe ser mayor o igual a 'Desde'.",
    };
  }

  if (args.project?.start_date) {
    const projectStart = new Date(args.project.start_date);
    if (from < projectStart) {
      return {
        ok: false,
        reason: "before_project_start",
        message: `'Desde' no puede ser anterior al inicio del proyecto (${args.project.start_date}).`,
      };
    }
  }

  const projectEnd =
    args.project?.actual_end_date ??
    args.project?.planned_end_date ??
    args.project?.planned_completion_date ??
    null;

  if (projectEnd) {
    const end = new Date(projectEnd);
    const toleranceDays = args.toleranceDays ?? 30;
    const tolerance = new Date(end.getTime() + toleranceDays * 86_400_000);
    if (to > tolerance) {
      return {
        ok: false,
        reason: "after_project_end_tolerance",
        message: `'Hasta' excede el plazo del proyecto (fin: ${projectEnd}).`,
      };
    }
  }

  const previousPeriod = args.periods
    .slice()
    .sort((a, b) => a.period_number - b.period_number)
    .filter((period) => period.period_number < args.form.number)
    .pop();

  if (previousPeriod && from <= new Date(previousPeriod.date_to)) {
    return {
      ok: false,
      reason: "not_after_previous_period",
      message: `'Desde' debe ser mayor que el fin de la valorizacion N ${previousPeriod.period_number} (${previousPeriod.date_to}).`,
      previousPeriod,
    };
  }

  const overlapPeriod = args.periods.find((period) => {
    const periodFrom = new Date(period.date_from);
    const periodTo = new Date(period.date_to);
    return from <= periodTo && to >= periodFrom;
  });

  if (overlapPeriod) {
    return {
      ok: false,
      reason: "overlap",
      message: `El periodo se solapa con la valorizacion N ${overlapPeriod.period_number} (${overlapPeriod.date_from} - ${overlapPeriod.date_to}).`,
      overlapPeriod,
    };
  }

  return { ok: true, reason: "ok", message: "" };
}
