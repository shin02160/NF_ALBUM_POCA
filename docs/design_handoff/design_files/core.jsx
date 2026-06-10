// ── NF ALBUM POCA · core: tokens, data, icons, shared atoms ─────────────
(function () {
  const T = {
    bg: '#f5f5f7', s: '#ffffff', b: '#dbdcdf', bl: '#f4f4f5',
    t: 'rgb(23,23,25)', tm: 'rgb(112,115,124)', tl: 'rgb(152,155,162)',
    p: 'rgb(51,102,255)', pb: 'rgb(234,242,254)',
    f: `'Pretendard JP', -apple-system, sans-serif`,
  };

  // Status (테두리 색): 소장 파랑 / 구해요 빨강 / 교환가능 앰버
  const STATUS = {
    '소장':     { c: 'rgb(51,102,255)',  bg: 'rgb(234,242,254)' },
    '구해요':   { c: 'rgb(255,66,66)',   bg: 'rgb(254,236,236)' },
    '교환 가능': { c: 'rgb(245,168,0)',   bg: 'rgb(255,247,229)' },
  };
  const STATUS_ORDER = ['소장', '구해요', '교환 가능'];

  // 멤버 컬러 (대시보드/뱃지용)
  const MC = {
    '승협': '#3366FF', '훈': '#00BF40', '재현': '#F5C400',
    '회승': '#FF9200', '동성': '#F553DA', '단체': '#8050DF',
  };

  // ── Sample data ──────────────────────────────────────────────────────
  const MEMBERS = ['승협', '훈', '재현', '회승', '동성', '단체'];
  const VERSIONS = ['Ever ver.', 'Lasting ver.'];
  const SOURCES = ['FNC STORE', '애플뮤직', '기타'];
  const IMG = {
    '승협': 'assets/poca-seunghyub.jpeg',
    '훈':   'assets/poca-hoon.jpeg',
    '재현': 'assets/poca-jaehyun.jpeg',
    '회승': 'assets/poca-hweseung.jpeg',
    '동성': 'assets/poca-dongsung.jpeg',
  };
  const LOGO = 'assets/nflying-logo.png';

  const ALBUMS = [
    { id: 'everlasting', name: 'Everlasting', sub: '정규 2집', year: '2025',
      versions: VERSIONS, sources: ['FNC STORE', '애플뮤직'], count: 12 },
    { id: 'woosahap', name: '우사합', sub: '스페셜', year: '2026',
      versions: ['통합 ver.'], sources: ['FNC STORE'], count: 6 },
    { id: 'motm', name: 'Man on the Moon', sub: '미니 3집', year: '2021',
      versions: ['A ver.', 'B ver.'], sources: ['FNC STORE', '기타'], count: 9 },
  ];

  // Build Everlasting cards (멤버 × 버전), assign sample statuses
  const sampleStatus = {
    'ev-0-0': '소장', 'ev-0-1': '소장', 'ev-0-2': '구해요',
    'ev-0-3': '교환 가능', 'ev-0-5': '소장',
    'ev-1-0': '소장', 'ev-1-2': '소장', 'ev-1-4': '구해요',
  };
  const CARDS = [];
  VERSIONS.forEach((ver, vi) => {
    MEMBERS.forEach((m, mi) => {
      const id = `ev-${vi}-${mi}`;
      CARDS.push({
        id, album: 'everlasting', version: ver, name: `${m} 포토카드`,
        member: m, source: SOURCES[(mi + vi) % 2],
        img: IMG[m] || null, status: sampleStatus[id] || null,
      });
    });
  });

  // ── Icons ────────────────────────────────────────────────────────────
  const sw = (p) => React.createElement('svg', { width: p.w || 18, height: p.h || p.w || 18, viewBox: p.vb || '0 0 18 18', fill: 'none' }, p.children);
  const Icon = {
    search: ({ c = T.tm }) => (<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5.2" stroke={c} strokeWidth="1.6"/><path d="M12 12L15.5 15.5" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>),
    book: ({ c = T.tm, sz = 18 }) => (<svg width={sz} height={sz} viewBox="0 0 18 18" fill="none"><path d="M4 2h7l4 4v11H4V2z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M11 2v4h4" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M7 9h5M7 12h3.5" stroke={c} strokeWidth="1.3" strokeLinecap="round"/></svg>),
    plus: ({ c = T.tm, sz = 13 }) => (<svg width={sz} height={sz} viewBox="0 0 13 13" fill="none"><path d="M6.5 2v9M2 6.5h9" stroke={c} strokeWidth="1.7" strokeLinecap="round"/></svg>),
    close: ({ c = T.tm, sz = 9 }) => (<svg width={sz} height={sz} viewBox="0 0 9 9" fill="none"><path d="M1 1l7 7M8 1L1 8" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>),
    back: ({ c = 'rgb(23,23,25)' }) => (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M14 4.5L8 11L14 17.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>),
    chev: ({ c = T.tm, d = 'down' }) => (<svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ transform: d === 'right' ? 'rotate(-90deg)' : 'none' }}><path d="M1 1l4 4 4-4" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>),
    list: ({ c = T.tm }) => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5.5 4h8M5.5 8h8M5.5 12h8" stroke={c} strokeWidth="1.5" strokeLinecap="round"/><circle cx="2.5" cy="4" r="1.2" fill={c}/><circle cx="2.5" cy="8" r="1.2" fill={c}/><circle cx="2.5" cy="12" r="1.2" fill={c}/></svg>),
    grid: ({ c = T.tm }) => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.2" stroke={c} strokeWidth="1.4"/><rect x="9" y="1.5" width="5.5" height="5.5" rx="1.2" stroke={c} strokeWidth="1.4"/><rect x="1.5" y="9" width="5.5" height="5.5" rx="1.2" stroke={c} strokeWidth="1.4"/><rect x="9" y="9" width="5.5" height="5.5" rx="1.2" stroke={c} strokeWidth="1.4"/></svg>),
    share: ({ c = 'rgb(23,23,25)' }) => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2.5v8" stroke={c} strokeWidth="1.5" strokeLinecap="round"/><path d="M5.5 5L8 2.5 10.5 5" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 8.5v5h8v-5" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>),
    drag: () => (<svg width="12" height="18" viewBox="0 0 12 18" fill="none">{[3,9,15].map(y => [3,9].map(x => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" fill={T.b}/>))}</svg>),
    chart: ({ c = T.tm }) => (<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 15V8M9 15V3M15 15v-5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>),
    home: ({ c = T.tm }) => (<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 8l6-5 6 5v7H3V8z" stroke={c} strokeWidth="1.6" strokeLinejoin="round"/></svg>),
    check: ({ c = '#fff', sz = 12 }) => (<svg width={sz} height={sz} viewBox="0 0 12 12" fill="none"><path d="M2 6.5L4.8 9.2L10 3.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>),
    edit: ({ c = T.tm, sz = 16 }) => (<svg width={sz} height={sz} viewBox="0 0 16 16" fill="none"><path d="M11.5 2.5l2 2L6 12l-2.5.5L4 10l7.5-7.5z" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/></svg>),
    trash: ({ c = T.tm, sz = 16 }) => (<svg width={sz} height={sz} viewBox="0 0 16 16" fill="none"><path d="M3 4.5h10M6 4.5V3h4v1.5M4.5 4.5l.5 8.5h6l.5-8.5" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>),
    upload: ({ c = T.tm, sz = 18 }) => (<svg width={sz} height={sz} viewBox="0 0 18 18" fill="none"><path d="M9 12V3M6 6l3-3 3 3" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.5 12v2.5h11V12" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>),
    lock: ({ c = T.tm, sz = 18 }) => (<svg width={sz} height={sz} viewBox="0 0 18 18" fill="none"><rect x="3.5" y="8" width="11" height="7.5" rx="2" stroke={c} strokeWidth="1.5"/><path d="M6 8V5.5a3 3 0 0 1 6 0V8" stroke={c} strokeWidth="1.5"/></svg>),
  };

  // ── Shared atoms ─────────────────────────────────────────────────────
  const SBar = () => (
    <div style={{ height: 44, padding: '0 22px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: 9, background: T.s, flexShrink: 0 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: T.t, fontFamily: T.f }}>11:35</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none"><rect x="0" y="4" width="3" height="7" rx="0.8" fill={T.t}/><rect x="4.5" y="2.5" width="3" height="8.5" rx="0.8" fill={T.t}/><rect x="9" y="0.5" width="3" height="10.5" rx="0.8" fill={T.t}/><rect x="13.5" y="0" width="2.5" height="11" rx="0.8" fill={T.t} opacity="0.35"/></svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill={T.t}/><path d="M3.5 6.5C5 4.8 6.4 4 8 4s3 .8 4.5 2.5" stroke={T.t} strokeWidth="1.4" strokeLinecap="round" opacity="0.85"/><path d="M1 3.5C3.2 1.3 5.4 0 8 0s4.8 1.3 7 3.5" stroke={T.t} strokeWidth="1.4" strokeLinecap="round" opacity="0.4"/></svg>
        <div style={{ width: 22, height: 11, borderRadius: 3, border: `1.2px solid ${T.t}`, padding: '1.5px 2px', display: 'flex', alignItems: 'center', position: 'relative' }}>
          <div style={{ height: '100%', width: '78%', borderRadius: 1.5, background: T.t }}/>
          <div style={{ position: 'absolute', right: -4, top: '50%', transform: 'translateY(-50%)', width: 2.5, height: 6, background: T.t, borderRadius: '0 1px 1px 0', opacity: 0.5 }}/>
        </div>
      </div>
    </div>
  );

  const Pill = ({ label, tone = 'gray' }) => {
    const map = { gray: [T.bl, T.tm], blue: [T.pb, T.p] };
    const [bg, c] = map[tone] || map.gray;
    return <span style={{ display: 'inline-flex', alignItems: 'center', height: 22, padding: '0 8px', borderRadius: 5, background: bg, color: c, fontSize: 11, fontWeight: 600, fontFamily: T.f, whiteSpace: 'nowrap' }}>{label}</span>;
  };

  const MemberDot = ({ member, size = 8 }) => (
    <span style={{ width: size, height: size, borderRadius: '50%', background: MC[member] || T.tm, display: 'inline-block', flexShrink: 0 }}/>
  );

  const MemberBadge = ({ member }) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 22, padding: '0 8px 0 7px', borderRadius: 100, background: (MC[member] || T.tm) + '1c', fontFamily: T.f }}>
      <MemberDot member={member} size={7}/>
      <span style={{ fontSize: 11, fontWeight: 600, color: MC[member] || T.tm }}>{member}</span>
    </span>
  );

  // POCA card with status border
  const PocaCard = ({ member = '승협', img, status, width = '100%', radius = 8, nameLabel }) => {
    const sc = status ? STATUS[status].c : null;
    const border = sc ? `2.5px solid ${sc}` : `1px solid ${T.b}`;
    const inner = img ? (
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <img src={img} alt={member} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}/>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '18px 6px 6px', background: 'linear-gradient(transparent, rgba(0,0,0,0.46))' }}>
          <p style={{ textAlign: 'center', fontSize: 8, fontWeight: 700, color: '#fff', fontFamily: T.f, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{nameLabel || member}</p>
        </div>
      </div>
    ) : (
      <div style={{ width: '100%', height: '100%', background: '#dbeafe', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '8px' }}>
        <img src={LOGO} alt="" style={{ width: '64%', filter: 'invert(38%) sepia(93%) saturate(1900%) hue-rotate(205deg) brightness(95%)' }}/>
        <p style={{ fontSize: 7.5, color: '#3b82f6', textAlign: 'center', fontWeight: 500, fontFamily: T.f, lineHeight: 1.45 }}>이미지<br/>준비중입니다.</p>
      </div>
    );
    return (
      <div style={{ width, aspectRatio: '2/3', borderRadius: radius, overflow: 'hidden', position: 'relative', flexShrink: 0, border, boxShadow: sc ? `0 0 0 3px ${sc}1f, 0 2px 10px rgba(0,0,0,0.10)` : '0 1px 6px rgba(0,0,0,0.08)' }}>
        {inner}
        {status && (
          <div style={{ position: 'absolute', top: 5, left: 5, height: 17, padding: '0 6px', borderRadius: 100, background: sc, display: 'flex', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
            <span style={{ fontSize: 8.5, fontWeight: 700, color: '#fff', fontFamily: T.f }}>{status}</span>
          </div>
        )}
      </div>
    );
  };

  // Bottom tab bar — 목록 / 대시보드 / 포토북
  const BottomTab = ({ active = 'list', bookCount = 0 }) => {
    const tabs = [
      { id: 'list', label: '목록', Ico: Icon.home },
      { id: 'dash', label: '대시보드', Ico: Icon.chart },
      { id: 'book', label: '포토북', Ico: Icon.book },
    ];
    return (
      <div style={{ height: 64, background: T.s, borderTop: `1px solid ${T.b}`, display: 'flex', alignItems: 'stretch', flexShrink: 0, paddingBottom: 6 }}>
        {tabs.map(({ id, label, Ico }) => {
          const on = id === active;
          return (
            <div key={id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, position: 'relative' }}>
              <div style={{ position: 'relative' }}>
                <Ico c={on ? T.p : T.tl}/>
                {id === 'book' && bookCount > 0 && (
                  <div style={{ position: 'absolute', top: -5, right: -8, minWidth: 15, height: 15, borderRadius: 8, background: T.p, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>
                    <span style={{ color: '#fff', fontSize: 8.5, fontWeight: 700, fontFamily: T.f }}>{bookCount}</span>
                  </div>
                )}
              </div>
              <span style={{ fontSize: 10.5, fontWeight: on ? 700 : 500, color: on ? T.p : T.tl, fontFamily: T.f }}>{label}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const FilterBtn = ({ label, active }) => (
    <div style={{ flex: 1, height: 38, borderRadius: 9, border: `${active ? 1.5 : 1}px solid ${active ? T.p : T.b}`, background: active ? T.pb : T.s, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 11px', gap: 4 }}>
      <span style={{ fontSize: 13, fontWeight: active ? 600 : 500, color: active ? T.p : T.t, fontFamily: T.f, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{label}</span>
      <Icon.chev c={active ? T.p : T.tm}/>
    </div>
  );

  Object.assign(window, {
    NF_T: T, NF_STATUS: STATUS, NF_STATUS_ORDER: STATUS_ORDER, NF_MC: MC,
    NF_MEMBERS: MEMBERS, NF_VERSIONS: VERSIONS, NF_SOURCES: SOURCES,
    NF_ALBUMS: ALBUMS, NF_CARDS: CARDS, NF_LOGO: LOGO, NF_IMG: IMG,
    NFIcon: Icon, NFSBar: SBar, NFPill: Pill, NFMemberDot: MemberDot,
    NFMemberBadge: MemberBadge, NFPocaCard: PocaCard, NFBottomTab: BottomTab,
    NFFilterBtn: FilterBtn,
  });
})();
