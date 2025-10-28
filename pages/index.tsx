import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Home() {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [needsName, setNeedsName] = useState(false)
  const [fullName, setFullName] = useState('')
  const [participant, setParticipant] = useState<any>(null)
  const [autoSearched, setAutoSearched] = useState(false)

  // Busca automática quando há parâmetro 'cod' na URL
  useEffect(() => {
    if (router.isReady && router.query.cod && !autoSearched) {
      const codigo = router.query.cod as string
      setSearchValue(codigo)
      setAutoSearched(true)
      performSearch(codigo)
    }
  }, [router.isReady, router.query.cod, autoSearched])

  const performSearch = async (searchTerm: string) => {
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/buscar-participante', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchValue: searchTerm }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Participante não encontrado')
        setLoading(false)
        return
      }

      setParticipant(data)

      // Verifica se o nome completo está preenchido
      if (!data['nome participante'] || data['nome participante'].trim() === '') {
        setNeedsName(true)
      } else {
        // Se tem nome, gerar certificado automaticamente
        await generateCertificate(data['nome participante'], data)
      }
    } catch (err) {
      setError('Erro ao buscar participante')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    await performSearch(searchValue)
  }

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim()) {
      setError('Por favor, digite seu nome completo')
      return
    }

    await generateCertificate(fullName, participant)
  }

  const generateCertificate = async (name: string, participantData: any) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/gerar-certificado', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: name,
          email: participantData['email participante'],
          telefone: participantData['telefone participante'],
          codigo: participantData['código'],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao gerar certificado')
        setLoading(false)
        return
      }

      // Exibir sucesso e link do certificado
      window.location.href = `/sucesso?url=${encodeURIComponent(data.url)}&nome=${encodeURIComponent(name)}`
    } catch (err) {
      setError('Erro ao gerar certificado')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSearchValue('')
    setFullName('')
    setNeedsName(false)
    setParticipant(null)
    setError('')
  }

  return (
    <>
      <Head>
        <title>Certificados - Sales Experience</title>
        <meta name="description" content="Gere seu certificado do evento" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Sistema de Certificados
            </h1>
            <p className="text-slate-400 text-lg">Sales Experience - Teresina</p>
          </div>

          {/* Card principal */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-700">
            {!needsName ? (
              <form onSubmit={handleSearch} className="space-y-6">
                <div>
                  <label
                    htmlFor="search"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Digite seu código, e-mail ou telefone
                  </label>
                  <input
                    type="text"
                    id="search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                    placeholder="Ex: etkt_WUCopX8eSuanhenMJoZk"
                    required
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-orange-500/50"
                >
                  {loading ? 'Buscando...' : 'Buscar Certificado'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleNameSubmit} className="space-y-6">
                <div className="bg-blue-900/30 border border-blue-500 text-blue-200 px-4 py-3 rounded-lg mb-4">
                  <p className="font-medium">Participante encontrado!</p>
                  <p className="text-sm mt-1">
                    Para gerar seu certificado, precisamos que você digite seu
                    nome completo.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                    placeholder="Digite seu nome completo"
                    required
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 border border-slate-600"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-orange-500/50"
                  >
                    {loading ? 'Gerando...' : 'Gerar Certificado'}
                  </button>
                </div>
              </form>
            )}
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
