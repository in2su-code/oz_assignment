// HTML 요소 가져오기
const cryptoList = document.getElementById("cryptoList");
const searchInput = document.getElementById("searchInput");
const loading = document.getElementById("loading");
const cryptoTable = document.getElementById("cryptoTable");
const allTab = document.getElementById("allTab");
const favoritesTab = document.getElementById("favoritesTab");

// 데이터 저장 변수
let allCryptoData = [];

// LocalStorage에서 관심항목 불러오기
let favorites =
    JSON.parse(localStorage.getItem("favorites")) || [];

// 현재 탭
let currentTab = "all";


// Binance API에서 데이터 가져오기
async function fetchCryptoData() {

    try {

        const response =
            await fetch(
                "https://api4.binance.com/api/v3/ticker/24hr"
            );

        if (!response.ok) {
            throw new Error("데이터를 가져오지 못했습니다.");
        }

        const data = await response.json();

        allCryptoData =
            data.filter(item =>
                item.symbol.endsWith("USDT") &&
                parseFloat(item.lastPrice) !== 0
            );

        filterAndRender();

        loading.classList.add("hidden");
        cryptoTable.classList.remove("hidden");

    } catch (error) {

        console.error(error);

        loading.textContent =
            "데이터를 불러오는 중 오류가 발생했습니다.";
    }
}


// 검색어와 현재 탭에 맞춰 데이터를 필터링
function filterAndRender() {
    const searchTerm = searchInput.value.toUpperCase();

    let filteredData = allCryptoData.filter((item) =>
        item.symbol.includes(searchTerm)
    );

    if (currentTab === "favorites") {
        filteredData = filteredData.filter((item) =>
            favorites.includes(item.symbol)
        );
    }

    renderData(filteredData);
}


// 데이터를 테이블에 출력
function renderData(data) {
    cryptoList.innerHTML = "";

    data.forEach((item) => {
        const row = document.createElement("tr");

        const priceChange = parseFloat(item.priceChangePercent);
        const changeClass = priceChange >= 0 ? "up" : "down";
        const sign = priceChange >= 0 ? "+" : "";
        const isFavorite = favorites.includes(item.symbol);

        row.innerHTML = `
            <td>
                <button
                    class="fav-btn ${isFavorite ? "active" : ""}"
                    data-symbol="${item.symbol}"
                >
                    ${isFavorite ? "★" : "☆"}
                </button>
            </td>

            <td class="symbol">${item.symbol}</td>

            <td>
                ${parseFloat(item.lastPrice).toLocaleString()}
            </td>

            <td class="${changeClass}">
                ${sign}${priceChange.toFixed(2)}%
            </td>

            <td>
                ${parseFloat(item.highPrice).toLocaleString()}
            </td>

            <td>
                ${parseFloat(item.lowPrice).toLocaleString()}
            </td>
        `;

        cryptoList.appendChild(row);
    });
}

// 관심항목 추가 / 삭제
function toggleFavorite(symbol) {
    const index = favorites.indexOf(symbol);

    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(symbol);
    }

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    filterAndRender();
}


// 관심항목 버튼 클릭 이벤트
cryptoList.addEventListener("click", (event) => {
    const favoriteButton = event.target.closest(".fav-btn");

    if (!favoriteButton) {
        return;
    }

    const symbol = favoriteButton.dataset.symbol;
    toggleFavorite(symbol);
});


// 검색 기능
searchInput.addEventListener("input", () => {
    filterAndRender();
});

// 전체보기 탭
allTab.addEventListener("click", () => {
    currentTab = "all";

    allTab.classList.add("active");
    favoritesTab.classList.remove("active");

    filterAndRender();
});

// 관심항목 탭
favoritesTab.addEventListener("click", () => {
    currentTab = "favorites";

    favoritesTab.classList.add("active");
    allTab.classList.remove("active");

    filterAndRender();
});

// 처음 한 번 데이터 불러오기
fetchCryptoData();

// 1초마다 최신 데이터 갱신
setInterval(fetchCryptoData, 1000);