export const ROUTES = {
  HOME: "/",
  SETUP: "/setup",
  VOCAB_TEST: "/vocab-test",
  TODAY: "/today",
  SCENARIO: (id: string) => `/scenario/${id}`,
  PRACTICE: (id: string) => `/practice/${id}`,
  REPLAY: "/replay",
  COMPLETE: "/complete",
  LIBRARY: "/library",
  SETTINGS: "/settings",
} as const;

export const GUARDED_ROUTES = [
  "/today",
  "/scenario",
  "/practice",
  "/replay",
  "/complete",
  "/library",
  "/settings",
];

export const HIDE_NAV_PATHS = [
  "/setup",
  "/vocab-test",
  "/scenario",
  "/practice",
  "/replay",
  "/complete",
] as const;
