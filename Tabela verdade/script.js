/*
-> Utilize o arquivo html - index.html

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Há algumas alterações em relação ao anterior mas o funcionamento é semelhante.
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/

// ~   -> Negação
// &   -> Conjunção
// #   -> Disjunção
// >   -> Implicação
// <-> -> Equivalência
//
const conectivos = ["~", "&", "#", ">", "<->"];

// Regras dos conectivos calculados recebendo valores booleanos
function regras(var1, var2, sinal) {
  switch (sinal) {
    case "&":
      return var1 && var2;
    case "#":
      return var1 || var2;
    case "~":
      return !var1;
    case ">":
      return !var1 || var2;
  }
}

// Expressão com Regex
function regex(proposicao) {
  return proposicao
    .split(
      /(\s*\~\s*|\s*\&\s*|\s*\#\s*|\s*\>\s*|\s*\<->\s*|\s*\(\s*|\s*\)\s*|)/g
    )
    .filter((e) => e.length);
}

// Remove elementos repetidos, conectivos e parenteses
function remover(array) {
  return array
    .filter(
      (value) =>
        value !== "(" && value !== ")" && conectivos.indexOf(value) === -1
    )
    .filter((value, index, a) => a.indexOf(value, index + 1) === -1);
}

// Responsável por gerar um array apenas com átomos e conectivos, similar a primeira parte do algortimo anterios mas nesse verifica caracteres por vez já que está quebrado.
function separarProposicao(proposicao) {
  let arrayAuxiliar = [];
  let arrayProposicional = [];

  for (let i of proposicao) {
    i.trim();
    if (i.length === 0) {
    } else if (i === "(") {
      arrayAuxiliar.push(i);
    } else if (i === ")") {
      while (
        arrayAuxiliar.length &&
        arrayAuxiliar[arrayAuxiliar.length - 1] !== "("
      ) {
        arrayProposicional.push(arrayAuxiliar.pop());
      }
      if (arrayAuxiliar.length) {
        arrayAuxiliar.pop();
      } else {
        arrayProposicional.push(")");
      }
    } else if (i === "~") {
      arrayAuxiliar.push(i);
    } else if (i === "&") {
      while (
        arrayAuxiliar.length &&
        arrayAuxiliar[arrayAuxiliar.length - 1] !== "(" &&
        conectivos.indexOf(arrayAuxiliar[arrayAuxiliar.length - 1]) < 2
      ) {
        arrayProposicional.push(arrayAuxiliar.pop());
      }
      arrayAuxiliar.push(i);
    } else if (i === "#") {
      while (
        arrayAuxiliar.length &&
        arrayAuxiliar[arrayAuxiliar.length - 1] !== "(" &&
        conectivos.indexOf(arrayAuxiliar[arrayAuxiliar.length - 1]) < 3
      ) {
        arrayProposicional.push(arrayAuxiliar.pop());
      }
      arrayAuxiliar.push(i);
    } else if (i === ">") {
      while (
        arrayAuxiliar.length &&
        arrayAuxiliar[arrayAuxiliar.length - 1] !== "(" &&
        conectivos.indexOf(arrayAuxiliar[arrayAuxiliar.length - 1]) < 4
      ) {
        arrayProposicional.push(arrayAuxiliar.pop());
      }
      arrayAuxiliar.push(i);
    } else if (arrayAuxiliar.length === 0) {
      arrayAuxiliar.push(i);
    } else if (i) {
      arrayProposicional.push(i);
    }
    // console.log("aux: " + arrayAuxiliar);
    // console.log("prop: " + arrayProposicional);
  }
  arrayProposicional.push(arrayAuxiliar.pop());

  return arrayProposicional;
}

// Responsável por dividir correntamente utilizando parenteses
function colocandoParenteses(prop) {
  let array = [];
  let str;

  for (let i of prop) {
    if (conectivos.indexOf(i) !== -1) {
      if (i === "~") {
        str = "(~" + array.pop() + ")";
      } else {
        const temp2 = array.pop();
        const temp1 = array.pop();
        str = "(" + temp1 + " " + i + " " + temp2 + ")";
        // console.log("str: " + str);
      }
      array.push(str);
    } else if (i !== "(" && i !== ")") {
      array.push(i);

      // console.log("array: " + array);
    }
  }

  return array.pop();
}

// Responsável por fazer os calculos dos valores em boolean utilizando as regras
function calcularBool(valoresBinario, array) {
  // Adiciona percorrendo o array com os atomos e conectivos
  // Se achar um conectivo faz o calculo com os atomos
  // Por fim retorna
  let arrayAuxiliar = [];
  for (let i of array) {
    // console.log(arrayAuxiliar);
    if (conectivos.indexOf(i) !== -1) {
      if (i === "~") {
        arrayAuxiliar.push(regras(arrayAuxiliar.pop(), false, i));
      } else {
        const temp1 = arrayAuxiliar.pop();
        const temp2 = arrayAuxiliar.pop();
        // console.log(i + ' ' + temp1 + ' ' + temp2);
        arrayAuxiliar.push(regras(temp2, temp1, i));
      }
    } else {
      arrayAuxiliar.push(valoresBinario[i]);
      // console.log(i + '     ' + valoresBinario[i]);
    }
  }
  return arrayAuxiliar.pop();
}

// Responsável por gerar tabela verdade
function gerarTabelaVerdade(arraySeparados, arrayComParenteses) {
  let tr = document.createElement("tr");
  const atomos = remover(arraySeparados);
  // console.log(atomos);

  // Coloca átomos na tabela
  for (let i of atomos) {
    let th = document.createElement("th");
    th.innerHTML = "<span>" + i + "</span>";
    tr.appendChild(th);
  }

  let th = document.createElement("th");
  th.innerHTML = "<span>" + arrayComParenteses + "</span>";
  tr.appendChild(th);
  tabelaVerdade.appendChild(tr);

  // Transformando em binario
  const tamanho = (2 ** atomos.length - 1).toString(2).length;
  // console.log((2 ** atomos.length - 1).toString(2).length);

  for (let i = 0; atomos.length && i < 2 ** atomos.length; i++) {
    let binario = "";
    for (let j = i.toString(2).length; j < tamanho; j++) {
      binario += "0";
    }

    binario += i.toString(2);

    // console.log(binario);

    let valoresBinario = {};
    for (let j = 0; j < binario.length; j++) {
      valoresBinario[atomos[j]] = binario[j] === "1" ? true : false;
      // console.log(valoresBinario[atomos[j]] + ' ' +  binario[j]);
    }
    // console.log(valoresBinario);

    // Criando elementos da tabela
    let tr = document.createElement("tr");
    for (let i in valoresBinario) {
      let td = document.createElement("td");
      const aux = valoresBinario[i] === true ? "F" : "V";
      if (aux === "V") {
        td.innerHTML = "<span style='color:green;'>" + aux + "</span>";
      } else {
        td.innerHTML = "<span style='color:red;'>" + aux + "</span>";
      }
      tr.appendChild(td);
    }
    // Chamada a função para calcular valores boolean e adicionar na tabela
    let td = document.createElement("td");
    if (calcularBool(valoresBinario, arraySeparados) === true) {
      td.innerHTML = "<span style='color:green;'>" + "V" + "</span>";
    } else {
      td.innerHTML = "<span style='color:red;'>" + "F" + "</span>";
    }

    tr.appendChild(td);
    tabelaVerdade.appendChild(tr);
  }
}

// Responsável por verificar consequencia logica, criado pra não interferir na de gerar tabela
function consequenciaLogica(arraySeparados, arrayComParenteses, tamanho) {
  const atomos = remover(arraySeparados);
  let array = [];

  let tr = document.createElement("tr");
  let th = document.createElement("th");
  th.innerHTML = "<span>" + arrayComParenteses + "</span>";
  tr.appendChild(th);
  tabelaVerdade.appendChild(tr);

  // ---------------------------------------
  // Transformando em binario
  for (let i = 0; i < 2 ** tamanho; i++) {
    let binario = "";
    for (let j = i.toString(2).length; j < tamanho; j++) {
      binario += "0";
    }

    binario += i.toString(2);

    let valoresBinario = {};
    for (let j = 0; j < binario.length; j++) {
      valoresBinario[atomos[j]] = binario[j] === "0" ? true : false;
    }

    let chamada = calcularBool(valoresBinario, arraySeparados);
    array.push(chamada);

    let td = document.createElement("td");
    if (calcularBool(valoresBinario, arraySeparados) === true) {
      td.innerHTML = "<span style='color:green;'>" + "V" + "</span>";
    } else {
      td.innerHTML = "<span style='color:red;'>" + "F" + "</span>";
    }

    tr.appendChild(td);
    tabelaVerdade.appendChild(tr);
  }
  // console.log(array)
  return array;
}

// --------------------------------------------------------------------------
let proposicaoInput = document.querySelector("#prop");
let btnTabela = document.querySelector("#btn-tabela");
let divTabela = document.querySelector("#tabela-verdade");
let tabelaVerdade = document.createElement("table");
let tabelaVerdade2 = document.createElement("table");
let array1 = [];
let array2 = [];

btnTabela.addEventListener("click", () => {
  tabelaVerdade.innerHTML = "";
  tabelaVerdade2.innerHTML = "";

  let proposicao = regex(proposicaoInput.value);

  // console.log(proposicao);

  if (proposicao.indexOf("<->") > -1) {
    let antes = [];
    let depois = [];
    for (let i = 0; i < proposicao.length; i++) {
      if (proposicao[i] === "<->") {
        antes = proposicao.slice(0, i);
        depois = proposicao.slice(i + 1, proposicao.length);
      }
    }

    let separadosAntes = separarProposicao(antes);
    let separadosDepois = separarProposicao(depois);

    let comParentesesAntes = colocandoParenteses(separadosAntes);
    let comParentesesDepois = colocandoParenteses(separadosDepois);

    const atomosMain = remover(proposicao);
    console.log(atomosMain);

    const tamanho = (2 ** atomosMain.length - 1).toString(2).length;
    
    divTabela.appendChild(tabelaVerdade);

    array1.push(
      consequenciaLogica(separadosAntes, comParentesesAntes, tamanho)
    );

    array2.push(
      consequenciaLogica(separadosDepois, comParentesesDepois, tamanho)
    );
  } else {
    let separados = separarProposicao(proposicao);
    console.log(separados);

    let comParenteses = colocandoParenteses(separados);
    console.log(comParenteses);

    divTabela.appendChild(tabelaVerdade);
    gerarTabelaVerdade(separados, comParenteses);
  }
});
