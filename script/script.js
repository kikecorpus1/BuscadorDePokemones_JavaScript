let idPokemon = 0

function buscarPersonaje(idPokemon1){

    const inputValor = document.getElementById("searchPokemon").value.trim().toLowerCase();
    const nombreUsar = idPokemon1 || inputValor || "1";

    const xhr = new XMLHttpRequest();
    const url = `https://pokeapi.co/api/v2/pokemon/${nombreUsar}`;
    console.log(url);

    xhr.open("GET",url,true);
    xhr.onreadystatechange = function (){

        if(xhr.readyState===4 && xhr.status === 200){

            try{

                const daticos = JSON.parse(xhr.responseText);

                let imgPokemon = daticos.sprites.other.showdown.front_default

                document.getElementById("imgPokemon").src = imgPokemon

                document.getElementById("idNombre").textContent =  daticos.id + " - " + daticos.name

                idPokemon= daticos.id;
            }

            catch(err){
                console.log(err.message); 
        }
    };

}

xhr.send();

 }

 document.getElementById("searchPokemon").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        buscarPersonaje();
    }
});

document.getElementById("next").addEventListener("click", function () {
    idPokemon++;
    buscarPersonaje(idPokemon);
    document.getElementById("searchPokemon").value = "";
});


document.getElementById("prev").addEventListener("click", function () {
    if (idPokemon > 1) {
        idPokemon--;
        buscarPersonaje(idPokemon);
        document.getElementById("searchPokemon").value = "";
    }
});


