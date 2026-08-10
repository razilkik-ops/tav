import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowsClockwise,
  Bank,
  CaretDown,
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
  Minus,
  Package,
  Paperclip,
  PaperPlaneTilt,
  Phone,
  PhoneCall,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Timer,
  Trash,
  Truck,
  Warehouse,
  X,
} from '@phosphor-icons/react';

const directions = [
  {
    id: 1,
    name: 'Станки',
    path: '/napravleniya/stanki',
    image: '/assets/category-machines.webp',
    pageTitle: 'ПРОМЫШЛЕННЫЕ СТАНКИ ИЗ АЗИИ',
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
    image: '/assets/category-heavy-equipment.webp',
    pageTitle: 'СПЕЦТЕХНИКА ДЛЯ СТРОЙКИ И КАРЬЕРОВ',
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
    image: '/assets/category-pumps.webp',
    pageTitle: 'ПРОМЫШЛЕННЫЕ НАСОСЫ И СТАНЦИИ',
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
    image: '/assets/category-parts.webp',
    pageTitle: 'ЗАПЧАСТИ ДЛЯ ПРОМЫШЛЕННОГО ОБОРУДОВАНИЯ',
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
    image: '/assets/category-construction.webp',
    pageTitle: 'СТРОИТЕЛЬНОЕ ОБОРУДОВАНИЕ',
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
    image: '/assets/category-factory.webp',
    pageTitle: 'НЕСТАНДАРТНОЕ ОБОРУДОВАНИЕ ПОД ЗАДАЧУ',
    lead: 'Если нужного направления нет в каталоге, найдём производителя и построим цепочку поставки специально под ваш проект.',
    description: 'Берём в работу нестандартные запросы: от отдельного узла до комплектной производственной линии. Подключаем профильных инженеров и локальных инспекторов.',
    supplies: ['Упаковочные линии', 'Пищевое оборудование', 'Складская автоматизация', 'Энергетическое оборудование', 'Роботизированные комплексы', 'Оборудование по вашему ТЗ'],
    benefits: ['Поиск узкопрофильных заводов', 'Сравнение технических решений', 'Аудит нового производителя', 'Проектная логистика'],
    facts: [['7–10 дней', 'ПЕРВИЧНЫЙ ПОДБОР'], ['1 000+ заводов', 'БАЗА ПОСТАВЩИКОВ'], ['РБ + РФ', 'ДОСТАВКА ПОД КЛЮЧ']],
  },
];

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
  { id: 'c1', title: 'Фрезерный центр для производства', image: '/assets/category-machines.webp', meta: ['38 дней', '12 тонн', 'Китай → Беларусь'] },
  { id: 'c2', title: 'Насосная станция для предприятия', image: '/assets/category-pumps.webp', meta: ['29 дней', '8 тонн', 'Китай → Россия'] },
  { id: 'c3', title: 'Спецтехника для строительной компании', image: '/assets/case-excavator.webp', meta: ['45 дней', '20 тонн', 'Китай → Беларусь'] },
];

function Logo({ onHome }) {
  return <button className="logo" onClick={() => onHome?.()} aria-label="На главную"><span>TAV</span> IMPORT</button>;
}

function Header({ cartCount, onCart, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [['Главная', 'hero'], ['Услуги', 'process'], ['Направления', 'directions'], ['Кейсы', 'cases'], ['О компании', 'advantages'], ['Контакты', 'contacts']];
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
      <button className="cart-button" onClick={onCart} aria-label="Открыть корзину"><ShoppingCart />{cartCount > 0 && <b>{cartCount}</b>}</button>
      <button className="outline-cta" onClick={() => go('request')}>ПОЛУЧИТЬ КП</button>
      <button className="menu-button" onClick={() => setMenuOpen(v => !v)} aria-label="Меню">{menuOpen ? <X /> : <List />}</button>
    </div>
  </header>;
}

function SectionTitle({ eyebrow, children }) {
  return <div className="section-heading">{eyebrow && <span>{eyebrow}</span>}<h2>{children}</h2><i /></div>;
}

function DirectionCard({ item, onAdd, onNavigate }) {
  return <article className="direction-card">
    <a className="direction-card-link" href={item.path} onClick={(event) => { event.preventDefault(); onNavigate(item.path); }} aria-label={`Открыть страницу «${item.name}»`} />
    <img src={item.image} alt={item.name} />
    <div className="direction-shade" />
    <span className="direction-number">{String(item.id).padStart(2, '0')}</span>
    <div className="direction-copy"><h3>{item.name}</h3><span>ПОДРОБНЕЕ <ArrowRight /></span></div>
    <button className="direction-add" onClick={() => onAdd(item)} aria-label={`Добавить в подборку: ${item.name}`}><Plus /></button>
  </article>;
}

function LeadForm({ compact = false, onSuccess }) {
  const [fileName, setFileName] = useState('');
  const submit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    onSuccess?.(form.elements.name?.value || '');
    form.reset();
    setFileName('');
  };
  return <form className={`lead-form ${compact ? 'compact' : ''}`} onSubmit={submit}>
    <div className="field-grid">
      <label><span>Имя</span><input name="name" placeholder="Ваше имя" required /></label>
      <label><span>Телефон</span><input name="phone" type="tel" placeholder="+375 (__) ___-__-__" required /></label>
      <label><span>E-mail</span><input name="email" type="email" placeholder="mail@company.by" /></label>
      <label><span>Направление</span><select name="direction" defaultValue=""><option value="" disabled>Выберите направление</option>{directions.map(item => <option key={item.id}>{item.name}</option>)}</select><CaretDown /></label>
    </div>
    <label className="message-field"><span>Описание задачи</span><textarea name="message" placeholder="Что нужно найти и доставить?" required /></label>
    <div className="form-actions">
      <label className="file-button"><Paperclip /><span>{fileName || 'ПРИКРЕПИТЬ ФАЙЛ'}</span><input type="file" onChange={(e) => setFileName(e.target.files?.[0]?.name || '')} /></label>
      <button className="orange-button" type="submit">ПОЛУЧИТЬ РАСЧЁТ <ArrowRight /></button>
    </div>
    <label className="consent"><input type="checkbox" required /> <span>Я согласен на обработку персональных данных и получение коммерческой информации.</span></label>
  </form>;
}

function CartDrawer({ open, items, onClose, setItems, onRequest }) {
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const update = (id, delta) => setItems(items.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
  return <><button className={`drawer-backdrop ${open ? 'open' : ''}`} onClick={onClose} aria-label="Закрыть корзину" />
    <aside className={`cart-drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div className="drawer-head"><div><span>ПОДБОРКА</span><h2>ОБОРУДОВАНИЕ <b>{count}</b></h2></div><button onClick={onClose} aria-label="Закрыть корзину"><X /></button></div>
      <div className="drawer-body">
        {items.length === 0 ? <div className="empty-cart"><Package /><h3>ПОДБОРКА ПУСТА</h3><p>Добавьте нужные направления — мы подготовим предложение по каждому.</p></div> : items.map(item => <article className="cart-row" key={item.id}>
          <img src={item.image} alt="" /><div><h3>{item.name}</h3><p>Предварительный подбор</p><div className="quantity"><button onClick={() => update(item.id, -1)} aria-label={`Уменьшить количество: ${item.name}`}><Minus /></button><span>{item.qty}</span><button onClick={() => update(item.id, 1)} aria-label={`Увеличить количество: ${item.name}`}><Plus /></button></div></div><button className="remove-item" onClick={() => setItems(items.filter(x => x.id !== item.id))} aria-label={`Удалить из подборки: ${item.name}`}><Trash /></button>
        </article>)}
      </div>
      {items.length > 0 && <div className="drawer-footer"><p><span>Позиций в запросе</span><strong>{count}</strong></p><button className="orange-button" onClick={onRequest}>ОТПРАВИТЬ НА РАСЧЁТ <ArrowRight /></button></div>}
    </aside>
  </>;
}

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: 'agent', text: 'Здравствуйте! Помогу подобрать оборудование и рассчитать доставку.' }]);
  const [draft, setDraft] = useState('');
  const send = (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    setMessages(prev => [...prev, { from: 'user', text: draft.trim() }, { from: 'agent', text: 'Спасибо! Консультант подключится в течение нескольких минут.' }]);
    setDraft('');
  };
  return <div className="chat-widget">
    {open && <section className="chat-panel">
      <header><div className="agent-avatar"><Headset /></div><div><strong>Консультант TAV</strong><span><i /> Сейчас онлайн</span></div><button onClick={() => setOpen(false)} aria-label="Закрыть чат"><X /></button></header>
      <div className="chat-messages">{messages.map((m, i) => <p className={m.from} key={i}>{m.text}</p>)}</div>
      <form onSubmit={send}><input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Введите сообщение…" aria-label="Сообщение" /><button aria-label="Отправить"><PaperPlaneTilt weight="fill" /></button></form>
    </section>}
    <button className="chat-toggle" onClick={() => setOpen(v => !v)} aria-label="Чат с консультантом">{open ? <X /> : <ChatCircleDots weight="fill" />}<span>Задать вопрос</span></button>
  </div>;
}

function ContactStrip() {
  return <section className="contact-strip" id="contacts">
    <img className="contact-map" src="/assets/contact-route-map-generated-v2.jpg" alt="" aria-hidden="true" />
    <div className="contact-content">
      <h2>ОБСУДИМ ВАШ ПРОЕКТ</h2>
      <div className="contact-list"><a href="tel:+375290000000"><PhoneCall /> <span>+375 29 000-00-00<small>Звоните</small></span></a><a href="mailto:info@tavimport.by"><EnvelopeSimple /> <span>info@tavimport.by<small>Пишите</small></span></a><a href="#telegram"><PaperPlaneTilt /> <span>Telegram / WhatsApp / Viber<small>Свяжитесь в мессенджере</small></span></a><span><Clock /> <b>Пн–Пт: 9:00–18:00<small>Время работы</small></b></span></div>
    </div>
  </section>;
}

const directionSteps = [
  ['01', 'ФИКСИРУЕМ ЗАДАЧУ', 'Уточняем параметры, комплектацию, бюджет и сроки проекта.'],
  ['02', 'ПОДБИРАЕМ РЕШЕНИЕ', 'Сравниваем производителей и согласовываем техническое предложение.'],
  ['03', 'ПРОВЕРЯЕМ НА ЗАВОДЕ', 'Контролируем производство, испытания, упаковку и документы.'],
  ['04', 'ДОСТАВЛЯЕМ НА ОБЪЕКТ', 'Организуем логистику, таможню и передачу оборудования клиенту.'],
];

function DirectionPage({ item, onNavigate, onAdd, onSuccess }) {
  const otherDirections = directions.filter(direction => direction.id !== item.id);
  const scrollToRequest = () => document.getElementById('request')?.scrollIntoView({ behavior: 'smooth' });
  return <main className="direction-page">
    <section className="direction-detail-hero" id="hero">
      <img src={item.image} alt={item.pageTitle} />
      <div className="direction-detail-overlay" />
      <div className="direction-detail-content">
        <button className="direction-breadcrumb" onClick={() => onNavigate('/', 'directions')}>ГЛАВНАЯ / НАПРАВЛЕНИЯ / <b>{item.name.toUpperCase()}</b></button>
        <span className="direction-kicker">{String(item.id).padStart(2, '0')} / НАПРАВЛЕНИЕ ПОСТАВОК</span>
        <h1>{item.pageTitle}</h1>
        <p>{item.lead}</p>
        <div className="direction-detail-actions"><button className="orange-button" onClick={scrollToRequest}>РАССЧИТАТЬ ПОСТАВКУ <ArrowRight /></button><button className="direction-outline-button" onClick={() => onAdd(item)}><Plus /> ДОБАВИТЬ В ПОДБОРКУ</button></div>
      </div>
      <div className="direction-facts">{item.facts.map(([value, label]) => <article key={label}><strong>{value}</strong><span>{label}</span></article>)}</div>
    </section>

    <section className="section direction-overview">
      <div><span className="section-label">РАБОТАЕМ ПОД КЛЮЧ</span><h2>ПОСТАВКА БЕЗ РАЗРЫВОВ<br />В ОТВЕТСТВЕННОСТИ</h2><p>{item.description}</p></div>
      <div className="direction-benefits">{item.benefits.map(benefit => <p key={benefit}><CheckCircle weight="fill" />{benefit}</p>)}</div>
    </section>

    <section className="section direction-supply">
      <SectionTitle eyebrow="Подбираем отдельные единицы и комплектные линии">ЧТО ПОСТАВЛЯЕМ</SectionTitle>
      <div className="direction-supply-grid">{item.supplies.map((supply, index) => <article key={supply}><span>{String(index + 1).padStart(2, '0')}</span><Cube /><h3>{supply}</h3><button onClick={scrollToRequest}>ЗАПРОСИТЬ РАСЧЁТ <ArrowRight /></button></article>)}</div>
    </section>

    <section className="direction-workflow">
      <div className="section direction-workflow-inner">
        <div className="direction-workflow-head"><span className="section-label">ПРОЦЕСС</span><h2>КАК ПРОХОДИТ ПОСТАВКА</h2><p>Один менеджер ведёт проект от первого запроса до передачи оборудования на вашем складе.</p></div>
        <div className="direction-workflow-grid">{directionSteps.map(([number, title, text]) => <article key={number}><b>{number}</b><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
      </div>
    </section>

    <section className="section direction-other">
      <div className="direction-other-head"><SectionTitle>ДРУГИЕ НАПРАВЛЕНИЯ</SectionTitle><button onClick={() => onNavigate('/', 'directions')}>СМОТРЕТЬ ВСЕ <ArrowRight /></button></div>
      <div className="direction-other-grid">{otherDirections.map(direction => <a href={direction.path} key={direction.id} onClick={(event) => { event.preventDefault(); onNavigate(direction.path); }}><img src={direction.image} alt="" /><span>{String(direction.id).padStart(2, '0')}</span><h3>{direction.name}</h3><ArrowRight /></a>)}</div>
    </section>

    <section className="section request-section direction-request" id="request">
      <div className="request-copy"><img src={item.image} alt="" /><div><span>{item.name}</span><h2>РАССЧИТАЕМ ПОСТАВКУ<br />ПОД ВАШУ ЗАДАЧУ</h2><p>Прикрепите спецификацию или опишите оборудование — подготовим первичный подбор и расчёт.</p></div></div>
      <LeadForm onSuccess={onSuccess} />
    </section>
    <ContactStrip />
  </main>;
}

function Footer({ onNavigate }) {
  return <footer className="site-footer">
    <div className="footer-brand"><Logo onHome={() => onNavigate('/')} /><p>Импорт промышленного оборудования,<br />станков, спецтехники и запчастей<br />из Азии в РБ и РФ.</p><small>© TAV IMPORT, 2026</small></div>
    <div><h4>КОМПАНИЯ</h4><button onClick={() => onNavigate('/', 'advantages')}>О компании</button><button onClick={() => onNavigate('/', 'advantages')}>Команда</button><button onClick={() => onNavigate('/', 'contacts')}>Документы</button><button onClick={() => onNavigate('/', 'cases')}>Новости</button></div>
    <div><h4>УСЛУГИ</h4><button onClick={() => onNavigate('/', 'process')}>Поиск оборудования</button><button onClick={() => onNavigate('/', 'process')}>Инспекция</button><button onClick={() => onNavigate('/', 'process')}>Логистика и доставка</button><button onClick={() => onNavigate('/', 'process')}>Таможенное оформление</button></div>
    <div><h4>НАПРАВЛЕНИЯ</h4>{directions.map(item => <button key={item.id} onClick={() => onNavigate(item.path)}>{item.name}</button>)}</div>
    <div className="messengers"><h4>МЫ В МЕССЕНДЖЕРАХ</h4><div><a href="#telegram" aria-label="Telegram"><PaperPlaneTilt weight="fill" /></a><a href="#whatsapp" aria-label="WhatsApp"><Phone weight="fill" /></a><a href="#viber" aria-label="Viber"><ChatCircleDots weight="fill" /></a></div></div>
  </footer>;
}

export function App() {
  const qaMode = new URLSearchParams(window.location.search).has('qa');
  const [path, setPath] = useState(window.location.pathname.replace(/\/$/, '') || '/');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const count = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);
  const activeDirection = directions.find(item => item.path === path);
  useEffect(() => {
    const syncPath = () => setPath(window.location.pathname.replace(/\/$/, '') || '/');
    window.addEventListener('popstate', syncPath);
    return () => window.removeEventListener('popstate', syncPath);
  }, []);
  useEffect(() => { document.title = activeDirection ? `${activeDirection.name} из Азии — TAV IMPORT` : 'TAV IMPORT — промышленное оборудование из Азии'; }, [activeDirection]);
  useEffect(() => { if (!notice) return; const id = setTimeout(() => setNotice(''), 4200); return () => clearTimeout(id); }, [notice]);
  const navigate = (nextPath = '/', anchor = '') => {
    const normalizedPath = nextPath.replace(/\/$/, '') || '/';
    const nextUrl = `${normalizedPath}${anchor ? `#${anchor}` : ''}`;
    if (`${window.location.pathname}${window.location.hash}` !== nextUrl) window.history.pushState({}, '', nextUrl);
    setPath(normalizedPath);
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      if (anchor) document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    }));
  };
  const addToCart = item => {
    setCart(prev => prev.some(x => x.id === item.id) ? prev.map(x => x.id === item.id ? { ...x, qty: x.qty + 1 } : x) : [...prev, { ...item, qty: 1 }]);
    setNotice(`${item.name}: добавлено в подборку`);
  };
  const requestFromCart = () => { setCartOpen(false); document.getElementById('request')?.scrollIntoView({ behavior: 'smooth' }); };
  const leadSuccess = name => setNotice(`${name ? `${name}, заявка` : 'Заявка'} принята. Мы свяжемся с вами в ближайшее время.`);

  if (activeDirection) return <div className={`app-shell ${qaMode ? 'qa-mode' : ''}`}>
    <Header cartCount={count} onCart={() => setCartOpen(true)} onNavigate={navigate} />
    <DirectionPage item={activeDirection} onNavigate={navigate} onAdd={addToCart} onSuccess={leadSuccess} />
    <Footer onNavigate={navigate} />
    <CartDrawer open={cartOpen} items={cart} setItems={setCart} onClose={() => setCartOpen(false)} onRequest={requestFromCart} />
    <ChatWidget />
    {notice && <div className="toast"><CheckCircle weight="fill" /><span>{notice}</span><button onClick={() => setNotice('')}><X /></button></div>}
  </div>;

  return <div className={`app-shell ${qaMode ? 'qa-mode' : ''}`}>
    <Header cartCount={count} onCart={() => setCartOpen(true)} onNavigate={navigate} />
    <main>
      <section className="hero" id="hero">
        <img src="/assets/hero-industrial.webp" alt="Доставка промышленного оборудования" />
        <div className="hero-overlay" />
        <img className="hero-route-map" src="/assets/hero-route-map.webp" alt="" aria-hidden="true" />
        <div className="hero-content">
          <span>TAV IMPORT</span>
          <h1>ПРОМЫШЛЕННОЕ<br />ОБОРУДОВАНИЕ ИЗ АЗИИ<br />ПОД КЛЮЧ</h1>
          <p>Находим, проверяем и доставляем оборудование<br />для вашего бизнеса в Беларусь и Россию</p>
          <div className="hero-actions"><button className="orange-button" onClick={() => document.getElementById('request')?.scrollIntoView({ behavior: 'smooth' })}>РАССЧИТАТЬ ДОСТАВКУ <ArrowRight /></button><button onClick={() => document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' })}>СМОТРЕТЬ КЕЙСЫ <ArrowRight /></button></div>
          <div className="hero-points"><span><MapPin /> РБ + РФ</span><span><Cube /> ПОЛНЫЙ ЦИКЛ</span><span><ShieldCheck /> КОНТРОЛЬ КАЧЕСТВА</span></div>
        </div>
      </section>

      <section className="section directions" id="directions">
        <SectionTitle>НАПРАВЛЕНИЯ ПОСТАВОК</SectionTitle>
        <div className="directions-grid">{directions.map(item => <DirectionCard key={item.id} item={item} onAdd={addToCart} onNavigate={navigate} />)}</div>
      </section>

      <section className="section process-section" id="process">
        <SectionTitle eyebrow="От заявки до оборудования на вашем складе">БЕРЁМ НА СЕБЯ ВЕСЬ ПРОЦЕСС</SectionTitle>
        <div className="process-line">{process.map(([label, Icon], index) => <article key={label}><b>{index + 1}</b><Icon /><span>{label}</span></article>)}</div>
      </section>

      <section className="section advantages" id="advantages">
        <div className="advantages-lead"><h2>ПОЧЕМУ<br />TAV IMPORT</h2><p><strong>7</strong><span>ЭТАПОВ<br />ПОД КОНТРОЛЕМ</span></p></div>
        <div className="advantages-grid">{advantages.map(([label, Icon]) => <article key={label}><Icon /><h3>{label}</h3></article>)}</div>
      </section>

      <section className="section cases" id="cases">
        <div className="cases-title"><SectionTitle>РЕАЛЬНЫЕ ПОСТАВКИ</SectionTitle><div><button aria-label="Назад">‹</button><button aria-label="Вперёд">›</button></div></div>
        <div className="cases-grid">{cases.map(item => <article className="case-card" key={item.id}><img src={item.image} alt={item.title} /><div><h3>{item.title}</h3><p>{item.meta.map(x => <span key={x}>{x}</span>)}</p><button onClick={() => addToCart({ ...item, name: item.title })}>В ПОДБОРКУ <Plus /></button></div></article>)}</div>
      </section>

      <section className="section request-section" id="request">
        <div className="request-copy"><img src="/assets/request-container.webp" alt="Контейнерная доставка оборудования" /><div><h2>РАССЧИТАЕМ ПОСТАВКУ<br />ПОД ВАШУ ЗАДАЧУ</h2><p>Прикрепите спецификацию или опишите оборудование — подготовим предварительный расчёт.</p></div></div>
        <LeadForm onSuccess={leadSuccess} />
      </section>

      <ContactStrip />
    </main>
    <Footer onNavigate={navigate} />
    <CartDrawer open={cartOpen} items={cart} setItems={setCart} onClose={() => setCartOpen(false)} onRequest={requestFromCart} />
    <ChatWidget />
    {notice && <div className="toast"><CheckCircle weight="fill" /><span>{notice}</span><button onClick={() => setNotice('')}><X /></button></div>}
  </div>;
}
