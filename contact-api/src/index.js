export default {
  async fetch(request, env) {
    // CORS ヘッダー
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // OPTIONS (CORS preflight)
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    // POST /contact — お問い合わせ送信
    if (url.pathname === "/contact" && request.method === "POST") {
      try {
        const body = await request.json();
        const { requirement, email, message } = body;

        // バリデーション
        if (!requirement || !email || !message) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "全ての項目を入力してください",
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            },
          );
        }

        // メールアドレスの簡易バリデーション
        if (!email.includes("@")) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "有効なメールアドレスを入力してください",
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            },
          );
        }

        // D1 に保存
        await env.DB.prepare(
          "INSERT INTO contacts (requirement, email, message) VALUES (?, ?, ?)",
        )
          .bind(requirement, email, message)
          .run();

        return new Response(
          JSON.stringify({ success: true, message: "送信が完了しました" }),
          { headers: { "Content-Type": "application/json", ...corsHeaders } },
        );
      } catch (error) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "サーバーエラーが発生しました",
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          },
        );
      }
    }

    // GET /contacts — 管理用（全件取得）
    if (url.pathname === "/contacts" && request.method === "GET") {
      try {
        const results = await env.DB.prepare(
          "SELECT * FROM contacts ORDER BY created_at DESC",
        ).all();
        return new Response(
          JSON.stringify({ success: true, data: results.results }),
          { headers: { "Content-Type": "application/json", ...corsHeaders } },
        );
      } catch (error) {
        return new Response(
          JSON.stringify({ success: false, error: "データ取得に失敗しました" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          },
        );
      }
    }

    // 404
    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  },
};
