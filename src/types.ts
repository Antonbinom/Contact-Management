import { type ComputedRef } from 'vue';

export interface Contact {
  id?: string;
  name: string;
  number: string;
  email: string;
}

export interface Store {
  state: { contacts: Contact[]; searchValue: string };
  getContacts: ComputedRef<Contact[]>;
  createContact: (obj: Contact) => void;
  deleteContact: (id: string) => void;
  editContact: (obj: Contact, id: string) => void;
  setSearchValue: (event: Event) => void;
}
