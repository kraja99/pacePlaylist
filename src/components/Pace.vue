<template>
  <div>
    <h1>{{ msg }}</h1>
    <b-row  align-h="center">
      <b-col sm="4"></b-col>
      <b-col sm="4">
        <p>
          Pace is a web app that auto-generates a playlist from Spotify to help you run to.
          Choose your tempo and Pace will create a playlist from some of your favorite songs that match.
        </p>
      </b-col>
      <b-col sm="4"></b-col>
    </b-row>
    <b-button v-on:click="onSubmit">Sign-In</b-button>
  </div>
</template>

<script>
export default {
  name: 'Pace',
  data() {
    return {
      mileTime: null,
      strideLength: null,
      bpm: null,
      msg: 'Pace',
    };
  },
  methods: {
    onSubmit() {
      // To prevent redirects
      event.preventDefault();
      if (this.bpm == null) {
        this.bpm = (12.0 * 5280.0) / (this.strideLength * this.mileTime);
      }
      console.log(this.bpm);
      const signInUrl = 'https://accounts.spotify.com/authorize?client_id=3dba767d35394c78b4fb4eacf36509f5&redirect_uri='+ encodeURIComponent('http://paceplaylist.s3-website-us-west-1.amazonaws.com/paceSignedIn') + '&scope=user-top-read%20user-read-email playlist-modify-public playlist-modify-private&response_type=token&show_dialog=true';
      window.location.replace(signInUrl);
    },
  },
};
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}

h2 {
  position: relative;
  margin-top: 20px;
}
h2.one {
  margin-top: 0;
}
h2.one:before {
  content: "";
  display: block;
  border-top: solid 1px black;
  width: 100%;
  height: 1px;
  position: absolute;
  top: 50%;
  z-index: 1;
}
h2.one:after {
  content: "";
  display: block;
  border-top: solid 1px black;
  width: 100%;
  height: 1px;
  position: absolute;
  top: 50%;
  z-index: 1;
}
h2.one span {
  background: #fff;
  padding: 0 20px;
  position: relative;
  z-index: 5;
}
</style>
