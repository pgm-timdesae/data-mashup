function GitHubApi () {
  this.getSearchUsers = async (name) => {
    //console.log(name)
    const GH_SEARCH_USERS_API = `https://api.github.com/search/users?sort=desc&page=1&per_page=100&q=${name}`;
    //console.log(GH_SEARCH_USERS_API)
    try {
      const response = await fetch(GH_SEARCH_USERS_API);
      console.log(response)

      const jsonData = await response.json();
      console.log(jsonData)
      return jsonData;
    } catch (error) {
      //console.error(error)
    }
  },

  this.getReposOfUser = async (username) => {
    const GH_REPOS_OF_USER_API = `https://api.github.com/users/${username}/repos?page=1&per_page=50`;
    console.log(GH_REPOS_OF_USER_API)
    try {
      const response = await fetch(GH_REPOS_OF_USER_API);
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error(error)
    }
  },

  this.getFollowersOfUser = async (username) => {
    const GH_FOLLOWERS_OF_USERS = `https://api.github.com/users/${username}/followers?page=1&per_page=100`;
    try {
      const response = await fetch (GH_FOLLOWERS_OF_USERS);
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error(error)
    }
  },

  this.getSubscriptionsOfUser = async (username) => {
    const GH_SUBSCRIPTIONS_OF_USER_API = `https://api.github.com/search/users?${username}`;
    try {
      const response = await fetch (GH_SUBSCRIPTIONS_OF_USER_API);
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error(error)
    }
  }
};

function UsersApi () {
  this.getUsers = async () => {
    const USERS_API = './static/data/pgm.json';
    console.log(USERS_API);
    try {
      const response = await fetch(USERS_API);
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error(error)
    }
  }
}

function WeatherApi() {
  this.getCurrentWeather = async () => {
    const WEATHER_API = 'https://api.weatherapi.com/v1/current.json?key=0e0a5dd641c04b72a68105653202112&q=Ghent';
    try {
      const response = await fetch(WEATHER_API);
      const jsonData = await response.json();
      return jsonData;
    } catch(error) {
      console.error(error)
    }
  }
}

function GhentOpenDataApi() {
  this.getCovidPositiveCases = async () => {
    const COVID_CASES_GHENT_API = 'https://data.stad.gent/api/records/1.0/search/?dataset=dataset-of-cumulative-number-of-confirmed-cases-by-municipality&q=';
    try {
      const response = await fetch(COVID_CASES_GHENT_API);
      const jsonData = await response.json();
      return jsonData;
    } catch(error) {
      console.error(error)
    }
  }
}
