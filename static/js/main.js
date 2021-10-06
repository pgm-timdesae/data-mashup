(() => {
  const app = {
    initialize() {
      this.cacheElements();
      this.fetchWeatherApi();
      this.fetchGhentCovidPositiveCases();
      this.fetchPGMUsers();
      this.registerListeners();
      this.buildUI();
    },
    cacheElements() {
      this.$weatherContainer = document.querySelector('.weather');

      this.$covidCasesContainer = document.querySelector('.covid-cases');

      this.$pgmUsersList = document.querySelector('.pgm-users__list');
      
      this.$ghUserDetails = document.querySelector('.gh-user-details');      
      this.$ghUsersList = document.querySelector('.gh-users__list');
      this.$frmSearchGhUsers = document.getElementById('frm-search-gh-users');
      this.$ghUserRepositoriesList = document.querySelector('.gh-user-repositories__list');
      this.$ghUserFollowersList = document.querySelector('.gh-user-followers__list');

      this.$clock = document.querySelector('.clock');
    },
    buildUI() {
      // when starting the app => show pgm on github
      this.fetchDetailsOfUser('pgmgent');

      // Set interval for digital clock
      setInterval(() => {this.ticking()},1000);
    },
    registerListeners () {
      //search event, when click => start fetch
      const input = document.getElementById('search-gh-users');
      this.$frmSearchGhUsers.addEventListener('submit', (ev) => {
        ev.preventDefault()
        this.fetchUsersByName(input.value);
      });

      //event listener for pgm users
      this.$pgmUsersList.addEventListener('click', (ev) => {
        const username = ev.target.dataset.name || ev.target.parentNode.dataset.name || ev.target.parentNode.parentNode.dataset.name;
        //console.log(username);
        if (username !== undefined) {
          this.fetchDetailsOfUser(username);
        }
      });

      //event listener for gh users
      this.$ghUsersList.addEventListener('click', (ev) => {
        const username = ev.target.dataset.name || ev.target.parentNode.dataset.name || ev.target.parentNode.parentNode.dataset.name;
        //console.log(username);
        if (username !== undefined) {
          this.fetchDetailsOfUser(username);
        }
      });
    },
    async fetchDetailsOfUser(username) {
      const githubApi = new GitHubApi();
      const githubRepos = await githubApi.getReposOfUser(username);
      const githubFollowers = await githubApi.getFollowersOfUser(username);
      const githubSearch = await githubApi.getSearchUsers(username);

      this.updateUserRepositoriesList (githubRepos);
      this.updateUserFollowersList(githubFollowers);
      this.updateUserDetails(githubSearch.items[0]);

      //Fetch PGM users
      const usersApi = new UsersApi();
      const usersList = await usersApi.getUsers();
      //Check when githubUsernam is the same as username
      const pgmUser = usersList.find(user => user.portfolio.gitHubUserName === username);
      //When the same => show it
      pgmUser !== undefined ? this.updatePGMUserDetails(pgmUser) : 'Something went wrong';
    },
    updateUserRepositoriesList (repos) {
      if (repos.length !== 0){
        console.log(repos)
        this.$ghUserRepositoriesList.innerHTML = repos.map(data => {
          return `
          <li class="repo">
            <h3 class="repo__title">${data.full_name}</h3>
            <p class="repo__description">${data.description ? data.description : 'No description'}</p>
            <span class="repo__lastpush">Last push at ${data.pushed_at}</span>
          </li>
          `
        }).join('');  
      } else {
        this.$ghUserRepositoriesList.innerHTML = `Deze gebruiker heeft nog geen repositorie.`
      }
    },
    updateUserFollowersList (followers) {
      console.log(followers)
      if(followers.length !== 0){
        this.$ghUserFollowersList.innerHTML = followers.map(data => {
          return `
          <li class="follower">
            <img class="follower__img" src="${data.avatar_url}" alt="picture of follower">
            <span class="follower__login">${data.login}</span>
          </li>
          `
        }).join('');
      } else {
        this.$ghUserFollowersList.innerHTML = `Deze gebruiker heeft geen volgers. :(`
      }
    },
    updatePGMUserDetails (username) {
      // when isStudent = true => show student, when false => show teacher
      const html = `
      <span class="gh-user-details__title">${username.firstName}</span>
      <span class="gh-user-details__title2">${username.lastName}</span>
      <div class="details-flex">
        <p class="gh-user-details__moto">" ${username.moto} "</p>
        <span class="gh-user-details__function">${username.isStudent ? 'Student' : 'Teacher'} @ PGM</span>
        <img class="gh-user-details__image"src="${username.thumbnail}" alt="picture of pgm-user">
      </div>
      `
      this.$ghUserDetails.innerHTML = html;
    },
    updateUserDetails (username) {
      console.log(username)
      const html = `
        <span class="gh-user-details__title2">${username.login}</span>
          <img class="gh-user-details__image"src="${username.avatar_url}" alt="picture of gh-user">
          <span class="gh-user-details__type">${username.type}</span>
        </div>
        `
        this.$ghUserDetails.innerHTML = html;
    },
    async fetchWeatherApi() {
      const weatherApi = new WeatherApi();
      const weather = await weatherApi.getCurrentWeather();
      this.updateWeather (weather);
    },
    updateWeather(weather) {
      this.$weatherContainer.innerHTML = `
        <span class="amount-of-degrees">${weather.current.temp_c}°C</span>
        <img src="${weather.current.condition.icon}">
      `
    },
    async fetchGhentCovidPositiveCases() {
      const covid = new GhentOpenDataApi();
      const covidCases = await covid.getCovidPositiveCases();
      this.updateGhentCovidPositiveCases(covidCases);
    },
    updateGhentCovidPositiveCases(covidCases){
      const arrayOfCases = covidCases.records
      this.$covidCasesContainer.innerHTML = arrayOfCases.map((data) => {
        return `
          <span class="amount-of-covid-cases">${data.fields.cases}</span>
          <img src="./static/media/images/virus.svg" alt="virus">
        `
      })
    },
    async fetchPGMUsers() {
      try {
        const usersApi = new UsersApi();
        const users = await usersApi.getUsers();
        this.updatePGMUsersList(users);
      } catch (error) {
        console.error(error)
      }
    },
    updatePGMUsersList(users){
      this.$pgmUsersList.innerHTML = users.map((data) => {
        return `
        <li class="pgm-user" data-name="${data.portfolio.gitHubUserName}">
          <div class="pgm-user__image">
            <img src="${data.thumbnail}">
          </div>
          <div class="pgm-user__name">
            <span class="pgm-username">${data.portfolio.gitHubUserName}</span>
            <span>${data.firstName} ${data.lastName}</span>
          </div>
        </li>     
        `
      }).join('')
    },
    async fetchUsersByName (name) {
        const githubApi = new GitHubApi();
        const ghUsers = await githubApi.getSearchUsers(name);
        this.UpdateGHUsersList(ghUsers)
    },
    UpdateGHUsersList (ghUsers) {
      const arrayOfUsers = ghUsers.items
      this.$ghUsersList.innerHTML = arrayOfUsers.map((data) => {
       return `
       <li class="gh-user" data-name="${data.login}">
        <div class="gh-user__image">
          <img src="${data.avatar_url}">
        </div>
        <div class="gh-user__name">
          <span class="pgm-username">${data.login}</span>
        </div>
      </li>     
      `
     }).join('')  
    },
    ticking () {
      this.$clock.innerHTML = `
      <span class="clock__title">Ghent (BE)</span>
      <span class="clock__clock">${this.DigitalClock(1, 'Ghent')}</span>      `;
    },  
    DigitalClock (utc, cityName) {
      const date = new Date();
      date.setHours(date.getHours() + utc + date.getTimezoneOffset()/60);
      return `${this.toAmountOfDigits(date.getHours(), 2)}:${this.toAmountOfDigits(date.getMinutes(), 2)}:${this.toAmountOfDigits(date.getSeconds(), 2)}`;
    },
    toAmountOfDigits (number, amount) {
      let str = String(number);
      while (str.length < amount) {
        str = `0${str}`;
      }
      return str;
    }
  };
  app.initialize();
})();