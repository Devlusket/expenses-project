
// import type { NextApiRequest, NextApiResponse } from 'next';
// import { createClient } from '@supabase/supabase-js';

// const supabase = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_ANON_KEY!
// );

// function validarData(data: string): boolean {
//   // Verifica formato YYYY-MM-DD simples
//   return /^\d{4}-\d{2}-\d{2}$/.test(data);
// }

// type DespesaParaAtualizar = {
//   id: string;
//   pago: boolean;
// };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     if (req.method === 'GET') {
//       const { data, error } = await supabase
//         .from('despesas')
//         .select('*')
//         .order('data', { ascending: false });

//       if (error) {
//         return res.status(500).json({ error: error.message });
//       }

//       return res.status(200).json(data);
//     }

//     if (req.method === 'POST') {
//       const { descricao, valor, pago, data } = req.body;

//       if (
//         !descricao ||
//         typeof descricao !== 'string' ||
//         !valor ||
//         typeof valor !== 'number' ||
//         typeof pago !== 'boolean' ||
//         !data ||
//         typeof data !== 'string' ||
//         !validarData(data)
//       ) {
//         return res.status(400).json({ error: 'Dados inválidos na requisição.' });
//       }

//       const { data: insertedData, error } = await supabase
//         .from('despesas')
//         .insert([{ descricao, valor, pago, data }]);

//       if (error) {
//         return res.status(500).json({ error: error.message });
//       }

//       return res.status(201).json(insertedData);
//     }

//     if (req.method === 'PUT') {
//       const despesasAtualizadas = req.body as DespesaParaAtualizar[];

//       if (!Array.isArray(despesasAtualizadas)) {
//         return res.status(400).json({ error: 'Formato inválido para atualização.' });
//       }

//       const updates = despesasAtualizadas.map((d) =>
//         supabase.from('despesas').update({ pago: d.pago }).eq('id', d.id)
//       );

//       const results = await Promise.all(updates);

//       const erroResposta = results.find(r => r.error);
//       if (erroResposta) {
//         return res.status(500).json({ error: erroResposta.error?.message ?? 'Erro desconhecido' });
//       }

//       return res.status(200).json({ message: 'Despesas atualizadas com sucesso' });
//     }

//     if (req.method === 'DELETE') {
//       const { idsParaDeletar } = req.body;

//       if (!Array.isArray(idsParaDeletar)) {
//         return res.status(400).json({ error: 'Formato inválido para deletar.' });
//       }

//       const { error } = await supabase
//         .from('despesas')
//         .delete()
//         .in('id', idsParaDeletar);

//       if (error) {
//         return res.status(500).json({ error: error.message });
//       }

//       return res.status(200).json({ message: 'Despesas deletadas com sucesso' });
//     }

//     return res.status(405).json({ error: 'Método não permitido' });
//   } catch (error) {
//     console.error('Erro na API de despesas:', error);
//     return res.status(500).json({ error: 'Erro interno no servidor.' });
//   }
// }


// pages/api/despesas.ts
// import type { NextApiRequest, NextApiResponse } from 'next';
// // import { PrismaClient } from '@prisma/client';
// import { PrismaClient } from '../../generated/prisma';


// const prisma = new PrismaClient();

// function validarData(data: string): boolean {
//   return /^\d{4}-\d{2}-\d{2}$/.test(data);
// }

// type DespesaParaAtualizar = {
//   id: string;
//   pago: boolean;
// };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     if (req.method === 'GET') {
//       const despesas = await prisma.despesa.findMany({
//         orderBy: { data: 'desc' }
//       });
//       return res.status(200).json(despesas);
//     }

//     if (req.method === 'POST') {
//       const { descricao, valor, pago, data } = req.body;

//       if (
//         !descricao || typeof descricao !== 'string' ||
//         !valor || typeof valor !== 'number' ||
//         typeof pago !== 'boolean' ||
//         !data || typeof data !== 'string' ||
//         !validarData(data)
//       ) {
//         return res.status(400).json({ error: 'Dados inválidos' });
//       }

//       const despesa = await prisma.despesa.create({
//         data: { descricao, valor, pago, data: new Date(data) }
//       });

//       return res.status(201).json(despesa);
//     }

//     if (req.method === 'PUT') {
//       const despesasAtualizadas = req.body as DespesaParaAtualizar[];
//       if (!Array.isArray(despesasAtualizadas)) {
//         return res.status(400).json({ error: 'Formato inválido' });
//       }

//       await Promise.all(
//         despesasAtualizadas.map((d) =>
//           prisma.despesa.update({
//             where: { id: d.id },
//             data: { pago: d.pago }
//           })
//         )
//       );

//       return res.status(200).json({ message: 'Despesas atualizadas com sucesso' });
//     }

//     if (req.method === 'DELETE') {
//       const { idsParaDeletar } = req.body;
//       if (!Array.isArray(idsParaDeletar)) {
//         return res.status(400).json({ error: 'Formato inválido' });
//       }

//       await prisma.despesa.deleteMany({
//         where: { id: { in: idsParaDeletar } }
//       });

//       return res.status(200).json({ message: 'Despesas deletadas com sucesso' });
//     }

//     return res.status(405).json({ error: 'Método não permitido' });
//   } catch (error) {
//     console.error('Erro na API:', error);
//     return res.status(500).json({ error: 'Erro interno no servidor.' });
//   }
// }


import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // use o caminho correto


function validarData(data: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(data);
}

type DespesaParaAtualizar = {
  id: string;
  pago: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const despesas = await prisma.despesas.findMany({
        orderBy: { data: 'desc' }
      });
      return res.status(200).json(despesas);
    }

    if (req.method === 'POST') {
      const { descricao, valor, pago, data } = req.body;

      if (!descricao || typeof descricao !== 'string' ||
          !valor || typeof valor !== 'number' ||
          typeof pago !== 'boolean' ||
          !data || typeof data !== 'string' ||
          !validarData(data)) {
        return res.status(400).json({ error: 'Dados inválidos' });
      }

      const despesa = await prisma.despesas.create({
        data: { descricao, valor, pago, data: new Date(data) }
      });

      return res.status(201).json(despesa);
    }

    if (req.method === 'PUT') {
      const despesasAtualizadas = req.body as DespesaParaAtualizar[];
      if (!Array.isArray(despesasAtualizadas)) {
        return res.status(400).json({ error: 'Formato inválido' });
      }

      await Promise.all(
        despesasAtualizadas.map(d =>
          prisma.despesas.update({
            where: { id: d.id },
            data: { pago: d.pago }
          })
        )
      );

      return res.status(200).json({ message: 'Despesas atualizadas com sucesso' });
    }

    if (req.method === 'DELETE') {
      const { idsParaDeletar } = req.body;
      if (!Array.isArray(idsParaDeletar)) {
        return res.status(400).json({ error: 'Formato inválido' });
      }

      await prisma.despesas.deleteMany({
        where: { id: { in: idsParaDeletar } }
      });

      return res.status(200).json({ message: 'Despesas deletadas com sucesso' });
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    console.error('Erro na API:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
}

