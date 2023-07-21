import axios from "axios";

const searchArtists = async (token,e) => {
    console.log(token,"Saasa")
    e.preventDefault()
    await axios.get("https://api.spotify.com/v1/search", {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            q: "KSI",
            type: "artist"
        }
    }).then(r=>console.log(r,"PLAY")).catch(err=>console.log(err,"Error"))
}


export {
    searchArtists,
}
