import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { Despesa } from '@/types/Despesa'; // Certifique-se de que o caminho está correto

const filePath = path.join(process.cwd(), 'data', 'despesas.json');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      const data = await fs.promises.readFile(filePath, 'utf-8');
      return res.status(200).json(JSON.parse(data));
    }

    if (req.method === 'POST') {
      const newDespesa: Despesa = req.body;
      const data = await fs.promises.readFile(filePath, 'utf-8');
      const despesas: Despesa[] = JSON.parse(data);
      
      // Geração de ID (como string se necessário)
      const novoId = Date.now().toString();
      const novaDespesaComId: Despesa = {
        ...newDespesa,
        id: novoId,
      };

      despesas.push(novaDespesaComId);
      await fs.promises.writeFile(filePath, JSON.stringify(despesas, null, 2));

      return res.status(201).json({ message: 'Despesa adicionada com sucesso!' });
    }

    if (req.method === 'PUT') {
      const updatedDespesas: Despesa[] = req.body;
      await fs.promises.writeFile(filePath, JSON.stringify(updatedDespesas, null, 2));
      return res.status(200).json({ message: 'Despesas atualizadas com sucesso!' });
    }

    if (req.method === 'DELETE') {
      const { idsToDelete }: { idsToDelete: string[] } = req.body;
      const data = await fs.promises.readFile(filePath, 'utf-8');
      let despesas: Despesa[] = JSON.parse(data);

      despesas = despesas.filter(despesa => !idsToDelete.includes(despesa.id));
      await fs.promises.writeFile(filePath, JSON.stringify(despesas, null, 2));

      return res.status(200).json({ message: 'Despesas deletadas com sucesso!' });
    }

    return res.status(405).json({ message: 'Método não permitido' });
  } catch (error) {
    console.error('Erro ao manipular despesas:', error);
    return res.status(500).json({ message: 'Erro ao acessar as despesas.' });
  }
}
