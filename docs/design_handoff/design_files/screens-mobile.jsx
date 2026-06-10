// ── NF ALBUM POCA · mobile screens ──────────────────────────────────────
(function () {
  const T = window.NF_T, STATUS = window.NF_STATUS, STATUS_ORDER = window.NF_STATUS_ORDER;
  const MEMBERS = window.NF_MEMBERS, VERSIONS = window.NF_VERSIONS, SOURCES = window.NF_SOURCES;
  const ALBUMS = window.NF_ALBUMS, CARDS = window.NF_CARDS, LOGO = window.NF_LOGO, MC = window.NF_MC;
  const Icon = window.NFIcon, SBar = window.NFSBar, Pill = window.NFPill;
  const MemberBadge = window.NFMemberBadge, PocaCard = window.NFPocaCard;
  const BottomTab = window.NFBottomTab, FilterBtn = window.NFFilterBtn;

  const Phone = ({ children, bg }) => (
    <div style={{ width: 375, height: 812, fontFamily: T.f, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: bg || T.bg }}>{children}</div>
  );

  const Header = ({ title, back, right }) => (
    <div style={{ height: 54, background: T.s, borderBottom: `1px solid ${T.b}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: back ? '0 12px 0 4px' : '0 16px', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: back ? 0 : 0 }}>
        {back && <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.back/></div>}
        {typeof title === 'string'
          ? <span style={{ fontSize: back ? 17 : 20, fontWeight: back ? 600 : 700, letterSpacing: '-0.03em', color: T.t }}>{title}</span>
          : title}
      </div>
      {right}
    </div>
  );

  // ── Screen: 앨범 선택 ──────────────────────────────────────────────────
  function AlbumSelect() {
    return (
      <Phone>
        <SBar/>
        <Header
          title={<img src={LOGO} alt="NFlying" style={{ height: 50, width: 'auto' }}/>}
          right={<div style={{ height: 32, padding: '0 12px', borderRadius: 100, background: T.bl, display: 'flex', alignItems: 'center', gap: 5 }}><Icon.lock c={T.tm} sz={13}/><span style={{ fontSize: 12, color: T.tm, fontWeight: 500 }}>관리자</span></div>}
        />
        <div style={{ padding: '20px 16px 8px', flexShrink: 0 }}>
          <p style={{ fontSize: 22, fontWeight: 700, color: T.t, letterSpacing: '-0.03em', marginBottom: 3 }}>앨범 선택</p>
          <p style={{ fontSize: 13, color: T.tm }}>소장 중인 포카를 앨범별로 기록해보세요</p>
        </div>
        <div style={{ flex: 1, padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
          {ALBUMS.map((al, i) => (
            <div key={al.id} style={{ background: T.s, borderRadius: 16, border: `1px solid ${T.b}`, padding: 14, display: 'flex', gap: 14, alignItems: 'center', boxShadow: i === 0 ? '0 4px 20px rgba(51,102,255,0.10)' : '0 2px 10px rgba(0,0,0,0.04)', borderColor: i === 0 ? 'rgba(51,102,255,0.35)' : T.b }}>
              <div style={{ width: 64, height: 64, borderRadius: 12, background: `linear-gradient(135deg, ${MC[MEMBERS[i]] }22, ${MC[MEMBERS[i+1]]||T.p}28)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${T.b}` }}>
                <img src={LOGO} alt="" style={{ width: '62%', opacity: 0.55 }}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: T.t }}>{al.name}</span>
                  <Pill label={al.sub}/>
                </div>
                <p style={{ fontSize: 12, color: T.tm, marginBottom: 7 }}>{al.year} · 포카 {al.count}종 · {al.versions.length}버전</p>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {al.versions.map(v => <Pill key={v} label={v} tone={i === 0 ? 'blue' : 'gray'}/>)}
                </div>
              </div>
              <Icon.chev c={T.tl} d="right"/>
            </div>
          ))}
        </div>
      </Phone>
    );
  }

  // ── AlbumBanner (포카 목록 헤더/배경) ──────────────────────────────────
  const AlbumBanner = () => (
    <div style={{ height: 96, position: 'relative', flexShrink: 0, overflow: 'hidden', background: 'linear-gradient(120deg, #1a1a2e 0%, #2d2d52 50%, #3366FF 140%)' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.15, background: 'radial-gradient(circle at 80% 20%, #fff 0%, transparent 50%)' }}/>
      <div style={{ position: 'absolute', left: 16, bottom: 14, display: 'flex', alignItems: 'flex-end', gap: 10 }}>
        <img src={LOGO} alt="" style={{ height: 26, filter: 'brightness(0) invert(1)' }}/>
        <div>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1 }}>Everlasting</p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>정규 2집 · 2025</p>
        </div>
      </div>
    </div>
  );

  // Toolbar: 검색 | 뷰 토글
  const ListToolbar = ({ view }) => (
    <div style={{ height: 46, background: T.s, borderBottom: `1px solid ${T.b}`, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, flexShrink: 0 }}>
      <div style={{ flex: 1, height: 36, borderRadius: 9, background: T.bl, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px' }}>
        <Icon.search c={T.tl}/>
        <span style={{ fontSize: 13, color: T.tl, fontFamily: T.f }}>포카 검색</span>
      </div>
      <div style={{ display: 'flex', background: T.bl, borderRadius: 9, padding: 3, gap: 2 }}>
        {[{ id: 'list', Ico: Icon.list }, { id: 'grid', Ico: Icon.grid }].map(({ id, Ico }) => (
          <div key={id} style={{ width: 32, height: 30, borderRadius: 6, background: view === id ? T.s : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: view === id ? '0 1px 4px rgba(0,0,0,0.10)' : 'none' }}>
            <Ico c={view === id ? T.t : T.tl}/>
          </div>
        ))}
      </div>
    </div>
  );

  const FilterRow = () => (
    <div style={{ background: T.s, borderBottom: `1px solid ${T.b}`, padding: '10px 16px', display: 'flex', gap: 8, flexShrink: 0 }}>
      <FilterBtn label="버전: 전체"/>
      <FilterBtn label="멤버: 전체"/>
      <FilterBtn label="구매처: 전체"/>
    </div>
  );

  const StatusLegend = () => (
    <div style={{ height: 34, background: T.bg, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', flexShrink: 0 }}>
      {STATUS_ORDER.map(s => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 9, height: 9, borderRadius: 3, border: `2px solid ${STATUS[s].c}` }}/>
          <span style={{ fontSize: 11, color: T.tm, fontFamily: T.f }}>{s}</span>
        </div>
      ))}
    </div>
  );

  // ── Screen: 포카 목록 — 리스트 ─────────────────────────────────────────
  function PocaList() {
    return (
      <Phone>
        <SBar/>
        <AlbumBanner/>
        <ListToolbar view="list"/>
        <FilterRow/>
        <StatusLegend/>
        <div style={{ flex: 1, background: T.s, overflow: 'hidden' }}>
          {CARDS.slice(0, 6).map((card) => (
            <div key={card.id} style={{ display: 'flex', gap: 12, padding: '11px 16px', borderBottom: `1px solid ${T.b}`, alignItems: 'center' }}>
              <div style={{ width: 46, flexShrink: 0 }}><PocaCard member={card.member} img={card.img} status={card.status} width={46}/></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: T.t, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{card.name}</p>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                  <MemberBadge member={card.member}/>
                  <Pill label={card.version} tone="blue"/>
                  <Pill label={card.source}/>
                </div>
              </div>
              {card.status
                ? <div style={{ height: 28, padding: '0 10px', borderRadius: 100, background: STATUS[card.status].bg, display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS[card.status].c }}/><span style={{ fontSize: 11, fontWeight: 700, color: STATUS[card.status].c }}>{card.status}</span></div>
                : <div style={{ height: 28, padding: '0 11px', borderRadius: 100, border: `1.5px solid ${T.b}`, display: 'flex', alignItems: 'center', flexShrink: 0 }}><span style={{ fontSize: 11, fontWeight: 600, color: T.tm }}>상태 기록</span></div>}
            </div>
          ))}
        </div>
        <BottomTab active="list" bookCount={3}/>
      </Phone>
    );
  }

  // ── Screen: 포카 목록 — 그리드 ─────────────────────────────────────────
  function PocaGrid() {
    return (
      <Phone>
        <SBar/>
        <AlbumBanner/>
        <ListToolbar view="grid"/>
        <FilterRow/>
        <StatusLegend/>
        <div style={{ flex: 1, padding: '12px 14px 0', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px 10px' }}>
            {CARDS.slice(0, 9).map((card) => (
              <div key={card.id} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <PocaCard member={card.member} img={card.img} status={card.status}/>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: MC[card.member] }}/>
                  <span style={{ fontSize: 10, color: T.tm, fontWeight: 500 }}>{card.member}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <BottomTab active="list" bookCount={3}/>
      </Phone>
    );
  }

  // ── Screen: 필터 모달 ──────────────────────────────────────────────────
  function FilterModal({ tab = 0 }) {
    const TABS = ['버전', '멤버', '구매처'];
    const data = [VERSIONS, MEMBERS, SOURCES][tab];
    const sel = [['Ever ver.'], ['승협', '훈'], []][tab];
    const isMember = tab === 1;
    return (
      <Phone>
        <SBar/>
        <div style={{ height: 96, opacity: 0.3, background: 'linear-gradient(120deg, #1a1a2e, #3366FF)', flexShrink: 0 }}/>
        <div style={{ flex: 1, opacity: 0.16, padding: '12px 14px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, alignContent: 'start' }}>
          {CARDS.slice(0, 6).map(c => <PocaCard key={c.id} member={c.member} img={c.img}/>)}
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,18,0.48)' }}/>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: T.s, borderRadius: '22px 22px 0 0', overflow: 'hidden', boxShadow: '0 -12px 48px rgba(0,0,0,0.18)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 0' }}><div style={{ width: 40, height: 4, borderRadius: 100, background: T.bl }}/></div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 22px 4px' }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: T.t }}>필터</span>
            <span style={{ fontSize: 13, color: T.p, fontWeight: 600 }}>초기화</span>
          </div>
          <div style={{ display: 'flex', borderBottom: `1px solid ${T.b}`, marginTop: 4 }}>
            {TABS.map((name, i) => (
              <div key={i} style={{ flex: 1, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, borderBottom: i === tab ? `2.5px solid ${T.p}` : '2.5px solid transparent', marginBottom: -1 }}>
                <span style={{ fontSize: 13, fontWeight: i === tab ? 700 : 400, color: i === tab ? T.p : T.tm }}>{name}</span>
                {sel.length > 0 && i === tab && <span style={{ minWidth: 16, height: 16, padding: '0 4px', borderRadius: 8, background: T.p, color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{sel.length}</span>}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '16px 22px' }}>
            {data.map((item) => {
              const on = sel.includes(item);
              return (
                <div key={item} style={{ height: 38, padding: '0 14px', borderRadius: 100, background: on ? T.p : T.bl, border: `1.5px solid ${on ? T.p : T.b}`, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {isMember && <span style={{ width: 8, height: 8, borderRadius: '50%', background: on ? '#fff' : MC[item] }}/>}
                  <span style={{ fontSize: 13, fontWeight: on ? 700 : 500, color: on ? '#fff' : T.t }}>{item}</span>
                </div>
              );
            })}
          </div>
          <div style={{ padding: '8px 22px 28px' }}>
            <div style={{ height: 54, borderRadius: 14, background: T.p, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(51,102,255,0.28)' }}>
              <span style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>적용하기</span>
            </div>
          </div>
        </div>
      </Phone>
    );
  }

  // ── Screen: 상태 선택 바텀시트 ─────────────────────────────────────────
  function StatusSheet() {
    const card = CARDS[2]; // 재현 구해요
    const current = '구해요';
    return (
      <Phone>
        <SBar/>
        <div style={{ height: 96, opacity: 0.3, background: 'linear-gradient(120deg, #1a1a2e, #3366FF)', flexShrink: 0 }}/>
        <div style={{ flex: 1, opacity: 0.16, padding: '12px 14px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, alignContent: 'start' }}>
          {CARDS.slice(0, 6).map(c => <PocaCard key={c.id} member={c.member} img={c.img}/>)}
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,18,0.55)' }}/>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: T.s, borderRadius: '22px 22px 0 0', overflow: 'hidden', boxShadow: '0 -12px 48px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 0' }}><div style={{ width: 40, height: 4, borderRadius: 100, background: T.bl }}/></div>
          {/* Card preview */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0 8px', gap: 12 }}>
            <div style={{ width: 132, filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.18))' }}>
              <PocaCard member={card.member} img={card.img} status={current} radius={12}/>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: T.t, marginBottom: 4 }}>{card.member}</p>
              <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
                <Pill label={card.version} tone="blue"/>
                <Pill label={card.source}/>
              </div>
            </div>
          </div>
          {/* Status buttons */}
          <div style={{ padding: '8px 20px 4px', display: 'flex', flexDirection: 'column', gap: 9 }}>
            <p style={{ fontSize: 12, color: T.tm, fontWeight: 600, marginBottom: 2 }}>소장 상태 선택</p>
            {STATUS_ORDER.map(s => {
              const on = s === current;
              const sc = STATUS[s].c;
              return (
                <div key={s} style={{ height: 52, borderRadius: 13, border: `2px solid ${on ? sc : T.b}`, background: on ? STATUS[s].bg : T.s, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <span style={{ width: 16, height: 16, borderRadius: 5, background: sc, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{on && <Icon.check sz={11}/>}</span>
                    <span style={{ fontSize: 15, fontWeight: on ? 700 : 500, color: on ? sc : T.t }}>{s}</span>
                  </div>
                  <span style={{ fontSize: 11, color: T.tl }}>썸네일 테두리 {s === '소장' ? '파랑' : s === '구해요' ? '빨강' : '노랑'}</span>
                </div>
              );
            })}
          </div>
          {/* Photobook + clear */}
          <div style={{ padding: '12px 20px 28px', display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, height: 50, borderRadius: 13, border: `1.5px solid ${T.b}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <span style={{ fontSize: 13, color: T.tm, fontWeight: 600 }}>상태 해제</span>
            </div>
            <div style={{ flex: 1.6, height: 50, borderRadius: 13, background: T.p, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, boxShadow: '0 4px 16px rgba(51,102,255,0.26)' }}>
              <Icon.book c="#fff" sz={16}/>
              <span style={{ fontSize: 14, color: '#fff', fontWeight: 700 }}>포토북에 담기</span>
            </div>
          </div>
        </div>
      </Phone>
    );
  }

  Object.assign(window, { NFAlbumSelect: AlbumSelect, NFPocaList: PocaList, NFPocaGrid: PocaGrid, NFFilterModal: FilterModal, NFStatusSheet: StatusSheet, NFPhone: Phone, NFHeader: Header });
})();
