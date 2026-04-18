(function () {
    var loader = document.getElementById('page-loader');
    if (sessionStorage.getItem('aa_visited')) {
        loader.style.display = 'none';
    } else {
        sessionStorage.setItem('aa_visited', '1');
        window.addEventListener('load', function () {
            setTimeout(function () { loader.classList.add('loaded'); }, 1750);
        });
    }
})();
