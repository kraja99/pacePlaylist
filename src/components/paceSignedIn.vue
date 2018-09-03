<template>
  <div>
    <h1>{{ msg }}</h1>
    <b-row  align-h="center">
      <b-col sm="auto">
        <label for="bpm">BPM:</label>
        <b-form-input v-model="bpm" type="number" name="bpm" placeholder="Playlist BPM" min="100"/>
      </b-col>
    </b-row>
    <br>
    <b-button v-on:click="onSubmit" v-bind:disabled="this.bpm == null || this.bpm < 120 || this.bpm > 220">Generate Playlist</b-button>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'paceSignedIn',
  data() {
    return {
      msg: 'Pace',
      songIds: [],
      newPlaylist: [],
      bpm: null,
      accessToken: null,
      userId: null,
    };
  },
  created() {
    this.signInSuccess();
    const thisUrl = window.location.href;
    let accessStart = 0;
    let accessEnd = 0;
    for (let i = 0; i < thisUrl.length; i += 1) {
      if (thisUrl.charAt(i) === '=') {
        accessStart = i + 1;
        break;
      }
    }
    for (let i = accessStart; i < thisUrl.length; i += 1) {
      if (thisUrl.charAt(i) === '&') {
        accessEnd = i;
        break;
      }
    }
    this.accessToken = thisUrl.substring(accessStart, accessEnd);
    // Get top 50 fav songs with tempos
    axios.get(`https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50`,
      { headers: {'Content-Type': 'application/json', 'Authorization' : 'Bearer ' + this.accessToken,},})
    .then((res) => {
      for (let i = 0; i < res.data.items.length; i += 1) {
        this.songIds.push({songId: res.data.items[i].id, songName: res.data.items[i].name, tempo: 0, uri: res.data.items[i].uri});
      }
      let idString = '';
      for (let i = 0; i < this.songIds.length; i += 1) {
        idString += this.songIds[i].songId + ',';
      }
      idString = idString.substring(0, idString.length - 1);
      axios.get(`https://api.spotify.com/v1/audio-features?ids=` + idString,
        { headers: {'Content-Type': 'application/json', 'Authorization' : 'Bearer ' + this.accessToken,},})
      .then((res) => {
        for (let i = 0; i < res.data.audio_features.length; i += 1) {
          this.songIds[i].tempo = res.data.audio_features[i].tempo;
        }
        //shuffle songs
        var j, x, i;
        for (i = this.songIds.length - 1; i > 0; i -= 1) {
            j = Math.floor(Math.random() * (i + 1));
            x = this.songIds[i];
            this.songIds[i] = this.songIds[j];
            this.songIds[j] = x;
        }
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.error(error);
      });
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.error(error);
    });
    axios.get(`https://api.spotify.com/v1/me`, {  headers: {'Content-Type': 'application/json', 'Authorization' : 'Bearer ' + this.accessToken,},})
    .then((res) => {
      this.userId = res.data.id;
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.error(error);
    });
  },
  methods: {
    onSubmit() {
      event.preventDefault();
      this.newPlaylist = [];
      //get songs in tempo range
      let tolerance = 10;
      for (let i = 0; i < this.songIds.length; i += 1) {
        if (this.songIds[i].tempo > this.bpm - tolerance && this.songIds[i].tempo < this.bpm + tolerance) {
          this.newPlaylist.push(this.songIds[i]);
        }
        if (this.newPlaylist.length > 19) {
          break;
        }
      }
      let uriArray = []
      for (let i = 0; i < this.newPlaylist.length; i += 1) {
        uriArray.push(this.newPlaylist[i].uri);
      }
      //create Playlist
      axios.get(`https://api.spotify.com/v1/me`, {  headers: {'Content-Type': 'application/json', 'Authorization' : 'Bearer ' + this.accessToken,},})
      .then((res) => {
        const userId = res.data.id;
        axios.post(`https://api.spotify.com/v1/users/`+ userId +`/playlists`, {
          name: 'Pace Playlist', description: 'auto-generated playlist based on your favorite recent songs that match your running speed',
        },
        {  headers: {'Content-Type': 'application/json', 'Authorization' : 'Bearer ' + this.accessToken,},})
        .then((res) => {
          const playlistId = res.data.id;
          const addTracksUrl = `https://api.spotify.com/v1/playlists/`+ playlistId +`/tracks`;
          axios.post(addTracksUrl, {
            uris: uriArray,
          },
          {  headers: {'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization' : 'Bearer ' + this.accessToken,},})
          .then((res) => {
            this.playlistCreated();
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.error(error);
          });
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
        });
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.error(error);
      });
    },
  },
  /**
  *iziToaster notifications to display
  */
  notifications: {
    signInSuccess: {
      title: 'Signed-In!',
      message: 'Sign-In Successful',
      type: 'success',
    },
    playlistCreated: {
      title: 'Playlist Created!',
      message: 'Playlist successfully generated! Find it on your Spotify account',
      type: 'success',
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
</style>
