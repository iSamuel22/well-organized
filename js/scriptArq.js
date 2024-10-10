window.addEventListener('DOMContentLoaded', carregarTarefas);

function getTarefasLocalStorage() {
    return JSON.parse(localStorage.getItem('tarefas')) || [];
}

function setTarefasLocalStorage(tarefas) {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function getTarefasConcluidas() {
    return getTarefasLocalStorage().filter((tarefa) => {
        return tarefa.concluida == true;
    });
}

function carregarTarefas() {
    let tarefas = getTarefasLocalStorage();
    tarefas.forEach((tarefa) => {
        if (tarefa.enviada) {
            document.getElementById("lista-concluidas").appendChild(criaItem(tarefa.desc, tarefa.cor, tarefa.concluida));
        }
    });
}

function excluirItem(pTexto) {
    let tarefas = getTarefasLocalStorage();
    let index = tarefas.findIndex((elem) =>
        elem.desc === pTexto.textContent
    );
    tarefas.splice(index, 1);
    setTarefasLocalStorage(tarefas);
}

function criaItem(textoItem, cor) {
    let item = document.createElement('li');
    let divCheck = document.createElement('div');
    let naoConcluida = document.createElement('p');
    let pTexto = document.createElement('p');
    let img = document.createElement('img');
    let imgCheck = document.createElement('img');
    const trashSound = document.querySelector('#trash-sound')

    imgCheck.src = "./assets/checked.png";
    imgCheck.setAttribute('class', 'img-check');

    item.setAttribute('class', cor);

    divCheck.id = textoItem.trim();
    divCheck.class = 'div-check';

    img.setAttribute('src', './assets/trash-color.png');
    img.setAttribute('class', 'img-enviar');

    pTexto.setAttribute('id', 'texto-linha');
    pTexto.setAttribute('class', 'texto-card');

    divCheck.style.backgroundColor = "#b8ff99";
    divCheck.style.color = " #2b5a07";
    naoConcluida.setAttribute('id', 'naoConcluida');
    naoConcluida.append("Concluída");
    img.setAttribute('src', './assets/trash-color.png');

    img.addEventListener('click', function () {
        if (imgCheck.getAttribute('src') === './assets/checked.png') {
            item.style.display = "none";
            excluirItem(pTexto);

            // Clone para reproduzir o som na mesma velocidade da exclusão
            const cloneSound = trashSound.cloneNode();
            cloneSound.play();
        }
    })

    pTexto.append(textoItem);

    divCheck.append(imgCheck, naoConcluida);
    item.append(divCheck, pTexto, img);

    return item;
}
