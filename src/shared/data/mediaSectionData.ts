import posterFirstVideo from "../../assets/video/posterFirstVideo.avif";
import posterSecondVideo from "../../assets/video/posterSecondVideo.avif";
import classicImage from "../../assets/tool/tool.avif";
import ecoImg from "../../assets/tool/eco.avif";
import titanImg from "../../assets/tool/titan.avif";
import optionOneImg from "../../assets/tool/options/var_1.avif";
import optionTwoImg from "../../assets/tool/options/var_2.avif";
import optionThreeImg from "../../assets/tool/options/var_3.avif";

/**
 * Ролики YouTube для секции «Посмотрите аппарат в работе».
 *
 * `id` принимает ID ролика (с параметрами после «?» или без), а также полную
 * ссылку вида https://www.youtube.com/watch?v=…, https://youtu.be/… или
 * https://www.youtube.com/shorts/…. Первый ролик показывается по умолчанию.
 * Если массив пустой, секция показывает превью-заглушку без плеера.
 *
 * `title`, `uploadDate` (ISO 8601) и `duration` (ISO 8601, например PT2M) —
 * данные с YouTube для разметки VideoObject; без них ролик в разметку не попадёт.
 *
 * `poster` — собственная обложка 16:9 из кадра ролика. Обложки собирает
 * scripts/make-video-posters.sh (там же задаётся секунда кадра).
 */
export const MEDIA_SECTION_DATA = {
  VIDEOS: [
    {
      id: "wwzq9kUryF8?si=X_kpOn4CDefmvvKH",
      poster: posterFirstVideo,
      title: "Сверхзвуковой пескоструйный аппарат «Гера-2»",
      uploadDate: "2024-07-15T00:32:56-07:00",
      duration: "PT2M",
    },
    {
      id: "AczPuWS2BeQ?si=29lXFXkqh68Hu0so",
      poster: posterSecondVideo,
      title: "Очистка суппорта пескоструйным аппаратом Гера 2",
      uploadDate: "2025-02-12T11:13:42-08:00",
      duration: "PT56S",
    },
  ] as {
    id: string;
    poster?: ImageMetadata;
    title?: string;
    uploadDate?: string;
    duration?: string;
  }[],
  BUTTON_TITLE: "Заказать",
  ORDER_TITLE: "Обсудить заказ",
  /** Примечания из текущей версии конфигуратора — без изменений. */
  MODEL_NOTE: "*На картинке представлена максимальная комплектация.",
  ORDER_NOTE: "*Пожалуйста, назовите модель и конфигурацию продавцу при заказе",
  COMPANY_NAME: "Gera2 ©",
  COMPANY_OWNER: "ИП Исаков Дмитрий Иванович",
  OWNER_UNP: "УНП 790853087",
  WEB_SOLUTIONS: "Веб-сайты под ключ для вашего бизнеса",
  WEB_SOLUTIONS_LINK: "tg://resolve?domain=@vpnameonlife",
};

export interface ToolOption {
  toolName: string;
  toolDescription: string;
  image: ImageMetadata;
  /** Минимальная производительность компрессора на выходе, л/мин — из toolDescription. */
  minFlow: number;
  options: {
    text: string;
    optionImage: ImageMetadata;
    price: { RU: number; BY: number };
  }[];
}

export const TOOL_OPTIONS: ToolOption[] = [
  {
    toolName: "Эко",
    toolDescription:
      "Преднозначен для маломощных компрессоров.Экономичен к расходу воздуха. Производительность компрессора от 200л/мин на выходе",
    image: ecoImg,
    minFlow: 200,
    options: [
      {
        text: "Без бачка и регулировки подачи абразива(1 разгонная трубка в комплекте)",
        optionImage: optionOneImg,
        price: { RU: 3000, BY: 75 },
      },
      {
        text: "Без бачка, но с регулировкой подачи абразива(1 разгонная трубка в комплекте)",
        optionImage: optionTwoImg,
        price: { RU: 3500, BY: 90 },
      },
      {
        text: "С бачком(2 разгонных трубки в комплекте)",
        optionImage: optionThreeImg,
        price: { RU: 4500, BY: 140 },
      },
    ],
  },
  {
    toolName: "Классик",
    toolDescription:
      "Преднозначен для бытовых работ.Производительность компрессора от 300л/мин на выходе",
    image: classicImage,
    minFlow: 300,
    options: [
      {
        text: "Без бачка и регулировки подачи абразива(1 разгонная трубка в комплекте)",
        optionImage: optionOneImg,
        price: { RU: 3500, BY: 85 },
      },
      {
        text: "Без бачка, но с регулировкой подачи абразива(1 разгонная трубка в комплекте)",
        optionImage: optionTwoImg,
        price: { RU: 4000, BY: 100 },
      },
      {
        text: "С бачком(2 разгонных трубки в комплекте)",
        optionImage: optionThreeImg,
        price: { RU: 5000, BY: 150 },
      },
    ],
  },
  {
    toolName: "Титан",
    toolDescription:
      "Преднозначен для работы на производстве(малярные мастерские,СТО). Ресурс соплового узла увеличен путем закалки.Производительность компрессора от 300л/мин на выходе",
    image: titanImg,
    minFlow: 300,
    options: [
      {
        text: "Без бачка и регулировки подачи абразива(1 разгонная трубка в комплекте)",
        optionImage: optionOneImg,
        price: { RU: 4000, BY: 100 },
      },
      {
        text: "Без бачка, но с регулировкой подачи абразива(1 разгонная трубка в комплекте)",
        optionImage: optionTwoImg,
        price: { RU: 4500, BY: 115 },
      },
      {
        text: "С бачком(2 разгонных трубки в комплекте)",
        optionImage: optionThreeImg,
        price: { RU: 5500, BY: 165 },
      },
    ],
  },
];

/**
 * Описание модели без фразы о компрессоре (она показывается отдельной колонкой).
 * Текст не меняется — только разбивается на части.
 */
export function splitToolDescription(description: string) {
  const index = description.indexOf("Производительность компрессора");
  const main = (index >= 0 ? description.slice(0, index) : description).trim();
  const flow = index >= 0 ? description.slice(index).trim() : "";
  return { main, flow };
}

export type Currency = "BY" | "RU";
export const CURRENCY_CODE: Record<Currency, "BYN" | "RUB"> = { BY: "BYN", RU: "RUB" };

/** Цена в том же формате, что и в конфигураторе: «3 000 RUB». */
export const formatPrice = (value: number, currency: Currency) =>
  `${value.toLocaleString("ru-RU")} ${CURRENCY_CODE[currency]}`;

/** Диапазон цен модели по всем комплектациям. */
export function priceRange(tool: ToolOption, currency: Currency) {
  const prices = tool.options.map((o) => o.price[currency]);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

/** Варианты производительности компрессора для конфигуратора. */
export const COMPRESSOR_OPTIONS = [
  { value: "200", label: "200–299 л/мин", flow: 200 },
  { value: "300", label: "300+ л/мин", flow: 300 },
  { value: "unknown", label: "Не знаю — нужна помощь", flow: null },
] as const;
