export interface Speaker {
  firstname: string;
  lastname: string;
}

export interface Stakeholder {
  firstname: string;
  lastname: string;
  job?: string;
  img?: string;
}

export interface OsMap {
  addressl1?: string;
  addressl2?: string;
  postalCode?: string;
  city?: string;
  coordinates?: [number, number];
}

export interface ConferenceDesign {
  mainColor: string;
  secondColor: string;
}

export interface Conference {
  id: string;
  title: string;
  date: string;
  description: string;
  img: string;
  content: string;
  duration?: string;
  osMap?: OsMap;
  speakers?: Speaker[];
  stakeholders?: Stakeholder[];
  design: ConferenceDesign;
}

export type ConferenceCreatePayload = Omit<Conference, 'id'>;
export type ConferenceUpdatePayload = Partial<ConferenceCreatePayload>;
