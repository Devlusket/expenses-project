// import type { NextApiRequest, NextApiResponse } from 'next';
// import fs from 'fs';
// import path from 'path';
// import { Despesa } from '@/types/Despesa'; // Certifique-se de que o caminho está correto

// const filePath = path.join(process.cwd(), 'data', 'despesas.json');

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     if (req.method === 'GET') {
//       const data = await fs.promises.readFile(filePath, 'utf-8');
//       return res.status(200).json(JSON.parse(data));
//     }

//     if (req.method === 'POST') {
//       const newDespesa: Despesa = req.body;
//       const data = await fs.promises.readFile(filePath, 'utf-8');
//       const despesas: Despesa[] = JSON.parse(data);
      
//       // Geração de ID (como string se necessário)
//       const novoId = Date.now().toString();
//       const novaDespesaComId: Despesa = {
//         ...newDespesa,
//         id: novoId,
//       };

//       despesas.push(novaDespesaComId);
//       await fs.promises.writeFile(filePath, JSON.stringify(despesas, null, 2));

//       return res.status(201).json({ message: 'Despesa adicionada com sucesso!' });
//     }

//     if (req.method === 'PUT') {
//       const updatedDespesas: Despesa[] = req.body;
//       await fs.promises.writeFile(filePath, JSON.stringify(updatedDespesas, null, 2));
//       return res.status(200).json({ message: 'Despesas atualizadas com sucesso!' });
//     }

//     if (req.method === 'DELETE') {
//       const { idsToDelete }: { idsToDelete: string[] } = req.body;
//       const data = await fs.promises.readFile(filePath, 'utf-8');
//       let despesas: Despesa[] = JSON.parse(data);

//       despesas = despesas.filter(despesa => !idsToDelete.includes(despesa.id));
//       await fs.promises.writeFile(filePath, JSON.stringify(despesas, null, 2));

//       return res.status(200).json({ message: 'Despesas deletadas com sucesso!' });
//     }

//     return res.status(405).json({ message: 'Método não permitido' });
//   } catch (error) {
//     console.error('Erro ao manipular despesas:', error);
//     return res.status(500).json({ message: 'Erro ao acessar as despesas.' });
//   }
// }


// console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
// console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY);


// import type { NextApiRequest, NextApiResponse } from 'next';
// import { createClient } from '@supabase/supabase-js';

// const supabase = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_ANON_KEY!
// );

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === 'GET') {
//     const { data, error } = await supabase
//       .from('despesas')
//       .select('*')
//       .order('data', { ascending: false });

//     if (error) {
//       return res.status(500).json({ error: error.message });
//     }

//     return res.status(200).json(data);
//   }

//   if (req.method === 'POST') {
//     const novaDespesa = req.body;

//     const { data, error } = await supabase
//       .from('despesas')
//       .insert([novaDespesa]);

//     if (error) {
//       return res.status(500).json({ error: error.message });
//     }

//     return res.status(201).json(data);
//   }

//   if (req.method === 'PUT') {
//     const despesasAtualizadas = req.body;

//     const updates = despesasAtualizadas.map((d: any) =>
//       supabase.from('despesas').update({ pago: d.pago }).eq('id', d.id)
//     );

//     const results = await Promise.all(updates);

//     const erro = results.find(r => r.error);
//     if (erro) {
//       return res.status(500).json({ error: erro.error.message });
//     }

//     return res.status(200).json({ message: 'Despesas atualizadas com sucesso' });
//   }

//   if (req.method === 'DELETE') {
//     const { idsParaDeletar } = req.body;

//     const { error } = await supabase
//       .from('despesas')
//       .delete()
//       .in('id', idsParaDeletar);

//     if (error) {
//       return res.status(500).json({ error: error.message });
//     }

//     return res.status(200).json({ message: 'Despesas deletadas com sucesso' });
//   }

//   return res.status(405).json({ error: 'Método não permitido' });
// }


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
//       const despesasAtualizadas = req.body;

//       if (!Array.isArray(despesasAtualizadas)) {
//         return res.status(400).json({ error: 'Formato inválido para atualização.' });
//       }

//       const updates = despesasAtualizadas.map((d: any) =>
//         supabase.from('despesas').update({ pago: d.pago }).eq('id', d.id)
//       );

//       const results = await Promise.all(updates);

//       // const erro = results.find(r => r.error);
//       // if (erro) {
//       //   return res.status(500).json({ error: erro.error.message });
//       // }


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





import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

function validarData(data: string): boolean {
  // Verifica formato YYYY-MM-DD simples
  return /^\d{4}-\d{2}-\d{2}$/.test(data);
}

type DespesaParaAtualizar = {
  id: string;
  pago: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('despesas')
        .select('*')
        .order('data', { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { descricao, valor, pago, data } = req.body;

      if (
        !descricao ||
        typeof descricao !== 'string' ||
        !valor ||
        typeof valor !== 'number' ||
        typeof pago !== 'boolean' ||
        !data ||
        typeof data !== 'string' ||
        !validarData(data)
      ) {
        return res.status(400).json({ error: 'Dados inválidos na requisição.' });
      }

      const { data: insertedData, error } = await supabase
        .from('despesas')
        .insert([{ descricao, valor, pago, data }]);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json(insertedData);
    }

    if (req.method === 'PUT') {
      const despesasAtualizadas = req.body as DespesaParaAtualizar[];

      if (!Array.isArray(despesasAtualizadas)) {
        return res.status(400).json({ error: 'Formato inválido para atualização.' });
      }

      const updates = despesasAtualizadas.map((d) =>
        supabase.from('despesas').update({ pago: d.pago }).eq('id', d.id)
      );

      const results = await Promise.all(updates);

      const erroResposta = results.find(r => r.error);
      if (erroResposta) {
        return res.status(500).json({ error: erroResposta.error?.message ?? 'Erro desconhecido' });
      }

      return res.status(200).json({ message: 'Despesas atualizadas com sucesso' });
    }

    if (req.method === 'DELETE') {
      const { idsParaDeletar } = req.body;

      if (!Array.isArray(idsParaDeletar)) {
        return res.status(400).json({ error: 'Formato inválido para deletar.' });
      }

      const { error } = await supabase
        .from('despesas')
        .delete()
        .in('id', idsParaDeletar);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ message: 'Despesas deletadas com sucesso' });
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    console.error('Erro na API de despesas:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
}
