import type { NextApiRequest, NextApiResponse } from 'next'
import { findParticipant } from '@/lib/participants'

type ErrorResponse = {
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { searchValue } = req.body

    if (!searchValue) {
      return res.status(400).json({ error: 'Valor de busca não fornecido' })
    }

    const participant = findParticipant(searchValue)

    if (!participant) {
      return res.status(404).json({ error: 'Participante não encontrado' })
    }

    return res.status(200).json(participant)
  } catch (error) {
    console.error('Erro ao buscar participante:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
