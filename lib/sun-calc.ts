import SunCalc from "suncalc";

export interface SunEvent {
  value: Date | null;
  type:
    | "sunset"
    | "goldenHourStart"
    | "goldenHourEnd"
    | "twilight"
    | "polar-night"
    | "polar-day"
    | "no-event";
  info: string;
}

export function getSunsetInfo(date: Date, lat: number, lng: number): SunEvent {
  const times = SunCalc.getTimes(date, lat, lng);

  const safe = (d: any) =>
    d instanceof Date && !isNaN(d.getTime()) ? d : null;

  const sunset = safe(times.sunset);
  const sunrise = safe(times.sunrise);
  const goldenHour = safe(times.goldenHour);
  const goldenHourEnd = safe(times.goldenHourEnd);
  const dawn = safe(times.dawn);
  const dusk = safe(times.dusk);

  if (!sunset && !sunrise) {
    if (dawn && dusk) {
      return {
        value: dawn,
        type: "polar-night",
        info: "Il sole non tramonta in questo periodo dell' anno, ma puoi goderti il crepuscolo",
      };
    }

    return {
      value: null,
      type: "polar-night",
      info: "Il sole non tramonta in questo periodo dell' anno",
    };
  }

  if (!sunset && sunrise && !dusk) {
    return {
      value: null,
      type: "polar-day",
      info: "Il sole non tramonta in questo periodo dell' anno",
    };
  }

  if (sunset) {
    return {
      value: sunset,
      type: "sunset",
      info: "Tramonto",
    };
  }

  if (goldenHour) {
    return {
      value: goldenHour,
      type: "goldenHourStart",
      info: "Inizio Golden Hour",
    };
  }

  if (goldenHourEnd) {
    return {
      value: goldenHourEnd,
      type: "goldenHourEnd",
      info: "Fine Golden Hour",
    };
  }

  if (dusk) {
    return {
      value: dusk,
      type: "twilight",
      info: "Il sole non tramonta in questo periodo dell' anno, ma puoi goderti il crepuscolo",
    };
  }

  return {
    value: null,
    type: "no-event",
    info: "Nessun evento solare disponibile.",
  };
}
