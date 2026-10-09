export type InfoGroup = {
  _key?: string;
  label?: string | null;
  items?: string[] | null;
};

export type InfoSection = {
  _key?: string;
  title?: string | null;
  groups?: InfoGroup[] | null;
};

export type InfoPageData = {
  _id: string;
  title?: string | null;
  slug?: string | null;
  lastUpdated?: string | null;
  intro?: string | null;
  sections?: InfoSection[] | null;
};
