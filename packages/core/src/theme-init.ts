export const themeInitScript = `(function () {
  try {
    var storedTheme = localStorage.getItem('uw-theme');
    var userPreference = storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'system';
    var isSystemDark = matchMedia('(prefers-color-scheme: dark)').matches;
    var isDarkMode = userPreference === 'dark' || (userPreference === 'system' && isSystemDark);
    
    document.documentElement.dataset.theme = isDarkMode ? 'dark' : 'light';
  } catch (error) {}
})();`
