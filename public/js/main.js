console.log("This is Spotify clone")
var currSong = new Audio()
let pause = document.getElementById("cent")
let songs
let currfolder
async function getsong(folder) {
    currfolder = folder

    let aj = await fetch(`/${folder}/`)
    let response = await aj.text()
    let element = document.createElement("div")
    element.innerHTML = response

    let allies = element.getElementsByTagName("a")

    songs = []
    for (let i = 0; i < allies.length; i++) {
        const element = allies[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])// this splits things after /folder/ and before it it gives two things 1 i have selected 2nd

        }
    }



    let songUl = document.querySelector(".list-things").getElementsByTagName("ul")[0]
    songUl.innerHTML = ""
    for (const aSong of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li>
        <img src="svgs/music.svg" alt="🎵">
    <div class="info">
        <div>${aSong.replaceAll("%20", " ")}</div>
        <div>Spotify</div>
    </div>
    <div class="play leftside">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" id="play">
            <path fill="#000"
                d="M7 17.259V6.741a1 1 0 0 1 1.504-.864l9.015 5.26a1 1 0 0 1 0 1.727l-9.015 5.259A1 1 0 0 1 7 17.259Z">
            </path>
        </svg>
    </div>
    </li>`
    }
    // ATTACHING EVENT LISTENER TO EACH SONG
    Array.from(document.querySelector(".list-things").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    })
    return songs
}

function secondsToMinutesSeconds(seconds) {
    // Calculate minutes and seconds
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;

    // Format the result
    var formattedTime = minutes.toString().padStart(2, '0') + ':' + remainingSeconds.toString().padStart(2, '0');

    return formattedTime;
}



const playmusic = (track, pausea = false) => {

    currSong.src = `/${currfolder}/` + track
    if (!pausea) {
        currSong.play()
        pause.getElementsByTagName("img")[0].src = "svgs/pause.svg"
    }


    document.getElementById("barinfo").innerHTML = `<div class ="otherthanli">
        <img src="svgs/music.svg" alt="🎵">
    <div class="info">
        <div>${decodeURI(track)}</div>
        <div>Spotify</div>
    </div>
    </div>`
    document.getElementById("bartime").innerHTML = "00:00 / 00:00"
}

const displayalbums = async () => {
    let aj = await fetch(`/songs/`)
    let response = await aj.text()
    let element = document.createElement("div")
    element.innerHTML = response


    let aces = element.getElementsByTagName("a")
    let cardContainer = document.querySelector(".Cardcontainer")
    let arayass = Array.from(aces)
    for (let index = 0; index < arayass.length; index++) {
        const e = arayass[index];


        if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/songs/").slice(-1)

            // get metadata of every folder
            let aj = await fetch(`/songs/${folder}/info.json`)
            let response = await aj.json()
            // console.log(response)

            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">

    <div class="play">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" id="play">
            <path fill="#000"
                d="M7 17.259V6.741a1 1 0 0 1 1.504-.864l9.015 5.26a1 1 0 0 1 0 1.727l-9.015 5.259A1 1 0 0 1 7 17.259Z">
            </path>
        </svg>
    </div>
    <img src="/songs/${folder}/car.jpeg"
        alt="">

    <h4>${response.title}</h2>
        <p>${response.description}</p>
</div>`
        }
    }

    // load the playlist whenever the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(card => {
        card.addEventListener("click", async (item) => {
            songs = await getsong(`songs/${item.currentTarget.dataset.folder}`)
            // target se jis cheez pe click hua hai vo milega par currtarget se jisse target karva rahe hai use lenge
       playmusic(songs[0])
        })
    })
//      // return songs
}

async function main() {



    //Get the list of all songs
    await getsong("songs/ncs")
    playmusic(songs[0], true)
    // console.log(songs)



    //Play the first song
    // var audio = new Audio(songs[4])
    // audio.play()


    // audio.addEventListener(("loadeddata"), () => {
    //     console.log(audio.currentSrc, audio.duration)
    //     setInterval(() => {
    //         console.log(Math.round(audio.currentTime))
    //     }, 100000);
    // })

    // display all the songs to page

    displayalbums()


    // Attach an event listner to play pause and next and previous buttons
    pause.addEventListener("click", () => {
        if (currSong.paused) {
            currSong.play()
            pause.getElementsByTagName("img")[0].src = "svgs/pause.svg"
        } else {
            currSong.pause()
            pause.getElementsByTagName("img")[0].src = "svgs/play.svg"
        }
    })

    // time updater
    currSong.addEventListener("timeupdate", () => {
        if (secondsToMinutesSeconds(Math.round(currSong.duration)).endsWith("NaN")) {
            var min = "00:00"
        } else {
            var min = secondsToMinutesSeconds(Math.round(currSong.duration))
        }
        document.querySelector("#bartime").innerHTML = `${secondsToMinutesSeconds(Math.round(currSong.currentTime))} / ` + min
        document.querySelector(".chupatabra").style.width = `${(currSong.currentTime / currSong.duration) * 100}%`
    })

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        e.stopPropagation()
        let thatpercent = (e.offsetX / document.querySelector(".seekbar").offsetWidth) * 100
        document.querySelector(".chupatabra").style.width = thatpercent + "%"
        currSong.currentTime = ((currSong.duration) * thatpercent) / 100
    })

    // for hamburg buttoon
    document.querySelector(".hamburg").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0
    })

    // for close buttoon
    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = -110 + "%"
    })

    //addeventlistner for previous
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currSong.src.split("/").slice(-1)[0])
        // console.log(songs, index)

        if (index - 1 >= 0) {
            playmusic(songs[index - 1])
        }
    })


    //addeventlistner for next
    next.addEventListener("click", () => {
        let index = songs.indexOf(currSong.src.split("/").slice(-1)[0])
        // console.log(songs, index)

        if (index + 1 <= songs.length - 1) {
            playmusic(songs[index + 1])
        }
    })
   
    setInterval(() => {
       if (Math.round(currSong.currentTime)==Math.round(currSong.duration)) {
       let index = songs.indexOf(currSong.src.split("/").slice(-1)[0])
        // console.log(songs, index)

        if (index + 1 <= songs.length - 1) {
            playmusic(songs[index + 1])
        } 
    }
    }, 1000);
    
        
    
   
   

    // add an event to volume button
    document.querySelector("#volume").addEventListener("change", (r) => {
        console.log("setted volume to " + r.target.value)
        currSong.volume = r.target.value / 100
    })

    let button = document.querySelector("#mute")
    button.addEventListener("click", (e) => {
        // console.log(e.target.src)
        let bandsrc = e.target.src
        if (bandsrc == 'http://192.168.29.193:5500/svgs/volume.svg'){
            currSong.volume = 0
            e.target.src = "http://192.168.29.193:5500/svgs/mute.svg"
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        } else {
            currSong.volume = 1
            e.target.src = "svgs/volume.svg"
            document.querySelector(".range").getElementsByTagName("input")[0].value = 50
        }

    })

}

main()
// it makes 45.3453453453453 to 45.34
//  let number = 45.3453453453453
//  console.log(number.toFixed(2))
