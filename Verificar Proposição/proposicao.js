/*
-------------------------------------------------------------------------------------------------- ERROS CONHECIDOS --------------------------------------------------------------------------------------------------
-> Negação não se torna um com o átomo, embora com algumas pequenas mudanças no codigo consiga renhecer átomos isolados com negação.
   Possível Solução: Ápos montar a subfunção fazer verificação no array original e subtituir com a negação ou criar um elemento no objeto para armazenar se existe ou não a negação.

-> Se houver mais de uma subfunção dentro dos mesmos parênteses ele não vai dividir como deveria tratando apenas como uma única subfunção.
   Possível Solução: Fazer verificação se o número de elementos dentro dos parênteses são pares os ímpares, caso sejão ímpares faz um split de acordo com o elemento do meio e faz uma chamada recursiva
   se for par fazer verificação no array original de onde estão os parênteses de dentro.

-> Não poder usar mesmos átomos
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-> Talvez alguma verificação não foi testada
-> Complexidade funcionando e se remover algumas verificações funciona com a negação
-> Subfunção funcionando mais ou menos
*/

// ~ -> Negação
// & -> Conjunção
// # -> Disjunção
// > -> Implicação
//                   0    1    2
const conectivos = ["&", "#", ">"];
let errors = 0;

// Verificar se existe no array
function verificarEstado(array, c) {
  if (array.indexOf(c) === -1) return false;
  else if (array.indexOf(c) > -1) return true;
}

// Verificar se é conectivo
function conectivoSub(caractere) {
  this.caractere = caractere;
  conectivos.indexOf(this.caractere) > -1 ? true : false;
}

// Monta a subfunção
function subfuncao(sub) {
  try {
    let caractereAux = sub.caractere;
    let arrayAux = [];
    let str = "";

    // Recursão que monta os subfunções pegando os caracteres armazenados no objeto
    // Verifica se é conectivo
    if (verificarEstado(conectivos, caractereAux)) {
      // Percorre o array
      arrayAux.push(caractereAux);
      // console.log('arrayAux     ' + arrayAux)
      str += subfuncao(sub.esquerda);
      // Adiciona o conectivo no meio dos átomos
      str += arrayAux.pop();
      str += subfuncao(sub.direita);
      // console.log('str if     ' + str)
    } else {
      // Adiciona se não for conectivo
      str += caractereAux;
      // console.log('str else     ' + str)
    }
    return str;
  } catch (error) {
    errors++;
  }
}

// Verificação da proposição
function verificarProposicao(proposicao) {
  const parenteses = ["(", ")"];

  // Verificação tamanho
  if (proposicao.length === 1) {
    for (let i = 0; i < proposicao.length; i++) {
      if (
        !verificarEstado(conectivos, proposicao.charAt(i)) &&
        !verificarEstado(parenteses, proposicao.charAt(i))
      )
        return `
        Proposição: ${proposicao}
        Complexidade: 1
        Subfunção: ${proposicao}
        `;
      else return "Proposição inválida!!";
    }
  }
  if (proposicao.length === 2) {
    for (let i = 0; i < proposicao.length; i++) {
      if (
        (proposicao.charAt(i) === "~" &&
          !verificarEstado(conectivos, proposicao.charAt(i + 1))) ||
        verificarEstado(parenteses, proposicao.charAt(i + 1))
      )
        return `
        Proposição: ${proposicao}
        Complexidade: 3
        Subfunção: ${proposicao}
        `;
      else return "Proposição inválida!!";
    }
  }

  // Verificando se são dois atomos em sequência
  for (let i = 0; i < proposicao.length; i++) {
    if (
      !verificarEstado(conectivos, proposicao.charAt(i)) &&
      !verificarEstado(parenteses, proposicao.charAt(i)) &&
      !verificarEstado(conectivos, proposicao.charAt(i + 1)) &&
      !verificarEstado(parenteses, proposicao.charAt(i + 1))
    )
      return "Átomos em sequência!!";
  }

  let arraySubfuncao = [];
  let arrayProposicional = [];
  let arrayAuxiliar = [];
  let complexidade = 0;
  let parenteseUm = 0;
  let parenteseDois = 0;
  let parenteseExiste = 0;

  // for para separar os caracteres
  for (let i = 0; i < proposicao.length; i++) {
    // Verifica os conectivos na proposição
    if (verificarEstado(conectivos, proposicao.charAt(i))) {
      // Adiciona no array de conectivos
      arrayAuxiliar.push(proposicao.charAt(i));
      complexidade++;
    }
    // Verifica se existe parenteses
    else if (verificarEstado(parenteses, proposicao.charAt(i))) {
      if (proposicao.charAt(i) === "(") {
        parenteseUm++;
        parenteseExiste++;
        // Adiciona no array de conectivos
        arrayAuxiliar.push(proposicao.charAt(i));
      } else if (proposicao.charAt(i) === ")") {
        parenteseDois++;
        parenteseExiste++;
        // Adiciona o conectivo na saida e remove do auxiliar
        arrayProposicional.push(arrayAuxiliar.pop());
        arrayAuxiliar.pop();
      }
    }
    // Verifica negação
    else if (proposicao.charAt(i) === "~" && proposicao.charAt(i + 1) === "(") {
      // Adiciona o átomo normal e a negação dele nas subfunções
      arraySubfuncao.push(proposicao[i + 1]);
      arraySubfuncao.push("~" + proposicao[i + 1]);
      arrayProposicional.push(proposicao.charAt(i));
      complexidade++;
    }
    // Adiciona átomos no array de proposição
    else {
      arrayProposicional.push(proposicao.charAt(i));
      // Verifica posição e adiciona átomo no array de subfunção
      if (
        verificarEstado(parenteses, proposicao.charAt(i - 1)) ||
        verificarEstado(parenteses, proposicao.charAt(i + 1))
      ) {
        arraySubfuncao.push(proposicao.charAt(i));
      }
      complexidade++;
    }
  }
  // Adiciona no array de proposição o ultimo elemento do auxiliar
  arrayProposicional.push(arrayAuxiliar.pop());

  // Verificação dos parenteses
  if ((parenteseUm + parenteseDois) % 2 !== 0)
    return "Número de parenteses incorreto!!";
  // Verificação de existência
  if (!parenteseExiste) return "Número de parenteses incorreto!!";
  // Verificando array de proposições
  for (let i = 0; i < arrayProposicional.length; i++) {
    if (arrayProposicional[i] === "(") return "Proposição inválida!!";
    if (arrayProposicional[i] === ")") return "Proposição inválida!!";
  }

  let arraySubConectivos = [];
  // Identificar conectivos das subfunções -> Vai até o penultimo elemento
  for (let i = 0; i <= arrayProposicional.length - 1; i++) {
    // Instancia objeto - conectivo
    let aux = new conectivoSub(arrayProposicional[i]);

    // Pega os átomos que estão dos lados de um conectivo
    if (conectivos.indexOf(arrayProposicional[i]) > -1) {
      aux.direita = arraySubConectivos.pop();
      aux.esquerda = arraySubConectivos.pop();
    }
    // Adiciona o objeto no array
    arraySubConectivos.push(aux);
  }

  // Variaveis que pegam as subfunções do lado esquerdo e direito
  let ladoEsquerdo = arraySubConectivos[0].esquerda;
  let ladoDireito = arraySubConectivos[0].direita;

  // Monta as subfunções
  arraySubfuncao.push(subfuncao(ladoEsquerdo));
  arraySubfuncao.push(subfuncao(ladoDireito));

  if (!errors == 0) return "Proposição inválida!!";

  // Remover repetidos
  let resultadoSubfuncao = arraySubfuncao.filter(
    (el, i) => arraySubfuncao.indexOf(el) === i
  );

  return `
    Proposição: ${proposicao}
    Complexidade: ${complexidade}
    Subfunção: ${resultadoSubfuncao}
  `;
}

console.log(verificarProposicao("(p>q)&(r>s)"));
