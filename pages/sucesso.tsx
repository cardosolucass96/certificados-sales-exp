import { useRouter } from 'next/router'
import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function Sucesso() {
  const router = useRouter()
  const { url, nome } = router.query
  const [copied, setCopied] = useState(false)
  const [isDataUrl, setIsDataUrl] = useState(false)

  useEffect(() => {
    // Verificar se é um data URL (base64)
    if (url && typeof url === 'string' && url.startsWith('data:')) {
      setIsDataUrl(true)
      // Fazer download automático do PDF
      downloadPdf(url, `certificado-${nome || 'participante'}.pdf`)
    }
  }, [url, nome])

  const downloadPdf = (dataUrl: string, filename: string) => {
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDownload = () => {
    if (url && typeof url === 'string') {
      if (isDataUrl) {
        downloadPdf(url, `certificado-${nome || 'participante'}.pdf`)
      } else {
        window.open(url, '_blank')
      }
    }
  }

  const copyToClipboard = () => {
    if (url) {
      navigator.clipboard.writeText(url as string)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      <Head>
        <title>Certificado Gerado com Sucesso!</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Card principal */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-700">
            <div className="text-center mb-6">
              {/* Ícone de sucesso */}
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-500/50">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Certificado Gerado!
              </h1>
              <p className="text-slate-400">
                Parabéns, <span className="text-white font-semibold">{nome}</span>!<br />
                Seu certificado foi gerado com sucesso.
              </p>
            </div>

            <div className="space-y-4">
              {!isDataUrl && (
                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                  <p className="text-xs text-slate-400 mb-2">Link do certificado:</p>
                  <p className="text-xs text-slate-300 break-all font-mono bg-slate-800 p-2 rounded border border-slate-600">
                    {url}
                  </p>
                </div>
              )}

              {isDataUrl && (
                <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700/50">
                  <p className="text-sm text-blue-300 text-center">
                    📥 Download automático iniciado!
                    <br />
                    <span className="text-xs text-blue-400">
                      Se não iniciar, clique no botão abaixo
                    </span>
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDownload}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 text-center shadow-lg hover:shadow-orange-500/50"
                >
                  {isDataUrl ? '📥 Baixar Certificado' : 'Visualizar Certificado'}
                </button>

                {!isDataUrl && (
                  <button
                    onClick={copyToClipboard}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 border border-slate-600"
                  >
                    {copied ? '✓ Link Copiado!' : 'Copiar Link'}
                  </button>
                )}

                <button
                  onClick={() => router.push('/')}
                  className="w-full bg-transparent hover:bg-slate-700/50 text-slate-300 font-semibold py-3 px-4 rounded-lg border border-slate-600 transition duration-200"
                >
                  ← Voltar ao Início
                </button>
              </div>

              <div className="text-center text-sm text-slate-500 mt-4 pt-4 border-t border-slate-700">
                <p>
                  {isDataUrl 
                    ? '💾 O certificado foi baixado automaticamente para seu dispositivo.'
                    : '💾 Salve este link! Você pode acessá-lo sempre que precisar.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-slate-500 text-sm">
              Sistema de Certificados - Grupo Vorp
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
