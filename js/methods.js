// ===== BASIC MATHEMATICAL METHODS =====

function calculateLunarNumbers() {
    const phase = getCurrentLunarPhase();
    const now = new Date();
    const lunarDay = now.getDate() + phase;
    
    const numbers = [];
    for (let i = 0; i < 8; i++) {
        const num = ((lunarDay * (i + 1) * 7) % 69) + 1;
        numbers.push(num);
    }
    
    const whites = ensureValidNumbers(numbers, 1, 69, 5);
    const red = (phase * 3 + now.getDate()) % 26 + 1;
    
    return {
        whites: whites,
        red: red,
        note: `🌙 Dynamic - Lunar Phase: ${phase}/8, Lunar influence: ${lunarDay}`
    };
}

function calculateFibonacciNumbers() {
    const dayOfYear = getDayOfYear();
    const startIndex = dayOfYear % 15;
    
    const numbers = [];
    for (let i = 0; i < 8; i++) {
        const fibIndex = (startIndex + i) % FIBONACCI_SEQUENCE.length;
        const num = (FIBONACCI_SEQUENCE[fibIndex] % 69) + 1;
        numbers.push(num);
    }
    
    const whites = ensureValidNumbers(numbers, 1, 69, 5);
    const red = (FIBONACCI_SEQUENCE[startIndex % FIBONACCI_SEQUENCE.length] % 26) + 1;
    
    return {
        whites: whites,
        red: red,
        note: `🌀 Static - Fibonacci sequence starting at index ${startIndex}`
    };
}

function calculateGoldenRatioNumbers() {
    const now = new Date();
    const timestamp = now.getTime();
    
    const numbers = [];
    for (let i = 1; i <= 8; i++) {
        const num = Math.floor((GOLDEN_RATIO * timestamp * i) % 69) + 1;
        numbers.push(num);
    }
    
    const whites = ensureValidNumbers(numbers, 1, 69, 5);
    const red = Math.floor((GOLDEN_RATIO * timestamp) % 26) + 1;
    
    return {
        whites: whites,
        red: red,
        note: `✨ Hourly - Golden Ratio φ = ${GOLDEN_RATIO.toFixed(6)}`
    };
}

function calculatePiNumbers() {
    const dayOfYear = getDayOfYear();
    const startIndex = dayOfYear % (PI_DIGITS.length - 2);
    
    const numbers = [];
    for (let i = 0; i < 8; i++) {
        const digit1 = parseInt(PI_DIGITS[startIndex + i] || '3');
        const digit2 = parseInt(PI_DIGITS[startIndex + i + 1] || '1');
        const num = (digit1 * 10 + digit2) % 69 + 1;
        numbers.push(num);
    }
    
    const whites = ensureValidNumbers(numbers, 1, 69, 5);
    const redDigit = parseInt(PI_DIGITS[startIndex % PI_DIGITS.length]);
    const red = (redDigit * 3) % 26 + 1;
    
    return {
        whites: whites,
        red: red,
        note: `🔢 Daily - π digits starting at position ${startIndex}`
    };
}

function calculateEulerNumbers() {
    const dayOfYear = getDayOfYear();
    const startIndex = dayOfYear % (EULER_DIGITS.length - 2);
    
    const numbers = [];
    for (let i = 0; i < 8; i++) {
        const digit1 = parseInt(EULER_DIGITS[startIndex + i] || '2');
        const digit2 = parseInt(EULER_DIGITS[startIndex + i + 1] || '7');
        const num = (digit1 * 10 + digit2) % 69 + 1;
        numbers.push(num);
    }
    
    const whites = ensureValidNumbers(numbers, 1, 69, 5);
    const red = (parseInt(EULER_DIGITS[startIndex % EULER_DIGITS.length]) * 3) % 26 + 1;
    
    return {
        whites: whites,
        red: red,
        note: `📈 Daily - Euler's e digits starting at position ${startIndex}`
    };
}

// ===== SACRED & DIVINE METHODS =====

function calculateGematriaNumbers() {
    const now = new Date();
    const dateString = now.toDateString().toUpperCase().replace(/[^A-Z]/g, '');
    const gematriaSum = calculateGematria(dateString);
    
    const numbers = [];
    for (let i = 1; i <= 8; i++) {
        const num = ((gematriaSum * i) % 69) + 1;
        numbers.push(num);
    }
    
    const whites = ensureValidNumbers(numbers, 1, 69, 5);
    const red = (gematriaSum % 26) + 1;
    
    return {
        whites: whites,
        red: red,
        note: `📜 Daily - Gematria sum of "${dateString}": ${gematriaSum}`
    };
}

function calculateKabbalahNumbers() {
    const now = new Date();
    const dayOfMonth = now.getDate();
    const month = now.getMonth() + 1;
    
    const numbers = [];
    for (let i = 0; i < 8; i++) {
        const sephira = KABBALAH_TREE.sephirot[i % 10];
        const num = ((sephira * dayOfMonth * (i + 1)) % 69) + 1;
        numbers.push(num);
    }
    
    const whites = ensureValidNumbers(numbers, 1, 69, 5);
    const red = ((KABBALAH_TREE.paths + dayOfMonth) % 26) + 1;
    
    return {
        whites: whites,
        red: red,
        note: `🌳 Daily - Tree of Life: 10 Sephirot, 22 Paths, Day: ${dayOfMonth}`
    };
}

function calculateVedicNumbers() {
    const now = new Date();
    const dayOfYear = getDayOfYear();
    const nakshatra = VEDIC_NUMBERS.nakshatras[dayOfYear % 27];
    
    const numbers = [];
    Object.values(VEDIC_NUMBERS.planets).forEach((planetNum, i) => {
        const num = ((planetNum * nakshatra * (i + 1)) % 69) + 1;
        numbers.push(num);
    });
    
    const whites = ensureValidNumbers(numbers, 1, 69, 5);
    const red = (BUDDHIST_SACRED.primary % 26) + 1;
    
    return {
        whites: whites,
        red: red,
        note: `🕉️ Daily - Vedic Nakshatra: ${nakshatra}/27, Sacred 108`
    };
}

function calculateRuneNumbers() {
    const now = new Date();
    const dayOfMonth = now.getDate();
    const runeValues = Object.values(ELDER_FUTHARK_RUNES);
    
    const numbers = [];
    for (let i = 0; i < 8; i++) {
        const runeIndex = (dayOfMonth + i) % runeValues.length;
        const num = ((runeValues[runeIndex] * (i + 1) * 3) % 69) + 1;
        numbers.push(num);
    }
    
    const whites = ensureValidNumbers(numbers, 1, 69, 5);
    const red = (runeValues[dayOfMonth % runeValues.length] % 26) + 1;
    
    return {
        whites: whites,
        red: red,
        note: `ᚱ Daily - Elder Futhark Runes, Day: ${dayOfMonth}`
    };
}

function calculateTarotNumbers() {
    const now = new Date();
    const dayOfYear = getDayOfYear();
    const card = dayOfYear % TAROT_CARDS.total;
    
    const numbers = [];
    for (let i = 0; i < 8; i++) {
        const cardNum = (card + i) % TAROT_CARDS.total;
        const num = ((cardNum * 3 + i * 7) % 69) + 1;
        numbers.push(num);
    }
    
    const whites = ensureValidNumbers(numbers, 1, 69, 5);
    const red = (card % 26) + 1;
    
    const arcana = card < 22 ? 'Major' : 'Minor';
    
    return {
        whites: whites,
        red: red,
        note: `🔮 Daily - Tarot Card: ${card}/78 (${arcana} Arcana)`
    };
}

function calculateIslamicNumbers() {
    const now = new Date();
    const dayOfMonth = now.getDate();
    const nameIndex = dayOfMonth % 99;
    
    const numbers = [];
    ISLAMIC_SACRED.sacred.forEach((sacredNum, i) => {
        const num = ((sacredNum + nameIndex * (i + 1)) % 69) + 1;
        numbers.push(num);
    });
    
    const whites = ensureValidNumbers(numbers, 1, 69, 5);
    const red = (ISLAMIC_SACRED.bismillah % 26) + 1;
    
    return {
        whites: whites,
        red: red,
        note: `☪️ Daily - 99 Names ${nameIndex + 1}/99, Bismillah: ${ISLAMIC_SACRED.bismillah}`
    };
}

function calculateOghamNumbers() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const treeValues = Object.values(OGHAM_TREE_VALUES);
    
    const numbers = [];
    for (let i = 0; i < 8; i++) {
        const treeIndex = (month + i) % treeValues.length;
        const num = ((treeValues[treeIndex] * (i + 1) * 5) % 69) + 1;
        numbers.push(num);
    }
    
    const whites = ensureValidNumbers(numbers, 1, 69, 5);
    const red = (treeValues[month % treeValues.length] % 26) + 1;
    
    return {
        whites: whites,
        red: red,
        note: `🌳 Monthly - Celtic Ogham Trees, Month: ${month}`
    };
}

// ===== ASTROLOGICAL & CELESTIAL METHODS =====

function calculatePlanetaryNumbers() {
    const now = new Date();
    const planets = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
    
    const numbers = [];
    planets.forEach((planet, i) => {
        const position = getPlanetaryPosition(planet, now);
        const num = ((position + i * 13) % 69) + 1;
        numbers.push(num);
    });
    
    const whites = ensureValidNumbers(numbers, 1, 69, 5);
    const red = (getPlanetaryPosition('Jupiter', now) % 26) + 1;
    
    return {
        whites: whites,
        red: red,
        note: `🪐 Dynamic - Planetary positions, Jupiter: ${getPlanetaryPosition('Jupiter', now)}°`
    };
}

function calculateZodiacNumbers() {
    const now = new Date();
    const dayOfYear = getDayOfYear();
    const zodiacSign = Math.floor(dayOfYear / 30.44) % 12;
    
    const baseAngle = Object.values(ZODIAC_DEGREES)[zodiacSign];
    const numbers = [];
    
    for (let i = 0; i < 8; i++) {
        const angle = (baseAngle + i * 15) % 360;
        const num = Math.floor(angle / 5) % 69 + 1;
        numbers.push(num);
    }
    
    const whites = ensureValidNumbers(numbers, 1, 69, 5);
    const red = Math.floor(baseAngle / 13) % 26 + 1;
    
    const signNames = Object.keys(ZODIAC_DEGREES);
    
    return {
        whites: whites,
        red: red,
        note: `♈ Daily - Zodiac: ${signNames[zodiacSign]}, Base: ${baseAngle}°`
    };
}

function calculateSolarCycleNumbers() {
    const now = new Date();
    const julianDay = getJulianDay();
    const solarCycle = julianDay % 11;
    
    const numbers = [];
    for (let i = 0; i < 8; i++) {
        const num = ((solarCycle * (i + 1) * 17 + julianDay) % 69) + 1;
        numbers.push(num);
    }
    
    const whites = ensureValidNumbers(numbers, 1, 69, 5);
    const red = (solarCycle * 3) % 26 + 1;
    
    return {
        whites: whites,
        red: red,
        note: `☀️ Dynamic - Solar Cycle: ${solarCycle}/11, Julian Day: ${julianDay}`
    };
}

// ===== ADVANCED MATHEMATICAL METHODS =====

function calculateChaosNumbers() {
    const now = new Date();
    const x = (now.getHours() + 1) / 24;
    
    const numbers = [];
    let current = x;
    
    // Simplified chaos calculation that stays bounded
    for (let i = 0; i < 8; i++) {
        current = (current * 3.7 * (1 - current)) % 1;
        const num = Math.floor(current * 69) + 1;
        numbers.push(num);
    }
    
    const whites = ensureValidNumbers(numbers, 1, 69, 5);
    const red = Math.floor(current * 26) + 1;
    
    return {
        whites: whites,
        red: red,
        note: `🌀 Hourly - Chaos Theory (Logistic Map), Hour: ${now.getHours()}`
    };
}

function calculatePrimeGapNumbers() {
    const dayOfYear = getDayOfYear();
    const startIndex = dayOfYear % (PRIME_NUMBERS.length - 1);
    
    const numbers = [];
    for (let i = 0; i < 8; i++) {
        const primeIndex = (startIndex + i) % PRIME_NUMBERS.length;
        const nextIndex = (primeIndex + 1) % PRIME_NUMBERS.length;
        const gap = PRIME_NUMBERS[nextIndex] - PRIME_NUMBERS[primeIndex];
        const num = ((PRIME_NUMBERS[primeIndex] + gap * 5) % 69) + 1;
        numbers.push(num);
    }
    
    const whites = ensureValidNumbers(numbers, 1, 69, 5);
    const red = (PRIME_NUMBERS[startIndex] % 26) + 1;
    
    return {
        whites: whites,
        red: red,
        note: `🔢 Daily - Prime gaps, Starting prime: ${PRIME_NUMBERS[startIndex]}`
    };
}

function calculateCatalanNumbers() {
    const now = new Date();
    const minute = now.getMinutes();
    const catalanIndex = minute % CATALAN_NUMBERS.length;
    
    const numbers = [];
    for (let i = 0; i < 8; i++) {
        const index = (catalanIndex + i) % CATALAN_NUMBERS.length;
        const catalan = CATALAN_NUMBERS[index];
        const num = ((catalan * (i + 1)) % 69) + 1;
        numbers.push(num);
    }
    
    const whites = ensureValidNumbers(numbers, 1, 69, 5);
    const red = (CATALAN_NUMBERS[catalanIndex] % 26) + 1;
    
    return {
        whites: whites,
        red: red,
        note: `🔶 Hourly - Catalan numbers, Index: ${catalanIndex}, Minute: ${minute}`
    };
}

// ===== TEMPORAL/CALENDAR METHODS =====

function calculateChineseNumbers() {
    const now = new Date();
    const year = now.getFullYear();
    const animalIndex = getChineseYear(year);
    const elementIndex = Math.floor(animalIndex / 2) % 5;
    
    const numbers = [];
    for (let i = 0; i < 8; i++) {
        const num = ((animalIndex * (i + 1) * 7 + elementIndex * 11) % 69) + 1;
        numbers.push(num);
    }
    
    const whites = ensureValidNumbers(numbers, 1, 69, 5);
    const red = ((animalIndex + elementIndex) % 26) + 1;
    
    const animal = CHINESE_CALENDAR.animals[animalIndex];
    const element = CHINESE_CALENDAR.elements[elementIndex];
    
    return {
        whites: whites,
        red: red,
        note: `🐉 Yearly - Chinese: ${element} ${animal}, Cycle: ${year % 60}/60`
    };
}

function calculateJewishNumbers() {
    const now = new Date();
    const hebrewYear = getHebrewYear(now);
    const month = now.getMonth() + 1;
    
    const numbers = [];
    JEWISH_CALENDAR.days_in_month.forEach((days, i) => {
        const num = ((days * month * (i + 1)) % 69) + 1;
        numbers.push(num);
    });
    
    const whites = ensureValidNumbers(numbers, 1, 69, 5);
    const red = (hebrewYear % 26) + 1;
    
    return {
        whites: whites,
        red: red,
        note: `✡️ Monthly - Hebrew year: ${hebrewYear}, Month: ${month}`
    };
}

function calculateMayanNumbers() {
    const now = new Date();
    const tzolkinDay = getMayanTzolkin(now);
    const daySign = MAYAN_CALENDAR.day_signs[tzolkinDay % 20];
    const trecena = MAYAN_CALENDAR.trecena[Math.floor(tzolkinDay / 20)];
    
    const numbers = [];
    for (let i = 0; i < 8; i++) {
        const num = ((daySign * trecena * (i + 1)) % 69) + 1;
        numbers.push(num);
    }
    
    const whites = ensureValidNumbers(numbers, 1, 69, 5);
    const red = (tzolkinDay % 26) + 1;
    
    return {
        whites: whites,
        red: red,
        note: `🗿 Daily - Mayan Tzolkin: ${tzolkinDay}/260, Sign: ${daySign}, Trecena: ${trecena}`
    };
}

// ===== ADDITIONAL SACRED METHODS =====

function calculateAngelNumbers() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const angelPattern = Math.floor(hour / 3) + 1;
    const repeatingDigit = angelPattern;
    
    const numbers = [];
    for (let i = 1; i <= 8; i++) {
        const num = ((repeatingDigit * 11 * i + minute) % 69) + 1;
        numbers.push(num);
    }
    
    const whites = ensureValidNumbers(numbers, 1, 69, 5);
    const red = ((repeatingDigit * 3 + minute) % 26) + 1;
    
    return {
        whites: whites,
        red: red,
        note: `👼 Hourly - Angel pattern: ${repeatingDigit}${repeatingDigit}${repeatingDigit}, Time: ${hour}:${minute}`
    };
}

function calculateIChing() {
    const now = new Date();
    const dayOfYear = getDayOfYear();
    const hexagram = (dayOfYear % I_CHING.hexagrams) + 1;
    
    const numbers = [];
    for (let i = 1; i <= 8; i++) {
        const num = ((hexagram * i * I_CHING.lines) % 69) + 1;
        numbers.push(num);
    }
    
    const whites = ensureValidNumbers(numbers, 1, 69, 5);
    const red = (hexagram % 26) + 1;
    
    return {
        whites: whites,
        red: red,
        note: `☯ Daily - I Ching Hexagram: ${hexagram}/64, Day: ${dayOfYear}`
    };
}

function calculateSacredGeometry() {
    const now = new Date();
    const dayOfMonth = now.getDate();
    
    const vesicaPiscis = 1.732;
    const pentagram = GOLDEN_RATIO;
    const platonic = 5;
    
    const numbers = [];
    const ratios = [vesicaPiscis, pentagram, Math.PI, Math.E, Math.sqrt(2)];
    
    for (let i = 0; i < 8; i++) {
        const ratio = ratios[i % ratios.length];
        const num = Math.floor((ratio * dayOfMonth * (i + 1)) % 69) + 1;
        numbers.push(num);
    }
    
    const whites = ensureValidNumbers(numbers, 1, 69, 5);
    const red = Math.floor((pentagram * dayOfMonth) % 26) + 1;
    
    return {
        whites: whites,
        red: red,
        note: `🔺 Daily - Sacred geometry: √3, φ, π, e, √2 on day ${dayOfMonth}`
    };
}

function calculateFrequencyAnalysis() {
    if (!LOTTERY_DATA || !LOTTERY_DATA.frequency) {
        return {
            whites: [6, 8, 20, 26, 32].sort((a, b) => a - b),
            red: 13,
            note: `📊 Error - No lottery data available. Check error log for details.`
        };
    }
    
    const whiteEntries = Object.entries(LOTTERY_DATA.frequency.white || {});
    const redEntries = Object.entries(LOTTERY_DATA.frequency.red || {});
    
    const totalWhiteFreq = whiteEntries.reduce((sum, [, freq]) => sum + parseInt(freq || 0), 0);
    const totalRedFreq = redEntries.reduce((sum, [, freq]) => sum + parseInt(freq || 0), 0);
    
    if (totalWhiteFreq === 0 || totalRedFreq === 0) {
        return {
            whites: [1, 15, 30, 45, 60].sort((a, b) => a - b),
            red: 1,
            note: `📊 Error - Frequency data is empty. Results: ${LOTTERY_DATA.results?.length || 0}`
        };
    }
    
    const whiteFreq = Object.entries(LOTTERY_DATA.frequency.white)
        .map(([num, freq]) => ({ num: parseInt(num), freq: parseInt(freq) }))
        .sort((a, b) => b.freq - a.freq);
    
    const redFreq = Object.entries(LOTTERY_DATA.frequency.red)
        .map(([num, freq]) => ({ num: parseInt(num), freq: parseInt(freq) }))
        .sort((a, b) => b.freq - a.freq);
    
    const now = new Date();
    const useHot = now.getDate() % 2 === 0;
    
    let whites, red;
    
    if (useHot) {
        whites = whiteFreq.slice(0, 5).map(item => item.num);
        red = redFreq[0]?.num || 1;
    } else {
        whites = whiteFreq.slice(-5).map(item => item.num);
        red = redFreq[redFreq.length - 1]?.num || 26;
    }
    
    const totalDrawings = LOTTERY_DATA.results.length;
    const lastUpdate = LOTTERY_DATA.last_updated ? 
        new Date(LOTTERY_DATA.last_updated).toLocaleDateString() : 'Unknown';
    
    return {
        whites: whites.sort((a, b) => a - b),
        red: red,
        note: `📊 Dynamic - ${useHot ? 'Hot' : 'Cold'} numbers from ${totalDrawings} drawings (Updated: ${lastUpdate})`
    };
}
