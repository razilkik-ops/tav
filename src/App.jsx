import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowsClockwise,
  Bank,
  ChatCircleDots,
  CheckCircle,
  ClipboardText,
  Clock,
  Cube,
  EnvelopeSimple,
  Factory,
  FileText,
  Handshake,
  Headset,
  List,
  MagnifyingGlass,
  MapPin,
  PaperPlaneTilt,
  Phone,
  PhoneCall,
  ShieldCheck,
  Timer,
  Truck,
  Warehouse,
  X,
} from '@phosphor-icons/react';

const siteBase = import.meta.env.BASE_URL.replace(/\/$/, '');
const asset = fileName => `${import.meta.env.BASE_URL}assets/${fileName}`;
const withBase = (path = '/') => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (!siteBase) return normalized;
  return normalized === '/' ? `${siteBase}/` : `${siteBase}${normalized}`;
};
const readAppPath = () => {
  const browserPath = window.location.pathname.replace(/\/$/, '') || '/';
  if (!siteBase) return browserPath;
  if (browserPath === siteBase) return '/';
  return browserPath.startsWith(`${siteBase}/`) ? browserPath.slice(siteBase.length) : browserPath;
};

const CHAT_STORAGE_KEY = 'tav-import-chat-history-v1';
const CHAT_RETENTION_MS = 24 * 60 * 60 * 1000;
const CHAT_WELCOME_MESSAGE = { from: 'agent', text: 'Здравствуйте! Помогу подобрать оборудование и рассчитать доставку.' };
const persistableChatMessages = messages => messages
  .filter(message => ['user', 'agent'].includes(message?.from) && typeof message.text === 'string')
  .slice(-50);
const readStoredChatMessages = () => {
  try {
    const stored = JSON.parse(window.localStorage.getItem(CHAT_STORAGE_KEY));
    const isFresh = Number.isFinite(stored?.updatedAt) && Date.now() - stored.updatedAt < CHAT_RETENTION_MS;
    const messages = persistableChatMessages(Array.isArray(stored?.messages) ? stored.messages : []);
    if (isFresh && messages.length) return messages;
    window.localStorage.removeItem(CHAT_STORAGE_KEY);
  } catch {
    // Fall back to a fresh chat when browser storage is unavailable.
  }
  return [CHAT_WELCOME_MESSAGE];
};

const directions = [
  {
    id: 1,
    name: 'Станки',
    path: '/napravleniya/stanki',
    image: asset('category-machines.webp'),
    heroImage: asset('direction-hero-stanki-v2.jpg'),
    pageTitle: 'ПРОМЫШЛЕННЫЕ СТАНКИ ИЗ АЗИИ',
    questionSubject: 'промышленных станков из Азии',
    lead: 'Подбираем, проверяем и доставляем металлообрабатывающие и производственные станки под вашу технологию.',
    description: 'Работаем как единое окно: уточняем технологическую задачу, сравниваем производителей, проверяем станок на заводе и довозим до вашего предприятия.',
    supplies: ['Токарные и фрезерные центры', 'Лазерные и плазменные станки', 'Листогибы и гидравлические прессы', 'Автоматические линии с ЧПУ', 'Деревообрабатывающие станки', 'Оснастка и комплектующие'],
    benefits: ['Подбор по чертежу детали и ТЗ', 'Проверка точности и комплектации', 'Видеоинспекция до отгрузки', 'Пусконаладка и запасные части'],
    facts: [['30–55 дней', 'СРЕДНИЙ СРОК'], ['100%', 'ПРЕДОТГРУЗОЧНЫЙ КОНТРОЛЬ'], ['РБ + РФ', 'ДОСТАВКА ПОД КЛЮЧ']],
  },
  {
    id: 2,
    name: 'Спецтехника',
    path: '/napravleniya/spetstekhnika',
    image: asset('category-heavy-equipment.webp'),
    heroImage: asset('direction-hero-spetstekhnika-v2.jpg'),
    pageTitle: 'СПЕЦТЕХНИКА ДЛЯ СТРОЙКИ И КАРЬЕРОВ',
    questionSubject: 'спецтехники для строительства и карьеров',
    lead: 'Поставляем технику для земляных, дорожных, погрузочных и карьерных работ с проверкой состояния и документов.',
    description: 'Подбираем новую и контрактную спецтехнику под условия эксплуатации, производительность и бюджет. Организуем осмотр, погрузку, перевозку и таможенное оформление.',
    supplies: ['Экскаваторы и экскаваторы-погрузчики', 'Фронтальные и вилочные погрузчики', 'Бульдозеры и грейдеры', 'Автокраны и подъёмная техника', 'Дорожно-строительные машины', 'Карьерная техника'],
    benefits: ['Проверка моточасов и агрегатов', 'Фото- и видеоотчёт с площадки', 'Расчёт логистики до покупки', 'Комплект документов для ввода'],
    facts: [['35–65 дней', 'СРЕДНИЙ СРОК'], ['50+ брендов', 'В ПОДБОРЕ'], ['РБ + РФ', 'ДОСТАВКА ПОД КЛЮЧ']],
  },
  {
    id: 3,
    name: 'Насосы',
    path: '/napravleniya/nasosy',
    image: asset('category-pumps.webp'),
    heroImage: asset('direction-hero-nasosy-v2.jpg'),
    pageTitle: 'ПРОМЫШЛЕННЫЕ НАСОСЫ И СТАНЦИИ',
    questionSubject: 'промышленных насосов и станций',
    lead: 'Комплектуем насосное оборудование по рабочей точке, среде, материалам исполнения и требованиям вашего производства.',
    description: 'Сверяем гидравлические параметры и присоединительные размеры, подбираем исполнение двигателя и автоматики, контролируем испытания перед отгрузкой.',
    supplies: ['Центробежные насосы', 'Химические и коррозионностойкие насосы', 'Шламовые и грунтовые насосы', 'Дозирующие установки', 'Пожарные насосные станции', 'Насосы с частотным управлением'],
    benefits: ['Подбор по рабочей точке', 'Проверка материалов исполнения', 'Стендовые испытания', 'ЗИП и сервисные комплекты'],
    facts: [['25–45 дней', 'СРЕДНИЙ СРОК'], ['0,5–10 000 м³/ч', 'ДИАПАЗОН ПОДБОРА'], ['РБ + РФ', 'ДОСТАВКА ПОД КЛЮЧ']],
  },
  {
    id: 4,
    name: 'Запчасти',
    path: '/napravleniya/zapchasti',
    image: asset('category-parts.webp'),
    heroImage: asset('direction-hero-zapchasti-v2.jpg'),
    pageTitle: 'ЗАПЧАСТИ ДЛЯ ПРОМЫШЛЕННОГО ОБОРУДОВАНИЯ',
    questionSubject: 'запчастей для промышленного оборудования',
    lead: 'Находим оригинальные детали и проверенные аналоги по маркировке, чертежу, образцу или каталожному номеру.',
    description: 'Закрываем разовые и регулярные потребности в комплектующих. Консолидируем позиции от разных поставщиков и доставляем одной партией.',
    supplies: ['Подшипники и редукторы', 'Гидравлика и пневматика', 'Электрика и компоненты ЧПУ', 'Литые и механообработанные детали', 'Ремни, цепи и уплотнения', 'Расходные материалы и ЗИП'],
    benefits: ['Поиск по образцу или фото', 'Проверка совместимости', 'Консолидация разных поставщиков', 'Плановые регулярные поставки'],
    facts: [['14–35 дней', 'СРЕДНИЙ СРОК'], ['1 позиция', 'МИНИМАЛЬНЫЙ ЗАПРОС'], ['РБ + РФ', 'ДОСТАВКА ПОД КЛЮЧ']],
  },
  {
    id: 5,
    name: 'Строительное оборудование',
    path: '/napravleniya/stroitelnoe-oborudovanie',
    image: asset('category-construction.webp'),
    heroImage: asset('direction-hero-stroitelnoe-v2.jpg'),
    pageTitle: 'СТРОИТЕЛЬНОЕ ОБОРУДОВАНИЕ',
    questionSubject: 'строительного оборудования',
    lead: 'Поставляем установки и технологические комплексы для производства материалов, подготовки сырья и строительных работ.',
    description: 'Прорабатываем производительность линии, условия монтажа и состав комплектации. Проверяем оборудование в работе и координируем доставку крупногабаритных узлов.',
    supplies: ['Бетонные и асфальтовые заводы', 'Дробильно-сортировочные комплексы', 'Бетононасосы и смесители', 'Подъёмное оборудование', 'Компрессоры и генераторы', 'Опалубка и строительные системы'],
    benefits: ['Компоновка под вашу площадку', 'Расчёт производительности', 'Контрольная сборка на заводе', 'Шефмонтаж и ввод в работу'],
    facts: [['40–90 дней', 'СРЕДНИЙ СРОК'], ['До 120 т', 'ОПЫТ КРУПНЫХ ПОСТАВОК'], ['РБ + РФ', 'ДОСТАВКА ПОД КЛЮЧ']],
  },
  {
    id: 6,
    name: 'Другое',
    path: '/napravleniya/drugoe',
    image: asset('category-factory.webp'),
    heroImage: asset('direction-hero-drugoe-v2.jpg'),
    pageTitle: 'НЕСТАНДАРТНОЕ ОБОРУДОВАНИЕ ПОД ЗАДАЧУ',
    questionSubject: 'нестандартного оборудования под задачу',
    lead: 'Если нужного направления нет в каталоге, найдём производителя и построим цепочку поставки специально под ваш проект.',
    description: 'Берём в работу нестандартные запросы: от отдельного узла до комплектной производственной линии. Подключаем профильных инженеров и локальных инспекторов.',
    supplies: ['Упаковочные линии', 'Пищевое оборудование', 'Складская автоматизация', 'Энергетическое оборудование', 'Роботизированные комплексы', 'Оборудование по вашему ТЗ'],
    benefits: ['Поиск узкопрофильных заводов', 'Сравнение технических решений', 'Аудит нового производителя', 'Проектная логистика'],
    facts: [['7–10 дней', 'ПЕРВИЧНЫЙ ПОДБОР'], ['1 000+ заводов', 'БАЗА ПОСТАВЩИКОВ'], ['РБ + РФ', 'ДОСТАВКА ПОД КЛЮЧ']],
  },
];

const supplyCardImages = {
  1: ['stanki-01-cnc', 'stanki-02-laser', 'stanki-03-press', 'stanki-04-line', 'stanki-05-wood', 'stanki-06-tooling'],
  2: ['spetstekhnika-01-excavator', 'spetstekhnika-02-loaders', 'spetstekhnika-03-dozer-grader', 'spetstekhnika-04-crane', 'spetstekhnika-05-road', 'spetstekhnika-06-quarry'],
  3: ['nasosy-01-centrifugal', 'nasosy-02-chemical', 'nasosy-03-slurry', 'nasosy-04-dosing', 'nasosy-05-fire', 'nasosy-06-vfd'],
  4: ['zapchasti-01-bearings', 'zapchasti-02-hydraulics', 'zapchasti-03-electronics', 'zapchasti-04-cast', 'zapchasti-05-belts', 'zapchasti-06-spares'],
  5: ['stroitelnoe-01-plant', 'stroitelnoe-02-crusher', 'stroitelnoe-03-concrete', 'stroitelnoe-04-lifting', 'stroitelnoe-05-power', 'stroitelnoe-06-formwork'],
  6: ['drugoe-01-packaging', 'drugoe-02-food', 'drugoe-03-warehouse', 'drugoe-04-energy', 'drugoe-05-robotics', 'drugoe-06-bespoke'],
};

const process = [
  ['Поиск', MagnifyingGlass],
  ['Образцы', Cube],
  ['Производство', Factory],
  ['Инспекция', ClipboardText],
  ['Доставка', Truck],
  ['Растаможка', FileText],
  ['Склад клиента', Warehouse],
];

const advantages = [
  ['Прямые контракты', Handshake],
  ['Юрлица в РБ и РФ', Bank],
  ['Контроль качества', ShieldCheck],
  ['Полный цикл', ArrowsClockwise],
  ['Оперативные сроки', Timer],
];

const cases = [
  { id: 'c1', title: 'Фрезерный центр для производства', image: asset('category-machines.webp'), meta: ['38 дней', '12 тонн', 'Китай → Беларусь'] },
  { id: 'c2', title: 'Насосная станция для предприятия', image: asset('category-pumps.webp'), meta: ['29 дней', '8 тонн', 'Китай → Россия'] },
  { id: 'c3', title: 'Спецтехника для строительной компании', image: asset('case-excavator.webp'), meta: ['45 дней', '20 тонн', 'Китай → Беларусь'] },
];

const groupCompanies = [
  ['TAV BIO', 'Медицинское направление', 'Поставка оборудования и медизделий из Китая, лицензирование и сопровождение', asset('group-icons/tav-bio-medical-v2.png'), asset('group-scenes/tav-bio-medical-v3.jpg')],
  ['TAVDORSTROY', 'Дороги и инфраструктура', 'Строительство, материалы и спецтехника', asset('group-icons/tavdorstroy.png'), asset('group-scenes/tavdorstroy-v2.jpg')],
  ['INKOMSTROYTORG', 'Комплексные поставки', 'Оборудование, комплектующие и материалы', asset('group-icons/inkomstroy.png'), asset('group-scenes/inkomstroy-v2.jpg')],
];

const groupRequisites = {
  'TAV GROUP': {
    title: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ «ТАВ-ГРУПП»',
    items: [
      ['ИНН', '6732219338'],
      ['Р/сч', '40702810259000016936'],
      ['Банк', 'ОАО «Сбербанк ПАО», БИК 046614632'],
      ['Юридический адрес', '214009, Смоленская область, г. Смоленск, мкр Южный, д. 4, помещ. 3'],
      ['Телефон', '+7 920 324-70-91'],
      ['Email', 'tav.wbsale@gmail.com'],
    ],
  },
  'TAV BIO': {
    title: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ «ТАВ-Биотехнологии»',
    items: [
      ['УНП', '791148165'],
      ['Р/сч', 'BY92 BLNB 3012 0000 3274 4700 0933'],
      ['Банк', 'ОАО «БНБ-Банк», БИК BLNBBY2X'],
      ['Юридический адрес', '213974, Могилевская обл., Дрибинский р-н, д. Белая, ул. Франциска Скорины, д. 11'],
      ['Телефон', '+375 44 7717179'],
      ['Руководитель', 'Директор Титовцов Андрей Васильевич действует на основании Устава'],
    ],
  },
  TAVDORSTROY: {
    title: 'ЧАСТНОЕ ПРОИЗВОДСТВЕННО-ТОРГОВОЕ УНИТАРНОЕ ПРЕДПРИЯТИЕ «ТАВДорстрой»',
    items: [
      ['УНП', '790988526'],
      ['Р/сч', 'BY54 BLNB 3012 0000 3015 4100 0933'],
      ['Банк', 'ОАО «БНБ-Банк», БИК BLNBBY2X'],
      ['Юридический адрес', '212039, г. Могилёв, ул. Ровчакова, д. 10'],
      ['Тел./факс', '8 0222 74-60-81'],
      ['Руководитель', 'Директор Титовцов Андрей Васильевич действует на основании Устава'],
    ],
  },
  INKOMSTROYTORG: {
    title: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ «Инкомстройторг»',
    items: [
      ['УНП', '790635391'],
      ['Р/сч', 'BY22 BLNB 3012 0000 3015 3000 0933'],
      ['Банк', 'ОАО «БНБ-Банк», БИК BLNBBY2X'],
      ['Юридический адрес', '212039, г. Могилев, ул. Ровчакова, д. 10'],
      ['Тел./факс', '8-0222-74-60-81'],
      ['Руководитель', 'Директор Титовцов Андрей Васильевич действует на основании Устава'],
    ],
  },
};

function Logo({ onHome }) {
  return <button className="logo" onClick={() => onHome?.()} aria-label="На главную"><span>TAV</span> IMPORT</button>;
}

function Header({ onNavigate, onApply }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [['Главная', 'hero'], ['Услуги', 'process'], ['Направления', 'directions'], ['Кейсы', 'cases'], ['О компании', 'group'], ['Контакты', 'contacts']];
  const go = (id) => {
    onNavigate('/', id);
    setMenuOpen(false);
  };
  return <header className="site-header">
    <Logo onHome={() => onNavigate('/')} />
    <nav className={menuOpen ? 'open' : ''} aria-label="Главное меню">
      {links.map(([label, id]) => <button key={id} onClick={() => go(id)}>{label}</button>)}
    </nav>
    <div className="header-side">
      <button className="search-trigger" onClick={() => go('directions')} aria-label="Поиск по направлениям"><MagnifyingGlass /></button>
      <a href="tel:+375290000000"><Phone weight="bold" /> +375 29 000-00-00</a>
      <button className="outline-cta" onClick={() => onApply('Расчёт заявки')}>РАССЧИТАТЬ ЗАЯВКУ</button>
      <button className="menu-button" onClick={() => setMenuOpen(v => !v)} aria-label="Меню">{menuOpen ? <X /> : <List />}</button>
    </div>
  </header>;
}

function SectionTitle({ eyebrow, children }) {
  return <div className="section-heading">{eyebrow && <span>{eyebrow}</span>}<h2>{children}</h2><i /></div>;
}

function GroupRequisites({ company }) {
  const requisites = groupRequisites[company];
  return <div className="group-requisites">
    <span>РЕКВИЗИТЫ</span>
    <strong>{requisites.title}</strong>
    <dl>{requisites.items.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
  </div>;
}

function GroupSection() {
  const treeRef = useRef(null);
  const parentRef = useRef(null);
  const companyRefs = useRef([]);
  const [connectorGeometry, setConnectorGeometry] = useState({ width: 1320, parentX: 660, targets: [208, 660, 1112] });

  useEffect(() => {
    const updateConnectors = () => {
      const tree = treeRef.current;
      const parent = parentRef.current;
      const companies = companyRefs.current.filter(Boolean);
      if (!tree || !parent || companies.length !== groupCompanies.length) return;

      const treeRect = tree.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      setConnectorGeometry({
        width: treeRect.width,
        parentX: parentRect.left - treeRect.left + parentRect.width / 2,
        targets: companies.map((card) => {
          const rect = card.getBoundingClientRect();
          return rect.left - treeRect.left + rect.width / 2;
        }),
      });
    };

    updateConnectors();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateConnectors);
    [treeRef.current, parentRef.current, ...companyRefs.current].filter(Boolean).forEach(node => observer?.observe(node));
    window.addEventListener('resize', updateConnectors);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateConnectors);
    };
  }, []);

  return <section className="section group-section" id="group">
    <SectionTitle eyebrow="Группа компаний">СТРУКТУРА TAV GROUP</SectionTitle>
    <div className="group-tree" ref={treeRef}>
      <article className="group-parent-card" ref={parentRef} tabIndex="0" aria-label="TAV Group. Наведите или нажмите, чтобы посмотреть реквизиты.">
        <img className="group-card-photo" src={asset('group-scenes/tav-group-russian-flag-v4.jpg')} alt="" aria-hidden="true" />
        <div className="group-card-copy">
          <span>ЕДИНАЯ ГРУППА</span>
          <h2>TAV <b>GROUP</b></h2>
          <p>Объединяем профильные компании для комплексной реализации проектов.</p>
        </div>
        <GroupRequisites company="TAV GROUP" />
      </article>
      <svg className="group-connectors" viewBox={`0 0 ${connectorGeometry.width} 80`} preserveAspectRatio="none" aria-hidden="true">
        {connectorGeometry.targets.map((targetX, index) => <line key={index} x1={connectorGeometry.parentX + (index - 1) * 30} y1="0" x2={targetX} y2="80" />)}
      </svg>
      <div className="group-company-list">
        {groupCompanies.map(([name, label, description, icon, photo], index) => <article className="group-company-card" key={name} ref={(node) => { companyRefs.current[index] = node; }} tabIndex="0" aria-label={`${name}. Наведите или нажмите, чтобы посмотреть реквизиты.`}>
          <img className="group-card-photo" src={photo} alt="" aria-hidden="true" />
          <b>{String(index + 1).padStart(2, '0')}</b>
          <div className="group-card-copy">
            <img className="group-company-icon" src={icon} alt="" aria-hidden="true" />
            <span>{label}</span>
            <h3>{name}</h3>
            <p>{description}</p>
          </div>
          <GroupRequisites company={name} />
        </article>)}
      </div>
    </div>
  </section>;
}

function DirectionCard({ item, onApply, onNavigate }) {
  return <article className="direction-card">
    <a className="direction-card-link" href={withBase(item.path)} onClick={(event) => { event.preventDefault(); onNavigate(item.path); }} aria-label={`Открыть страницу «${item.name}»`} />
    <img src={item.image} alt={item.name} />
    <div className="direction-shade" />
    <span className="direction-number">{String(item.id).padStart(2, '0')}</span>
    <div className="direction-copy"><h3>{item.name}</h3><span>ПОДРОБНЕЕ <ArrowRight /></span></div>
    <button className="direction-apply" onClick={() => onApply(item.name)}>ОТПРАВИТЬ ЗАЯВКУ</button>
  </article>;
}

function ApplicationModal({ service, onClose, onSuccess }) {
  useEffect(() => {
    if (!service) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = event => { if (event.key === 'Escape') onClose(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [service, onClose]);

  if (!service) return null;
  const submit = event => {
    event.preventDefault();
    const firstName = event.currentTarget.elements.firstName.value;
    onSuccess(firstName);
    onClose();
  };
  return <div className="application-modal" role="dialog" aria-modal="true" aria-labelledby="application-title">
    <button className="application-backdrop" onClick={onClose} aria-label="Закрыть окно заявки" />
    <section className="application-dialog">
      <button className="application-close" onClick={onClose} aria-label="Закрыть"><X /></button>
      <span className="application-kicker">ЗАЯВКА / TAV IMPORT</span>
      <h2 id="application-title">ОТПРАВИТЬ ЗАЯВКУ</h2>
      <p>Оставьте контакты — уточним задачу и подготовим предложение по выбранной услуге.</p>
      <form onSubmit={submit}>
        <div className="application-grid">
          <label><span>Имя</span><input name="firstName" autoComplete="given-name" placeholder="Ваше имя" autoFocus required /></label>
          <label><span>Фамилия</span><input name="lastName" autoComplete="family-name" placeholder="Ваша фамилия" required /></label>
          <label><span>Номер телефона</span><input name="phone" type="tel" autoComplete="tel" placeholder="+375 (__) ___-__-__" required /></label>
          <label><span>Выбранная услуга</span><input name="service" value={service} readOnly /></label>
        </div>
        <label className="application-consent"><input type="checkbox" required /><span>Я согласен на обработку персональных данных.</span></label>
        <button className="orange-button application-submit" type="submit">ОТПРАВИТЬ ЗАЯВКУ <ArrowRight /></button>
      </form>
    </section>
  </div>;
}

function ChatMessageContent({ text }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => part.startsWith('**') && part.endsWith('**')
    ? <strong key={index}>{part.slice(2, -2)}</strong>
    : part
  );
}

function ChatWidget({ request }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(readStoredChatMessages);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [slowResponse, setSlowResponse] = useState(false);
  const draftRef = useRef(null);
  const messagesEndRef = useRef(null);
  const persistedMessagesRef = useRef(JSON.stringify(persistableChatMessages(messages)));
  useEffect(() => {
    if (!request) return;
    setOpen(true);
    setDraft(request.text);
  }, [request]);
  useEffect(() => {
    const field = draftRef.current;
    if (!field) return;
    field.style.height = '0px';
    field.style.height = `${Math.min(Math.max(field.scrollHeight, 57), 124)}px`;
  }, [draft, open]);
  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, open, sending]);
  useEffect(() => {
    const persistableMessages = persistableChatMessages(messages);
    const snapshot = JSON.stringify(persistableMessages);
    if (snapshot === persistedMessagesRef.current) return;
    persistedMessagesRef.current = snapshot;
    try {
      window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify({ updatedAt: Date.now(), messages: persistableMessages }));
    } catch {
      // The chat remains usable when browser storage is unavailable.
    }
  }, [messages]);
  useEffect(() => {
    const clearExpiredChat = () => {
      try {
        const stored = JSON.parse(window.localStorage.getItem(CHAT_STORAGE_KEY));
        if (!stored?.updatedAt || Date.now() - stored.updatedAt < CHAT_RETENTION_MS) return;
        window.localStorage.removeItem(CHAT_STORAGE_KEY);
        const freshMessages = [CHAT_WELCOME_MESSAGE];
        persistedMessagesRef.current = JSON.stringify(freshMessages);
        setMessages(freshMessages);
      } catch {
        // Ignore storage restrictions; the in-memory chat remains available.
      }
    };
    const expirationCheck = window.setInterval(clearExpiredChat, 60 * 1000);
    return () => window.clearInterval(expirationCheck);
  }, []);
  const send = async (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;
    const nextMessages = [...messages, { from: 'user', text }];
    setMessages(nextMessages);
    setDraft('');
    setSending(true);
    setSlowResponse(false);
    const slowResponseTimer = window.setTimeout(() => setSlowResponse(true), 10000);
    try {
      const response = await fetch(withBase('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages
            .filter(message => ['user', 'agent'].includes(message.from))
            .map(message => ({ role: message.from === 'user' ? 'user' : 'assistant', content: message.text })),
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.message) throw new Error(result.error || 'Не удалось получить ответ.');
      setMessages(current => [...current, { from: 'agent', text: result.message }]);
    } catch (error) {
      setMessages(current => [...current, { from: 'error', text: error.message || 'Не удалось получить ответ. Попробуйте ещё раз.' }]);
    } finally {
      window.clearTimeout(slowResponseTimer);
      setSlowResponse(false);
      setSending(false);
    }
  };
  return <div className="chat-widget">
    {open && <section className="chat-panel" aria-label="Чат с ИИ-консультантом">
      <header><div className="agent-avatar"><Headset /></div><div><strong>Консультант TAV</strong><span><i /> ИИ-консультант · онлайн</span></div><button onClick={() => setOpen(false)} aria-label="Закрыть чат"><X /></button></header>
      <div className="chat-messages" aria-live="polite">{messages.map((m, i) => <p className={`${m.from} ${m.text.includes('ДАННЫЕ ДЛЯ МЕНЕДЖЕРА') ? 'manager-summary' : ''}`} key={`${m.from}-${i}`}><ChatMessageContent text={m.text} /></p>)}{sending && <p className="agent typing" aria-label="Консультант готовит ответ"><span>{slowResponse ? 'Проверяю детали — это может занять до минуты' : 'Готовлю ответ'}</span><b aria-hidden="true"><i /><i /><i /></b></p>}<span ref={messagesEndRef} /></div>
      <form onSubmit={send}><textarea ref={draftRef} rows="1" value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); event.currentTarget.form.requestSubmit(); } }} placeholder="Введите сообщение…" aria-label="Сообщение" autoFocus /><button type="submit" aria-label="Отправить" disabled={sending || !draft.trim()}><PaperPlaneTilt weight="fill" /></button></form>
    </section>}
    <button className="chat-toggle" onClick={() => setOpen(v => !v)} aria-label="Открыть чат-менеджер">{open ? <X /> : <ChatCircleDots weight="fill" />}<span>Чат-менеджер</span></button>
  </div>;
}

function ContactStrip() {
  return <section className="contact-strip" id="contacts">
    <img className="contact-map" src={asset('contact-route-map-generated-v2.jpg')} alt="" aria-hidden="true" />
    <div className="contact-content">
      <h2>ОБСУДИМ ВАШ ПРОЕКТ</h2>
      <div className="contact-list"><a href="tel:+375290000000"><PhoneCall /> <span>+375 29 000-00-00<small>Звоните</small></span></a><a href="mailto:info@tavimport.by"><EnvelopeSimple /> <span>info@tavimport.by<small>Пишите</small></span></a><a href="#telegram"><PaperPlaneTilt /> <span>Telegram / WhatsApp / Viber<small>Свяжитесь в мессенджере</small></span></a><span><Clock /> <b>Пн–Пт: 9:00–18:00<small>Время работы</small></b></span></div>
    </div>
  </section>;
}

const directionSteps = [
  { number: '01', title: 'ФИКСИРУЕМ ЗАДАЧУ', text: 'Уточняем параметры, комплектацию, бюджет и сроки проекта.', icon: asset('process-icons/task.png') },
  { number: '02', title: 'ПОДБИРАЕМ РЕШЕНИЕ', text: 'Сравниваем производителей и согласовываем техническое предложение.', icon: asset('process-icons/solution.png') },
  { number: '03', title: 'ПРОВЕРЯЕМ НА ЗАВОДЕ', text: 'Контролируем производство, испытания, упаковку и документы.', icon: asset('process-icons/inspection.png') },
  { number: '04', title: 'ДОСТАВЛЯЕМ НА ОБЪЕКТ', text: 'Организуем логистику, таможню и передачу оборудования клиенту.', icon: asset('process-icons/delivery.png') },
];

function DirectionPage({ item, onNavigate, onApply, onQuestion }) {
  const otherDirections = directions.filter(direction => direction.id !== item.id);
  return <main className="direction-page">
    <section className="direction-detail-hero" id="hero">
      <img src={item.heroImage} alt={item.pageTitle} />
      <div className="direction-detail-overlay" />
      <div className="direction-detail-content">
        <button className="direction-breadcrumb" onClick={() => onNavigate('/', 'directions')}>ГЛАВНАЯ / НАПРАВЛЕНИЯ / <b>{item.name.toUpperCase()}</b></button>
        <span className="direction-kicker">{String(item.id).padStart(2, '0')} / НАПРАВЛЕНИЕ ПОСТАВОК</span>
        <h1>{item.pageTitle}</h1>
        <p>{item.lead}</p>
        <div className="direction-detail-actions">
          <button className="orange-button" onClick={() => onApply(item.name)}>ОТПРАВИТЬ ЗАЯВКУ <ArrowRight /></button>
          <button className="direction-hero-question" type="button" onClick={() => onQuestion(item.questionSubject, true)}><ChatCircleDots weight="fill" /> ЗАДАТЬ ВОПРОС</button>
        </div>
      </div>
    </section>

    <section className="section direction-supply">
      <SectionTitle eyebrow="Подбираем отдельные единицы и комплектные линии">ЧТО ПОСТАВЛЯЕМ</SectionTitle>
      <div className="direction-supply-grid">{item.supplies.map((supply, index) => <article className="direction-supply-card" key={supply}>
        <img className="direction-supply-photo" src={asset(`supply-cards/${supplyCardImages[item.id][index]}.jpg`)} alt="" aria-hidden="true" />
        <span>{String(index + 1).padStart(2, '0')}</span>
        <div className="direction-supply-copy">
          <h3>{supply}</h3>
          <span className="direction-supply-cta">ВЫБРАТЬ ДЕЙСТВИЕ <ArrowRight /></span>
        </div>
        <div className="direction-supply-actions">
          <button className="direction-question-button" type="button" onClick={() => onQuestion(supply)}>ЗАДАТЬ ВОПРОС</button>
          <button className="direction-application-button" type="button" onClick={() => onApply(supply)}>ОТПРАВИТЬ ЗАЯВКУ</button>
        </div>
      </article>)}</div>
    </section>

    <section className="direction-workflow">
      <div className="section direction-workflow-inner">
        <div className="direction-workflow-head"><div className="workflow-label"><span>ПРОЦЕСС</span><i aria-hidden="true" /></div><h2>КАК ПРОХОДИТ ПОСТАВКА</h2><p>Один менеджер ведёт проект от первого запроса<br />до передачи оборудования на вашем складе.</p></div>
        <div className="direction-workflow-grid">{directionSteps.map((step) => <article className="workflow-step" key={step.number}>
            <img className="workflow-icon" src={step.icon} alt="" aria-hidden="true" />
            <div className="workflow-number"><b>{step.number}</b></div>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>)}</div>
      </div>
    </section>

    <section className="section direction-other">
      <div className="direction-other-head"><SectionTitle>ДРУГИЕ НАПРАВЛЕНИЯ</SectionTitle><button onClick={() => onNavigate('/', 'directions')}>СМОТРЕТЬ ВСЕ <ArrowRight /></button></div>
      <div className="direction-other-grid">{otherDirections.map(direction => <a href={withBase(direction.path)} key={direction.id} onClick={(event) => { event.preventDefault(); onNavigate(direction.path); }}><img src={direction.image} alt="" /><span>{String(direction.id).padStart(2, '0')}</span><h3>{direction.name}</h3><ArrowRight /></a>)}</div>
    </section>

    <ContactStrip />
  </main>;
}

function Footer({ onNavigate }) {
  return <footer className="site-footer">
    <div className="footer-brand"><Logo onHome={() => onNavigate('/')} /><p>Импорт промышленного оборудования,<br />станков, спецтехники и запчастей<br />из Азии в РБ и РФ.</p><small>© TAV IMPORT, 2026</small></div>
    <div><h4>КОМПАНИЯ</h4><button onClick={() => onNavigate('/', 'group')}>О компании</button><button onClick={() => onNavigate('/', 'group')}>Группа компаний</button><button onClick={() => onNavigate('/', 'contacts')}>Документы</button><button onClick={() => onNavigate('/', 'cases')}>Новости</button></div>
    <div><h4>УСЛУГИ</h4><button onClick={() => onNavigate('/', 'process')}>Поиск оборудования</button><button onClick={() => onNavigate('/', 'process')}>Инспекция</button><button onClick={() => onNavigate('/', 'process')}>Логистика и доставка</button><button onClick={() => onNavigate('/', 'process')}>Таможенное оформление</button></div>
    <div><h4>НАПРАВЛЕНИЯ</h4>{directions.map(item => <button key={item.id} onClick={() => onNavigate(item.path)}>{item.name}</button>)}</div>
    <div className="messengers"><h4>МЫ В МЕССЕНДЖЕРАХ</h4><div><a href="#telegram" aria-label="Telegram"><PaperPlaneTilt weight="fill" /></a><a href="#whatsapp" aria-label="WhatsApp"><Phone weight="fill" /></a><a href="#viber" aria-label="Viber"><ChatCircleDots weight="fill" /></a></div></div>
  </footer>;
}

export function App() {
  const qaMode = new URLSearchParams(window.location.search).has('qa');
  const [path, setPath] = useState(readAppPath());
  const [applicationService, setApplicationService] = useState('');
  const [chatRequest, setChatRequest] = useState(null);
  const [activeCase, setActiveCase] = useState(0);
  const [notice, setNotice] = useState('');
  const activeDirection = directions.find(item => item.path === path);
  useEffect(() => {
    const syncPath = () => setPath(readAppPath());
    window.addEventListener('popstate', syncPath);
    return () => window.removeEventListener('popstate', syncPath);
  }, []);
  useEffect(() => { document.title = activeDirection ? `${activeDirection.name} из Азии — TAV IMPORT` : 'TAV IMPORT — промышленное оборудование из Азии'; }, [activeDirection]);
  useEffect(() => { if (!notice) return; const id = setTimeout(() => setNotice(''), 4200); return () => clearTimeout(id); }, [notice]);
  const navigate = (nextPath = '/', anchor = '') => {
    const normalizedPath = nextPath.replace(/\/$/, '') || '/';
    const nextUrl = `${withBase(normalizedPath)}${anchor ? `#${anchor}` : ''}`;
    if (`${window.location.pathname}${window.location.hash}` !== nextUrl) window.history.pushState({}, '', nextUrl);
    setPath(normalizedPath);
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      if (anchor) document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    }));
  };
  const leadSuccess = name => setNotice(`${name ? `${name}, заявка` : 'Заявка'} принята. Мы свяжемся с вами в ближайшее время.`);
  const askQuestion = (subject, broad = false) => setChatRequest({ id: Date.now(), text: broad
    ? `Здравствуйте, у меня есть вопрос по поставке ${subject}.`
    : `Здравствуйте, у меня есть вопрос по поставке «${subject}».`
  });

  if (activeDirection) return <div className={`app-shell ${qaMode ? 'qa-mode' : ''}`}>
    <Header onNavigate={navigate} onApply={setApplicationService} />
    <DirectionPage item={activeDirection} onNavigate={navigate} onApply={setApplicationService} onQuestion={askQuestion} />
    <Footer onNavigate={navigate} />
    <ApplicationModal service={applicationService} onClose={() => setApplicationService('')} onSuccess={leadSuccess} />
    <ChatWidget request={chatRequest} />
    {notice && <div className="toast"><CheckCircle weight="fill" /><span>{notice}</span><button onClick={() => setNotice('')}><X /></button></div>}
  </div>;

  return <div className={`app-shell ${qaMode ? 'qa-mode' : ''}`}>
    <Header onNavigate={navigate} onApply={setApplicationService} />
    <main>
      <section className="hero" id="hero">
        <img src={asset('hero-industrial-v3.png')} alt="Погрузка промышленного насосного модуля в морском терминале" />
        <div className="hero-overlay" />
        <img className="hero-route-map" src={asset('hero-route-map.webp')} alt="" aria-hidden="true" />
        <div className="hero-content">
          <span>TAV IMPORT</span>
          <h1>ПРОМЫШЛЕННОЕ<br />ОБОРУДОВАНИЕ ИЗ АЗИИ<br />ПОД КЛЮЧ</h1>
          <p>Находим, проверяем и доставляем оборудование<br />для вашего бизнеса в Беларусь и Россию</p>
          <div className="hero-actions"><button className="orange-button" onClick={() => setApplicationService('Расчёт заявки')}>РАССЧИТАТЬ ЗАЯВКУ <ArrowRight /></button></div>
          <div className="hero-points"><span><MapPin /> РБ + РФ</span><span><Cube /> ПОЛНЫЙ ЦИКЛ</span><span><ShieldCheck /> КОНТРОЛЬ КАЧЕСТВА</span></div>
        </div>
      </section>

      <section className="section directions" id="directions">
        <SectionTitle>НАПРАВЛЕНИЯ ПОСТАВОК</SectionTitle>
        <div className="directions-grid">{directions.map(item => <DirectionCard key={item.id} item={item} onApply={setApplicationService} onNavigate={navigate} />)}</div>
      </section>

      <GroupSection />

      <section className="section china-support-section" id="china-support">
        <SectionTitle eyebrow="Дополнительные возможности">ВЫЕЗДЫ В КНР И ТЕХНИЧЕСКОЕ СОПРОВОЖДЕНИЕ</SectionTitle>
        <div className="china-support-card">
          <img
            className="china-support-photo"
            src={asset('china-technical-support-v1.jpg')}
            alt="Международная команда проводит инспекцию и пусконаладку промышленного оборудования на заводе в КНР"
          />
          <div className="china-support-copy">
            <p className="china-support-lead">Подключаемся там, где дистанционного контроля недостаточно: на заводе в КНР и на площадке заказчика.</p>
            <div className="china-support-points">
              <article>
                <b>01</b>
                <div><h3>Оперативный выезд в КНР</h3><p>Организуем инспекцию и проверку оборудования, участие в подписании договора и решение организационных вопросов любой сложности для заказчика.</p></div>
              </article>
              <article>
                <b>02</b>
                <div><h3>Монтаж и пусконаладка</h3><p>Организуем выезд профильных специалистов из КНР на объект заказчика для монтажа, шеф-монтажа и пусконаладки поставленного оборудования.</p></div>
              </article>
            </div>
            <button className="orange-button" onClick={() => setApplicationService('Выезд в КНР и техническое сопровождение')}>ОБСУДИТЬ СОПРОВОЖДЕНИЕ <ArrowRight /></button>
          </div>
        </div>
      </section>

      <section className="section process-section" id="process">
        <SectionTitle eyebrow="От заявки до оборудования на вашем складе">БЕРЁМ НА СЕБЯ ВЕСЬ ПРОЦЕСС</SectionTitle>
        <div className="process-line">{process.map(([label, Icon], index) => <article key={label}><b>{index + 1}</b><Icon /><span>{label}</span></article>)}</div>
      </section>

      <section className="section advantages" id="advantages">
        <div className="advantages-lead"><h2>ПОЧЕМУ TAV IMPORT</h2><p><strong>7</strong><span>ЭТАПОВ<br />ПОД КОНТРОЛЕМ</span></p></div>
        <div className="advantages-grid">{advantages.map(([label, Icon]) => <article key={label}><Icon /><h3>{label}</h3></article>)}</div>
      </section>

      <section className="section cases" id="cases">
        <div className="cases-title"><SectionTitle>КЕЙСЫ</SectionTitle></div>
        <div className="cases-grid">{cases.map(item => <article className="case-card" id={`case-${item.id}`} key={item.id}><img src={item.image} alt={item.title} /><div><h3>{item.title}</h3><p>{item.meta.map(x => <span key={x}>{x}</span>)}</p><button onClick={() => setApplicationService(item.title)}>ОТПРАВИТЬ ЗАЯВКУ <ArrowRight /></button></div></article>)}</div>
        <div className="case-pagination" aria-label="Навигация по реальным поставкам">{cases.map((item, index) => <button className={index === activeCase ? 'is-active' : ''} key={item.id} type="button" aria-label={`Показать кейс ${index + 1}`} aria-current={index === activeCase ? 'true' : undefined} onClick={() => { setActiveCase(index); document.getElementById(`case-${item.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' }); }} />)}</div>
      </section>

      <ContactStrip />
    </main>
    <Footer onNavigate={navigate} />
    <ApplicationModal service={applicationService} onClose={() => setApplicationService('')} onSuccess={leadSuccess} />
    <ChatWidget request={chatRequest} />
    {notice && <div className="toast"><CheckCircle weight="fill" /><span>{notice}</span><button onClick={() => setNotice('')}><X /></button></div>}
  </div>;
}
