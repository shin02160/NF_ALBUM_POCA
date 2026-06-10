// ── Supabase Edge Function: poca-admin ─────────────────────────────────
// 관리자 쓰기 전용 서버. service_role로 동작(자동 주입), PIN은 DB(admin_config) 해시와 대조.
// 클라이언트(anon)는 RLS상 읽기 전용. 모든 write/이미지 업로드는 이 함수 경유.
// 배포: Supabase MCP deploy_edge_function (verify_jwt=false, 커스텀 PIN 인증).
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

  let body: any;
  try { body = await req.json(); } catch { return json({ error: "bad json" }, 400); }
  const { pin, action, payload } = body ?? {};
  if (!pin || typeof pin !== "string") return json({ error: "pin required" }, 400);

  const { data: ok, error: vErr } = await admin.rpc("verify_admin_pin", { p: pin });
  if (vErr) return json({ error: "verify failed" }, 500);
  if (!ok) {
    await new Promise((r) => setTimeout(r, 400)); // 무차별 대입 완화
    return json({ error: "unauthorized" }, 401);
  }

  try {
    switch (action) {
      case "verify":
        return json({ ok: true });
      case "saveAlbum": {
        const { error } = await admin.from("album_meta").upsert(payload);
        if (error) throw error;
        return json({ ok: true });
      }
      case "deleteAlbum": {
        const { error } = await admin.from("album_meta").delete().eq("album_id", payload.id);
        if (error) throw error;
        return json({ ok: true });
      }
      case "saveCard": {
        const { error } = await admin.from("album_poca_cards").upsert(payload);
        if (error) throw error;
        return json({ ok: true });
      }
      case "deleteCard": {
        const { error } = await admin.from("album_poca_cards").delete().eq("id", payload.id);
        if (error) throw error;
        return json({ ok: true });
      }
      case "reorderCards": {
        const ids: string[] = payload?.orderedIds ?? [];
        for (let i = 0; i < ids.length; i++) {
          const { error } = await admin.from("album_poca_cards").update({ sort_order: i }).eq("id", ids[i]);
          if (error) throw error;
        }
        return json({ ok: true });
      }
      case "uploadImage": {
        const { base64, contentType, ext, folder } = payload ?? {};
        if (!base64) return json({ error: "no image" }, 400);
        const raw = String(base64).includes(",") ? String(base64).split(",")[1] : String(base64);
        const bytes = Uint8Array.from(atob(raw), (c) => c.charCodeAt(0));
        const path = `${folder || "uploads"}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext || "png"}`;
        const { error } = await admin.storage.from("poca-images").upload(path, bytes, { contentType: contentType || "image/png", upsert: true });
        if (error) throw error;
        const { data } = admin.storage.from("poca-images").getPublicUrl(path);
        return json({ url: data.publicUrl });
      }
      default:
        return json({ error: "unknown action" }, 400);
    }
  } catch (e) {
    return json({ error: String((e as any)?.message ?? e) }, 500);
  }
});
