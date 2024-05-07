class CoinApp {
  constructor() {
    this.app = document.getElementById("app");
    this.url = "https://api.coincap.io/v2/assets";
    this.errorCatch = "Data could not found";
    this.errorResponse = "Network response was not ok";
  }

  render() {
    this.createMenu();
    this.createSidebar();
    this.createWrapper();
    this.fetchData();
    this.createFooter();
  }

  refreshData() {
    this.clearData();
    this.fetchData();
  }

  clearData() {
    const boxes = document.querySelectorAll(".box");
    boxes.forEach((box) => this.wrapper.removeChild(box));
  }

  createMenu() {
    const menu = document.createElement("div");
    menu.classList.add("menu");
    this.app.appendChild(menu);

    const logo = document.createElement("img");
    logo.classList.add("logo");
    logo.src = "../img/logo.svg";
    menu.appendChild(logo);

    const navigation = document.createElement("ul");
    navigation.classList.add("navigation");
    menu.appendChild(navigation);

    const refresh = document.createElement("li");
    refresh.textContent = "Refresh";
    refresh.addEventListener("click", () => this.refreshData());
    navigation.appendChild(refresh);

    const bestCoins = document.createElement("li");
    bestCoins.textContent = "TOP 10";
    bestCoins.addEventListener("click", () => this.topTenCoins());
    navigation.appendChild(bestCoins);

    const sortCoins = document.createElement("li");
    sortCoins.textContent = "A-Z";
    sortCoins.addEventListener("click", () => this.alphabetCoins());
    navigation.appendChild(sortCoins);

    const sortValue = document.createElement("li");
    sortValue.textContent = "Sort by value";
    navigation.appendChild(sortValue);
    sortValue.addEventListener("click", () => this.mostExpensiveCoins());
  }

  createSidebar() {
    const sideMenu = document.createElement("div");
    sideMenu.className = "menu-side";
    this.app.appendChild(sideMenu);

    const sideNavigation = document.createElement("ul");
    sideNavigation.classList.add("sidebar-navigation");
    sideMenu.appendChild(sideNavigation);

    const sideRefresh = document.createElement("li");
    sideRefresh.textContent = "Refresh";
    sideRefresh.addEventListener("click", () => this.refreshData());
    sideNavigation.appendChild(sideRefresh);

    const sideBestCoins = document.createElement("li");
    sideBestCoins.textContent = "TOP 10";
    sideBestCoins.addEventListener("click", () => this.topTenCoins());
    sideNavigation.appendChild(sideBestCoins);

    const sideSortCoins = document.createElement("li");
    sideSortCoins.textContent = "A-Z";
    sideSortCoins.addEventListener("click", () => this.alphabetCoins());
    sideNavigation.appendChild(sideSortCoins);

    const sideSortValue = document.createElement("li");
    sideSortValue.textContent = "Sort by value";
    sideNavigation.appendChild(sideSortValue);
    sideSortValue.addEventListener("click", () => this.mostExpensiveCoins());

    const sideBar = new Image();
    sideBar.className = "sidebar";
    sideBar.src = "../img/sidebar.svg";

    sideBar.addEventListener("click", () => {
      const sideMenu = document.querySelector(".menu-side");
      sideMenu.classList.toggle("active");

      if (sideMenu.classList.contains("active")) {
        sideBar.src = "../img/close.svg";
      } else {
        sideBar.src = "../img/sidebar.svg";
      }
    });

    this.app.appendChild(sideBar);

    const sideMenuBtns = [
      sideRefresh,
      sideBestCoins,
      sideSortCoins,
      sideSortValue,
    ];
    sideMenuBtns.forEach((element) => {
      element.addEventListener("click", () => {
        const sideMenu = document.querySelector(".menu-side");
        sideMenu.classList.toggle("active");
        sideBar.src = "../img/sidebar.svg"
      });
    });
  }

  createWrapper() {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("wrapper");
    this.app.appendChild(this.wrapper);
  }

  createCoinBox(element) {
    const box = document.createElement("div");
    box.classList.add("box");
    this.wrapper.appendChild(box);

    const coinName = document.createElement("h3");
    coinName.textContent = element.name;
    box.appendChild(coinName);

    const symbolCoin = document.createElement("p");
    symbolCoin.textContent = element.symbol;
    box.appendChild(symbolCoin);

    const logoBox = document.createElement("div");
    box.appendChild(logoBox);

    const firstSource = `https://assets.coincap.io/assets/icons/${element.symbol.toLowerCase()}@2x.png`;
    const secondSource = `https://assets.coincap.io/assets/icons/m${element.symbol.toLowerCase()}@2x.png`;
    const localSource = `../img/coin.png`;

    this.loadImage(firstSource, secondSource, localSource)
      .then((imgCoin) => {
        imgCoin.style.maxWidth = "64px";
        logoBox.appendChild(imgCoin);
      })
      .catch(() => {
        const imgCoinLocal = new Image();
        imgCoinLocal.style.maxWidth = "64px";
        imgCoinLocal.onerror = () => {
          console.error("Failed to load image");
        };
        imgCoinLocal.src = localSource;
        logoBox.appendChild(imgCoinLocal);
      });

    const spanRank = document.createElement("span");
    spanRank.textContent = "Rank:";
    box.appendChild(spanRank);

    const coinRank = document.createElement("p");
    coinRank.textContent = element.rank;
    spanRank.appendChild(coinRank);

    const spanValue = document.createElement("span");
    spanValue.textContent = "Value:";
    box.appendChild(spanValue);

    const coinPrice = document.createElement("p");
    const coinValue = parseFloat(element.priceUsd);
    coinPrice.textContent = `${coinValue.toFixed(5)}$`;
    spanValue.appendChild(coinPrice);

    const spanChange = document.createElement("span");
    spanChange.textContent = "Last 24hr:";
    box.appendChild(spanChange);

    const changePercentLastDay = document.createElement("p");
    const change24HR = parseFloat(element.changePercent24Hr);
    changePercentLastDay.textContent = `${change24HR.toFixed(5)}%`;
    spanChange.appendChild(changePercentLastDay);

    function changePercentValue() {
      if (change24HR > 0) {
        changePercentLastDay.textContent = `+${change24HR.toFixed(5)}%`;
        changePercentLastDay.style.color = "rgb(24, 198, 131)";
      } else if (change24HR < 0) {
        changePercentLastDay.textContent = `${change24HR.toFixed(5)}%`;
        changePercentLastDay.style.color = "#ea3943";
      } else {
        changePercentLastDay.textContent = `${change24HR.toFixed(5)}%`;
      }
    }

    changePercentValue();

    box.addEventListener("mouseenter", function () {
      if (change24HR < 0) {
        this.classList.add("down");
      } else if (change24HR > 0) {
        this.classList.add("up");
      } else {
        this.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
      }
      changePercentLastDay.style.color = "white";
    });

    box.addEventListener("mouseleave", function () {
      if (change24HR !== 0) {
        this.classList.remove("down", "up");
      } else {
        this.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
      }

      changePercentValue();
    });
  }

  loadImage(source1, source2, localSource) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => {
        img.src = source2;
        img.onload = () => resolve(img);
        img.onerror = () => {
          img.src = localSource;
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("Failed to load image"));
        };
      };
      img.src = source1;
    });
  }

  fetchData() {
    fetch(this.url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(this.errorResponse);
        }
        return response.json();
      })
      .then((data) => {
        data.data.forEach((element) => {
          this.createCoinBox(element);
        });
      })
      .catch((error) => console.error(this.errorCatch, error));
  }

  topTenCoins() {
    this.clearData();
    fetch(this.url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(this.errorResponse);
        }
        return response.json();
      })
      .then((data) => {
        const topCoins = data.data.slice(0, 10);
        topCoins.forEach((element) => {
          this.createCoinBox(element);
        });
      })
      .catch((error) => console.error(this.errorCatch, error));
  }

  mostExpensiveCoins() {
    this.clearData();
    fetch(this.url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(this.errorResponse);
        }
        return response.json();
      })
      .then((data) => {
        const sortedData = data.data.sort(
          (a, b) => parseFloat(b.priceUsd) - parseFloat(a.priceUsd)
        );
        sortedData.forEach((element) => {
          this.createCoinBox(element);
        });
      })
      .catch((error) => console.error(this.errorCatch, error));
  }

  alphabetCoins() {
    this.clearData();
    fetch(this.url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(this.errorResponse);
        }
        return response.json();
      })
      .then((data) => {
        data.data.sort((a, b) => a.name.localeCompare(b.name));
        data.data.forEach((element) => {
          this.createCoinBox(element);
        });
      })
      .catch((error) => console.error(this.errorCatch, error));
  }

  createFooter() {
    const footer = document.createElement("footer");
    const FB = document.createElement("a");
    footer.textContent = `Copyright 2024 by${FB}`;
    FB.textContent = "FB";
    FB.href = "https://github.com/FilipBukowiec";
    FB.target = "_blank";
    footer.appendChild(FB);
    this.app.appendChild(footer);
  }
}

const coinApp = new CoinApp();
coinApp.render();
