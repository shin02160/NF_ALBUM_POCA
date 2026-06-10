// ── NF ALBUM POCA · 포토북 + 대시보드 ──────────────────────────────────
(function () {
  const T = window.NF_T, STATUS = window.NF_STATUS, STATUS_ORDER = window.NF_STATUS_ORDER;
  const MEMBERS = window.NF_MEMBERS, ALBUMS = window.NF_ALBUMS, CARDS = window.NF_CARDS;
  const LOGO = window.NF_LOGO, MC = window.NF_MC;
  const Icon = window.NFIcon, SBar = window.NFSBar, Pill = window.NFPill;
  const MemberBadge = window.NFMemberBadge, PocaCard = window.NFPocaCard;
  const BottomTab = window.NFBottomTab, Phone = window.NFPhone, Header = window.NFHeader;

  const BOOK = [CARDS[0], CARDS[2], CARDS[4], CARDS[6], CARDS[1], CARDS[7]]; // mix of statuses

  // ── Screen: 포토북 편집 ────────────────────────────────────────────────
  function PhotobookEdit() {
    return (
      <Phone>
        <SBar/>
        <Header title="포토북" back
          right={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ height: 22, padding: '0 9px', borderRadius: 100, background: T.pb, display: 'flex', alignItems: 'center' }}><span style={{ fontSize: 11, color: T.p, fontWeight: 700 }}>{BOOK.length}장</span></div>
          </div>}/>
        <div style={{ background: T.pb, padding: '9px 16px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: T.p }}>드래그해서 순서를 바꿀 수 있어요</span>
          <span style={{ fontSize: 11, color: T.p, fontWeight: 600, opacity: 0.7 }}>상태 테두리 유지</span>
        </div>
        <div style={{ flex: 1, background: T.s, overflow: 'hidden' }}>
          {BOOK.map((card) => (
            <div key={card.id} style={{ display: 'flex', gap: 11, padding: '10px 16px', borderBottom: `1px solid ${T.b}`, alignItems: 'center' }}>
              <div style={{ flexShrink: 0 }}><Icon.drag/></div>
              <div style={{ width: 42, flexShrink: 0 }}><PocaCard member={card.member} img={card.img} status={card.status} width={42}/></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: T.t, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{card.name}</p>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                  <MemberBadge member={card.member}/>
                  {card.status && <span style={{ fontSize: 11, fontWeight: 700, color: STATUS[card.status].c }}>{card.status}</span>}
                </div>
              </div>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: T.bl, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon.close c={T.tm} sz={9}/></div>
            </div>
          ))}
        </div>
        <div style={{ padding: '12px 16px', background: T.s, borderTop: `1px solid ${T.b}`, flexShrink: 0 }}>
          <div style={{ height: 52, borderRadius: 14, background: T.p, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 20px rgba(51,102,255,0.26)' }}>
            <span style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>포토북 내보내기</span>
            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>→</span>
          </div>
        </div>
        <BottomTab active="book" bookCount={BOOK.length}/>
      </Phone>
    );
  }

  // ── Screen: 포토북 내보내기 (4열 고정) ─────────────────────────────────
  function PhotobookExport() {
    return (
      <Phone>
        <SBar/>
        <Header title="포토북 내보내기" back/>
        <div style={{ flex: 1, padding: '20px 20px 14px', display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden' }}>
          <div style={{ background: T.s, borderRadius: 16, border: `1px solid ${T.b}`, overflow: 'hidden', boxShadow: '0 6px 28px rgba(0,0,0,0.06)' }}>
            <div style={{ padding: '12px 18px', borderBottom: `1px solid ${T.b}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src={LOGO} alt="" style={{ height: 20 }}/>
                <span style={{ fontSize: 12, fontWeight: 600, color: T.tm, letterSpacing: '0.04em' }}>Everlasting</span>
              </div>
              <p style={{ fontSize: 11, color: T.tl }}>2026.06.10</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, padding: 14 }}>
              {BOOK.map((card) => (
                <div key={card.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <PocaCard member={card.member} img={card.img} status={card.status} radius={6}/>
                  <p style={{ fontSize: 8, color: T.tl, textAlign: 'center', fontWeight: 500 }}>{card.member}</p>
                </div>
              ))}
            </div>
          </div>
          <p style={{ fontSize: 11, color: T.tl, textAlign: 'center' }}>nf_poca_20260610_113500.png</p>
          <div style={{ display: 'flex', gap: 10 }}>
            {[['↗', '공유하기'], ['↓', 'PNG 저장']].map(([ico, label]) => (
              <div key={label} style={{ flex: 1, height: 52, borderRadius: 12, border: `1.5px solid ${T.b}`, background: T.s, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                <span style={{ fontSize: 15, color: T.t }}>{ico}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: T.t }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <BottomTab active="book" bookCount={BOOK.length}/>
      </Phone>
    );
  }

  // ── Dashboard helpers ──────────────────────────────────────────────────
  // [일반] 전체 발매된 포카 기준
  const totalPoca = 91;
  const versionsAll = [
    { name: 'Ever ver.', n: 48 }, { name: 'Lasting ver.', n: 43 },
  ];
  const maxVersionAll = Math.max(...versionsAll.map(x => x.n));
  const sellersAll = [
    { name: 'FNC STORE', n: 38 }, { name: '애플뮤직', n: 21 },
    { name: 'YES24', n: 16 }, { name: '교보문고', n: 9 }, { name: '기타', n: 7 },
  ];
  const maxSellerAll = Math.max(...sellersAll.map(s => s.n));

  // [사용자 현황] 소장 기준
  const ownedTotal = 54;
  const versionsOwned = [
    { name: 'Ever ver.', n: 31 }, { name: 'Lasting ver.', n: 23 },
  ];
  const maxVersionOwned = Math.max(...versionsOwned.map(x => x.n));
  const sellersOwned = [
    { name: 'FNC STORE', n: 24 }, { name: '애플뮤직', n: 13 },
    { name: 'YES24', n: 9 }, { name: '교보문고', n: 5 }, { name: '기타', n: 3 },
  ];
  const maxSellerOwned = Math.max(...sellersOwned.map(s => s.n));
  const membersOwned = MEMBERS.map((m, i) => ({ m, n: [12, 9, 11, 8, 10, 4][i], total: [15, 15, 15, 15, 15, 16][i] }));
  const maxMemberOwned = Math.max(...membersOwned.map(x => x.total));

  const StatCard = ({ label, value, unit, accent }) => (
    <div style={{ flex: 1, background: T.s, borderRadius: 14, border: `1px solid ${T.b}`, padding: '12px 12px 13px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
      <p style={{ fontSize: 11, color: T.tm, fontWeight: 500, marginBottom: 5 }}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
        <span style={{ fontSize: 26, fontWeight: 700, color: accent || T.t, letterSpacing: '-0.04em' }}>{value}</span>
        {unit && <span style={{ fontSize: 12, color: T.tm, fontWeight: 600 }}>{unit}</span>}
      </div>
    </div>
  );

  const Section = ({ title, right, children }) => (
    <div style={{ background: T.s, borderRadius: 16, border: `1px solid ${T.b}`, padding: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: T.t, letterSpacing: '-0.02em' }}>{title}</span>
        {right}
      </div>
      {children}
    </div>
  );

  // 그룹 헤더 ([일반] / [사용자 현황])
  const GroupHeader = ({ label, sub, accent }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 4, marginBottom: -2 }}>
      <span style={{ width: 4, height: 16, borderRadius: 100, background: accent }}/>
      <span style={{ fontSize: 16, fontWeight: 700, color: T.t, letterSpacing: '-0.02em' }}>{label}</span>
      {sub && <span style={{ fontSize: 11, color: T.tm, fontWeight: 500 }}>{sub}</span>}
    </div>
  );

  // 가로 막대 행 (label · bar · count)
  const BarRow = ({ label, n, max, color, secondary, secondaryMax, suffix }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 78, display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
        {color && <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }}/>}
        <span style={{ fontSize: 12, fontWeight: 600, color: T.t, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      </div>
      <div style={{ flex: 1, height: 10, borderRadius: 100, background: T.bl, overflow: 'hidden', position: 'relative' }}>
        {secondary != null && <div style={{ position: 'absolute', inset: 0, width: `${secondary / secondaryMax * 100}%`, borderRadius: 100, background: (color || T.p) + '26' }}/>}
        <div style={{ width: `${n / max * 100}%`, height: '100%', borderRadius: 100, background: color || T.p, position: 'relative' }}/>
      </div>
      <span style={{ width: suffix ? 46 : 24, textAlign: 'right', fontSize: 12, fontWeight: 700, color: T.t, flexShrink: 0 }}>{n}{suffix}</span>
    </div>
  );

  // ── Screen: 대시보드 ───────────────────────────────────────────────────
  function Dashboard() {
    const ownRate = Math.round(ownedTotal / totalPoca * 100);
    // 소장 도넛
    const ownAngle = ownedTotal / totalPoca * 360;
    const ownDonut = `conic-gradient(${T.p} 0deg ${ownAngle}deg, ${T.bl} ${ownAngle}deg 360deg)`;
    return (
      <Phone>
        <SBar/>
        <Header title={<img src={LOGO} alt="NFlying" style={{ height: 50, width: 'auto' }}/>}
          right={<div style={{ height: 30, padding: '0 12px', borderRadius: 100, background: T.bl, display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ fontSize: 12, color: T.tm, fontWeight: 600 }}>Everlasting ▾</span></div>}/>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 20px', display: 'flex', flexDirection: 'column', gap: 13 }}>
          <div>
            <p style={{ fontSize: 22, fontWeight: 700, color: T.t, letterSpacing: '-0.03em', marginBottom: 2 }}>컬렉션 대시보드</p>
            <p style={{ fontSize: 13, color: T.tm }}>Everlasting · 발매 포카와 내 소장 현황</p>
          </div>

          {/* ════ [일반] ════ */}
          <GroupHeader label="일반" sub="발매된 전체 포카 기준" accent={T.p}/>
          {/* 전체 포카 현황 */}
          <Section title="전체 포카 현황">
            <div style={{ display: 'flex', gap: 8 }}>
              <StatCard label="총 포카" value={totalPoca} unit="종" accent={T.p}/>
              <StatCard label="버전" value="2"/>
              <StatCard label="판매처" value={sellersAll.length}/>
              <StatCard label="멤버" value="6"/>
            </div>
          </Section>
          {/* 버전별 포카 현황 */}
          <Section title="버전별 포카 현황">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {versionsAll.map((v, i) => (
                <BarRow key={v.name} label={v.name} n={v.n} max={maxVersionAll} color={i === 0 ? T.p : '#8050DF'}/>
              ))}
            </div>
          </Section>
          {/* 판매처별 포카 현황 */}
          <Section title="판매처별 포카 현황">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {sellersAll.map((s) => (
                <BarRow key={s.name} label={s.name} n={s.n} max={maxSellerAll} color={T.p}/>
              ))}
            </div>
          </Section>

          {/* ════ [사용자 현황] ════ */}
          <GroupHeader label="사용자 현황" sub="내 소장 기준" accent="#00BF40"/>
          {/* 소장 현황 — 전체 */}
          <Section title="소장 현황 · 전체">
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{ width: 100, height: 100, borderRadius: '50%', background: ownDonut, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: T.s, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: T.p, letterSpacing: '-0.04em' }}>{ownRate}%</span>
                  <span style={{ fontSize: 9, color: T.tm }}>소장률</span>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: 30, fontWeight: 700, color: T.t, letterSpacing: '-0.04em' }}>{ownedTotal}</span>
                  <span style={{ fontSize: 14, color: T.tm, fontWeight: 600 }}>/ {totalPoca}종 소장</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 11, color: T.tm }}>미보유</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: T.t }}>{totalPoca - ownedTotal}<span style={{ fontSize: 11, color: T.tm, fontWeight: 600 }}>종</span></span>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 11, color: '#FF4242' }}>구해요</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#FF4242' }}>9<span style={{ fontSize: 11, fontWeight: 600 }}>종</span></span>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 11, color: '#F5A800' }}>교환가능</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#F5A800' }}>6<span style={{ fontSize: 11, fontWeight: 600 }}>종</span></span>
                  </div>
                </div>
              </div>
            </div>
          </Section>
          {/* 소장 현황 — 버전별 */}
          <Section title="소장 현황 · 버전별">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {versionsOwned.map((v, i) => {
                const all = versionsAll[i].n;
                return (
                  <div key={v.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: T.t }}>{v.name}</span>
                      <span style={{ fontSize: 11, color: T.tm }}><strong style={{ color: T.t, fontWeight: 700 }}>{v.n}</strong> / {all}종 · {Math.round(v.n / all * 100)}%</span>
                    </div>
                    <div style={{ height: 10, borderRadius: 100, background: T.bl, overflow: 'hidden' }}>
                      <div style={{ width: `${v.n / all * 100}%`, height: '100%', borderRadius: 100, background: i === 0 ? T.p : '#8050DF' }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
          {/* 소장 현황 — 판매처별 */}
          <Section title="소장 현황 · 판매처별">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sellersOwned.map((s, i) => {
                const all = sellersAll[i].n;
                return (
                  <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 78, fontSize: 12, fontWeight: 600, color: T.t, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}>{s.name}</span>
                    <div style={{ flex: 1, height: 10, borderRadius: 100, background: T.bl, overflow: 'hidden', position: 'relative' }}>
                      <div style={{ position: 'absolute', inset: 0, width: `${all / maxSellerAll * 100}%`, borderRadius: 100, background: T.p + '22' }}/>
                      <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${s.n / maxSellerAll * 100}%`, borderRadius: 100, background: T.p }}/>
                    </div>
                    <span style={{ width: 50, textAlign: 'right', fontSize: 11, color: T.tm, flexShrink: 0 }}><strong style={{ color: T.t, fontWeight: 700, fontSize: 12 }}>{s.n}</strong>/{all}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 14, marginTop: 12, paddingTop: 11, borderTop: `1px solid ${T.b}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: T.p }}/><span style={{ fontSize: 11, color: T.tm }}>소장</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: T.p + '22' }}/><span style={{ fontSize: 11, color: T.tm }}>전체 발매</span></div>
            </div>
          </Section>
          {/* 소장 현황 — 멤버별 */}
          <Section title="소장 현황 · 멤버별">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {membersOwned.map(({ m, n, total }) => (
                <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 44, display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: MC[m] }}/>
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.t }}>{m}</span>
                  </div>
                  <div style={{ flex: 1, height: 10, borderRadius: 100, background: T.bl, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, width: `${total / maxMemberOwned * 100}%`, borderRadius: 100, background: MC[m] + '22' }}/>
                    <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${n / maxMemberOwned * 100}%`, borderRadius: 100, background: MC[m] }}/>
                  </div>
                  <span style={{ width: 48, textAlign: 'right', fontSize: 11, color: T.tm, flexShrink: 0 }}><strong style={{ color: T.t, fontWeight: 700, fontSize: 12 }}>{n}</strong>/{total}종</span>
                </div>
              ))}
            </div>
          </Section>
        </div>
        <BottomTab active="dash" bookCount={6}/>
      </Phone>
    );
  }

  Object.assign(window, { NFPhotobookEdit: PhotobookEdit, NFPhotobookExport: PhotobookExport, NFDashboard: Dashboard });
})();
