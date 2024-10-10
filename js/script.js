window.addEventListener('DOMContentLoaded', carregarTarefas);
window.addEventListener("load", verificaCheckbox);
document.getElementById("add").addEventListener("click", addItem);
document.getElementById("entrada").addEventListener("keypress", addItem);
document.getElementById("btnToggle").addEventListener("click", toggleMenu);

let checkbox = document.querySelectorAll(".check");

function scaneaCheckbox(check, checkbox) {
    for (var i = 0; i < checkbox.length; i++) {
        if (checkbox[i].id !== check.id) {
            checkbox[i].checked = false;
        }
    }
}

function encontraCor(checkbox) {
    var cor;

    for (var i = 0; i < checkbox.length; i++) {
        if (checkbox[i].checked) {
            cor = checkbox[i].id;
        }
    }

    return cor;
}

function verificaCheckbox() {
    for (var i = 0; i < checkbox.length; i++) {
        checkbox[i].addEventListener("click", function () {
            scaneaCheckbox(this, checkbox);
        });
    }
}

function toggleMenu() {
    var menu = document.getElementById("menus");
    var addTarefa = document.getElementById("toggleAdd");

    if (addTarefa.style.display === "block") {
        addTarefa.style.display = "none";
    } else {
        menu.style.display = "block";
        addTarefa.style.display = "none";
    }
}

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
        if (!tarefa.enviada) {
            document.getElementById("lista-a-fazer").appendChild(criaItem(tarefa.desc, tarefa.cor, tarefa.concluida, tarefa.enviada));
        }
    });
}

function excluirItem(evt) {
    evt.target.parentNode.remove();
    let tarefas = getTarefasLocalStorage();
    let index = tarefas.findIndex((elem) =>
        elem.desc === evt.target.parentNode.childNodes[1].textContent
    );
    tarefas.splice(index, 1);
    setTarefasLocalStorage(tarefas);

    atualizarStatus(getTarefasConcluidas().length, tarefas.length);
}

function concluirTarefa(pTexto) {
    const completeSound = document.querySelector("#completeOrNo-sound")
    let tarefas = getTarefasLocalStorage();
    let index = tarefas.findIndex((elem) =>
        elem.desc === pTexto.textContent
    );
    tarefas[index].concluida = true;
    setTarefasLocalStorage(tarefas);

    const cloneComplete = completeSound.cloneNode()
    cloneComplete.play()
}

function naoConcluir(pTexto) {
    const notCompleteSound = document.querySelector("#completeOrNo-sound")
    let tarefas = getTarefasLocalStorage();
    let index = tarefas.findIndex((elem) =>
        elem.desc === pTexto.textContent
    );
    tarefas[index].concluida = false;
    setTarefasLocalStorage(tarefas);

    const cloneNotComplete = notCompleteSound.cloneNode()
    cloneNotComplete.play()
}

function enviar(pTexto) {
    let tarefas = getTarefasLocalStorage();
    let index = tarefas.findIndex((elem) =>
        elem.desc === pTexto.textContent
    );
    tarefas[index].enviada = true;
    setTarefasLocalStorage(tarefas);
}

function criaItem(textoItem, cor, concluida) {
    let check = document.createElement('img');
    let item = document.createElement('li');
    let divCheck = document.createElement('div');
    let naoConcluida = document.createElement('p');
    let pTexto = document.createElement('p');
    let img = document.createElement('img');
    const arquivandoSound = document.querySelector('#arquive-sound');

    item.setAttribute('class', cor);

    check.setAttribute('src', './assets/unchecked.png');
    check.setAttribute('class', 'img-check');

    divCheck.setAttribute('id', textoItem.trim());
    divCheck.setAttribute('class', 'div-check');

    img.setAttribute('src', './assets/archive-gray-scale.png');
    img.setAttribute('class', 'img-enviar');

    pTexto.setAttribute('id', 'pTexto');
    pTexto.setAttribute('class', 'texto-card');

    if (concluida) {
        check.setAttribute('src', './assets/checked.png');
        pTexto.setAttribute('id', 'texto-linha');
        divCheck.style.backgroundColor = "#b8ff99";
        divCheck.style.color = " #2b5a07";
        naoConcluida.setAttribute('id', 'naoConcluida');
        naoConcluida.append("Concluída");
        img.setAttribute('src', './assets/archive-color.png');
    } else {
        divCheck.style.backgroundColor = "#ffa4a3";
        divCheck.style.color = " #e42c28";
        naoConcluida.setAttribute('id', 'naoConcluida');
        naoConcluida.append("Não Concluída");
        img.setAttribute('src', './assets/archive-gray-scale.png');
    }

    check.addEventListener('click', function () {
        if (check.getAttribute('src') === './assets/unchecked.png') {
            check.setAttribute('src', './assets/checked.png');
            pTexto.setAttribute('id', 'texto-linha');
            divCheck.style.backgroundColor = "#b8ff99";
            divCheck.style.color = " #2b5a07";
            naoConcluida.innerHTML = "Concluída";
            img.setAttribute('src', './assets/archive-color.png');
            concluirTarefa(pTexto);
        } else {
            check.setAttribute('src', './assets/unchecked.png');
            pTexto.setAttribute('id', 'pTexto');
            divCheck.style.backgroundColor = "#ffa4a3";
            divCheck.style.color = " #e42c28";
            naoConcluida.innerHTML = "Não Concluída";
            img.setAttribute('src', './assets/archive-gray-scale.png');
            naoConcluir(pTexto);
        }
    });

    img.addEventListener('click', function () {
        if (check.getAttribute('src') === './assets/checked.png') {
            item.style.display = "none";
            enviar(pTexto);
            
            const cloneArquiveSound = arquivandoSound.cloneNode()
            cloneArquiveSound.play()
        }
    });

    pTexto.append(textoItem);

    divCheck.append(check, naoConcluida);
    item.append(divCheck, pTexto, img);

    return item;
}

function resetInput(input) {
    input.value = "";
    input.focus();
}

function resetCor() {
    checkbox.forEach((check) => {
        if (check.checked) {
            check.checked = false;
        }
    });
}

function itemJaExiste(texto, lista) {
    const itens = Array.from(lista.childNodes);
    return itens.map((item) => {
        return item.childNodes[1].textContent;
    }).includes(texto);
    
}

function addItem(evt) {
    const input = document.getElementById("entrada");
    const completionSound = document.getElementById("completion-sound");
    const stopSound = document.getElementById("stop-sound")
    let tarefas;
    let cor = encontraCor(checkbox);
    let listaFazer = document.getElementById("lista-a-fazer");

    if ((evt.keyCode === 13 && evt.key === "Enter")
        || evt.target.type === "submit") {

        if (input.value.trim() === "") {
            showEmpty();
            stopSound.play()
        } else if (!cor) {
            showCor();
            resetCor();
            stopSound.play()
        } else {
            var objetos = JSON.parse(localStorage.getItem("tarefas")) || [];

            var objetoEncontrado = objetos.find(function (objeto) {
                return objeto.desc === input.value.trim();
            });

            if (objetoEncontrado) {
                showExist()
                resetInput(input);
                resetCor();
                stopSound.play()
            } else {
                listaFazer.appendChild(criaItem(input.value, cor, false, false));

                tarefas = getTarefasLocalStorage();
                tarefas.push({ desc: input.value, concluida: false, cor: cor, enviada: false });
                setTarefasLocalStorage(tarefas);

                resetInput(input);
                resetCor();
                completionSound.play();
            }
        }
    }
}

var modalNoEmpty = document.getElementById("modalNoEmpty");

function closeEmpty() {
    modalNoEmpty.style.display = 'none';

}
function showEmpty() {
    modalNoEmpty.style.display = "block";
}

var modalExist = document.getElementById("modalExist");

function closeExist() {
    modalExist.style.display = 'none';
}

function showExist() {
    modalExist.style.display = "block";
}

var modalCor = document.getElementById("modalCor");

function closeCor() {
    modalCor.style.display = 'none';
}

function showCor() {
    modalCor.style.display = "block";
}