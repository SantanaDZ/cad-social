const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const FROM_EMAIL = Deno.env.get('FROM_EMAIL')

Deno.serve(async (req: Request) => {
  try {
    const { record, old_record } = await req.json()

    // Só dispara se o status mudou para aprovado ou rejeitado
    if (record.status === old_record.status) {
      return new Response(JSON.stringify({ message: "Status não alterado" }), { status: 200 })
    }

    if (record.status === 'pendente') {
      return new Response(JSON.stringify({ message: "Notificação não necessária para pendente" }), { status: 200 })
    }

    // Buscar o e-mail do usuário no perfil
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    // Import helper dinamicamente para evitar dependências pesadas
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2')
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', record.user_id)
      .single()

    const userEmail = profile?.email

    if (!userEmail) {
      console.error("E-mail do usuário não encontrado para ID:", record.user_id)
      return new Response(JSON.stringify({ error: "E-mail não encontrado" }), { status: 400 })
    }

    const statusLabel = record.status === 'aprovado' ? 'APROVADA' : 'REJEITADA'
    const subject = `Sua inscrição no CadSocial foi ${statusLabel}`

    const htmlContent = `
      <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #2563eb;">Olá, ${record.nome_completo}!</h2>
        <p>Gostaríamos de informar que a análise da sua inscrição foi concluída.</p>
        
        <div style="background-color: ${record.status === 'aprovado' ? '#f0fdf4' : '#fef2f2'}; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold; color: ${record.status === 'aprovado' ? '#166534' : '#991b1b'};">
            STATUS: ${statusLabel}
          </p>
        </div>

        ${record.observacoes ? `
          <p><strong>Observações do Analista:</strong></p>
          <blockquote style="border-left: 4px solid #ddd; padding-left: 15px; font-style: italic;">
            ${record.observacoes}
          </blockquote>
        ` : ''}

        <p style="margin-top: 30px;">
          Você pode conferir todos os detalhes acessando o portal:
          <br>
          <a href="https://cadsocial.com.br/dashboard" style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Ver minha inscrição</a>
        </p>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="font-size: 12px; color: #666;">
          Este é um e-mail automático enviado pelo CadSocial. Por favor, não responda a este e-mail.
        </p>
      </div>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [userEmail],
        subject: subject,
        html: htmlContent,
      }),
    })

    const result = await res.json()
    console.log("Email enviado:", result)

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    console.error("Erro na função:", error)
    return new Response(JSON.stringify({ error: error?.message || "Erro interno" }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
