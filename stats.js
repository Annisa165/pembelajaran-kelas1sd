/* ============================================================
   stats.js — Sistem penyimpanan bintang & statistik belajar
   Dipakai bersama oleh index.html, part1.html, part2.html, part3.html
   Data disimpan permanen di localStorage (tetap ada walau browser ditutup)
   ============================================================ */

(function (global) {
  "use strict";

  var STORAGE_KEY_STARS = "pembelajaran_totalStars";
  var STORAGE_KEY_STATS = "pembelajaran_stats";

  function safeGetItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function safeSetItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      /* localStorage unavailable (private mode dsb) — abaikan diam-diam */
    }
  }

  function getTotalStars() {
    return Number(safeGetItem(STORAGE_KEY_STARS) || 0);
  }

  function addTotalStars(n) {
    var updated = getTotalStars() + n;
    safeSetItem(STORAGE_KEY_STARS, String(updated));
    return updated;
  }

  function getStats() {
    try {
      return JSON.parse(safeGetItem(STORAGE_KEY_STATS) || "{}");
    } catch (e) {
      return {};
    }
  }

  /**
   * Mencatat satu jawaban/percobaan untuk sebuah aktivitas.
   * activityKey: id unik aktivitas, mis. "part1_matematika"
   * activityLabel: nama yang ditampilkan di statistik, mis. "Matematika (Bagian 1)"
   * isCorrect: true jika benar, false jika salah
   */
  function recordAnswer(activityKey, activityLabel, isCorrect) {
    var stats = getStats();
    if (!stats[activityKey]) {
      stats[activityKey] = { label: activityLabel, correct: 0, wrong: 0 };
    }
    stats[activityKey].label = activityLabel;
    if (isCorrect) {
      stats[activityKey].correct += 1;
    } else {
      stats[activityKey].wrong += 1;
    }
    safeSetItem(STORAGE_KEY_STATS, JSON.stringify(stats));
  }

  function resetAllProgress() {
    try {
      localStorage.removeItem(STORAGE_KEY_STARS);
      localStorage.removeItem(STORAGE_KEY_STATS);
    } catch (e) {
      /* abaikan */
    }
  }

  global.LearnStats = {
    getTotalStars: getTotalStars,
    addTotalStars: addTotalStars,
    getStats: getStats,
    recordAnswer: recordAnswer,
    resetAllProgress: resetAllProgress
  };
})(window);
