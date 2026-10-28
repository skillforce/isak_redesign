import type { ContactType } from "../data/modal_data";

/** Same wording the site has always sent to the seller. */
export function buildOrderMessage(toolName: string) {
  return `Здравствуйте! Хотел бы заказать ${toolName}.`;
}

/** Prefill text in messengers that support it; phone links stay unchanged. */
export function buildContactLink(
  type: ContactType,
  base: string,
  message: string
) {
  const text = encodeURIComponent(message);

  switch (type) {
    case "whatsapp":
      return `${base}?text=${text}`;
    case "telegram":
      return `${base}&text=${text}&profile`;
    case "viber":
      return `${base}&draft=${text}`;
    default:
      return base;
  }
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the legacy path */
  }

  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.append(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  } catch {
    return false;
  }
}
