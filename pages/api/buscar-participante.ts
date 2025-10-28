import type { NextApiRequest, NextApiResponse } from 'next'
import { findParticipant } from '@/lib/participants'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const { searchValue } = req.body

  if (!searchValue) {
    return res.status(400).json({ error: 'Valor de busca não fornecido' })
  }

  const participant = findParticipant(searchValue)

  if (!participant) {
    return res.status(404).json({ error: 'Participante não encontrado' })
  }

  return res.status(200).json(participant)
}
