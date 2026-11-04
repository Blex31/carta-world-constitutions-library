import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.119.0";

const URL = Deno.env.get("SUPABASE_URL") ?? "";
const KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? "";
const ORIGINS = new Set((Deno.env.get("CARTA_ALLOWED_ORIGINS") ??
  "http://localhost:5173,http://127.0.0.1:5173").split(",").map((x) => x.trim()).filter(Boolean));

function headers(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": origin && ORIGINS.has(origin) ? origin : "null",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Max-Age": "600",
    "Vary": "Origin",
  };
}
function reply(data: unknown, status = 200, origin: string | null = null) {
  return new Response(JSON.stringify(data), {
    status, headers: { ...headers(origin), "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}
function error(message: string, status = 400, code?: string, origin: string | null = null) {
  return reply({ error: message, ...(code ? { code } : {}) }, status, origin);
}
function client(req: Request) {
  if (!URL || !KEY) throw new Error("Supabase function configuration is incomplete.");
  const authorization = req.headers.get("Authorization");
  return createClient(URL, KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: authorization ? { headers: { Authorization: authorization } } : undefined,
  });
}
async function getUser(req: Request, db: ReturnType<typeof client>) {
  const auth = req.headers.get("Authorization") ?? "";
  if (!auth.toLowerCase().startsWith("bearer ")) return null;
  const { data, error: authError } = await db.auth.getUser(auth.slice(7).trim());
  return authError ? null : data.user;
}
function admin(user: { app_metadata?: Record<string, unknown> } | null) {
  return user?.app_metadata?.role === "admin";
}
function route(path: string) { return path.replace(/^\/functions\/v1\/carta-api/, "") || "/"; }

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("Origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: headers(origin) });
  if (origin && !ORIGINS.has(origin)) return error("Origin is not allowed.", 403, "ORIGIN_NOT_ALLOWED", origin);

  let db: ReturnType<typeof client>;
  try { db = client(req); }
  catch (e) { return error((e as Error).message, 500, "CONFIGURATION_ERROR", origin); }
  const path = route(new URL(req.url).pathname);
  const params = new URL(req.url).searchParams;

  try {
    if (path === "/health" && req.method === "GET")
      return reply({ ok: true, service: "carta-api", backend: "supabase", at: new Date().toISOString() }, 200, origin);

    if (path === "/api/library" && req.method === "GET") {
      const [countriesR, docsR, feedR, coverageR] = await Promise.all([
        db.from("jurisdictions").select("iso_code,name,flag_emoji,jurisdiction_kind,constitution_status")
          .eq("is_active", true).order("name").limit(300),
        db.from("legal_documents").select("id,jurisdiction_iso,title,short_title,doc_type,adopted_at,published_at,is_current,language_code,official_url,version_label,document_status,license_status,commercial_use_allowed,legal_sources!inner(is_official,license_status,commercial_use_allowed)")
          .eq("is_current", true).eq("document_status", "verified")
          .in("license_status", ["approved","public_domain_verified","open_license","permission_granted"])
          .eq("commercial_use_allowed", true).eq("legal_sources.is_official", true)
          .in("legal_sources.license_status", ["approved","public_domain_verified","open_license","permission_granted"])
          .eq("legal_sources.commercial_use_allowed", true).order("jurisdiction_iso").limit(1200),
        db.from("feed_items").select("id,item_type,title,summary,canonical_url,published_at,jurisdiction_iso,document_id,legal_sources(name,is_official,is_active),jurisdictions(name)")
          .eq("verification_status", "source_verified").eq("legal_sources.is_official", true).eq("legal_sources.is_active", true)
          .gte("published_at", new Date(Date.now()-90*86400000).toISOString())
          .order("published_at", { ascending: false }).limit(80),
        db.from("jurisdiction_constitution_coverage").select("*").limit(300),
      ]);
      for (const result of [countriesR, docsR, feedR, coverageR]) if (result.error) throw result.error;
      const countries = countriesR.data ?? [];
      const documents = docsR.data ?? [];
      const feed = feedR.data ?? [];
      const coverageRows = coverageR.data ?? [];
      const ids = documents.map((d: any) => d.id);
      let sections: any[] = [];
      if (ids.length) {
        const sectionResult = await db.from("document_sections")
          .select("id,document_id,section_number,heading,section_order,original_text,plain_language_summary,source_location")
          .in("document_id", ids).order("section_order").limit(15000);
        if (sectionResult.error) throw sectionResult.error;
        sections = sectionResult.data ?? [];
      }
      const chapters = documents.map((d: any) => ({ id: d.id + ":root", documentId: d.id, number: 1, title: "Document provisions" }));
      const articles = sections.map((s: any) => ({
        id: s.id, documentId: s.document_id, chapterId: s.document_id + ":root",
        articleNumber: s.section_number || "Section " + (s.section_order+1),
        title: s.heading || s.section_number || "Provision", originalText: s.original_text,
        simplifiedText: s.plain_language_summary || "", tags: [], sourceReference: s.source_location || "",
      }));
      const dailyItems = feed.map((f: any) => ({
        id: f.id, type: f.item_type === "bill" ? "BILL" : f.item_type === "judgment" ? "COURT UPDATE" : "CURRENT AFFAIR",
        title: f.title, body: f.summary || "Open the official publisher for this update.", ref: f.document_id,
        jurisdictionIso: f.jurisdiction_iso,
        tag: [f.jurisdictions?.name, f.legal_sources?.name].filter(Boolean).join(" · "),
        sourceUrl: f.canonical_url, publishedAt: f.published_at,
      }));
      const coverage = coverageRows.reduce((a: any, r: any) => ({
        total: a.total+1,
        verified_current: a.verified_current+(r.constitution_status === "verified_current" ? 1 : 0),
        text_loaded: a.text_loaded+(r.constitution_status === "text_loaded" ? 1 : 0),
        metadata_only: a.metadata_only+(r.constitution_status === "metadata_only" ? 1 : 0),
      }), { total:0, verified_current:0, text_loaded:0, metadata_only:0 });
      return reply({
        countries: countries.map((c: any) => ({ id:c.iso_code, iso:c.iso_code, name:c.name, flag:c.flag_emoji, jurisdictionKind:c.jurisdiction_kind, constitutionStatus:c.constitution_status })),
        documents: documents.map((d: any) => ({ ...d, countryId:d.jurisdiction_iso, country_id:d.jurisdiction_iso, type:d.doc_type,
          year:(d.adopted_at || d.published_at || "").slice(0,4), main:d.doc_type === "constitution" && d.is_current,
          shortDescription:d.short_title || "Official legal text" })),
        chapters, articles, dailyItems, coverage,
        feedNotice:"CARTA publishes legal text only after current-version, authority and reuse checks.",
      }, 200, origin);
    }

    if (path === "/api/feed" && req.method === "GET") {
      const limit = Math.min(100, Math.max(1, Number(params.get("limit") || 40)));
      let q = db.from("feed_items").select("id,item_type,title,summary,canonical_url,published_at,jurisdiction_iso,legal_sources!inner(name,source_url,is_official,is_active,authority_rank),jurisdictions(name,flag_emoji)")
        .eq("verification_status","source_verified").eq("legal_sources.is_official",true).eq("legal_sources.is_active",true)
        .order("published_at",{ascending:false}).limit(limit);
      const country = params.get("country"); if (country) q = q.eq("jurisdiction_iso",country);
      const result = await q; if (result.error) throw result.error;
      return reply({ items:(result.data ?? []).map((f:any)=>({
        id:f.id,item_type:f.item_type,title:f.title,summary:f.summary,canonical_url:f.canonical_url,published_at:f.published_at,
        jurisdiction_iso:f.jurisdiction_iso,jurisdiction_name:f.jurisdictions?.name,flag_emoji:f.jurisdictions?.flag_emoji,
        source_name:f.legal_sources?.name,publisher_url:f.legal_sources?.source_url,authority_rank:f.legal_sources?.authority_rank,
      })) },200,origin);
    }

    if (path === "/api/search" && req.method === "GET") {
      const term = (params.get("q") ?? "").trim();
      if (term.length < 2) return reply({results:[]},200,origin);
      const safe = term.replace(/[^\p{L}\p{N}\s"'&-]/gu," ").slice(0,200);
      let q = db.from("document_chunks").select("id,document_id,heading,content,legal_documents!inner(title,official_url,jurisdiction_iso,document_status,license_status,commercial_use_allowed,legal_sources!inner(is_official,license_status,commercial_use_allowed))")
        .textSearch("search_vector",safe,{type:"websearch",config:"simple"})
        .eq("legal_documents.document_status","verified").eq("legal_documents.commercial_use_allowed",true)
        .in("legal_documents.license_status",["approved","public_domain_verified","open_license","permission_granted"])
        .eq("legal_documents.legal_sources.is_official",true).eq("legal_documents.legal_sources.commercial_use_allowed",true)
        .in("legal_documents.legal_sources.license_status",["approved","public_domain_verified","open_license","permission_granted"]).limit(50);
      const country = params.get("country"); if (country) q = q.eq("legal_documents.jurisdiction_iso",country);
      const result = await q; if (result.error) throw result.error;
      return reply({results:(result.data ?? []).map((x:any)=>({
        chunk_id:x.id,document_id:x.document_id,heading:x.heading,content:x.content,
        document_title:x.legal_documents?.title,official_url:x.legal_documents?.official_url,
      }))},200,origin);
    }

    const documentMatch = path.match(/^\/api\/documents\/([0-9a-f-]{36})$/i);
    if (documentMatch && req.method === "GET") {
      const id = documentMatch[1];
      const doc = await db.from("legal_documents").select("id,jurisdiction_iso,title,short_title,doc_type,adopted_at,published_at,is_current,official_url,version_label,document_status,license_status,commercial_use_allowed,legal_sources!inner(name,is_official,license_status,commercial_use_allowed)")
        .eq("id",id).eq("is_current",true).eq("document_status","verified")
        .in("license_status",["approved","public_domain_verified","open_license","permission_granted"])
        .eq("commercial_use_allowed",true).eq("legal_sources.is_official",true).eq("legal_sources.commercial_use_allowed",true)
        .in("legal_sources.license_status",["approved","public_domain_verified","open_license","permission_granted"]).maybeSingle();
      if (doc.error) throw doc.error;
      if (!doc.data) return error("This document is not in CARTA's verified publication set.",404,"DOCUMENT_NOT_PUBLISHED",origin);
      const s = await db.from("document_sections").select("id,section_number,heading,section_order,original_text,plain_language_summary,source_location").eq("document_id",id).order("section_order");
      if (s.error) throw s.error;
      return reply({document:doc.data,sections:s.data ?? []},200,origin);
    }

    if (path === "/api/library/me" && req.method === "GET") {
      const user = await getUser(req,db);
      if (!user) return error("Sign in to access your personal library.",401,"AUTH_REQUIRED",origin);
      const id = user.id;
      const [b,h,n,d,p] = await Promise.all([
        db.from("user_bookmarks").select("id,document_id,section_id").eq("user_id",id),
        db.from("user_highlights").select("id,document_id,section_id,selected_text").eq("user_id",id),
        db.from("user_notes").select("id,document_id,section_id,body,created_at").eq("user_id",id).order("created_at",{ascending:false}),
        db.from("user_saved_documents").select("document_id").eq("user_id",id),
        db.from("user_profiles").select("*").eq("user_id",id).maybeSingle(),
      ]);
      for (const r of [b,h,n,d,p]) if (r.error) throw r.error;
      return reply({
        bookmarks:(b.data??[]).map((x:any)=>({id:x.id,documentId:x.document_id,sectionId:x.section_id})),
        highlights:(h.data??[]).map((x:any)=>({id:x.id,documentId:x.document_id,sectionId:x.section_id})),
        notes:(n.data??[]).map((x:any)=>({id:x.id,documentId:x.document_id,sectionId:x.section_id,text:x.body,date:x.created_at})),
        downloads:(d.data??[]).map((x:any)=>({documentId:x.document_id})), preferences:p.data,
      },200,origin);
    }

    if (path === "/api/library/me" && req.method === "POST") {
      const user = await getUser(req,db);
      if (!user) return error("Sign in to sync your personal library.",401,"AUTH_REQUIRED",origin);
      const body = await req.json(); const id = user.id;
      const action = String(body.action ?? ""); const op = body.operation === "remove" ? "remove" : "save";
      if (action === "preferences") {
        const profile:any = {user_id:id,timezone:body.timezone || "Africa/Nairobi",
          daily_digest_enabled:body.dailyDigestEnabled !== false,offline_default_enabled:body.offlineDefaultEnabled !== false,updated_at:new Date().toISOString()};
        if (body.countryIso) profile.preferred_jurisdiction_iso = body.countryIso;
        const r = await db.from("user_profiles").upsert(profile,{onConflict:"user_id"}); if (r.error) throw r.error;
        return reply({ok:true},200,origin);
      }
      const documentId = typeof body.documentId === "string" ? body.documentId : "";
      const sectionId = typeof body.sectionId === "string" ? body.sectionId : null;
      if (action === "download") {
        if (!documentId) return error("A document ID is required.",400,"DOCUMENT_REQUIRED",origin);
        const r = op === "remove"
          ? await db.from("user_saved_documents").delete().eq("user_id",id).eq("document_id",documentId)
          : await db.from("user_saved_documents").upsert({user_id:id,document_id:documentId},{onConflict:"user_id,document_id"});
        if (r.error) throw r.error; return reply({ok:true},200,origin);
      }
      if (action === "bookmark" || action === "highlight") {
        if (!documentId || !sectionId) return error("Document and section IDs are required.",400,"SECTION_REQUIRED",origin);
        const table = action === "bookmark" ? "user_bookmarks" : "user_highlights";
        if (op === "remove") {
          const r = await db.from(table).delete().eq("user_id",id).eq("document_id",documentId).eq("section_id",sectionId);
          if (r.error) throw r.error;
        } else {
          const lookup = await db.from(table).select("id").eq("user_id",id).eq("document_id",documentId).eq("section_id",sectionId).maybeSingle();
          if (lookup.error) throw lookup.error;
          if (!lookup.data) {
            const payload:any = {user_id:id,document_id:documentId,section_id:sectionId};
            if (action === "highlight") payload.selected_text = String(body.selectedText ?? "").slice(0,5000);
            const r = await db.from(table).insert(payload); if (r.error) throw r.error;
          }
        }
        return reply({ok:true},200,origin);
      }
      if (action === "note") {
        if (op === "remove") {
          let q = db.from("user_notes").delete().eq("user_id",id);
          if (body.id) q = q.eq("id",body.id);
          else if (documentId && sectionId) q = q.eq("document_id",documentId).eq("section_id",sectionId);
          else return error("A note ID or note location is required.",400,"NOTE_TARGET_REQUIRED",origin);
          const r = await q; if (r.error) throw r.error;
        } else {
          const text = String(body.text ?? "").trim();
          if (!documentId || !sectionId || !text) return error("Document, section and note text are required.",400,"NOTE_REQUIRED",origin);
          const lookup = await db.from("user_notes").select("id").eq("user_id",id).eq("document_id",documentId).eq("section_id",sectionId).maybeSingle();
          if (lookup.error) throw lookup.error;
          const payload = {user_id:id,document_id:documentId,section_id:sectionId,body:text.slice(0,10000),updated_at:new Date().toISOString()};
          const r = lookup.data ? await db.from("user_notes").update(payload).eq("id",lookup.data.id).eq("user_id",id) : await db.from("user_notes").insert(payload);
          if (r.error) throw r.error;
        }
        return reply({ok:true},200,origin);
      }
      return error("Unsupported library action.",400,"UNSUPPORTED_ACTION",origin);
    }

    if (path === "/api/billing/status" && req.method === "GET") {
      const user = await getUser(req,db); if (!user) return error("Sign in to view membership.",401,"AUTH_REQUIRED",origin);
      const r = await db.from("subscriptions").select("plan_key,status,period_ends_at,cancel_at_period_end,is_live_mode")
        .eq("user_id",user.id).eq("is_live_mode",true).in("status",["active","trialing"])
        .order("updated_at",{ascending:false}).limit(1).maybeSingle();
      if (r.error) throw r.error;
      return reply({isAdFree:Boolean(r.data && ["plus","carta_plus","premium"].includes(r.data.plan_key)),
        status:r.data?.status ?? "free",currentPeriodEnd:r.data?.period_ends_at ?? null,cancelAtPeriodEnd:r.data?.cancel_at_period_end ?? false},200,origin);
    }

    if (path.startsWith("/api/legal-chat") || path.startsWith("/api/billing/checkout") ||
        path.startsWith("/api/billing/portal") || path.startsWith("/api/billing/verify"))
      return error("This feature is not enabled. Configure and verify its provider credentials before use.",503,"PROVIDER_NOT_CONFIGURED",origin);

    if (path === "/api/admin/sources" || path.startsWith("/api/admin/sources/")) {
      const user = await getUser(req,db); if (!user) return error("Sign in to access source administration.",401,"AUTH_REQUIRED",origin);
      if (!admin(user)) return error("Administrator access is required.",403,"ADMIN_REQUIRED",origin);
      if (path === "/api/admin/sources" && req.method === "GET") {
        const [s,r] = await Promise.all([
          db.from("legal_sources").select("*").order("authority_rank").order("name").limit(500),
          db.from("ingestion_runs").select("*").order("started_at",{ascending:false}).limit(20),
        ]);
        if (s.error) throw s.error; if (r.error) throw r.error;
        return reply({sources:s.data ?? [],runs:r.data ?? []},200,origin);
      }
      if (path === "/api/admin/sources" && req.method === "POST") {
        const b = await req.json();
        const payload = {slug:String(b.slug??"").slice(0,80),name:String(b.name??"").slice(0,240),
          publisher:String(b.publisher??"").slice(0,240),source_type:String(b.sourceType??"other"),jurisdiction_iso:b.jurisdictionIso||null,
          source_url:String(b.sourceUrl??""),feed_url:b.feedUrl||null,api_url:b.apiUrl||null,documentation_url:b.documentationUrl||null,
          authority_rank:Math.min(100,Math.max(1,Number(b.authorityRank||50))),poll_interval_minutes:b.pollIntervalMinutes||null,
          is_official:b.isOfficial===true,license_status:"review_required",commercial_use_allowed:false,is_active:false,
          content_scope:String(b.contentScope??""),metadata:{allowedHosts:Array.isArray(b.allowedHosts)?b.allowedHosts:[],rightsReview:"required"}};
        const r = await db.from("legal_sources").insert(payload).select("*").single(); if (r.error) throw r.error;
        return reply({source:r.data},201,origin);
      }
      const sourceId = path.split("/").pop();
      if (req.method === "PATCH" && sourceId) {
        const b = await req.json(); const patch:any = {updated_at:new Date().toISOString()};
        if (typeof b.isActive === "boolean") patch.is_active = b.isActive;
        if (typeof b.licenseStatus === "string") patch.license_status = b.licenseStatus;
        if (typeof b.commercialUseAllowed === "boolean") patch.commercial_use_allowed = b.commercialUseAllowed;
        if (b.rightsEvidenceUrl || b.rightsNotes) {
          const old = await db.from("legal_sources").select("metadata").eq("id",sourceId).single();
          if (old.error) throw old.error;
          patch.metadata = {...(old.data.metadata ?? {}),rightsEvidenceUrl:String(b.rightsEvidenceUrl??""),
            rightsNotes:String(b.rightsNotes??""),rightsReviewedAt:new Date().toISOString(),rightsReviewedBy:user.id};
        }
        if (patch.commercial_use_allowed === true && !["approved","public_domain_verified","open_license","permission_granted"].includes(String(patch.license_status??"")))
          return error("Commercial reuse requires a recognised licence or written permission.",422,"RIGHTS_STATUS_REQUIRED",origin);
        const r = await db.from("legal_sources").update(patch).eq("id",sourceId).select("*").single(); if (r.error) throw r.error;
        return reply({source:r.data},200,origin);
      }
    }

    if (path === "/api/admin/ingest" && req.method === "POST") {
      const user = await getUser(req,db); if (!user) return error("Sign in to run ingestion.",401,"AUTH_REQUIRED",origin);
      if (!admin(user)) return error("Administrator access is required.",403,"ADMIN_REQUIRED",origin);
      return error("Ingestion is paused until a publisher adapter and reuse permissions are verified.",409,"INGESTION_NOT_CONFIGURED",origin);
    }

    return error("Route not found.",404,"NOT_FOUND",origin);
  } catch (e) {
    console.error("CARTA API error",e);
    return error("The CARTA service could not complete this request.",500,"INTERNAL_ERROR",origin);
  }
});