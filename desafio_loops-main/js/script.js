const gameForm = document.querySelector('.form-1');
const gameList = document.getElementById('gameList');
let gameListArray = [];
let starSet = "";
let classSet = "";
let divId = 0;
isLoad = false; 

// Envio do formulário
gameForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('name').value;
    const descricao = document.getElementById('Ldescricao').value;
    const favorito = document.getElementById('favorito').value;
    
    // Condição para apenas ser aceita se os campos estiverem preenchidos
    if (nome && descricao) {

        const jogo = {
            nome,
            descricao,
            favorito,
        };

        isLoad = false;
        addElement(jogo);
        gameForm.reset();

        //Checa se a lista está vazia para mostrar a mensagem
        checkEmptyList();
    }
    console.log(gameListArray);
});

// Verifica se o jogo é favorito, se sim muda a classe e estrela
function addElement(jogo) {
    if (jogo.favorito == "Sim") {
        classSet = "jogo-container-fav";
        starSet = `<img id="img-estrela" src="img/star-outline-svgrepo-com 1.png" alt="estrela"></img>`;
    } else {
        classSet = "jogo-container";
        starSet = `<img id="img-estrela" src="img/estrela transparente.png" alt="estrela"></img>`;
    }
    adicionarJogo(jogo);
}

function adicionarJogo(jogo) {
    let row = document.createElement("div");

    row.innerHTML = `
    <div data-index="${divId}" id="gameDiv" class="${classSet}" >

    <div id="joystick">
        <img id="img-joystick" src="img/joystick-svgrepo-com 1.png" alt="joystick">
    </div>
    <div class="titulo">
        <h4 id="title-game">${jogo.nome}</h4>
        <div id="conteudo">
            <p>${jogo.descricao}</p>
        </div>
    </div>
    <div id="action">
        <div id="excluir" onclick="apagarJogo(this)">
           <img id="img-lixo" src="img/trash 1.png" alt="lixo">
        </div>
        <div id="estrela" onclick="setStar(this)">
          ${starSet}
        </div>
    </div>

</div>
        `;

    divId++;
    checkFav(jogo, row);

}

function apagarJogo(element) {
    // Pega o id da div pai
    let elementId = element.closest("#gameDiv");
    id = elementId.getAttribute("data-index");
    gameListArray.splice(id, 1);
    elementId.remove();

    divId--;

    // Respectivamente funções de: Atualizar o id das divs; Salvar a lista no localStorage; 
    // Checar se a lista está vazia para exibir a mensagem
    reloadGames();
    saveGameList();
    checkEmptyList();
}

function checkFav(jogo, element) {
    if (isLoad) {
        gameList.appendChild(element);
    } else {
        if (jogo.favorito == "Sim") {
            insertGameBefore(element, true)
            gameListArray.unshift(jogo);
        } else {
            insertGameBefore(element, false);
            gameListArray.push(jogo);
        }
        saveGameList();
    }
}

function setStar(element) {
    parentE = element.closest("#gameDiv");
    imgDiv = element.querySelector("img");
    id = parentE.getAttribute("data-index");

    if (parentE.classList.contains("jogo-container")) {
        parentE.classList.remove("jogo-container");
        parentE.classList.add("jogo-container-fav");
        imgDiv.src = "img/star-outline-svgrepo-com 1.png";
        gameListArray[id].favorito = "Sim";
        changeIdGame(id, true);
        insertGameBefore(parentE, true);
    } 
    else {
        parentE.classList.add("jogo-container");
        parentE.classList.remove("jogo-container-fav");
        imgDiv.src = "img/estrela transparente.png";
        gameListArray[id].favorito = "Não";
        changeIdGame(id, false);
        insertGameBefore(parentE, false);
    }
    saveGameList();
    console.log(gameListArray);
}

function insertGameBefore(element, condition) {
    if (condition) {
        element.remove();
        gameList.insertBefore(element, gameList.firstChild);
    } else {
        element.remove();
        gameList.appendChild(element);
    }
    reloadGames();

}

function changeIdGame(id, condition){
    if(condition){
        let objetoRemovido = gameListArray.splice(id, 1)[0];
        gameListArray.unshift(objetoRemovido);
    } else{
        let objetoRemovido = gameListArray.splice(id, 1)[0];
        gameListArray.push(objetoRemovido);
    }
}

function reloadGames() {
    const gameDivs = gameList.querySelectorAll("#gameDiv");
    let index = 0;
    gameDivs.forEach(element => {
        element.setAttribute("data-index", index);
        index++;
    });
}

// Persistência de dados

document.onload = loadPage();

function saveGameList() {
    // Salva no localStorage como do tipo json
    localStorage.setItem("gameList", JSON.stringify(gameListArray));
}

function loadPage() {
    addLoadedElements();
    checkEmptyList();
}

function addLoadedElements() {
    if (localStorage.length != 0) {
        isLoad = true;
        let itens = JSON.parse(localStorage.getItem("gameList"));
        console.log(itens);
        itens.forEach(element => {
            if (element.favorito == "Sim") {
                addElement(element);
                gameListArray.push(element);
            }
        });
        itens.forEach(element => {
            if (element.favorito == "Não") {
                addElement(element);
                gameListArray.push(element);
            }
        });

    }
}

function checkEmptyList() {
    const message = document.getElementById('emptyListMessage');
    if (gameListArray.length == 0) {
        message.style.display = "block";
    } else {
        message.style.display = "none";
    }
}