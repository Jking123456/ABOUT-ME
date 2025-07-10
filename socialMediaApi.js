// socialMediaAPI.js

// Konfigurasi API
const youtubeApiKey = 'AIzaSyAVc74DVn8_lwS-hBkM-eu3f2oeb74GWgY'; // Ganti dengan YouTube API Key Anda
const youtubeChannelId = 'UCnmNJZMCcH61smobqRqX-oQ'; // Ganti dengan ID channel YouTube Anda (@bidzzofc)
const telegramBotToken = '8095229589:AAHFmq3F3_dJ0azrMYLaAVA5ebgN23U-s9g'; // Bot Token dari HTML Anda
const telegramChatId = '-1002149183732'; // ID channel Telegram Anda

// Fallback values (dari HTML Anda, digunakan jika API gagal)
const fallbackStats = {
    youtube: 1462,
    instagram: 2945,
    telegram: 3751
};

// Fungsi untuk mengambil data YouTube subscribers
async function fetchYouTubeSubscribers() {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${youtubeChannelId}&key=${youtubeApiKey}`
        );
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            return parseInt(data.items[0].statistics.subscriberCount);
        } else {
            console.error('YouTube API: No channel data found');
            return fallbackStats.youtube;
        }
    } catch (error) {
        console.error('Error fetching YouTube subscribers:', error);
        return fallbackStats.youtube;
    }
}

// Fungsi untuk mengambil data Telegram members
async function fetchTelegramMembers() {
    try {
        const response = await fetch(
            `https://api.telegram.org/bot${telegramBotToken}/getChatMemberCount?chat_id=${telegramChatId}`
        );
        const data = await response.json();
        if (data.ok) {
            return data.result;
        } else {
            console.error('Telegram API: No chat data found');
            return fallbackStats.telegram;
        }
    } catch (error) {
        console.error('Error fetching Telegram members:', error);
        return fallbackStats.telegram;
    }
}

// Fungsi untuk mengambil data Instagram followers (Fallback karena keterbatasan API)
async function fetchInstagramFollowers() {
    // Catatan: Instagram Graph API memerlukan autentikasi akun bisnis.
    // Untuk saat ini, gunakan nilai statis dari HTML karena tidak ada API gratis untuk data publik.
    // Jika Anda memiliki akses ke Instagram Graph API, tambahkan kode di sini.
    console.warn('Instagram API: Using fallback value due to API restrictions');
    return fallbackStats.instagram;
}

// Fungsi untuk menganimasikan counter
function animateCounter(element, target) {
    let current = 0;
    const increment = Math.ceil(target / 100);
    const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(interval);
        }
        element.textContent = current;
    }, 20);
}

// Fungsi utama untuk memperbarui semua statistik
async function updateSocialStats() {
    // Ambil elemen counter dari DOM
    const youtubeCounter = document.querySelector('.social-stat-card.youtube .counter');
    const instagramCounter = document.querySelector('.social-stat-card.instagram .counter');
    const telegramCounter = document.querySelector('.social-stat-card.telegram .counter');

    // Ambil data dari API
    const youtubeSubs = await fetchYouTubeSubscribers();
    const instagramFollowers = await fetchInstagramFollowers();
    const telegramMembers = await fetchTelegramMembers();

    // Perbarui nilai di DOM dengan animasi
    animateCounter(youtubeCounter, youtubeSubs);
    animateCounter(instagramCounter, instagramFollowers);
    animateCounter(telegramCounter, telegramMembers);
}

// Jalankan fungsi saat halaman dimuat
document.addEventListener('DOMContentLoaded', updateSocialStats);