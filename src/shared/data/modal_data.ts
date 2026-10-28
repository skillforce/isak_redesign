export type ContactType = "whatsapp" | "viber" | "telegram" | "phone";

export interface Contact {
  type: ContactType;
  href: string;
  label: string;
  /** Короткая подпись под названием канала. */
  note: string;
}

export interface ModalData {
  CONTACT_MODAL_ID: string;
  WELCOME_MODAL_ID: string;
  PHONE_DISPLAY: string;
  CONTACTS: Contact[];
}

export const MODAL_DATA: ModalData = {
  CONTACT_MODAL_ID: "contact_modal",
  WELCOME_MODAL_ID: "welcome_modal",
  PHONE_DISPLAY: "+375 29 608-36-56",
  CONTACTS: [
    {
      type: "whatsapp",
      href: "https://wa.me/375296083656",
      label: "WhatsApp",
      note: "Текст заявки подставится в сообщение",
    },
    {
      type: "viber",
      href: "viber://chat?number=%2B375296083656",
      label: "Viber",
      note: "Текст заявки подставится в сообщение",
    },
    {
      type: "telegram",
      href: "tg://resolve?domain=@voxel44",
      label: "Telegram",
      note: "Если текст не подставится — вставьте скопированный",
    },
    {
      type: "phone",
      href: "tel:+375296083656",
      label: "Позвонить",
      note: "+375 29 608-36-56",
    },
  ],
};
