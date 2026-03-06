export default {
  async fetch(request, env) {
    // Настройки CORS, чтобы форма работала только с твоего домена
    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://dmytrobudanov.github.io", // или твой домен
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    if (request.method === "POST") {
      try {
        const formData = await request.formData();
        const data = Object.fromEntries(formData.entries());

        // Отправка в ZeptoMail
        const response = await fetch("https://api.zeptomail.eu/v1.1/email", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Zoho-enczpt yA6KbHsP6AT2wT5VQxQ/gMKDoYpj/60+i3+2sSH..." // Твой пароль из скриншота
          },
          body: JSON.stringify({
            from: { address: "noreply@nexial-intelligence.com" },
            to: [{ email_address: { address: "solutions@nexial-intelligence.com" } }],
            subject: "New Contact Form Submission",
            htmlbody: `<h3>New message from ${data['first-name']}</h3>
                       <p><b>Email:</b> ${data.email}</p>
                       <p><b>Focus:</b> ${data.focus}</p>`
          }),
        });

        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
      }
    }

    return new Response("Method not allowed", { status: 405 });
  }
};