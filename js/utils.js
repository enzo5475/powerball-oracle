// ===== MATHEMATICAL CONSTANTS =====
const PI_DIGITS = "31415926535";
const EULER_DIGITS = "27182818284";
const GOLDEN_RATIO = 1.618033989;
const FIBONACCI_SEQUENCE = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765];
const PRIME_NUMBERS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67];
const CATALAN_NUMBERS = [1, 1, 2, 5, 14, 42, 132, 429, 1430, 4862, 16796, 58786];

// ===== GEMATRIA & SACRED ALPHABETS =====
const GEMATRIA_VALUES = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9, 'J': 10,
    'K': 20, 'L': 30, 'M': 40, 'N': 50, 'O': 60, 'P': 70, 'Q': 80, 'R': 90, 'S': 100,
    'T': 200, 'U': 300, 'V': 400, 'W': 500, 'X': 600, 'Y': 700, 'Z': 800
};

const ELDER_FUTHARK_RUNES = {
    'F': 1, 'U': 2, 'TH': 3, 'A': 4, 'R': 5, 'K': 6, 'G': 7, 'W': 8, 'H': 9, 'N': 10,
    'I': 11, 'J': 12, 'EI': 13, 'P': 14, 'Z': 15, 'S': 16, 'T': 17, 'B': 18, 'E': 19,
    'M': 20, 'L': 21, 'NG': 22, 'D': 23, 'O': 24
};

const OGHAM_TREE_VALUES = {
    'Birch': 1, 'Rowan': 2, 'Alder': 3, 'Willow': 4, 'Ash': 5, 'Hawthorn': 6, 'Oak': 7,
    'Holly': 8, 'Hazel': 9, 'Vine': 10, 'Ivy': 11, 'Reed': 12, 'Blackthorn': 13,
    'Elder': 14, 'Fir': 15, 'Furze': 16, 'Heather': 17, 'Poplar': 18, 'Yew': 19, 'Grove': 20
};

// ===== VEDIC & EASTERN NUMEROLOGY =====
const VEDIC_NUMBERS = {
    planets: { Sun: 1, Moon: 2, Jupiter: 3, Rahu: 4, Mercury: 5, Venus: 6, Ketu: 7, Saturn: 8, Mars: 9 },
    nakshatras: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
    chakras: [7, 144, 108, 112, 96, 64, 32] // Number of petals in each chakra
};

const ISLAMIC_SACRED = {
    names99: Array.from({length: 99}, (_, i) => i + 1), // 99 Names of Allah
    bismillah: 786, // Numerical value of Bismillah
    sacred: [3, 7, 19, 40, 99, 313, 786]
};

const BUDDHIST_SACRED = {
    primary: 108, // Sacred number
    prayer_beads: [21, 27, 54, 108],
    wheel_spokes: [8, 12, 24, 31],
    mantras: [3, 7, 21, 108, 1080]
};

// ===== ASTROLOGICAL DATA =====
const PLANETARY_CYCLES = {
    Mercury: 87.97, Venus: 224.7, Earth: 365.25, Mars: 686.98,
    Jupiter: 4332.59, Saturn: 10759.22, Uranus: 30688.5, Neptune: 60182
};

const ZODIAC_DEGREES = {
    Aries: 0, Taurus: 30, Gemini: 60, Cancer: 90, Leo: 120, Virgo: 150,
    Libra: 180, Scorpio: 210, Sagittarius: 240, Capricorn: 270, Aquarius: 300, Pisces: 330
};

const LUNAR_PHASES = ['New', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];

// ===== TAROT SYSTEM =====
const TAROT_CARDS = {
    major_arcana: Array.from({length: 22}, (_, i) => i), // 0-21
    minor_arcana: {
        suits: ['Wands', 'Cups', 'Swords', 'Pentacles'],
        numbers: Array.from({length: 14}, (_, i) => i + 1) // Ace-King
    },
    total: 78
};

// ===== CALENDAR SYSTEMS =====
const MAYAN_CALENDAR = {
    tzolkin: 260, // Sacred calendar
    haab: 365, // Solar calendar
    long_count: [20, 18, 20, 20, 13], // Day, month, year, katun, baktun multipliers
    day_signs: Array.from({length: 20}, (_, i) => i + 1),
    trecena: Array.from({length: 13}, (_, i) => i + 1)
};

const CHINESE_CALENDAR = {
    animals: ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'],
    elements: ['Wood', 'Fire', 'Earth', 'Metal', 'Water'],
    cycle: 60, // Years in complete cycle
    stem_branch: [10, 12] // Heavenly stems, Earthly branches
};

const JEWISH_CALENDAR = {
    months: ['Tishrei', 'Cheshvan', 'Kislev', 'Tevet', 'Shevat', 'Adar', 'Nisan', 'Iyar', 'Sivan', 'Tammuz', 'Av', 'Elul'],
    days_in_month: [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29],
    year_types: [353, 354, 355, 383, 384, 385] // Possible days in year
};

// ===== KABBALAH & ENOCHIAN =====
const KABBALAH_TREE = {
    sephirot: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    paths: 22, // Hebrew letters
    names: ['Kether', 'Chokmah', 'Binah', 'Chesed', 'Geburah', 'Tiphareth', 'Netzach', 'Hod', 'Yesod', 'Malkuth'],
    gematria_values: [620, 73, 67, 72, 216, 1081, 148, 15, 80, 496]
};

const ENOCHIAN_SYSTEM = {
    watchtowers: 4,
    tablets: [12, 13], // Rows, columns
    calls: 19, // Enochian calls
    aethyrs: 30,
    angels: [7, 12, 16, 24] // Different angel hierarchies
};

// ===== I CHING & CHAOS THEORY =====
const I_CHING = {
    hexagrams: 64,
    trigrams: 8,
    lines: 6,
    changes: [1, 2, 3, 4, 5, 6], // Line positions
    elements: ['Metal', 'Earth', 'Wood', 'Wood', 'Earth', 'Fire', 'Earth', 'Metal']
};

const CHAOS_CONSTANTS = {
    lorenz: [10, 28, 8/3], // σ, ρ, β parameters
    mandelbrot: [-2, 1, -1.5, 1.5], // x_min, x_max, y_min, y_max
    feigenbaum: 4.669201609, // Feigenbaum constant
    golden_angle: 137.508 // Golden angle in degrees
};

// ===== HELPER FUNCTIONS =====
function getCurrentLunarPhase() {
    const now = new Date();
    const newMoon = new Date('2024-01-11'); // Reference new moon
    const lunarCycle = 29.53059; // days
    const daysSinceNew = (now - newMoon) / (1000 * 60 * 60 * 24);
    const phase = (daysSinceNew % lunarCycle) / lunarCycle;
    return Math.floor(phase * 8); // 8 lunar phases
}

function getDayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getJulianDay() {
    const now = new Date();
    const a = Math.floor((14 - (now.getMonth() + 1)) / 12);
    const y = now.getFullYear() + 4800 - a;
    const m = (now.getMonth() + 1) + 12 * a - 3;
    return now.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function getPlanetaryPosition(planet, date = new Date()) {
    // Simplified planetary position calculation
    const daysSinceEpoch = (date - new Date('2000-01-01')) / (1000 * 60 * 60 * 24);
    const cycle = PLANETARY_CYCLES[planet] || 365.25;
    const position = (daysSinceEpoch / cycle) * 360;
    return Math.floor(position % 360);
}

function getChineseYear(year = new Date().getFullYear()) {
    // Chinese New Year starts in late Jan/early Feb, simplified calculation
    const baseYear = 1924; // Rat year
    const yearDiff = year - baseYear;
    return yearDiff % 12;
}

function getHebrewYear(date = new Date()) {
    // Simplified Hebrew year calculation (approximate)
    const gregorianYear = date.getFullYear();
    return gregorianYear + 3760; // Approximate conversion
}

function getMayanTzolkin(date = new Date()) {
    // Mayan Tzolkin calculator
    const baseDate = new Date('2012-12-21'); // End of 13th baktun
    const daysDiff = Math.floor((date - baseDate) / (1000 * 60 * 60 * 24));
    const tzolkinDay = daysDiff % 260;
    return tzolkinDay < 0 ? tzolkinDay + 260 : tzolkinDay;
}

function calculateGematria(text) {
    return text.toUpperCase().split('').reduce((sum, char) => {
        return sum + (GEMATRIA_VALUES[char] || 0);
    }, 0);
}

function getVedicPlanetNumber(planet) {
    return VEDIC_NUMBERS.planets[planet] || 1;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function ensureValidNumbers(numbers, min, max, count) {
    const validNumbers = [];
    const attempts = numbers.slice();
    
    while (validNumbers.length < count && attempts.length > 0) {
        let num = attempts.shift();
        
        // Ensure number is in valid range
        if (num < min || num > max) {
            num = ((num - min) % (max - min + 1)) + min;
        }
        
        // Ensure no duplicates for white balls
        if (!validNumbers.includes(num)) {
            validNumbers.push(num);
        }
    }
    
    // Fill remaining spots if needed
    while (validNumbers.length < count) {
        let num = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!validNumbers.includes(num)) {
            validNumbers.push(num);
        }
    }
    
    return validNumbers.sort((a, b) => a - b);
}
