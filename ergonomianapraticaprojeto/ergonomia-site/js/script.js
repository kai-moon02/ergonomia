// ============================================================
// Ergonomia na Prática – JavaScript básico
// Cada ferramenta só roda se o elemento existir na página.
// ============================================================

// 1) Menu no celular e submenu "Mais"
var botaoMenu = document.getElementById('btn-menu');
var menu = document.getElementById('menu');
botaoMenu.addEventListener('click', function () {
  var aberto = menu.classList.toggle('aberto');
  botaoMenu.setAttribute('aria-expanded', aberto);
});

var botaoMais = document.getElementById('btn-mais');
var submenu = document.getElementById('submenu');
botaoMais.addEventListener('click', function () {
  var aberto = submenu.classList.toggle('aberto');
  botaoMais.setAttribute('aria-expanded', aberto);
});

// 2) Perguntas frequentes
document.querySelectorAll('.faq-pergunta').forEach(function (pergunta) {
  pergunta.addEventListener('click', function () {
    var resposta = pergunta.nextElementSibling;
    var estavaFechada = resposta.hasAttribute('hidden');
    if (estavaFechada) { resposta.removeAttribute('hidden'); } else { resposta.setAttribute('hidden', ''); }
    pergunta.setAttribute('aria-expanded', estavaFechada);
  });
});

// 3) Ampliar qualquer figura ao clicar (Esc fecha)
document.querySelectorAll('.figura img').forEach(function (imagem) {
  imagem.addEventListener('click', function () {
    var fundo = document.createElement('div');
    fundo.className = 'zoom';
    fundo.innerHTML = '<img src="' + imagem.src + '" alt="' + imagem.alt + '">';
    fundo.addEventListener('click', function () { fundo.remove(); });
    document.body.appendChild(fundo);
  });
});
document.addEventListener('keydown', function (evento) {
  if (evento.key === 'Escape') {
    var aberto = document.querySelector('.zoom');
    if (aberto) { aberto.remove(); }
  }
});

// Função usada pelas ferramentas para mostrar cada resultado (azul = ok, vinho = ajustar)
function montarResultados(lista, destino, resumo) {
  var html = '';
  var certos = 0;
  lista.forEach(function (item) {
    if (item.ok) { certos = certos + 1; }
    html += '<li><span class="chip ' + (item.ok ? 'ok' : 'ajustar') + '">' + (item.ok ? '✔ Adequado' : '! Ajustar') + '</span><span><strong>' + item.nome + ':</strong> ' + item.texto + '</span></li>';
  });
  destino.innerHTML = '<ul>' + html + '</ul><p class="resultado">' + certos + ' de ' + lista.length + ' itens adequados. ' + resumo(certos, lista.length) + '</p>';
}
function resumoPadrao(certos, total) {
  if (certos === total) { return 'Tudo dentro da referência.'; }
  if (certos >= total / 2) { return 'Quase lá: corrija os itens marcados.'; }
  return 'Há bastante o que melhorar.';
}

// ------------------------------------------------------------
// ITEM 1 – Avaliação ambiental prática
// Entradas: lux, dB(A), temperatura, corrente de ar. Saída: status de cada fator.
// ------------------------------------------------------------
var formAmbiente = document.getElementById('form-ambiente');
if (formAmbiente) {
  formAmbiente.addEventListener('submit', function (e) {
    e.preventDefault();
    var lux = parseFloat(document.getElementById('lux').value);
    var ruido = parseFloat(document.getElementById('ruido').value);
    var temp = parseFloat(document.getElementById('temp').value);
    var vento = document.getElementById('vento').value;
    var saida = document.getElementById('saida-ambiente');

    if (isNaN(lux) || isNaN(ruido) || isNaN(temp)) {
      saida.innerHTML = '<p class="resultado">Preencha luminosidade, ruído e temperatura.</p>';
      return;
    }
    var lista = [
      { nome: 'Iluminação', ok: lux >= 500, texto: lux + ' lux. ' + (lux >= 500 ? 'Atinge a referência de 500 lux para escritório.' : 'Abaixo de 500 lux: aumente a luz sobre a tarefa.') },
      { nome: 'Ruído', ok: ruido <= 65, texto: ruido + ' dB(A). ' + (ruido <= 65 ? 'Dentro do limite geral de 65 dB(A).' : 'Acima de 65 dB(A): reduza a fonte ou isole o local.') },
      { nome: 'Temperatura', ok: temp >= 18 && temp <= 25, texto: temp + ' °C. ' + (temp >= 18 && temp <= 25 ? 'Dentro da faixa de 18 a 25 °C.' : 'Fora da faixa de 18 a 25 °C.') },
      { nome: 'Ventilação', ok: vento === 'nao', texto: vento === 'nao' ? 'Sem corrente de ar direta sobre a pessoa.' : 'Corrente de ar direta: mude a posição do posto ou do aparelho.' }
    ];
    montarResultados(lista, saida, resumoPadrao);
  });
}

// ------------------------------------------------------------
// ITEM 2 – Medição prática do posto (comparação com a referência)
// ------------------------------------------------------------
var formPosto = document.getElementById('form-posto');
if (formPosto) {
  formPosto.addEventListener('submit', function (e) {
    e.preventDefault();
    var assento = parseFloat(document.getElementById('assento').value);
    var distancia = parseFloat(document.getElementById('distancia').value);
    var cotovelo = parseFloat(document.getElementById('cotovelo').value);
    var tela = document.getElementById('tela').value;
    var pes = document.getElementById('pes').value;
    var saida = document.getElementById('saida-posto');

    if (isNaN(assento) || isNaN(distancia) || isNaN(cotovelo)) {
      saida.innerHTML = '<p class="resultado">Preencha as três medidas em número.</p>';
      return;
    }
    var lista = [
      { nome: 'Altura do assento', ok: assento >= 37 && assento <= 50, texto: assento + ' cm. Referência: 37 a 50 cm do piso (NR-17, Anexo II, 3.1 j IV).' },
      { nome: 'Distância da tela', ok: distancia >= 50 && distancia <= 70, texto: distancia + ' cm. Referência didática: 50 a 70 cm.' },
      { nome: 'Ângulo do cotovelo', ok: cotovelo >= 80 && cotovelo <= 100, texto: cotovelo + '°. Referência didática: perto de 90° (de 80° a 100°).' },
      { nome: 'Topo da tela', ok: tela !== 'acima', texto: tela === 'acima' ? 'Acima dos olhos: baixe a tela ou suba a cadeira.' : 'Na altura dos olhos ou abaixo.' },
      { nome: 'Pés', ok: pes === 'sim', texto: pes === 'sim' ? 'Apoiados no piso ou em apoio.' : 'Sem apoio: use apoio para os pés (NR-17, item 17.6.4).' }
    ];
    montarResultados(lista, saida, resumoPadrao);
  });
}

// Checklist do posto (conta os itens marcados)
var checklist = document.getElementById('checklist');
if (checklist) {
  var caixas = checklist.querySelectorAll('input[type="checkbox"]');
  var barra = document.getElementById('barra-progresso');
  var resultadoCheck = document.getElementById('resultado');
  function atualizarChecklist() {
    var marcados = 0;
    caixas.forEach(function (caixa) { if (caixa.checked) { marcados = marcados + 1; } });
    barra.style.width = (marcados / caixas.length) * 100 + '%';
    barra.classList.toggle('cheia', marcados === caixas.length);
    if (marcados === 0) { resultadoCheck.textContent = 'Marque os itens para ver o resultado.'; }
    else if (marcados <= 3) { resultadoCheck.textContent = marcados + ' de ' + caixas.length + ': há bastante espaço para melhorar.'; }
    else if (marcados <= 6) { resultadoCheck.textContent = marcados + ' de ' + caixas.length + ': você está no caminho certo.'; }
    else { resultadoCheck.textContent = marcados + ' de ' + caixas.length + ': ótimo, seu posto está bem ajustado.'; }
  }
  caixas.forEach(function (caixa) { caixa.addEventListener('change', atualizarChecklist); });
}

// ------------------------------------------------------------
// ITEM 3 – Timer Pomodoro (azul = foco, vinho = pausa)
// ------------------------------------------------------------
var timer = document.getElementById('timer');
if (timer) {
  var modos = { '25': [25, 5, 15], '50': [50, 10, 20], '90': [90, 20, 30] }; // foco, pausa, pausa longa (min)
  var dicas = ['Levante e caminhe um pouco.', 'Olhe para longe, pela janela.', 'Alongue punhos e pescoço.', 'Beba água.', 'Solte os ombros e respire fundo.'];
  var etapa = 'foco', rodada = 1, segundos = 0, intervalo = null;
  var elTempo = document.getElementById('tempo'), elEstado = document.getElementById('estado');
  var elDica = document.getElementById('dica'), elRodada = document.getElementById('rodada');
  var btnIniciar = document.getElementById('btn-iniciar'), selModo = document.getElementById('modo');

  function duracao() {
    var m = modos[selModo.value];
    if (etapa === 'foco') { return m[0] * 60; }
    return (etapa === 'longa' ? m[2] : m[1]) * 60;
  }
  function mostrar() {
    var min = Math.floor(segundos / 60), seg = segundos % 60;
    elTempo.textContent = (min < 10 ? '0' : '') + min + ':' + (seg < 10 ? '0' : '') + seg;
    elEstado.textContent = etapa === 'foco' ? 'Foco' : (etapa === 'longa' ? 'Pausa longa' : 'Pausa curta');
    timer.className = 'timer' + (etapa === 'foco' ? '' : (etapa === 'longa' ? ' longa' : ' pausa'));
    elDica.textContent = etapa === 'foco' ? 'Foque em uma tarefa só.' : dicas[rodada % dicas.length];
    elRodada.textContent = 'Rodada ' + rodada + ' de 4';
    document.title = elTempo.textContent + ' – ' + elEstado.textContent;
  }
  function proximaEtapa() {
    if (etapa === 'foco') { etapa = (rodada === 4) ? 'longa' : 'pausa'; }
    else { etapa = 'foco'; rodada = (etapa === 'foco' && rodada === 4) ? 1 : rodada + 1; }
    segundos = duracao();
    mostrar();
  }
  function passo() {
    segundos = segundos - 1;
    if (segundos <= 0) { proximaEtapa(); } else { mostrar(); }
  }
  function reiniciar() {
    clearInterval(intervalo); intervalo = null;
    etapa = 'foco'; rodada = 1; segundos = duracao();
    btnIniciar.textContent = 'Iniciar'; btnIniciar.classList.remove('ativo');
    mostrar();
  }
  btnIniciar.addEventListener('click', function () {
    if (intervalo === null) {
      intervalo = setInterval(passo, 1000);
      btnIniciar.textContent = 'Pausar';
    } else {
      clearInterval(intervalo); intervalo = null;
      btnIniciar.textContent = 'Continuar';
    }
  });
  document.getElementById('btn-reiniciar').addEventListener('click', reiniciar);
  selModo.addEventListener('change', reiniciar);
  reiniciar();
}

// ------------------------------------------------------------
// ITEM 3 – Rotina de pausas personalizada
// Entradas: horas, tipo de tarefa, cansaço (1 a 5). Saída: ritmo e total de pausas.
// ------------------------------------------------------------
var formRotina = document.getElementById('form-rotina');
if (formRotina) {
  formRotina.addEventListener('submit', function (e) {
    e.preventDefault();
    var horas = parseFloat(document.getElementById('horas').value);
    var tarefa = document.getElementById('tarefa').value;
    var cansaco = parseInt(document.getElementById('cansaco').value, 10);
    var saida = document.getElementById('saida-rotina');
    if (isNaN(horas) || horas <= 0 || horas > 12) {
      saida.innerHTML = '<p class="resultado">Informe as horas de trabalho (de 1 a 12).</p>';
      return;
    }
    var foco = 50, pausa = 10;
    if (cansaco >= 3) { foco = 25; pausa = 5; }
    if (cansaco >= 4) { pausa = 7; }
    var ciclos = Math.floor((horas * 60) / (foco + pausa));
    var totalPausa = ciclos * pausa;
    var extra = tarefa === 'tela' ? ' Como o trabalho é em tela, a cada 20 minutos olhe 20 segundos para algo distante (regra 20-20-20).' : ' Aproveite as pausas para trocar de postura.';
    saida.innerHTML = '<p class="resultado">Trabalhe ' + foco + ' min e pause ' + pausa + ' min.</p><p>Em ' + horas + ' h dá cerca de ' + ciclos + ' pausas, somando ' + totalPausa + ' min de descanso.' + extra + ' Saia do posto de trabalho durante a pausa.</p>';
  });
}
