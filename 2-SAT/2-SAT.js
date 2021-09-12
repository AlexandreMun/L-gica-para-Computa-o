// LÓGICA PARA COMPUTAÇÃO
// TURMA: 10h-12h
// EQUIPE: José Alexandre Munis Nogueira - 473393
//         Jorge Luiz Araujo de Sousa - 476900
//         Luan de Lima Leandro - 412815
//
// Usamos a biblioteca de strongly connected components para calcular os componentes fortemente conexos

let SCC = require("strongly-connected-components");

function transformarClausula(x, n) {
  if (x < 0) return n + -1 - x;
  else return x - 1;
}

function negar(x, n) {
  if (x < n) return x + n;
  else return x - n;
}

function doisSat(n, clausulas) {
  let array = [];

  for (let i = 0; i < 2 * n; i++) {
    array[i] = [];
  }

  // Constroi o grafo direcionado para usar com o algoritmo de SCC
  for (let i = 0; i < clausulas.length; i++) {
    let clausula = clausulas[i];

    let a = transformarClausula(clausula[0], n);
    let b = transformarClausula(clausula[1], n);

    let negarA = negar(a, n);
    array[negarA].push(b);
    let negarB = negar(b, n);
    array[negarB].push(a);
  }

  // Usa biblioteca para calcular os componentes fortemente conexos
  let arraySCC = SCC(array).components;
  console.log(arraySCC);
  let arraySolucao = [];

  // Para cada componente fortemente conexo, verifica cada clausula
  for (let i = 0; i < arraySCC.length; i++) {
    let cc = arraySCC[i];
    let aux = 0;

    for (let j = 0; j < cc.length; j++) {
      let x = cc[j];

      if (arraySolucao[x] >= 0) {
        aux = arraySolucao[x];
      }

      // Atualiza componentes
      let negarX = negar(x, n);
      arraySolucao[negarX] = aux ^ 1;

      let e = aux ? array[x] : array[negarX];
      for (let k = 0; k < e.length; k++) {
        arraySolucao[e[k]] = 1;
      }
    }
  }

  arraySolucao.length = n;
  console.log(arraySolucao);
  if (arraySolucao.includes(1)) return "Satisfazível";
  else return "Não Satisfazível";
}

console.log(
  doisSat(4, [
    [1, 2],
    [-3, 4],
    [-1, -2],
  ])
);
