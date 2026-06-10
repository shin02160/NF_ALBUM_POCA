// ── NF ALBUM POCA · 관리자 (데스크탑) ──────────────────────────────────
(function () {
  const T = window.NF_T, MEMBERS = window.NF_MEMBERS, VERSIONS = window.NF_VERSIONS;
  const SOURCES = window.NF_SOURCES, ALBUMS = window.NF_ALBUMS, CARDS = window.NF_CARDS;
  const LOGO = window.NF_LOGO, MC = window.NF_MC;
  const Icon = window.NFIcon, Pill = window.NFPill, PocaCard = window.NFPocaCard, MemberBadge = window.NFMemberBadge;

  const W = 1280, H = 860;
  const Desk = ({ children }) => (
    <div style={{ width: W, height: H, fontFamily: T.f, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: T.bg }}>{children}</div>
  );

  // ── Admin top bar ──────────────────────────────────────────────────────
  const AdminBar = ({ tab }) => (
    <div style={{ height: 60, background: T.s, borderBottom: `1px solid ${T.b}`, display: 'flex', alignItems: 'center', padding: '0 28px', gap: 28, flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src={LOGO} alt="" style={{ height: 34 }}/>
        <span style={{ fontSize: 13, fontWeight: 700, color: T.t, padding: '3px 8px', borderRadius: 6, background: T.pb, color: T.p }}>ADMIN</span>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {['앨범 관리', '포카 관리'].map((n, i) => (
          <div key={n} style={{ height: 36, padding: '0 16px', borderRadius: 9, background: (tab === i) ? T.pb : 'transparent', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: (tab === i) ? 700 : 500, color: (tab === i) ? T.p : T.tm }}>{n}</span>
          </div>
        ))}
      </div>
      <div style={{ flex: 1 }}/>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 13, color: T.tm }}>Shin · 관리자</span>
        <div style={{ height: 34, padding: '0 14px', borderRadius: 100, border: `1px solid ${T.b}`, display: 'flex', alignItems: 'center' }}><span style={{ fontSize: 12, color: T.tm, fontWeight: 600 }}>로그아웃</span></div>
      </div>
    </div>
  );

  // ── Screen: 관리자 로그인 ──────────────────────────────────────────────
  function AdminLogin() {
    const pin = ['1', '2', '3', '4', '', ''];
    return (
      <div style={{ width: W, height: H, fontFamily: T.f, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f5f7 0%, #eaeefb 100%)', overflow: 'hidden' }}>
        <div style={{ width: 420, background: T.s, borderRadius: 24, border: `1px solid ${T.b}`, padding: '40px 40px 36px', boxShadow: '0 24px 64px rgba(0,0,0,0.10)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: T.pb, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Icon.lock c={T.p} sz={26}/>
          </div>
          <img src={LOGO} alt="" style={{ height: 30, marginBottom: 6 }}/>
          <p style={{ fontSize: 19, fontWeight: 700, color: T.t, letterSpacing: '-0.03em', marginBottom: 4 }}>관리자 인증</p>
          <p style={{ fontSize: 13, color: T.tm, marginBottom: 28, textAlign: 'center' }}>6자리 비밀번호를 입력해주세요</p>
          <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
            {pin.map((d, i) => (
              <div key={i} style={{ width: 48, height: 56, borderRadius: 12, border: `2px solid ${d ? T.p : (i === 4 ? T.p : T.b)}`, background: d ? T.pb : T.s, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: i === 4 ? '0 0 0 4px rgba(51,102,255,0.12)' : 'none' }}>
                {d
                  ? <span style={{ width: 12, height: 12, borderRadius: '50%', background: T.p }}/>
                  : (i === 4 ? <span style={{ width: 2, height: 24, background: T.p, animation: 'none' }}/> : null)}
              </div>
            ))}
          </div>
          <div style={{ width: '100%', height: 52, borderRadius: 14, background: T.p, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(51,102,255,0.28)' }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>인증하기</span>
          </div>
          <p style={{ fontSize: 11, color: T.tl, marginTop: 16 }}>세션 내 유지 · 새로고침 시 재입력</p>
        </div>
      </div>
    );
  }

  const fieldStyle = { height: 42, borderRadius: 10, border: `1px solid ${T.b}`, background: T.s, display: 'flex', alignItems: 'center', padding: '0 14px', fontSize: 14, color: T.t };
  const Label = ({ children }) => <p style={{ fontSize: 12, fontWeight: 600, color: T.tm, marginBottom: 7 }}>{children}</p>;

  // ── Screen: 앨범 관리 ──────────────────────────────────────────────────
  function AdminAlbums() {
    return (
      <Desk>
        <AdminBar tab={0}/>
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left: album list */}
          <div style={{ width: 340, borderRight: `1px solid ${T.b}`, background: T.s, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <div style={{ padding: '20px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: T.t }}>앨범 목록</span>
              <div style={{ height: 32, padding: '0 12px', borderRadius: 100, background: T.p, display: 'flex', alignItems: 'center', gap: 5 }}><Icon.plus c="#fff" sz={12}/><span style={{ fontSize: 12, color: '#fff', fontWeight: 700 }}>추가</span></div>
            </div>
            <div style={{ flex: 1, overflow: 'hidden', padding: '0 12px' }}>
              {ALBUMS.map((al, i) => (
                <div key={al.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 12px', borderRadius: 12, background: i === 0 ? T.pb : 'transparent', marginBottom: 4, border: i === 0 ? `1px solid rgba(51,102,255,0.3)` : '1px solid transparent' }}>
                  <div style={{ width: 26, cursor: 'grab', display: 'flex', justifyContent: 'center' }}><Icon.drag/></div>
                  <div style={{ width: 44, height: 44, borderRadius: 9, background: `linear-gradient(135deg, ${MC[MEMBERS[i]]}22, ${T.p}22)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><img src={LOGO} style={{ width: '60%', opacity: 0.5 }}/></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: i === 0 ? T.p : T.t, marginBottom: 2 }}>{al.name}</p>
                    <p style={{ fontSize: 11, color: T.tm }}>{al.count}종 · {al.versions.length}버전</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Right: edit form */}
          <div style={{ flex: 1, overflow: 'hidden', padding: '24px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <div>
                <p style={{ fontSize: 12, color: T.tl, fontWeight: 600, marginBottom: 3 }}>앨범 편집</p>
                <p style={{ fontSize: 22, fontWeight: 700, color: T.t, letterSpacing: '-0.03em' }}>Everlasting</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ height: 38, padding: '0 14px', borderRadius: 10, border: `1px solid ${T.b}`, display: 'flex', alignItems: 'center', gap: 6 }}><Icon.trash c={T.tm} sz={15}/><span style={{ fontSize: 13, color: T.tm, fontWeight: 600 }}>삭제</span></div>
                <div style={{ height: 38, padding: '0 18px', borderRadius: 10, background: T.p, display: 'flex', alignItems: 'center', boxShadow: '0 2px 10px rgba(51,102,255,0.25)' }}><span style={{ fontSize: 13, color: '#fff', fontWeight: 700 }}>저장</span></div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 28px', maxWidth: 760 }}>
              <div>
                <Label>앨범명</Label>
                <div style={fieldStyle}>Everlasting</div>
              </div>
              <div>
                <Label>정렬 순서</Label>
                <div style={fieldStyle}>1</div>
              </div>
              {/* Versions */}
              <div style={{ gridColumn: '1 / -1' }}>
                <Label>버전 목록</Label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                  {VERSIONS.map(v => (
                    <div key={v} style={{ height: 36, padding: '0 8px 0 14px', borderRadius: 100, background: T.pb, border: `1.5px solid ${T.p}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: T.p, fontWeight: 600 }}>{v}</span>
                      <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.close c={T.p} sz={8}/></span>
                    </div>
                  ))}
                  <div style={{ height: 36, padding: '0 14px', borderRadius: 100, border: `1.5px dashed ${T.b}`, display: 'flex', alignItems: 'center', gap: 5 }}><Icon.plus c={T.tm} sz={11}/><span style={{ fontSize: 13, color: T.tm, fontWeight: 600 }}>버전 추가</span></div>
                </div>
              </div>
              {/* Sources */}
              <div style={{ gridColumn: '1 / -1' }}>
                <Label>구매처 목록</Label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                  {['FNC STORE', '애플뮤직'].map(s => (
                    <div key={s} style={{ height: 36, padding: '0 8px 0 14px', borderRadius: 100, background: T.bl, border: `1px solid ${T.b}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: T.t, fontWeight: 500 }}>{s}</span>
                      <span style={{ width: 20, height: 20, borderRadius: '50%', background: T.s, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.close c={T.tm} sz={8}/></span>
                    </div>
                  ))}
                  <div style={{ height: 36, padding: '0 14px', borderRadius: 100, border: `1.5px dashed ${T.b}`, display: 'flex', alignItems: 'center', gap: 5 }}><Icon.plus c={T.tm} sz={11}/><span style={{ fontSize: 13, color: T.tm, fontWeight: 600 }}>구매처 추가</span></div>
                </div>
              </div>
              {/* Image uploads */}
              <div>
                <Label>헤더 이미지</Label>
                <div style={{ height: 130, borderRadius: 12, border: `1.5px dashed ${T.b}`, background: T.s, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, #1a1a2e, #3366FF)', opacity: 0.92 }}/>
                  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <Icon.upload c="#fff" sz={22}/>
                    <span style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>헤더 이미지 교체</span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>1080×320 권장</span>
                  </div>
                </div>
              </div>
              <div>
                <Label>배경 이미지</Label>
                <div style={{ height: 130, borderRadius: 12, border: `1.5px dashed ${T.b}`, background: T.s, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Icon.upload c={T.tl} sz={22}/>
                  <span style={{ fontSize: 12, color: T.tm, fontWeight: 600 }}>배경 이미지 업로드</span>
                  <span style={{ fontSize: 10, color: T.tl }}>Supabase Storage</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Desk>
    );
  }

  // ── Screen: 포카 관리 ──────────────────────────────────────────────────
  function AdminPocas() {
    const rows = CARDS.slice(0, 9);
    return (
      <Desk>
        <AdminBar tab={1}/>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '24px 32px' }}>
          {/* Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <p style={{ fontSize: 22, fontWeight: 700, color: T.t, letterSpacing: '-0.03em' }}>포카 관리</p>
              <div style={{ height: 30, padding: '0 12px', borderRadius: 100, background: T.bl, display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ fontSize: 12, color: T.tm, fontWeight: 600 }}>Everlasting ▾</span></div>
              <span style={{ fontSize: 13, color: T.tm }}>총 12종</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 220, height: 40, borderRadius: 10, border: `1px solid ${T.b}`, background: T.s, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px' }}><Icon.search c={T.tl}/><span style={{ fontSize: 13, color: T.tl }}>포카 검색</span></div>
              <div style={{ height: 40, padding: '0 16px', borderRadius: 10, background: T.p, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 10px rgba(51,102,255,0.25)' }}><Icon.plus c="#fff" sz={13}/><span style={{ fontSize: 13, color: '#fff', fontWeight: 700 }}>포카 추가</span></div>
            </div>
          </div>
          {/* Table */}
          <div style={{ flex: 1, background: T.s, borderRadius: 16, border: `1px solid ${T.b}`, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
            {/* Head */}
            <div style={{ display: 'grid', gridTemplateColumns: '50px 70px 1.4fr 1fr 1fr 1fr 90px', alignItems: 'center', height: 46, padding: '0 20px', borderBottom: `1px solid ${T.b}`, background: T.bg }}>
              {['', '썸네일', '포카명', '멤버', '버전', '구매처', '관리'].map((h, i) => (
                <span key={i} style={{ fontSize: 12, fontWeight: 700, color: T.tm }}>{h}</span>
              ))}
            </div>
            {rows.map((card, i) => (
              <div key={card.id} style={{ display: 'grid', gridTemplateColumns: '50px 70px 1.4fr 1fr 1fr 1fr 90px', alignItems: 'center', height: 66, padding: '0 20px', borderBottom: i < rows.length - 1 ? `1px solid ${T.b}` : 'none' }}>
                <div style={{ cursor: 'grab' }}><Icon.drag/></div>
                <div style={{ width: 36 }}><PocaCard member={card.member} img={card.img} status={card.status} width={36} radius={5}/></div>
                <span style={{ fontSize: 14, fontWeight: 600, color: T.t }}>{card.name}</span>
                <div><MemberBadge member={card.member}/></div>
                <div><Pill label={card.version} tone="blue"/></div>
                <span style={{ fontSize: 13, color: T.tm }}>{card.source}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: T.bl, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.edit c={T.tm} sz={15}/></div>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: T.bl, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.trash c={T.tm} sz={15}/></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Desk>
    );
  }

  // ── Screen: 포카 추가/편집 모달 (데스크탑) ─────────────────────────────
  function AdminPocaEdit() {
    return (
      <div style={{ width: W, height: H, fontFamily: T.f, position: 'relative', overflow: 'hidden', background: T.bg }}>
        {/* Dim backdrop = table */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.35 }}><AdminPocas/></div>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,18,0.5)' }}/>
        {/* Modal */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 640, background: T.s, borderRadius: 22, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}>
          <div style={{ padding: '22px 28px', borderBottom: `1px solid ${T.b}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: T.t }}>포카 추가</span>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: T.bl, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.close c={T.tm} sz={12}/></div>
          </div>
          <div style={{ padding: 28, display: 'flex', gap: 24 }}>
            {/* Thumbnail upload */}
            <div style={{ width: 150, flexShrink: 0 }}>
              <Label>썸네일</Label>
              <div style={{ width: 150, aspectRatio: '2/3', borderRadius: 12, border: `1.5px dashed ${T.b}`, background: T.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Icon.upload c={T.tl} sz={24}/>
                <span style={{ fontSize: 12, color: T.tm, fontWeight: 600 }}>이미지 업로드</span>
                <span style={{ fontSize: 10, color: T.tl }}>2:3 비율</span>
              </div>
            </div>
            {/* Fields */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <Label>포카명</Label>
                <div style={fieldStyle}>승협 포토카드</div>
              </div>
              <div>
                <Label>멤버</Label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {MEMBERS.map((m, i) => (
                    <div key={m} style={{ height: 34, padding: '0 12px', borderRadius: 100, background: i === 0 ? MC[m] : T.bl, border: `1.5px solid ${i === 0 ? MC[m] : T.b}`, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: i === 0 ? '#fff' : MC[m] }}/>
                      <span style={{ fontSize: 12, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? '#fff' : T.t }}>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <Label>버전</Label>
                  <div style={{ ...fieldStyle, justifyContent: 'space-between' }}><span>Ever ver.</span><Icon.chev c={T.tm}/></div>
                </div>
                <div style={{ flex: 1 }}>
                  <Label>구매처</Label>
                  <div style={{ ...fieldStyle, justifyContent: 'space-between' }}><span>FNC STORE</span><Icon.chev c={T.tm}/></div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ padding: '0 28px 26px', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <div style={{ height: 44, padding: '0 20px', borderRadius: 11, border: `1px solid ${T.b}`, display: 'flex', alignItems: 'center' }}><span style={{ fontSize: 14, color: T.tm, fontWeight: 600 }}>취소</span></div>
            <div style={{ height: 44, padding: '0 26px', borderRadius: 11, background: T.p, display: 'flex', alignItems: 'center', boxShadow: '0 4px 16px rgba(51,102,255,0.26)' }}><span style={{ fontSize: 14, color: '#fff', fontWeight: 700 }}>저장</span></div>
          </div>
        </div>
      </div>
    );
  }

  Object.assign(window, { NFAdminLogin: AdminLogin, NFAdminAlbums: AdminAlbums, NFAdminPocas: AdminPocas, NFAdminPocaEdit: AdminPocaEdit });
})();
