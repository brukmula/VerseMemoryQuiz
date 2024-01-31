const languageSelection = document.getElementById('language');
const versionDropdown = document.getElementById('versionSelect');

//Wait for user to change selected language
languageSelection.addEventListener('change', () => {
    const selectedLanguage = languageSelection.value;
    // Clear existing options
    versionDropdown.innerHTML = '';

    // Define new options based on selected language
    let newOptions = [];
    if (selectedLanguage === 'english') {
        newOptions = ['esv', 'niv', 'kjv', 'nlt', 'net'];
    } else if (selectedLanguage === 'chinese') {
        newOptions = ['和合本', '新译本', '中文标准译本', '和合本修订版', '现代中文译本'];
    }

    // Add new options to the version dropdown
    newOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option.toUpperCase();
        versionDropdown.appendChild(optionElement);
    });

});