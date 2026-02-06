import Link from "next/link"

export default function TermosPage() {
  const dataAtual = new Date().toLocaleDateString('pt-BR')

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex flex-col" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* ─── NAV ─── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              Task<span className="text-indigo-600">Master</span>
            </span>
          </Link>
          <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">
            Voltar para o Início
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16 flex-1">
        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-200/50 border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 uppercase tracking-tight">
            Termos e Condições Gerais de Uso
          </h1>
          <p className="text-sm text-gray-400 font-bold mb-8">
            Última atualização: {dataAtual}
          </p>

          <div className="prose prose-indigo max-w-none text-gray-600 space-y-8 leading-relaxed">
            <section>
              <p>
                Bem-vindo ao <strong>TaskMaster</strong>.
              </p>
              <p>
                Ao acessar, utilizar, registrar-se ou interagir de qualquer forma com o serviço oferecido por meio deste aplicativo, website ou plataforma digital, o usuário declara expressamente que leu, compreendeu e concorda integralmente com os presentes Termos e Condições Gerais de Uso.
              </p>
              <p className="font-bold text-gray-900">
                Caso o usuário não concorde com qualquer das disposições aqui contidas, não deverá utilizar o serviço.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">1. OBJETO DO SERVIÇO</h2>
              <div className="mt-4 space-y-3">
                <p>
                  1.1. O TaskMaster é uma plataforma digital destinada ao gerenciamento de tarefas e atividades pessoais, permitindo o cadastro, edição, organização e acompanhamento de tarefas pelos usuários.
                </p>
                <p>
                  1.2. O serviço é oferecido em <strong>caráter experimental e sem garantias</strong>, podendo sofrer alterações, interrupções ou descontinuidade a qualquer momento, sem aviso prévio.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">2. ACEITAÇÃO AUTOMÁTICA DOS TERMOS</h2>
              <div className="mt-4 space-y-3">
                <p>
                  2.1. O simples acesso, cadastro ou utilização do serviço implica na aceitação automática, plena e irrestrita destes Termos de Uso.
                </p>
                <p>
                  2.2. Durante o processo de criação de conta, poderá ser solicitado que o usuário confirme expressamente sua concordância com estes Termos por meio de um campo de aceite (checkbox). Independentemente disso, a utilização do serviço já configura aceitação integral.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">3. CADASTRO E ACESSO</h2>
              <div className="mt-4 space-y-3">
                <p>3.1. O acesso ao serviço poderá ocorrer por meio de:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Login via e-mail e senha;</li>
                  <li>Login por meio de provedores externos, como Google.</li>
                </ul>
                <p>
                  3.2. O usuário é o único responsável pela veracidade das informações fornecidas no momento do cadastro.
                </p>
                <p>
                  3.3. O usuário compromete-se a manter seus dados de acesso em sigilo, sendo inteiramente responsável por qualquer atividade realizada em sua conta.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">4. ARMAZENAMENTO DE DADOS</h2>
              <div className="mt-4 space-y-3">
                <p>
                  4.1. O serviço utiliza tecnologia de armazenamento baseada em banco de dados SQLite, com finalidade exclusiva de viabilizar o funcionamento da plataforma.
                </p>
                <p>
                  4.2. O usuário declara estar ciente de que:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Os dados cadastrados são armazenados sem garantias de integridade, segurança ou disponibilidade permanente;</li>
                  <li>Podem ocorrer perdas de dados, falhas técnicas, indisponibilidades ou exclusões acidentais;</li>
                  <li>Não há qualquer garantia de backup, recuperação ou manutenção das informações inseridas.</li>
                </ul>
                <p>
                  4.3. O usuário é inteiramente responsável por manter cópias próprias de quaisquer dados que considere importantes.
                </p>
              </div>
            </section>

            <section className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">5. ISENÇÃO TOTAL DE RESPONSABILIDADE</h2>
              <div className="mt-4 space-y-3 font-medium text-indigo-900">
                <p>
                  5.1. O serviço é fornecido “no estado em que se encontra”, sem garantias de qualquer natureza, expressas ou implícitas.
                </p>
                <p>
                  5.2. O desenvolvedor e/ou responsável pelo aplicativo não se responsabiliza, em hipótese alguma, por: perda total ou parcial de dados; danos diretos, indiretos, morais ou materiais; lucros cessantes; interrupções do serviço; falhas de segurança; mau uso da plataforma ou informações incorretas inseridas pelos usuários.
                </p>
                <p>
                  5.3. <strong>O uso do serviço é realizado por conta e risco exclusivo do usuário.</strong>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">6. EXIBIÇÃO DE INFORMAÇÕES DE USUÁRIOS PREMIUM</h2>
              <div className="mt-4 space-y-3">
                <p>
                  6.1. Usuários que adquirirem qualquer plano pago (“conta premium”) ou utilizarem recursos pagos do sistema concordam expressamente que:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Sua foto de perfil vinculada ao login do Google poderá ser exibida publicamente na página inicial ou em outras áreas do aplicativo, com a finalidade de demonstrar usuários apoiadores ou participantes do serviço;
                  </li>
                  <li>Seu nome e/ou imagem poderão ser utilizados para fins de divulgação interna do próprio aplicativo.</li>
                </ul>
                <p>
                  6.2. O usuário declara estar plenamente ciente e de acordo que tal exibição é parte integrante do funcionamento e da proposta do serviço.
                </p>
                <p>
                  6.3. Caso o usuário não concorde com essa exposição, deverá optar por não utilizar planos pagos ou solicitar o cancelamento de sua conta.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">7. PLANOS PAGOS E REEMBOLSOS</h2>
              <div className="mt-4 space-y-3">
                <p>
                  7.1. A aquisição de planos premium ou funcionalidades pagas não gera qualquer garantia adicional quanto ao funcionamento, estabilidade ou segurança do serviço.
                </p>
                <p>
                  7.2. Não há garantia de reembolso por indisponibilidade, perda de dados ou insatisfação com o serviço, salvo quando exigido por lei.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">8. PRIVACIDADE</h2>
              <div className="mt-4 space-y-3">
                <p>8.1. O aplicativo coleta apenas as informações necessárias ao seu funcionamento.</p>
                <p>8.2. Os dados são utilizados exclusivamente para a operação do serviço, não sendo comercializados com terceiros.</p>
                <p>8.3. Apesar dos esforços técnicos, o responsável pelo aplicativo não garante níveis específicos de segurança ou privacidade.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">9. CANCELAMENTO E EXCLUSÃO DE CONTA</h2>
              <div className="mt-4 space-y-3">
                <p>9.1. O usuário pode solicitar a exclusão de sua conta a qualquer momento.</p>
                <p>9.2. A exclusão da conta não garante a remoção imediata de dados já exibidos publicamente, incluindo eventuais fotos exibidas como usuário premium.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">10. DISPOSIÇÕES FINAIS</h2>
              <div className="mt-4 space-y-3">
                <p>10.1. Estes Termos poderão ser modificados a qualquer momento. A continuidade do uso do serviço após alterações implica na aceitação automática.</p>
                <p>10.2. Este serviço é oferecido sem qualquer garantia formal de continuidade.</p>
              </div>
            </section>

            <div className="pt-10 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500 font-bold mb-4 uppercase tracking-[0.2em]">Contato</p>
              <p className="text-indigo-600 font-extrabold underline decoration-2 underline-offset-4">
                juliano340@gmail.com
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.1em]">
            © 2026 TaskMaster. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
